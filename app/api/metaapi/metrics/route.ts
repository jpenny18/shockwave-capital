import { NextRequest, NextResponse } from 'next/server';
import { auth as adminAuth, db as adminDb } from '@/lib/firebase-admin';

// For now, we'll use mock data to test the system
// Once MetaAPI connectivity is resolved, we can switch back
const USE_MOCK_DATA = false;

// Import MetaAPI only on server side
const MetaApiClass = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').default;
const MetaStats = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').MetaStats;
const RiskManagement = USE_MOCK_DATA ? null : require('metaapi.cloud-sdk').RiskManagement;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { accountId, accountToken, accountType, accountSize, isAdmin } = body;
    
    console.log('Request body:', { 
      accountId, 
      hasToken: !!accountToken, 
      accountType, 
      accountSize 
    });
    
    // Validate required parameters
    if (!accountId || !accountToken) {
      return NextResponse.json(
        { error: 'Missing required parameters: accountId and accountToken are required' },
        { status: 400 }
      );
    }
    
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
            objectives: cachedData.lastObjectives || calculateTradingObjectives(
              {
                balance: cachedData.balance || 0,
                maxDrawdown: cachedData.maxDrawdown || 0,
                dailyDrawdown: cachedData.dailyDrawdown || 0,
                trades: cachedData.numberOfTrades || 0,
                tradingDays: cachedData.tradingDays || 0
              },
              accountType,
              accountSize,
              undefined,
              undefined,
              cachedData.maxDailyDrawdown // Pass the cached max daily drawdown
            ),
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
      const mockResponse = generateMockData(accountId, accountType, accountSize);
      return NextResponse.json(mockResponse);
    }

    // Real MetaAPI implementation (currently disabled)
    const metaApi = new MetaApiClass(accountToken);
    const metaStats = new MetaStats(accountToken);
    const riskManagement = new RiskManagement(accountToken);
    
    console.log('MetaAPI initialized with token:', accountToken.substring(0, 20) + '...');
    console.log('Processing request for account:', accountId);

    // Initialize default response data
    let metricsData = {
      balance: 0,
      equity: 0,
      margin: 0,
      freeMargin: 0,
      profit: 0,
      credit: 0,
      trades: 0,
      wonTrades: 0,
      lostTrades: 0,
      averageWin: 0,
      averageLoss: 0,
      expectancy: 0,
      profitFactor: 0,
      absoluteDrawdown: 0,
      maxDrawdown: 0,
      relativeDrawdown: 0,
      lots: 0,
      commissions: 0
    };
    
    let accountData = null;
    let tradesData: any[] = [];
    let equityData: any[] = [];

    try {
      // Fetch account info first to ensure connection
      accountData = await fetchAccountInfo(metaApi, accountId);
      
      // Update balance from account info if available
      if (accountData && accountData.balance) {
        metricsData.balance = accountData.balance;
        metricsData.equity = accountData.equity || accountData.balance;
      }
    } catch (error) {
      console.error('Error fetching account info:', error);
      // Continue with other data fetching
    }

    // Try to fetch metrics from MetaStats
    try {
      const metrics = await metaStats.getMetrics(accountId);
      if (metrics) {
        metricsData = { ...metricsData, ...metrics };
        console.log('Metrics received:', {
          balance: metrics.balance,
          maxDrawdown: metrics.maxDrawdown,
          relativeDrawdown: metrics.relativeDrawdown,
          dailyDrawdown: metrics.dailyDrawdown,
          maxDailyDrawdown: metrics.maxDailyDrawdown,
          maxRelativeDrawdown: metrics.maxRelativeDrawdown,
          trades: metrics.trades,
          tradingDays: metrics.tradingDays
        });
      }
    } catch (error: any) {
      console.error('Error fetching metrics:', error.message);
      // Use data from account info if available
    }

    // Try to fetch trades
    try {
      // Using the date format from the example: '0000-01-01 00:00:00.000'
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
      
      // Log a sample trade to understand the structure
      if (tradesData.length > 0) {
        console.log('Sample trade structure:', JSON.stringify(tradesData[0], null, 2));
      }
      
      // Filter out balance operations and non-trading deals
      const beforeFilterCount = tradesData.length;
      const filteredOutTrades: any[] = [];
      
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
               
        if (!isRealTrade && trade.type) {
          filteredOutTrades.push({ type: trade.type, symbol: trade.symbol });
        }
        
        return isRealTrade;
      });
      
      console.log(`Filtered from ${beforeFilterCount} to ${tradesData.length} actual trades`);
      if (filteredOutTrades.length > 0) {
        console.log('Filtered out trade types:', filteredOutTrades);
      }
    } catch (error: any) {
      console.error('Error fetching trades:', error.message);
    }

    // Try to fetch equity chart
    try {
      const riskApi = riskManagement.riskManagementApi;
      const equity = await riskApi.getEquityChart(accountId);
      equityData = equity || [];
      console.log(`Retrieved ${equityData.length} equity data points`);
      
      // Log sample equity data to understand structure
      if (equityData.length > 0) {
        console.log('Sample equity data:', JSON.stringify(equityData[0], null, 2));
      }
    } catch (error: any) {
      console.error('Error fetching equity chart:', error.message);
    }

    // Calculate additional metrics
    const winRate = metricsData.trades > 0 ? (metricsData.wonTrades / metricsData.trades) * 100 : 0;
    const avgRRR = metricsData.averageLoss !== 0 ? Math.abs(metricsData.averageWin / metricsData.averageLoss) : 0;

    // Calculate trading objectives
    const objectives = calculateTradingObjectives(metricsData, accountType, accountSize, equityData, tradesData, USE_MOCK_DATA ? undefined : await getCachedMaxDailyDrawdown(accountId));

    // Calculate daily drawdown from equity data
    const calculatedDailyDrawdown = equityData && equityData.length > 0 
      ? calculateDailyDrawdown(equityData)
      : metricsData.relativeDrawdown || 0; // Use relativeDrawdown as fallback

    // Format response
    const response = {
      metrics: {
        ...metricsData,
        winRate,
        avgRRR,
        dailyDrawdown: calculatedDailyDrawdown
      },
      accountInfo: accountData || {
        accountId,
        name: 'Unknown Account',
        broker: 'Unknown',
        server: 'Unknown',
        balance: metricsData.balance,
        equity: metricsData.equity,
        currency: 'USD',
        leverage: 100,
        type: 'ACCOUNT_TRADE_MODE_DEMO',
        platform: 'mt5',
        state: 'UNKNOWN',
        connectionStatus: 'UNKNOWN'
      },
      trades: tradesData.slice(0, 50).map((trade: any) => ({
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
      })),
      equityChart: (() => {
        // The Risk Management API returns aggregated hourly data
        // We need to create a time series for the chart
        const chartPoints: any[] = [];
        
        equityData.forEach((point: any) => {
          // Add start point
          if (point.startBrokerTime) {
            chartPoints.push({
              date: point.startBrokerTime,
              equity: parseFloat(point.startEquity || point.averageEquity || 0),
              balance: parseFloat(point.startBalance || point.averageBalance || 0)
            });
          }
          
          // Add end point (or single point if no start/end)
          chartPoints.push({
            date: point.endBrokerTime || point.brokerTime || new Date().toISOString(),
            equity: parseFloat(point.lastEquity || point.averageEquity || point.equity || 0),
            balance: parseFloat(point.lastBalance || point.averageBalance || point.balance || 0)
          });
        });
        
        // Sort by date and filter out invalid points
        return chartPoints
          .filter((point: any) => point.equity > 0 || point.balance > 0)
          .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      })(),
      objectives
    };
    
    console.log(`Returning ${response.trades.length} trades and ${response.equityChart.length} equity points`);
    console.log(`Daily Drawdown: ${calculatedDailyDrawdown.toFixed(2)}%`);

    // Save to Firebase cache (if real data, not mock)
    if (!USE_MOCK_DATA) {
      try {
        // Get existing cached metrics to check for max daily drawdown
        let maxDailyDrawdown = calculatedDailyDrawdown;
        try {
          const existingCached = await adminDb.collection('cachedMetrics').doc(accountId).get();
          if (existingCached.exists) {
            const existingData = existingCached.data();
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
        
        const metricsToCache = {
          accountId,
          balance: response.metrics.balance,
          equity: response.metrics.equity,
          averageProfit: response.metrics.averageWin,
          averageLoss: response.metrics.averageLoss,
          numberOfTrades: response.metrics.trades,
          averageRRR: response.metrics.avgRRR,
          lots: response.metrics.lots,
          expectancy: response.metrics.expectancy,
          winRate: response.metrics.winRate,
          profitFactor: response.metrics.profitFactor,
          maxDrawdown: response.metrics.maxDrawdown,
          dailyDrawdown: calculatedDailyDrawdown,
          maxDailyDrawdown, // Store the maximum daily drawdown ever achieved
          currentProfit: response.metrics.profit,
          tradingDays: response.objectives.minTradingDays.current,
          accountName: response.accountInfo.name,
          broker: response.accountInfo.broker,
          server: response.accountInfo.server,
          lastTrades: response.trades,
          lastEquityChart: response.equityChart,
          lastObjectives: response.objectives,
          lastUpdated: new Date()
        };

        await adminDb.collection('cachedMetrics').doc(accountId).set(metricsToCache);
        console.log('Metrics cached to Firebase for account:', accountId);
        console.log(`Max Daily Drawdown recorded: ${maxDailyDrawdown.toFixed(2)}%`);
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

// Helper function to calculate daily drawdown from equity data
function calculateDailyDrawdown(equityData: any[]): number {
  if (!equityData || equityData.length === 0) return 0;
  
  let maxDailyDrawdown = 0;
  
  // Group equity data by day
  const dailyData: { [key: string]: any[] } = {};
  
  equityData.forEach(point => {
    const date = new Date(point.brokerTime || point.endBrokerTime || point.date);
    const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
    
    if (!dailyData[dayKey]) {
      dailyData[dayKey] = [];
    }
    dailyData[dayKey].push(point);
  });
  
  // Calculate max drawdown for each day
  Object.values(dailyData).forEach(dayPoints => {
    let dayHighBalance = 0;
    let dayHighEquity = 0;
    let maxDayDrawdown = 0;
    
    dayPoints.forEach(point => {
      // Track highest balance/equity for the day
      const balance = parseFloat(point.balance || point.lastBalance || point.maxBalance || 0);
      const equity = parseFloat(point.equity || point.lastEquity || point.maxEquity || 0);
      
      dayHighBalance = Math.max(dayHighBalance, balance);
      dayHighEquity = Math.max(dayHighEquity, equity);
      
      // Calculate current drawdown from day's high
      const currentEquity = parseFloat(point.lastEquity || point.equity || point.minEquity || 0);
      const drawdownFromHigh = dayHighEquity > 0 ? ((dayHighEquity - currentEquity) / dayHighEquity) * 100 : 0;
      
      maxDayDrawdown = Math.max(maxDayDrawdown, drawdownFromHigh);
    });
    
    // Track the worst daily drawdown across all days
    maxDailyDrawdown = Math.max(maxDailyDrawdown, maxDayDrawdown);
  });
  
  return maxDailyDrawdown;
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

function calculateTradingObjectives(
  metrics: any,
  challengeType: 'standard' | 'instant',
  accountStartBalance: number,
  equityData?: any[],
  tradesData?: any[],
  cachedMaxDailyDrawdown?: number
) {
  const currentBalance = metrics.balance || 0;
  const currentDrawdown = metrics.maxDrawdown || 0;
  
  // Calculate daily drawdown from equity data if available
  let maxDailyDrawdown = 0;
  
  if (equityData && equityData.length > 0) {
    // Use our detailed calculation from equity data
    const currentDailyDrawdown = calculateDailyDrawdown(equityData);
    // Compare with cached max daily drawdown and use the higher value
    maxDailyDrawdown = Math.max(
      currentDailyDrawdown,
      cachedMaxDailyDrawdown || 0
    );
  } else if (cachedMaxDailyDrawdown !== undefined) {
    // Use cached max daily drawdown if no equity data
    maxDailyDrawdown = cachedMaxDailyDrawdown;
  } else {
    // Fallback to metrics data if available
    maxDailyDrawdown = Math.max(
      metrics.dailyDrawdown || 0,
      metrics.relativeDrawdown || 0,
      metrics.maxDailyDrawdown || 0,
      metrics.maxRelativeDrawdown || 0
    );
  }
  
  const profitPercentage = accountStartBalance > 0 
    ? ((currentBalance - accountStartBalance) / accountStartBalance) * 100 
    : 0;
  
  const targets = {
    standard: {
      minTradingDays: 5,
      maxDrawdown: 15,
      maxDailyDrawdown: 8,
      profitTargetStep1: 10,
      profitTargetStep2: 5
    },
    instant: {
      minTradingDays: 5,
      maxDrawdown: 12,
      maxDailyDrawdown: 4,
      profitTargetStep1: 12,
      profitTargetStep2: 0
    }
  };
  
  const target = targets[challengeType] || targets.standard;
  
  // Calculate trading days based on trades data
  // A trading day is counted when there are at least 2 trades on that day
  let tradingDays = 0;
  
  if (tradesData && tradesData.length > 0) {
    // Group trades by day
    const tradesByDay: { [key: string]: number } = {};
    
    tradesData.forEach(trade => {
      const tradeDate = trade.openTime || trade.time || trade.date;
      if (tradeDate) {
        const date = new Date(tradeDate);
        const dayKey = date.toISOString().slice(0, 10); // YYYY-MM-DD
        
        if (!tradesByDay[dayKey]) {
          tradesByDay[dayKey] = 0;
        }
        tradesByDay[dayKey]++;
      }
    });
    
    // Count days with at least 2 trades
    Object.values(tradesByDay).forEach(tradesCount => {
      if (tradesCount >= 2) {
        tradingDays++;
      }
    });
  } else if (metrics.tradingDays) {
    // If MetaStats provides trading days directly
    tradingDays = metrics.tradingDays;
  } else if (metrics.trades > 0) {
    // Fallback estimation - assume trades are distributed across days
    // with an average of 3 trades per trading day
    tradingDays = Math.min(Math.floor(metrics.trades / 3), 30);
  }
  
  return {
    minTradingDays: {
      target: target.minTradingDays,
      current: tradingDays,
      passed: tradingDays >= target.minTradingDays
    },
    maxDrawdown: {
      target: target.maxDrawdown,
      current: currentDrawdown,
      passed: currentDrawdown <= target.maxDrawdown
    },
    maxDailyDrawdown: {
      target: target.maxDailyDrawdown,
      current: maxDailyDrawdown,
      passed: maxDailyDrawdown <= target.maxDailyDrawdown
    },
    profitTarget: {
      target: target.profitTargetStep1,
      current: profitPercentage,
      passed: profitPercentage >= target.profitTargetStep1
    }
  };
}

function generateMockData(accountId: string, accountType: string, accountSize: number) {
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
    objectives: calculateMockObjectives(accountType, accountSize, balance, [])
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

function calculateMockObjectives(accountType: string, accountSize: number, currentBalance: number, equityData?: any[], cachedMaxDailyDrawdown?: number) {
  const profitPercentage = ((currentBalance - accountSize) / accountSize) * 100;
  
  // Calculate daily drawdown from equity data if available
  let maxDailyDrawdown = 2.3; // Default mock value
  if (cachedMaxDailyDrawdown !== undefined) {
    maxDailyDrawdown = cachedMaxDailyDrawdown;
  } else if (equityData && equityData.length > 0) {
    maxDailyDrawdown = calculateDailyDrawdown(equityData);
  }
  
  return {
    minTradingDays: {
      target: 5,
      current: 5,
      passed: true
    },
    maxDrawdown: {
      target: accountType === 'standard' ? 15 : 12,
      current: 4.5,
      passed: true
    },
    maxDailyDrawdown: {
      target: accountType === 'standard' ? 8 : 4,
      current: maxDailyDrawdown,
      passed: maxDailyDrawdown <= (accountType === 'standard' ? 8 : 4)
    },
    profitTarget: {
      target: accountType === 'standard' ? 10 : 12,
      current: profitPercentage,
      passed: profitPercentage >= (accountType === 'standard' ? 10 : 12)
    }
  };
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