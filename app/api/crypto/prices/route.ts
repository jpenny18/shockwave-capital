import { NextResponse } from 'next/server';

// In-memory cache for prices
let priceCache = {
  data: null as any,
  lastUpdated: 0
};

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function GET() {
  const now = Date.now();

  // Return cached data if it's still fresh
  if (priceCache.data && (now - priceCache.lastUpdated) < CACHE_DURATION) {
    return NextResponse.json(priceCache.data);
  }

  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second delay between retries

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      // Add proper headers and use v3 API
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,tether,usd-coin&vs_currencies=usd',
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Shockwave Capital/1.0.0'
          }
        }
      );
      
      if (!response.ok) {
        // If we get a rate limit response, wait before retrying
        if (response.status === 429) {
          await delay(RETRY_DELAY);
          continue;
        }
        throw new Error(`API responded with status: ${response.status}`);
      }

      const data = await response.json();
      
      const prices = {
        BTC: data.bitcoin?.usd || 108531,
        ETH: data.ethereum?.usd || 2553,
        USDT: data.tether?.usd || 1,
        USDC: data['usd-coin']?.usd || 1
      };

      // Update cache
      priceCache = {
        data: prices,
        lastUpdated: now
      };

      return NextResponse.json(prices);
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      
      // If this was our last attempt and we have cached data, return it even if expired
      if (attempt === MAX_RETRIES - 1 && priceCache.data) {
        console.log('All attempts failed, using cached prices');
        return NextResponse.json(priceCache.data);
      }
      
      // If this was our last attempt and we have no cached data, return fallback prices
      if (attempt === MAX_RETRIES - 1) {
        console.log('All attempts failed, using fallback prices');
        const fallbackPrices = {
          BTC: 108531,
          ETH: 2553,
          USDT: 1,
          USDC: 1
        };
        
        // Cache fallback prices
        priceCache = {
          data: fallbackPrices,
          lastUpdated: now
        };
        
        return NextResponse.json(fallbackPrices);
      }
      
      // Wait before retrying
      await delay(RETRY_DELAY);
    }
  }

  // This should never be reached due to the fallback in the last attempt
  return NextResponse.json(priceCache.data || {
    BTC: 108531,
    ETH: 2553,
    USDT: 1,
    USDC: 1
  });
} 