import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db as adminDb } from '@/lib/firebase-admin';
import {
  ChallengeType,
  RecentBreaches,
  calculateTradingObjectives,
  computeDailyDrawdownFromEquity,
  computeTradingDaysFromTrades,
  isFundedAccount,
  toPercent,
  CHALLENGE_TARGETS
} from '@/lib/metaapi/objectives';

// For now, we'll use mock data to test the system
// Once MetaAPI connectivity is resolved, we can switch back
const USE_MOCK_DATA = false;

// Import MetaAPI only on server side
const MetaApiClass = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').default;
const MetaStats = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').MetaStats;
const RiskManagement = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').RiskManagement;

// Get the main MetaAPI auth token
const METAAPI_AUTH_TOKEN = process.env.METAAPI_AUTH_TOKEN || 'your-metaapi-auth-token-here';

// This route deploys/connects MetaApi accounts and calls MetaStats/RiskManagement,
// which can take well beyond the default serverless limit. Without this, the
// function is killed in production (but not in `next dev`), so metrics never load.
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, accountToken, accountType, accountSize, step, isAdmin } = body;
    
    console.log('Request body:', { 
      accountId, 
      hasToken: !!accountToken, 
      accountType, 
      accountSize,
      step 
    });
    
    // Validate required parameters
    if (!accountId || !accountToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId and accountToken are required' },
        { status: 400 }
      );
    }
    
    // Determine which auth token to use
    // If accountToken is 'main-token', use the main METAAPI_AUTH_TOKEN
    const authTokenToUse = (accountToken === 'main-token') ? METAAPI_AUTH_TOKEN : accountToken;
    
    console.log('Using auth token:', authTokenToUse === METAAPI_AUTH_TOKEN ? 'main-token' : 'account-specific-token');
    
    // Skip user auth check if admin
    let userId = null;
    if (!isAdmin) {
      // Verify user is authenticated
      const authHeader = req.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }

      const token = authHeader.split('Bearer ')[1];
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
        console.log('Authenticated user:', userId);
      } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
      }
    } else {
      console.log('Admin access - skipping user authentication');
    }

    // Verify user has access to this account
    try {
      // Only check for user's account ownership if not admin
      if (!isAdmin && userId) {
        const accountsRef = adminDb.collection('userMetaApiAccounts');
        const snapshot = await accountsRef
          .where('userId', '==', userId)
          .where('accountId', '==', accountId)
          .get();
        
        if (snapshot.empty) {
          return NextResponse.json({ error: 'Account not found or access denied' }, { status: 403 });
        }

        // Check account status
        const accountDoc = snapshot.docs[0].data();
        const accountStatus = accountDoc.status;
        
        // If account is failed, return cached metrics only
        if (accountStatus === 'failed') {
          console.log('Account is failed, returning cached metrics only');
          
          // Get cached metrics
          const cachedMetricsRef = adminDb.collection('cachedMetrics').doc(accountId);
          const cachedMetricsDoc = await cachedMetricsRef.get();
          
          if (!cachedMetricsDoc.exists) {
            return NextResponse.json({ 
              error: 'No cached metrics available for failed account',
              accountStatus: 'failed'
            }, { status: 404 });
          }
          
          const cachedData = cachedMetricsDoc.data();
          if (!cachedData) {
            return NextResponse.json({ 
              error: 'Invalid cached metrics data',
              accountStatus: 'failed'
            }, { status: 500 });
          }
          
          // Return cached data in the expected format
          return NextResponse.json({
            metrics: {
              balance: cachedData.balance || 0,
              equity: cachedData.equity || 0,
              averageProfit: cachedData.averageProfit || 0,
              averageLoss: cachedData.averageLoss || 0,
              numberOfTrades: cachedData.numberOfTrades || 0,
              wonTrades: cachedData.wonTrades || 0,
              lostTrades: cachedData.lostTrades || 0,
              averageRRR: cachedData.averageRRR || 0,
              lots: cachedData.lots || 0,
              expectancy: cachedData.expectancy || 0,
              winRate: cachedData.winRate || 0,
              profitFactor: cachedData.profitFactor || 0,
              maxDrawdown: cachedData.maxDrawdown || 0,
              dailyDrawdown: cachedData.dailyDrawdown || 0,
              trades: cachedData.numberOfTrades || 0,
              avgRRR: cachedData.averageRRR || 0
            },
            accountInfo: {
              accountId,
              name: cachedData.accountName || 'Failed Account',
              broker: cachedData.broker || 'Unknown',
              server: cachedData.server || 'Unknown',
              balance: cachedData.balance || 0,
              equity: cachedData.equity || 0,
              currency: 'USD',
              leverage: 100,
              type: 'ACCOUNT_TRADE_MODE_DEMO',
              platform: accountDoc.platform || 'mt5',
              state: 'FAILED',
              connectionStatus: 'DISCONNECTED'
            },
            trades: cachedData.lastTrades || [],
            equityChart: cachedData.lastEquityChart || [],
            objectives: cachedData.lastObjectives || calculateTradingObjectives({
              challengeType: accountType as ChallengeType,
              accountStartBalance: accountSize,
              step: step || 1,
              maxDrawdownPercent: cachedData.maxDrawdown || 0,
              dailyDrawdownPercent: cachedData.maxDailyDrawdown ?? cachedData.dailyDrawdown ?? 0,
              tradingDays: cachedData.tradingDays || 0,
              profitPercent: accountSize > 0
                ? (((cachedData.balance || 0) - accountSize) / accountSize) * 100
                : 0
            }),
            riskEvents: cachedData.lastRiskEvents || [],
            periodStats: cachedData.lastPeriodStats || [],
            accountStatus: 'failed'
          });
        }
      }
    } catch (error) {
      console.error('Database query error:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Use mock data for testing
    if (USE_MOCK_DATA) {
      const mockResponse = generateMockData(accountId, accountType, accountSize, step);
      return NextResponse.json(mockResponse);
    }

    // Real MetaAPI implementation - HYBRID APPROACH
    const metaApi = new MetaApiClass(authTokenToUse);
    const metaStats = new MetaStats(authTokenToUse);
    const riskManagement = new RiskManagement(authTokenToUse);
    
    console.log('MetaAPI initialized with token:', authTokenToUse === METAAPI_AUTH_TOKEN ? 'main-token' : authTokenToUse.substring(0, 20) + '...');
    console.log('Processing request for account:', accountId);

    // Initialize response data
    let accountData = null;
    let tradesData: any[] = [];
    let equityData: any[] = [];
    let riskEvents: any[] = [];
    let periodStats: any[] = [];
    let trackers: any[] = [];
    let metricsFromStats: any = null;

    try {
      // 1. Fetch account info first to ensure connection
      accountData = await fetchAccountInfo(metaApi, accountId);
    } catch (error) {
      console.error('Error fetching account info:', error);
      // Continue with other data fetching
    }

    // 2. Get core metrics using MetaStats (original working approach)
    try {
      const startDate = '2020-01-01 00:00:00.000';
      const endDate = new Date().toISOString().slice(0, 19).replace('T', ' ') + '.000';
      
      console.log(`Fetching MetaStats metrics for account ${accountId}`);
      
      // Prefer real-time metrics that include floating P/L from open positions.
      // NOTE: includeOpenPositions=true REQUIRES the account to be deployed and
      // synchronized; when the account isn't synced (common here), MetaStats
      // returns ERR_BAD_RESPONSE. So fall back to stored metrics (no live
      // connection needed) instead of failing the whole request.
      try {
        metricsFromStats = await metaStats.getMetrics(accountId, true);
      } catch (openPosError: any) {
        console.warn(
          `getMetrics(includeOpenPositions=true) failed for ${accountId} (${openPosError?.message}); retrying without open positions`
        );
        metricsFromStats = await metaStats.getMetrics(accountId);
      }
      console.log('MetaStats metrics received:', {
        balance: metricsFromStats?.balance,
        equity: metricsFromStats?.equity,
        trades: metricsFromStats?.trades,
        profitFactor: metricsFromStats?.profitFactor
      });
    } catch (error: any) {
      console.error('Error fetching MetaStats metrics:', error.message);
      
      // Check if this is a MetaStats API not enabled error
      if (error.message && error.message.includes('metastats API you need enable it')) {
        console.log('MetaStats API is not enabled for this account');
        
        // Return helpful error response for admin
        if (isAdmin) {
          return NextResponse.json({
            error: 'MetaStats API is not enabled for this account',
            solution: 'Please enable MetaStats API in the MetaAPI web UI or recreate the account with MetaStats enabled',
            accountId,
            webUIUrl: `https://app.metaapi.cloud/accounts/${accountId}/enable-account-features`
          }, { status: 400 });
        }
        
        // For non-admin users, provide a more user-friendly message
        return NextResponse.json({
          error: 'Account metrics are currently unavailable. Please contact support.',
          accountStatus: 'configuration_required'
        }, { status: 503 });
      }
    }

    // Load any previously cached metrics ONCE. We use this as a fallback so a
    // failed live fetch (e.g. MetaStats ERR_BAD_RESPONSE / account not synced)
    // never zeroes out balance/equity/trade stats — while still refreshing the
    // data we CAN fetch (equity chart, daily drawdown, risk events) and bumping
    // the "last updated" timestamp on every refresh.
    let existingCachedData: any = null;
    try {
      const existingCachedDoc = await adminDb.collection('cachedMetrics').doc(accountId).get();
      if (existingCachedDoc.exists) existingCachedData = existingCachedDoc.data();
    } catch (cacheReadError: any) {
      console.error('Error reading existing cached metrics:', cacheReadError?.message);
    }

    // Only bail out if we truly have nothing to show: no live metrics, no live
    // balance, AND no cache. Otherwise we continue and merge live + cached below.
    if (!metricsFromStats && !(accountData && (accountData.balance || 0) > 0) && !existingCachedData) {
      console.warn(`No live metrics and no cached data for account ${accountId}`);
      return NextResponse.json({
        error: 'Live metrics are temporarily unavailable for this account and no cached data exists yet.',
        accountStatus: 'metrics_unavailable',
        accountId
      }, { status: 502 });
    }

    // 3. Fetch trades using MetaStats
    try {
      const startDate = '2020-01-01 00:00:00.000';
      const endDate = new Date().toISOString().slice(0, 19).replace('T', ' ') + '.000';
      
      console.log(`Fetching trades for account ${accountId} from ${startDate} to ${endDate}`);
      
      // Fetch both historical trades and open trades
      const [historicalTrades, openTrades] = await Promise.all([
        metaStats.getAccountTrades(accountId, startDate, endDate).catch(() => []),
        metaStats.getAccountOpenTrades ? metaStats.getAccountOpenTrades(accountId).catch(() => []) : Promise.resolve([])
      ]);
      
      // Combine historical and open trades
      tradesData = [...(historicalTrades || []), ...(openTrades || [])];
      console.log(`Retrieved ${tradesData.length} total trades (${historicalTrades?.length || 0} historical, ${openTrades?.length || 0} open)`);
      
      // Filter out balance operations and non-trading deals
      const beforeFilterCount = tradesData.length;
      tradesData = tradesData.filter((trade: any) => {
        // Check if it's a real trade
        const isRealTrade = trade.type && 
               !trade.type.includes('DEAL_TYPE_BALANCE') &&
               !trade.type.includes('DEAL_TYPE_CREDIT') &&
               !trade.type.includes('DEAL_TYPE_CHARGE') &&
               !trade.type.includes('DEAL_TYPE_CORRECTION') &&
               !trade.type.includes('DEAL_TYPE_BONUS') &&
               !trade.type.includes('DEAL_TYPE_COMMISSION') &&
               trade.symbol; // Must have a symbol to be a real trade
        
        return isRealTrade;
      });
      
      console.log(`Filtered from ${beforeFilterCount} to ${tradesData.length} actual trades`);
    } catch (error: any) {
      console.error('Error fetching trades:', error.message);
    }

    // 4 & 5. Risk Management API: equity chart, trackers, tracker events, tracking statistics
    let riskApi: any = null;
    let trackerPeriodById: Record<string, string> = {};
    let dailyTrackerStats: any[] = [];

    try {
      riskApi = riskManagement.riskManagementApi;
    } catch (error: any) {
      console.log('Risk Management API not available:', error.message);
    }

    if (riskApi) {
      // Equity chart (used for the growth chart + daily-drawdown fallback).
      // getEquityChart(accountId, startTime, endTime, realTime, fillSkips)
      try {
        const equityStart = '2020-01-01 00:00:00.000';
        equityData = await riskApi.getEquityChart(accountId, equityStart);
        console.log(`Retrieved ${equityData.length} equity data points from Risk Management API`);
      } catch (riskError: any) {
        console.log('Risk Management equity chart not available:', riskError.message);
      }

      // Trackers: ensure the ones we need exist (idempotent on the MetaApi side).
      try {
        const existingTrackers = await riskApi.getTrackers(accountId);
        // Instant challenge uses a single trailing tracker; others use overall + daily.
        const expectedCount = accountType === 'instant' && step !== 3 ? 1 : 2;
        const needsSetup = existingTrackers.length < expectedCount;

        if (needsSetup) {
          console.log(`Account has ${existingTrackers.length} trackers, ensuring required trackers exist...`);
          trackers = await setupRiskTrackers(riskApi, accountId, accountType, accountSize, step);
          console.log(`Risk tracker setup completed: ${trackers.length} active trackers`);
        } else {
          console.log(`Account already has ${existingTrackers.length} trackers configured`);
          trackers = existingTrackers;
        }
      } catch (error: any) {
        console.error('Error with risk tracker management:', error.message);
        try {
          trackers = await riskApi.getTrackers(accountId);
        } catch (fallbackError: any) {
          console.error('Could not retrieve any trackers:', fallbackError.message);
          trackers = [];
        }
      }

      // Build a tracker-id -> period lookup so we can classify breach events,
      // and locate the daily tracker for per-period drawdown statistics.
      trackerPeriodById = {};
      trackers.forEach((t: any) => {
        const id = t._id || t.id;
        if (id) trackerPeriodById[id] = t.period || 'day';
      });
      const dailyTracker = trackers.find((t: any) => t.period === 'day');

      // Tracker events (breach notifications). Correct argument order is
      // (startBrokerTime, endBrokerTime, accountId, trackerId, limit).
      try {
        riskEvents = await riskApi.getTrackerEvents(undefined, undefined, accountId, undefined, 100);
        console.log(`Retrieved ${riskEvents.length} risk events`);
      } catch (error: any) {
        console.error('Error fetching tracker events:', error.message);
      }

      // Daily tracking statistics (the correct API for per-period drawdown).
      if (dailyTracker) {
        try {
          const dailyTrackerId = dailyTracker._id || dailyTracker.id;
          dailyTrackerStats = await riskApi.getTrackingStatistics(accountId, dailyTrackerId, undefined, 30, true);
          console.log(`Retrieved ${dailyTrackerStats.length} daily tracking statistics`);
        } catch (error: any) {
          console.error('Error fetching tracking statistics:', error.message);
        }
      }
    } else {
      console.log('Risk Management API not available - skipping enhanced features');
    }

    // Per-day growth from MetaStats (real balance/profit/drawdown per trading day).
    const dailyGrowth: any[] = Array.isArray(metricsFromStats?.dailyGrowth) ? metricsFromStats.dailyGrowth : [];

    // Build the "Daily Performance" period stats from MetaStats daily growth so
    // the admin table shows real balance/profit/drawdown values.
    periodStats = dailyGrowth.map((day: any) => ({
      period: 'day',
      startBrokerTime: day.date ? `${day.date} 00:00:00.000` : new Date().toISOString(),
      endBrokerTime: day.date ? `${day.date} 23:59:59.999` : new Date().toISOString(),
      balance: Number(day.balance) || 0,
      equity: Number(day.balance) || 0,
      profit: Number(day.profit ?? 0),
      maxDrawdown: Number(day.drawdownPercentage ?? 0),
      maxDailyDrawdown: Number(day.drawdownPercentage ?? 0),
      trades: 0,
      tradingDays: 0
    }));

    // 6. Process and combine data.
    // When live MetaStats data is unavailable, fall back to the last cached
    // values for trade-derived stats so a refresh never wipes them to zero.
    // MetaStats Metrics has no wonTrades/lostTrades fields; derive them from
    // wonTradesPercent and the long/short won-trade counts instead.
    const cachedStats = existingCachedData || {};
    const statsLive = !!metricsFromStats;

    const totalTrades = statsLive
      ? Number(metricsFromStats.trades ?? 0)
      : Number(cachedStats.numberOfTrades ?? 0);
    const wonTradesPercent = Number(metricsFromStats?.wonTradesPercent ?? 0);
    const longWonTrades = Number(metricsFromStats?.longWonTrades ?? 0);
    const shortWonTrades = Number(metricsFromStats?.shortWonTrades ?? 0);
    let wonTrades = longWonTrades + shortWonTrades;
    if (!wonTrades && totalTrades > 0 && wonTradesPercent > 0) {
      wonTrades = Math.round((wonTradesPercent / 100) * totalTrades);
    }
    if (!statsLive) wonTrades = Number(cachedStats.wonTrades ?? 0);
    const lostTrades = !statsLive
      ? Number(cachedStats.lostTrades ?? Math.max(0, totalTrades - wonTrades))
      : Math.max(0, totalTrades - wonTrades);

    // Resolve balance/equity: live MetaStats -> live RPC account info -> cache.
    const hasLiveAccountBalance = !!(accountData && (accountData.balance || 0) > 0);
    const resolvedBalance = statsLive
      ? (metricsFromStats.balance ?? 0)
      : (hasLiveAccountBalance ? (accountData?.balance ?? 0) : (cachedStats.balance ?? 0));
    const resolvedEquity = statsLive
      ? (metricsFromStats.equity ?? 0)
      : (hasLiveAccountBalance ? (accountData?.equity ?? accountData?.balance ?? 0) : (cachedStats.equity ?? cachedStats.balance ?? 0));

    const combinedMetrics = {
      balance: resolvedBalance,
      equity: resolvedEquity,
      margin: metricsFromStats?.margin || 0,
      freeMargin: metricsFromStats?.freeMargin || 0,
      profit: statsLive ? (metricsFromStats.profit || 0) : (cachedStats.currentProfit || 0),
      credit: 0,
      trades: totalTrades,
      wonTrades,
      lostTrades,
      averageWin: statsLive ? (metricsFromStats.averageWin || 0) : (cachedStats.averageProfit || 0),
      averageLoss: statsLive ? (metricsFromStats.averageLoss || 0) : (cachedStats.averageLoss || 0),
      expectancy: statsLive ? (metricsFromStats.expectancy || 0) : (cachedStats.expectancy || 0),
      profitFactor: statsLive ? (metricsFromStats.profitFactor || 0) : (cachedStats.profitFactor || 0),
      absoluteDrawdown: 0,
      maxDrawdown: statsLive ? (metricsFromStats.maxDrawdown || 0) : (cachedStats.maxDrawdown || 0), // already a percent
      relativeDrawdown: 0, // set below to the computed daily drawdown for cache back-compat
      lots: statsLive ? (metricsFromStats.lots || 0) : (cachedStats.lots || 0),
      commissions: metricsFromStats?.commissions || 0
    };

    // Win rate comes straight from MetaStats wonTradesPercent (with a safe fallback).
    const winRate = statsLive
      ? (totalTrades > 0 ? (wonTradesPercent || (wonTrades / totalTrades) * 100) : 0)
      : Number(cachedStats.winRate ?? 0);
    const avgRRR = combinedMetrics.averageLoss !== 0
      ? Math.abs(combinedMetrics.averageWin / combinedMetrics.averageLoss)
      : (statsLive ? 0 : Number(cachedStats.averageRRR ?? 0));

    // Daily drawdown (percent). Priority: risk-management daily tracker stats ->
    // MetaStats daily growth -> equity-chart calculation -> cached value.
    let calculatedDailyDrawdown = 0;
    if (dailyTrackerStats && dailyTrackerStats.length > 0) {
      calculatedDailyDrawdown = Math.max(
        0,
        ...dailyTrackerStats.map((s: any) => toPercent(s.maxRelativeDrawdown))
      );
    } else if (dailyGrowth.length > 0) {
      calculatedDailyDrawdown = Math.max(
        0,
        ...dailyGrowth.map((d: any) => Number(d.drawdownPercentage ?? 0))
      );
    } else if (equityData && equityData.length > 0) {
      calculatedDailyDrawdown = computeDailyDrawdownFromEquity(equityData);
    } else {
      calculatedDailyDrawdown = (await getCachedMaxDailyDrawdown(accountId)) || 0;
    }
    combinedMetrics.relativeDrawdown = calculatedDailyDrawdown;

    // Normalize tracker events: convert fraction drawdowns to percent and
    // classify daily vs overall breaches using the originating tracker's period
    // (the SDK only emits 'drawdown' | 'profit', never 'dailyDrawdown').
    const normalizedRiskEvents = (riskEvents || []).map((event: any) => {
      const period = trackerPeriodById[event.trackerId] || 'day';
      const rawType = event.exceededThresholdType; // 'drawdown' | 'profit'
      let classifiedType = rawType;
      if (rawType === 'drawdown') {
        classifiedType = period === 'day' ? 'dailyDrawdown' : 'drawdown';
      }
      const sequenceNumber = event.sequencenumber ?? event.sequenceNumber;
      return {
        id: event.id || `${event.accountId || accountId}_${sequenceNumber ?? Math.random()}`,
        type: classifiedType,
        accountId: event.accountId || accountId,
        trackerId: event.trackerId,
        sequenceNumber,
        brokerTime: event.brokerTime,
        absoluteDrawdown: Number(event.absoluteDrawdown ?? 0),
        relativeDrawdown: toPercent(event.relativeDrawdown), // now a percent
        exceededThresholdType: classifiedType
      };
    });

    // Recent (last 24h) breach detection from normalized events.
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    const recentEvents = normalizedRiskEvents.filter(e => {
      const t = e.brokerTime ? new Date(e.brokerTime).getTime() : NaN;
      return !Number.isNaN(t) && t > dayAgo.getTime();
    });
    const recentBreaches: RecentBreaches = {
      maxDrawdown: recentEvents.some(e => e.exceededThresholdType === 'drawdown'),
      dailyDrawdown: recentEvents.some(e => e.exceededThresholdType === 'dailyDrawdown'),
      fundedRiskViolation: isFundedAccount(step)
        ? recentEvents.some(e => e.exceededThresholdType === 'dailyDrawdown' && e.relativeDrawdown > 2)
        : false
    };

    // Trading days. Funded accounts count days with >= minDailyGain% gain;
    // challenge accounts count days that had at least one trade.
    let tradingDays = 0;
    if (isFundedAccount(step)) {
      const gainThreshold = accountSize * (CHALLENGE_TARGETS.funded.minDailyGain / 100);
      tradingDays = dailyGrowth.filter((d: any) => Number(d.profit ?? 0) >= gainThreshold).length;
      if (!tradingDays) tradingDays = computeTradingDaysFromTrades(tradesData);
    } else {
      tradingDays = computeTradingDaysFromTrades(tradesData);
    }
    // Don't let a failed live fetch reset the trading-day count.
    if (!tradingDays && cachedStats.tradingDays) tradingDays = Number(cachedStats.tradingDays);

    const profitPercent = accountSize > 0
      ? ((combinedMetrics.balance - accountSize) / accountSize) * 100
      : 0;

    // Calculate trading objectives using the shared, normalized logic.
    const objectives = calculateTradingObjectives({
      challengeType: accountType as ChallengeType,
      accountStartBalance: accountSize,
      step: step || 1,
      maxDrawdownPercent: combinedMetrics.maxDrawdown,
      dailyDrawdownPercent: calculatedDailyDrawdown,
      tradingDays,
      profitPercent,
      recentBreaches
    });

    // Format response with hybrid data approach
    const response = {
      metrics: {
        ...combinedMetrics,
        winRate,
        avgRRR,
        dailyDrawdown: calculatedDailyDrawdown
      },
      accountInfo: accountData || {
        accountId,
        name: 'Unknown Account',
        broker: 'Unknown',
        server: 'Unknown',
        balance: combinedMetrics.balance,
        equity: combinedMetrics.equity,
        currency: 'USD',
        leverage: 100,
        type: 'ACCOUNT_TRADE_MODE_DEMO',
        platform: 'mt5',
        state: 'UNKNOWN',
        connectionStatus: 'UNKNOWN'
      },
      trades: tradesData.length > 0
        ? tradesData.map((trade: any) => ({
            id: trade._id || trade.id || `trade_${Date.now()}_${Math.random()}`,
            symbol: trade.symbol || 'Unknown',
            type: mapTradeType(trade.type),
            volume: parseFloat(trade.volume || trade.lots) || 0,
            openPrice: parseFloat(trade.openPrice || trade.priceOpen || trade.price) || 0,
            closePrice: trade.closePrice != null ? parseFloat(trade.closePrice || trade.priceClose) : null,
            profit: parseFloat(trade.profit || trade.gain) || 0,
            openTime: trade.openTime || trade.time || new Date().toISOString(),
            closeTime: trade.closeTime || null,
            commission: parseFloat(trade.commission || trade.commissions) || 0,
            swap: parseFloat(trade.swap || trade.swaps) || 0,
            state: trade.state || (trade.closeTime ? 'closed' : 'opened')
          }))
        : (cachedStats.lastTrades || []),
      equityChart: (equityData && equityData.length > 0)
        ? formatEquityChart(equityData)
        : (cachedStats.lastEquityChart || []),
      objectives,
      riskEvents: normalizedRiskEvents.length > 0 ? normalizedRiskEvents : (cachedStats.lastRiskEvents || []),
      periodStats: periodStats.length > 0
        ? periodStats.map(stat => ({
            period: stat.period,
            startBrokerTime: stat.startBrokerTime,
            endBrokerTime: stat.endBrokerTime,
            balance: stat.balance,
            equity: stat.equity,
            maxDrawdown: stat.maxDrawdown,
            maxDailyDrawdown: stat.maxDailyDrawdown,
            profit: stat.profit,
            trades: stat.trades,
            tradingDays: stat.tradingDays
          }))
        : (cachedStats.lastPeriodStats || []),
      trackers: trackers.length === 0 && cachedStats.lastTrackers ? cachedStats.lastTrackers : trackers.map(tracker => {
        // Clean object by removing undefined values
        const cleanTracker: any = {
          id: tracker.id || `tracker_${tracker.name}_${Date.now()}`,
          name: tracker.name || 'Unknown Tracker',
          period: tracker.period || 'day'
        };
        
        // Only add fields if they have actual values
        if (tracker.type !== undefined) cleanTracker.type = tracker.type;
        if (tracker.absoluteDrawdownThreshold !== undefined) cleanTracker.absoluteDrawdownThreshold = tracker.absoluteDrawdownThreshold;
        if (tracker.relativeDrawdownThreshold !== undefined) cleanTracker.relativeDrawdownThreshold = tracker.relativeDrawdownThreshold;
        if (tracker.absoluteProfitThreshold !== undefined) cleanTracker.absoluteProfitThreshold = tracker.absoluteProfitThreshold;
        if (tracker.relativeProfitThreshold !== undefined) cleanTracker.relativeProfitThreshold = tracker.relativeProfitThreshold;
        if (tracker.startBrokerTime !== undefined) cleanTracker.startBrokerTime = tracker.startBrokerTime;
        if (tracker.endBrokerTime !== undefined) cleanTracker.endBrokerTime = tracker.endBrokerTime;
        
        return cleanTracker;
      })
    };
    
    console.log(`Returning ${response.trades.length} trades, ${response.equityChart.length} equity points, ${response.riskEvents.length} risk events`);
    console.log(`Daily Drawdown: ${calculatedDailyDrawdown.toFixed(2)}%, Risk Trackers: ${trackers.length}`);

    // Save enhanced data to Firebase cache
    if (!USE_MOCK_DATA) {
      try {
        // Get existing cached metrics to check for max daily drawdown
        let maxDailyDrawdown = calculatedDailyDrawdown;
        let existingData: any = null;
        try {
          const existingCached = await adminDb.collection('cachedMetrics').doc(accountId).get();
          if (existingCached.exists) {
            existingData = existingCached.data();
            // Keep the higher value between current and previously recorded max daily drawdown
            maxDailyDrawdown = Math.max(
              calculatedDailyDrawdown,
              existingData?.maxDailyDrawdown || 0
            );
          }
        } catch (err) {
          // If no existing cache, use current value
          console.log('No existing cache found, using current daily drawdown');
        }

        // Defensive guard: never overwrite previously-good values with zeros.
        // If this fetch produced a zero balance but we have a positive cached
        // balance, keep the cached balance/equity/maxDrawdown instead.
        const hasGoodExisting = !!existingData && (existingData.balance || 0) > 0;
        const liveBalanceMissing = !(response.metrics.balance > 0);
        const safeBalance = liveBalanceMissing && hasGoodExisting ? existingData.balance : response.metrics.balance;
        const safeEquity = liveBalanceMissing && hasGoodExisting ? (existingData.equity ?? existingData.balance) : response.metrics.equity;
        const safeMaxDrawdown = liveBalanceMissing && hasGoodExisting ? (existingData.maxDrawdown ?? response.metrics.maxDrawdown) : response.metrics.maxDrawdown;

        const metricsToCache = {
          accountId,
          balance: safeBalance,
          equity: safeEquity,
          averageProfit: response.metrics.averageWin,
          averageLoss: response.metrics.averageLoss,
          numberOfTrades: response.metrics.trades,
          wonTrades: response.metrics.wonTrades,
          lostTrades: response.metrics.lostTrades,
          averageRRR: response.metrics.avgRRR,
          lots: response.metrics.lots,
          expectancy: response.metrics.expectancy,
          winRate: response.metrics.winRate,
          profitFactor: response.metrics.profitFactor,
          maxDrawdown: safeMaxDrawdown,
          dailyDrawdown: calculatedDailyDrawdown,
          maxDailyDrawdown,
          currentProfit: response.metrics.profit,
          tradingDays: response.objectives.minTradingDays.current,
          accountName: response.accountInfo.name,
          broker: response.accountInfo.broker,
          server: response.accountInfo.server,
          lastTrades: response.trades,
          lastEquityChart: response.equityChart,
          lastObjectives: response.objectives,
          lastRiskEvents: response.riskEvents,
          lastPeriodStats: response.periodStats,
          lastTrackers: response.trackers,
          lastUpdated: new Date()
        };

        await adminDb.collection('cachedMetrics').doc(accountId).set(metricsToCache);
        console.log('Enhanced metrics cached to Firebase for account:', accountId);
        console.log(`Max Daily Drawdown recorded: ${maxDailyDrawdown.toFixed(2)}%, Risk Events: ${response.riskEvents.length}`);
      } catch (cacheError) {
        console.error('Error caching metrics to Firebase:', cacheError);
        // Don't fail the request if caching fails
      }
    }

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}

// Enhanced function to set up automated risk trackers
async function setupRiskTrackers(riskApi: any, accountId: string, accountType: 'standard' | 'instant' | '1-step' | 'gauntlet', accountSize: number, step: number = 1) {
  try {
    // Check if riskApi is available
    if (!riskApi) {
      console.log('Risk API not available - cannot set up trackers');
      return [];
    }

    // Get existing trackers
    const existingTrackers = await riskApi.getTrackers(accountId);
    console.log(`Found ${existingTrackers.length} existing trackers`);
    
    // Define the trackers we need based on challenge type and step
    const isFunded = step === 3;
    let targetDrawdown: number;
    let targetDailyDrawdown: number | null;
    
    if (isFunded) {
      // Funded accounts use standard rules
      targetDrawdown = 15;
      targetDailyDrawdown = 8;
    } else if (accountType === '1-step') {
      // New 1-step challenge: 8% max, 4% daily
      targetDrawdown = 8;
      targetDailyDrawdown = 4;
    } else if (accountType === 'gauntlet') {
      // Gauntlet challenge: 15% max, 8% daily (single phase)
      targetDrawdown = 15;
      targetDailyDrawdown = 8;
    } else if (accountType === 'instant') {
      // Updated instant: 4% max trailing loss, no daily
      targetDrawdown = 4;
      targetDailyDrawdown = null; // No daily drawdown for instant
    } else {
      // Standard: 15% max, 8% daily
      targetDrawdown = 15;
      targetDailyDrawdown = 8;
    }
    
    // Required trackers using correct NewTracker format.
    // The overall/trailing max-drawdown tracker must span the whole account
    // ('lifetime'), otherwise it resets daily and never measures total drawdown.
    const requiredTrackers: any[] = [
      {
        name: isFunded ? 'Funded Max Drawdown Monitor' : 
              accountType === 'instant' ? 'Trailing Max Loss Monitor' : 'Max Drawdown Monitor',
        period: 'lifetime',
        relativeDrawdownThreshold: targetDrawdown / 100,
        absoluteDrawdownThreshold: (accountSize * targetDrawdown) / 100
      }
    ];
    
    // Only add daily drawdown tracker if not instant challenge
    if (targetDailyDrawdown !== null) {
      requiredTrackers.push({
        name: isFunded ? 'Funded Risk Limit Monitor' : 'Daily Drawdown Monitor', 
        period: 'day',
        relativeDrawdownThreshold: targetDailyDrawdown / 100,
        absoluteDrawdownThreshold: (accountSize * targetDailyDrawdown) / 100
      });
    }
    
    // Check if trackers already exist and create missing ones
    for (const requiredTracker of requiredTrackers) {
      const existingTracker = existingTrackers.find((t: any) => t.name === requiredTracker.name);
      
      if (!existingTracker) {
        console.log(`Creating tracker: ${requiredTracker.name}`);
        try {
          await riskApi.createTracker(accountId, requiredTracker);
          console.log(`Successfully created tracker: ${requiredTracker.name}`);
        } catch (createError: any) {
          console.error(`Failed to create tracker ${requiredTracker.name}:`, createError.message);
          // Continue with other trackers even if one fails
        }
      } else {
        console.log(`Tracker already exists: ${requiredTracker.name}`);
      }
    }
    
    // Return updated list of trackers
    const updatedTrackers = await riskApi.getTrackers(accountId);
    console.log(`Final tracker count: ${updatedTrackers.length}`);
    return updatedTrackers;
  } catch (error) {
    console.error('Error setting up risk trackers:', error);
    return [];
  }
}

// Enhanced function to format equity chart data
function formatEquityChart(equityData: any[]): any[] {
  const chartPoints: any[] = [];
  
  equityData.forEach((point: any) => {
    // Handle different data structures from Risk Management API
    if (point.startBrokerTime && point.endBrokerTime) {
      // Add start point
      chartPoints.push({
        date: point.startBrokerTime,
        equity: parseFloat(point.startEquity || point.averageEquity || 0),
        balance: parseFloat(point.startBalance || point.averageBalance || 0)
      });
      
      // Add end point
      chartPoints.push({
        date: point.endBrokerTime,
        equity: parseFloat(point.lastEquity || point.averageEquity || point.equity || 0),
        balance: parseFloat(point.lastBalance || point.averageBalance || point.balance || 0)
      });
    } else {
      // Single point data
      chartPoints.push({
        date: point.brokerTime || point.date || new Date().toISOString(),
        equity: parseFloat(point.equity || point.averageEquity || 0),
        balance: parseFloat(point.balance || point.averageBalance || 0)
      });
    }
  });
  
  // Sort by date and filter out invalid points
  return chartPoints
    .filter((point: any) => point.equity > 0 || point.balance > 0)
    .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

async function fetchAccountInfo(metaApi: any, accountId: string) {
  try {
    const account = await metaApi.metatraderAccountApi.getAccount(accountId);
    
    // First get basic account info from the account object
    const accountData = {
      accountId: account.id,
      name: account.name,
      broker: account.broker || 'Unknown',
      server: account.server || 'Unknown',
      type: account.type,
      platform: account.platform || 'mt5',
      state: account.state,
      connectionStatus: account.connectionStatus,
      // Default values that will be updated if we can connect
      balance: 0,
      equity: 0,
      currency: 'USD',
      leverage: 100
    };
    
    try {
      // Deploy account if needed
      if (account.state !== 'DEPLOYED') {
        console.log(`Deploying account ${accountId}. State: ${account.state}`);
        await account.deploy();
        console.log('Waiting for deployment...');
        // Wait a bit for deployment
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
      
      // Wait for connection if not connected
      if (account.connectionStatus !== 'CONNECTED') {
        console.log(`Waiting for account ${accountId} to connect. Status: ${account.connectionStatus}`);
        await account.waitConnected({ timeoutInSeconds: 30 });
      }
      
      // After account is connected, get account information
      // Based on the SDK, we need to create a connection to get real-time data
      const connection = account.getRPCConnection();
      
      try {
        await connection.connect();
        await connection.waitSynchronized({ timeoutInSeconds: 10 });
        
        // Get account information
        const accountInfo = await connection.getAccountInformation();
        if (accountInfo) {
          accountData.balance = accountInfo.balance || 0;
          accountData.equity = accountInfo.equity || 0;
          accountData.currency = accountInfo.currency || 'USD';
          accountData.leverage = accountInfo.leverage || 100;
          accountData.broker = accountInfo.broker || account.broker || 'Unknown';
          accountData.server = accountInfo.server || account.server || 'Unknown';
        }
        
        // Close connection after getting data
        if (connection.close) {
          connection.close();
        }
      } catch (connectionError: any) {
        console.error('Error with RPC connection:', connectionError.message);
        // Try streaming connection as fallback
        try {
          const streamingConnection = account.getStreamingConnection();
          await streamingConnection.connect();
          await streamingConnection.waitSynchronized({ timeoutInSeconds: 10 });
          
          // Check terminal state for account information
          if (streamingConnection.terminalState && streamingConnection.terminalState.accountInformation) {
            const info = streamingConnection.terminalState.accountInformation;
            accountData.balance = info.balance || 0;
            accountData.equity = info.equity || 0;
            accountData.currency = info.currency || 'USD';
            accountData.leverage = info.leverage || 100;
            accountData.broker = info.broker || account.broker || 'Unknown';
            accountData.server = info.server || account.server || 'Unknown';
          }
          
          if (streamingConnection.close) {
            streamingConnection.close();
          }
        } catch (streamingError: any) {
          console.error('Error with streaming connection:', streamingError.message);
        }
      }
      
    } catch (deploymentError: any) {
      console.error('Error deploying/connecting account:', deploymentError.message);
      // Return the basic account data we have
    }
    
    return accountData;
  } catch (error) {
    console.error('Error fetching account info:', error);
    throw error;
  }
}

// Helper function to get cached max daily drawdown
async function getCachedMaxDailyDrawdown(accountId: string): Promise<number | undefined> {
  try {
    const cachedDoc = await adminDb.collection('cachedMetrics').doc(accountId).get();
    if (cachedDoc.exists) {
      const data = cachedDoc.data();
      return data?.maxDailyDrawdown;
    }
  } catch (error) {
    console.error('Error fetching cached max daily drawdown:', error);
  }
  return undefined;
}

function generateMockData(accountId: string, accountType: string, accountSize: number, step: number = 1) {
  const balance = accountSize * 1.05; // 5% profit
  const equity = balance - 150; // Small floating loss
  const trades = 47;
  const wonTrades = 28;
  const lostTrades = 19;
  const winRate = (wonTrades / trades) * 100;
  
  return {
    metrics: {
      balance,
      equity,
      margin: 250,
      freeMargin: equity - 250,
      profit: balance - accountSize,
      credit: 0,
      trades,
      wonTrades,
      lostTrades,
      averageWin: 125.50,
      averageLoss: -65.25,
      expectancy: 35.75,
      profitFactor: 1.85,
      absoluteDrawdown: 450,
      maxDrawdown: 4.5,
      relativeDrawdown: 2.3,
      dailyGrowth: 0.25,
      monthlyGrowth: 5.2,
      lots: 15.75,
      commissions: -125,
      winRate,
      avgRRR: 1.92
    },
    accountInfo: {
      accountId,
      name: 'Shockwave Challenge Account',
      broker: 'MetaQuotes Software Corp.',
      server: 'MetaQuotes-Demo',
      balance,
      equity,
      currency: 'USD',
      leverage: 100,
      type: 'ACCOUNT_TRADE_MODE_DEMO',
      platform: 'mt5',
      state: 'DEPLOYED',
      connectionStatus: 'CONNECTED'
    },
    trades: generateMockTrades(),
    equityChart: generateMockEquityChart(accountSize),
    objectives: calculateMockObjectives(accountType, accountSize, balance, step, [], undefined),
    riskEvents: generateMockRiskEvents(),
    periodStats: generateMockPeriodStats(),
    trackers: generateMockTrackers(accountType, accountSize, step)
  };
}

function generateMockTrades() {
  const symbols = ['EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'XAUUSD'];
  const trades = [];
  
  for (let i = 0; i < 20; i++) {
    const isWin = Math.random() > 0.4;
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = Math.random() > 0.5 ? 'buy' : 'sell';
    const volume = (Math.random() * 0.5 + 0.1).toFixed(2);
    const openPrice = 1.0500 + Math.random() * 0.01;
    const profit = isWin ? Math.random() * 200 : -(Math.random() * 100);
    
    trades.push({
      id: `trade_${i}`,
      symbol,
      type,
      volume: parseFloat(volume),
      openPrice,
      closePrice: openPrice + (profit > 0 ? 0.001 : -0.0005),
      profit,
      openTime: new Date(Date.now() - i * 3600000).toISOString(),
      closeTime: i < 10 ? new Date(Date.now() - i * 1800000).toISOString() : null,
      commission: -2.5,
      swap: -0.5,
      state: i < 10 ? 'closed' : 'opened'
    });
  }
  
  return trades;
}

function generateMockEquityChart(startBalance: number) {
  const points = [];
  let currentBalance = startBalance;
  let currentEquity = startBalance;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Simulate gradual growth with some volatility
    const dailyChange = (Math.random() - 0.3) * 0.005 * currentBalance;
    currentBalance += dailyChange;
    currentEquity = currentBalance + (Math.random() - 0.5) * 100;
    
    points.push({
      date: date.toISOString(),
      balance: currentBalance,
      equity: currentEquity
    });
  }
  
  return points;
}

function generateMockRiskEvents() {
  return [
    {
      id: 'event1',
      type: 'warning',
      accountId: 'mock-account',
      sequenceNumber: 1,
      brokerTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      absoluteDrawdown: 250,
      relativeDrawdown: 2.5,
      exceededThresholdType: 'drawdown'
    }
  ];
}

function generateMockPeriodStats() {
  const stats = [];
  for (let i = 7; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    stats.push({
      period: 'day',
      startBrokerTime: new Date(date.getTime()).toISOString(),
      endBrokerTime: new Date(date.getTime() + 86400000).toISOString(),
      balance: 10000 + (Math.random() - 0.5) * 500,
      equity: 10000 + (Math.random() - 0.5) * 500,
      maxDrawdown: Math.random() * 3,
      maxDailyDrawdown: Math.random() * 2,
      profit: (Math.random() - 0.5) * 100,
      trades: Math.floor(Math.random() * 5),
      tradingDays: i < 5 ? 1 : 0
    });
  }
  return stats;
}

function generateMockTrackers(accountType: string, accountSize: number, step: number = 1) {
  const isFunded = step === 3;
  
  let maxDD: number;
  let dailyDD: number | null;
  
  if (isFunded) {
    maxDD = 15;
    dailyDD = 8;
  } else if (accountType === '1-step') {
    maxDD = 8;
    dailyDD = 4;
  } else if (accountType === 'gauntlet') {
    maxDD = 15;
    dailyDD = 8;
  } else if (accountType === 'instant') {
    maxDD = 4;
    dailyDD = null;
  } else {
    maxDD = 15;
    dailyDD = 8;
  }
  
  const trackers: any[] = [
    {
      id: 'tracker_max_dd',
      name: isFunded ? 'Funded Max Drawdown Monitor' : 
            accountType === 'instant' ? 'Trailing Max Loss Monitor' : 'Max Drawdown Monitor',
      period: 'day',
      relativeDrawdownThreshold: maxDD / 100,
      absoluteDrawdownThreshold: (accountSize * maxDD) / 100
    }
  ];
  
  if (dailyDD !== null) {
    trackers.push({
      id: 'tracker_daily_dd',
      name: isFunded ? 'Funded Risk Limit Monitor' : 'Daily Drawdown Monitor',
      period: 'day',
      relativeDrawdownThreshold: dailyDD / 100,
      absoluteDrawdownThreshold: (accountSize * dailyDD) / 100
    });
  }
  
  return trackers;
}

function calculateMockObjectives(accountType: string, accountSize: number, currentBalance: number, step: number = 1, equityData?: any[], cachedMaxDailyDrawdown?: number) {
  const profitPercent = ((currentBalance - accountSize) / accountSize) * 100;
  const maxDrawdown = 4.5; // Mock value
  const dailyDrawdown = cachedMaxDailyDrawdown || 2.3; // Mock value
  const tradingDays = 12; // Mock value
  
  const isFunded = step === 3;
  
  if (isFunded) {
    return {
      minTradingDays: { target: 5, current: tradingDays, passed: tradingDays >= 5 },
      maxDrawdown: { target: 15, current: maxDrawdown, passed: maxDrawdown <= 15 },
      maxDailyDrawdown: { target: 8, current: dailyDrawdown, passed: dailyDrawdown <= 8 },
      profitTarget: { target: 0, current: profitPercent, passed: true },
      fundedStatus: true,
      tradingDaysWithGain: tradingDays,
      fundedPayoutEligible: tradingDays >= 5
    };
  }
  
  let targets: any = {};
  
  if (accountType === '1-step') {
    targets = {
      minTradingDays: 5,
      maxDrawdown: 8,
      maxDailyDrawdown: 4,
      profitTarget: 10
    };
  } else if (accountType === 'gauntlet') {
    targets = {
      minTradingDays: 0,
      maxDrawdown: 15,
      maxDailyDrawdown: 8,
      profitTarget: 10
    };
  } else if (accountType === 'instant') {
    targets = {
      minTradingDays: 5,
      maxDrawdown: 4,
      maxDailyDrawdown: null,
      profitTarget: 12
    };
  } else {
    targets = {
      minTradingDays: 5,
      maxDrawdown: 15,
      maxDailyDrawdown: 8,
      profitTarget: step === 1 ? 10 : 5
    };
  }
  
  const objectives: any = {
    minTradingDays: { 
      target: targets.minTradingDays, 
      current: tradingDays, 
      passed: tradingDays >= targets.minTradingDays 
    },
    maxDrawdown: { 
      target: targets.maxDrawdown, 
      current: maxDrawdown, 
      passed: maxDrawdown <= targets.maxDrawdown,
      isTrailing: accountType === 'instant'
    },
    profitTarget: { 
      target: targets.profitTarget, 
      current: profitPercent, 
      passed: profitPercent >= targets.profitTarget 
    }
  };
  
  if (targets.maxDailyDrawdown !== null) {
    objectives.maxDailyDrawdown = { 
      target: targets.maxDailyDrawdown, 
      current: dailyDrawdown, 
      passed: dailyDrawdown <= targets.maxDailyDrawdown 
    };
  }
  
  return objectives;
}

function mapTradeType(type: string): 'buy' | 'sell' | 'unknown' {
  if (!type) return 'unknown';
  
  const typeUpper = type.toUpperCase();
  
  // Handle various trade type formats from MetaStats
  if (typeUpper.includes('BUY') || 
      typeUpper.includes('DEAL_TYPE_BUY') || 
      typeUpper === 'DEAL_BUY' ||
      typeUpper === 'BUY_MARKET' ||
      typeUpper === 'BUY_LIMIT' ||
      typeUpper === 'BUY_STOP') {
    return 'buy';
  }
  
  if (typeUpper.includes('SELL') || 
      typeUpper.includes('DEAL_TYPE_SELL') || 
      typeUpper === 'DEAL_SELL' ||
      typeUpper === 'SELL_MARKET' ||
      typeUpper === 'SELL_LIMIT' ||
      typeUpper === 'SELL_STOP') {
    return 'sell';
  }
  
  return 'unknown';
} 