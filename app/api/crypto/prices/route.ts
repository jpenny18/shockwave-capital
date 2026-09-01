import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type CryptoPrices = {
  BTC: number;
  ETH: number;
  USDT: number;
  USDC: number;
};

let priceCache: { data: CryptoPrices | null; lastUpdated: number } = {
  data: null,
  lastUpdated: 0
};

const CACHE_DURATION = 60 * 1000; // 1 minute — short enough to stay close to spot
const FETCH_TIMEOUT_MS = 5000;

const FALLBACK_PRICES: CryptoPrices = {
  BTC: 108531,
  ETH: 2553,
  USDT: 1,
  USDC: 1
};

const jsonHeaders = {
  'Cache-Control': 'no-store, max-age=0'
};

function isValidPrice(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, {
      ...init,
      signal: controller.signal,
      cache: 'no-store'
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchCoinGecko(): Promise<Partial<CryptoPrices> | null> {
  try {
    const response = await fetchWithTimeout(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd&precision=full',
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Shockwave Capital/1.0.0'
        }
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    const prices: Partial<CryptoPrices> = {};

    if (isValidPrice(data.bitcoin?.usd)) prices.BTC = data.bitcoin.usd;
    if (isValidPrice(data.ethereum?.usd)) prices.ETH = data.ethereum.usd;
    if (isValidPrice(data.tether?.usd)) prices.USDT = data.tether.usd;
    if (isValidPrice(data['usd-coin']?.usd)) prices.USDC = data['usd-coin'].usd;

    return Object.keys(prices).length ? prices : null;
  } catch (error) {
    console.error('CoinGecko price fetch failed:', error);
    return null;
  }
}

async function fetchBinance(): Promise<Partial<CryptoPrices> | null> {
  try {
    const response = await fetchWithTimeout(
      'https://api.binance.com/api/v3/ticker/price?symbols=%5B%22BTCUSDT%22,%22ETHUSDT%22,%22USDCUSDT%22%5D'
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (!Array.isArray(data)) return null;

    const map: Record<string, number> = {};
    for (const ticker of data) {
      const price = Number(ticker?.price);
      if (ticker?.symbol && isValidPrice(price)) {
        map[ticker.symbol] = price;
      }
    }

    const prices: Partial<CryptoPrices> = {};
    if (isValidPrice(map.BTCUSDT)) prices.BTC = map.BTCUSDT;
    if (isValidPrice(map.ETHUSDT)) prices.ETH = map.ETHUSDT;
    if (isValidPrice(map.USDCUSDT)) prices.USDC = map.USDCUSDT;
    // Binance pairs are quoted in USDT, which tracks $1 closely
    prices.USDT = 1;

    return prices.BTC || prices.ETH ? prices : null;
  } catch (error) {
    console.error('Binance price fetch failed:', error);
    return null;
  }
}

async function fetchCoinbase(): Promise<Partial<CryptoPrices> | null> {
  try {
    const [btcRes, ethRes] = await Promise.all([
      fetchWithTimeout('https://api.coinbase.com/v2/prices/BTC-USD/spot'),
      fetchWithTimeout('https://api.coinbase.com/v2/prices/ETH-USD/spot')
    ]);

    const prices: Partial<CryptoPrices> = {};

    if (btcRes.ok) {
      const btc = Number((await btcRes.json())?.data?.amount);
      if (isValidPrice(btc)) prices.BTC = btc;
    }
    if (ethRes.ok) {
      const eth = Number((await ethRes.json())?.data?.amount);
      if (isValidPrice(eth)) prices.ETH = eth;
    }

    return prices.BTC || prices.ETH ? prices : null;
  } catch (error) {
    console.error('Coinbase price fetch failed:', error);
    return null;
  }
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) {
    return (sorted[mid - 1] + sorted[mid]) / 2;
  }
  return sorted[mid];
}

function mergePrices(sources: Array<Partial<CryptoPrices> | null>): CryptoPrices | null {
  const valid = sources.filter((source): source is Partial<CryptoPrices> => source !== null);
  if (!valid.length) return null;

  const pick = (key: keyof CryptoPrices): number | undefined => {
    const values = valid.map((source) => source[key]).filter(isValidPrice);
    if (!values.length) return undefined;
    return values.length === 1 ? values[0] : median(values);
  };

  const BTC = pick('BTC');
  const ETH = pick('ETH');
  if (!isValidPrice(BTC) || !isValidPrice(ETH)) return null;

  return {
    BTC,
    ETH,
    USDT: pick('USDT') ?? 1,
    USDC: pick('USDC') ?? 1
  };
}

export async function GET() {
  const now = Date.now();

  if (priceCache.data && now - priceCache.lastUpdated < CACHE_DURATION) {
    return NextResponse.json(priceCache.data, { headers: jsonHeaders });
  }

  const sources = await Promise.all([fetchCoinGecko(), fetchBinance(), fetchCoinbase()]);
  const merged = mergePrices(sources);
  const prices = merged ?? priceCache.data ?? FALLBACK_PRICES;

  if (merged) {
    priceCache = {
      data: merged,
      lastUpdated: now
    };
  }

  return NextResponse.json(prices, { headers: jsonHeaders });
}
