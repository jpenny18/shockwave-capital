import { NextRequest, NextResponse } from 'next/server';
import { MetaApi } from 'metaapi.cloud-sdk';
import { getAuth } from 'firebase-admin/auth';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import moment from 'moment';

// Initialize MetaAPI SDK
const metaApi = new MetaApi(process.env.METAAPI_TOKEN!);

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY!))
  });
}

const db = getFirestore();

// Challenge Rules
const CHALLENGE_RULES = {
  SHOCKWAVE_PHASE_1: {
    name: 'Shockwave Challenge (Phase 1)',
    maxDailyDrawdown: 8,
    maxDrawdown: 15,
    profitTarget: 10,
    minTradingDays: 4
  },
  SHOCKWAVE_PHASE_2: {
    name: 'Shockwave Challenge (Phase 2)',
    maxDailyDrawdown: 8,
    maxDrawdown: 15,
    profitTarget: 5,
    minTradingDays: 4
  },
  SHOCKWAVE_INSTANT: {
    name: 'Shockwave Instant',
    maxDailyDrawdown: 4,
    maxDrawdown: 12,
    profitTarget: 12,
    minTradingDays: 5
  }
};

function getChallengeRules(type: string, phase: number = 1) {
  if (type === 'instant') return CHALLENGE_RULES.SHOCKWAVE_INSTANT;
  return phase === 2 ? CHALLENGE_RULES.SHOCKWAVE_PHASE_2 : CHALLENGE_RULES.SHOCKWAVE_PHASE_1;
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split('Bearer ')[1];
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = await getAuth().verifyIdToken(token);
    const userId = decoded.uid;

    // Get user's accounts from Firestore
    const accountsSnap = await db.collection(`users/${userId}/accounts`).get();
    if (accountsSnap.empty) {
      return NextResponse.json({ accounts: [] });
    }

    const userAccounts = accountsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Fetch MetaApi accounts (all)
    const allMetaApiAccounts = await metaApi.metatraderAccountApi.getAccounts();

    const accountData = [];

    for (const userAcc of userAccounts) {
      const metaApiAcc = allMetaApiAccounts.find(a => a.id === userAcc.metaApiAccountId);
      if (!metaApiAcc) continue;

      const account = await metaApi.metatraderAccountApi.getAccount(metaApiAcc.id);
      await account.deploy();
      await account.waitConnected();

      const conn = account.getStreamingConnection();
      await conn.connect();
      await conn.waitSynchronized();

      const history = conn.historyStorage;
      const deals = await history.getDeals({
        startTime: moment().subtract(30, 'days').toISOString()
      });

      const closed = deals.filter(d => d.profit !== undefined);
      let totalProfit = 0;
      let peakEquity = 0;
      let maxDrawdown = 0;
      const dailyPnLMap: Record<string, number> = {};

      for (const deal of closed) {
        const date = moment(deal.time).format('YYYY-MM-DD');
        dailyPnLMap[date] = (dailyPnLMap[date] || 0) + deal.profit;
        totalProfit += deal.profit;

        if (deal.equity !== undefined) {
          peakEquity = Math.max(peakEquity, deal.equity);
          const drawdown = ((peakEquity - deal.equity) / peakEquity) * 100;
          maxDrawdown = Math.max(maxDrawdown, drawdown);
        }
      }

      const tradingDays = Object.keys(dailyPnLMap).length;
      const worstDailyLoss = Math.min(...Object.values(dailyPnLMap));
      const dailyDrawdownPercent = (Math.abs(worstDailyLoss) / metaApiAcc.balance) * 100;
      const profitPercent = (totalProfit / metaApiAcc.balance) * 100;

      const rules = getChallengeRules(userAcc.challengeType, userAcc.phase);

      const progress = {
        profitTarget: Math.min(100, (profitPercent / rules.profitTarget) * 100),
        maxDrawdown: 100 - Math.min(100, (maxDrawdown / rules.maxDrawdown) * 100),
        minTradingDays: Math.min(100, (tradingDays / rules.minTradingDays) * 100)
      };

      accountData.push({
        id: metaApiAcc.id,
        type: rules.name,
        balance: metaApiAcc.balance,
        status: userAcc.status,
        metrics: {
          equity: metaApiAcc.equity,
          dailyDrawdown: parseFloat(dailyDrawdownPercent.toFixed(2)),
          maxDrawdown: parseFloat(maxDrawdown.toFixed(2)),
          profitTarget: parseFloat(profitPercent.toFixed(2)),
          winRate: 65.2, // Optional: compute based on real deal data
          profitFactor: 2.1,
          totalTrades: closed.length,
          averageWin: 350,
          averageLoss: 180
        },
        progress
      });
    }

    return NextResponse.json({ accounts: accountData });
  } catch (err) {
    console.error('Error in /api/accounts:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
