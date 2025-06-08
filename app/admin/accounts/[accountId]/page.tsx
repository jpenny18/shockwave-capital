'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getCachedMetrics, updateCachedMetrics, Timestamp, db } from '../../../../lib/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import dynamic from 'next/dynamic';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  BarChart2, 
  Target,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  Server,
  Activity,
  RefreshCw,
  User,
  ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define interfaces
interface TradingObjectives {
  minTradingDays: { target: number; current: number; passed: boolean };
  maxDrawdown: { target: number; current: number; passed: boolean; recentBreach?: boolean };
  maxDailyDrawdown: { target: number; current: number; passed: boolean; recentBreach?: boolean };
  profitTarget: { target: number; current: number; passed: boolean };
}

interface TradeData {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  volume: number;
  openPrice: number;
  closePrice: number;
  profit: number;
  openTime: string;
  closeTime?: string;
  commission: number;
  swap: number;
  state: 'opened' | 'closed';
}

interface EquityChartPoint {
  date: string;
  equity: number;
  balance: number;
}

interface RiskEvent {
  id: string;
  type: string;
  accountId: string;
  sequenceNumber: number;
  brokerTime: string;
  absoluteDrawdown: number;
  relativeDrawdown: number;
  exceededThresholdType: string;
}

interface PeriodStatistic {
  period: string;
  startBrokerTime: string;
  endBrokerTime: string;
  balance: number;
  equity: number;
  maxDrawdown: number;
  maxDailyDrawdown: number;
  profit: number;
  trades: number;
  tradingDays: number;
}

// Metric Card Component
const MetricCard = ({ title, value, icon: Icon, format = 'number', prefix = '', suffix = '' }: {
  title: string;
  value: number | string;
  icon?: React.ElementType;
  format?: 'number' | 'currency' | 'percent' | 'string';
  prefix?: string;
  suffix?: string;
}) => {
  const formatValue = () => {
    if (format === 'string') return value;
    const numValue = typeof value === 'number' ? value : parseFloat(value as string);
    
    if (format === 'currency') return `$${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    if (format === 'percent') return `${numValue.toFixed(2)}%`;
    return `${prefix}${numValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}${suffix}`;
  };

  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4 hover:border-[#0FF1CE]/30 transition-all">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-400 text-xs mb-1">{title}</p>
          <p className="text-white text-lg font-semibold">{formatValue()}</p>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#0FF1CE]/10 text-[#0FF1CE]">
            <Icon size={16} />
          </div>
        )}
      </div>
    </div>
  );
};

// Trading Objectives Table Component
const TradingObjectivesTable = ({ objectives }: { objectives: TradingObjectives }) => {
  const rows = [
    { 
      label: 'Min Trading Days', 
      target: objectives.minTradingDays.target,
      current: objectives.minTradingDays.current,
      passed: objectives.minTradingDays.passed,
      format: 'days'
    },
    { 
      label: 'Max Drawdown %', 
      target: objectives.maxDrawdown.target,
      current: objectives.maxDrawdown.current,
      passed: objectives.maxDrawdown.passed,
      format: 'percent'
    },
    { 
      label: 'Max Daily Drawdown % (Highest Achieved)', 
      target: objectives.maxDailyDrawdown.target,
      current: objectives.maxDailyDrawdown.current,
      passed: objectives.maxDailyDrawdown.passed,
      format: 'percent'
    },
    { 
      label: 'Profit Target %', 
      target: objectives.profitTarget.target,
      current: objectives.profitTarget.current,
      passed: objectives.profitTarget.passed,
      format: 'percent'
    }
  ];

  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trading Objectives</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2F2F2F]">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Objective</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Target</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Current</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border-b border-[#2F2F2F]/50">
                <td className="py-3 px-4 text-sm text-white">{row.label}</td>
                <td className="py-3 px-4 text-sm text-center text-gray-300">
                  {row.format === 'percent' ? `${row.target}%` : row.target}
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className={row.passed ? 'text-green-400' : 'text-yellow-400'}>
                    {row.format === 'percent' ? `${row.current.toFixed(2)}%` : row.current}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  {row.passed ? (
                    <CheckCircle className="inline-block text-green-400" size={18} />
                  ) : (
                    <XCircle className="inline-block text-red-400" size={18} />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Risk Events Table Component
const RiskEventsTable = ({ riskEvents }: { riskEvents: RiskEvent[] }) => {
  if (!riskEvents || riskEvents.length === 0) {
    return (
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Events</h3>
        <p className="text-gray-400 text-sm">No risk events recorded</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Risk Events</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2F2F2F]">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Time</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Type</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Drawdown %</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Amount</th>
            </tr>
          </thead>
          <tbody>
            {riskEvents.map((event, index) => (
              <tr key={event.id || index} className="border-b border-[#2F2F2F]/50">
                <td className="py-3 px-4 text-sm text-white">
                  {new Date(event.brokerTime).toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    event.exceededThresholdType === 'drawdown' 
                      ? 'bg-red-500/20 text-red-400'
                      : event.exceededThresholdType === 'dailyDrawdown'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {event.exceededThresholdType}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right text-red-400 font-medium">
                  {event.relativeDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-right text-red-400">
                  ${event.absoluteDrawdown.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Period Statistics Component
const PeriodStatsChart = ({ periodStats }: { periodStats: PeriodStatistic[] }) => {
  if (!periodStats || periodStats.length === 0) {
    return (
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Period Statistics</h3>
        <p className="text-gray-400 text-sm">No period statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Daily Performance (Last 30 Days)</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#2F2F2F]">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Date</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Balance</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Equity</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Profit</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Max DD</th>
              <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Daily DD</th>
              <th className="text-center py-3 px-4 text-sm font-medium text-gray-400">Trades</th>
            </tr>
          </thead>
          <tbody>
            {periodStats.slice(-7).map((stat, index) => ( // Show last 7 days
              <tr key={index} className="border-b border-[#2F2F2F]/50">
                <td className="py-3 px-4 text-sm text-white">
                  {new Date(stat.startBrokerTime).toLocaleDateString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-white">
                  ${stat.balance.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-white">
                  ${stat.equity.toLocaleString()}
                </td>
                <td className={`py-3 px-4 text-sm text-right font-medium ${
                  stat.profit >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.profit >= 0 ? '+' : ''}${stat.profit.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-sm text-right text-yellow-400">
                  {stat.maxDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-right text-orange-400">
                  {stat.maxDailyDrawdown.toFixed(2)}%
                </td>
                <td className="py-3 px-4 text-sm text-center text-gray-300">
                  {stat.trades}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default function AdminAccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = params.accountId as string;
  
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);
  const [objectives, setObjectives] = useState<TradingObjectives | null>(null);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string>('active');
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [periodStats, setPeriodStats] = useState<PeriodStatistic[]>([]);

  const fetchAccountData = async () => {
    try {
      setError(null);
      
      // First, get the account info from userMetaApiAccounts
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const accountQuery = query(accountsRef, where('accountId', '==', accountId), limit(1));
      const accountSnapshot = await getDocs(accountQuery);
      
      if (accountSnapshot.empty) {
        throw new Error('Account not found');
      }
      
      const accountData = accountSnapshot.docs[0].data();
      setAccountStatus(accountData.status);
      
      // Get user info
      const usersRef = collection(db, 'users');
      const userQuery = query(usersRef, where('uid', '==', accountData.userId), limit(1));
      const userSnapshot = await getDocs(userQuery);
      
      if (!userSnapshot.empty) {
        setUserInfo(userSnapshot.docs[0].data());
      }
      
      // Try to get cached metrics first
      const cachedData = await getCachedMetrics(accountId);
      
      if (cachedData) {
        // Convert cached data to the expected format
        setMetrics({
          balance: cachedData.balance,
          equity: cachedData.equity,
          averageWin: cachedData.averageProfit,
          averageLoss: cachedData.averageLoss,
          trades: cachedData.numberOfTrades,
          lots: cachedData.lots,
          expectancy: cachedData.expectancy,
          profitFactor: cachedData.profitFactor,
          maxDrawdown: cachedData.maxDrawdown,
          relativeDrawdown: cachedData.dailyDrawdown,
          wonTrades: Math.round(cachedData.numberOfTrades * (cachedData.winRate / 100)),
          lostTrades: Math.round(cachedData.numberOfTrades * (1 - cachedData.winRate / 100)),
          winRate: cachedData.winRate,
          avgRRR: cachedData.averageRRR,
          profit: cachedData.currentProfit || ((cachedData.balance - accountData.accountSize) || 0),
          riskEvents: cachedData.lastRiskEvents || [],
          periodStats: cachedData.lastPeriodStats || []
        });
        
        // Set risk events and period stats
        setRiskEvents(cachedData.lastRiskEvents || []);
        setPeriodStats(cachedData.lastPeriodStats || []);
        
        // Calculate objectives based on account type with enhanced data
        const targetDrawdown = accountData.accountType === 'standard' ? 15 : 12;
        const targetDailyDrawdown = accountData.accountType === 'standard' ? 8 : 4;
        const targetProfit = accountData.accountType === 'standard' ? 10 : 12;
        const targetTradingDays = accountData.accountType === 'standard' ? 5 : 5;
        
        const profitPercent = ((cachedData.balance - accountData.accountSize) / accountData.accountSize) * 100;
        
        // Check for recent breaches in risk events
        const recentBreaches = {
          maxDrawdown: false,
          dailyDrawdown: false
        };
        
        if (cachedData.lastRiskEvents && cachedData.lastRiskEvents.length > 0) {
          const recentEvents = cachedData.lastRiskEvents.filter((e: any) => {
            const eventTime = new Date(e.brokerTime);
            const dayAgo = new Date();
            dayAgo.setDate(dayAgo.getDate() - 1);
            return eventTime > dayAgo;
          });
          
          recentBreaches.maxDrawdown = recentEvents.some((e: any) => e.exceededThresholdType === 'drawdown');
          recentBreaches.dailyDrawdown = recentEvents.some((e: any) => e.exceededThresholdType === 'dailyDrawdown');
        }
        
        setObjectives({
          minTradingDays: {
            target: targetTradingDays,
            current: cachedData.tradingDays || 0,
            passed: (cachedData.tradingDays || 0) >= targetTradingDays
          },
          maxDrawdown: {
            target: targetDrawdown,
            current: cachedData.maxDrawdown || 0,
            passed: (cachedData.maxDrawdown || 0) <= targetDrawdown,
            recentBreach: recentBreaches.maxDrawdown
          },
          maxDailyDrawdown: {
            target: targetDailyDrawdown,
            current: cachedData.maxDailyDrawdown || cachedData.dailyDrawdown || 0,
            passed: (cachedData.maxDailyDrawdown || cachedData.dailyDrawdown || 0) <= targetDailyDrawdown,
            recentBreach: recentBreaches.dailyDrawdown
          },
          profitTarget: {
            target: targetProfit,
            current: profitPercent,
            passed: profitPercent >= targetProfit
          }
        });
        
        setLastUpdate(cachedData.lastUpdated.toDate());
        
        // Set basic account info
        setAccountInfo({
          accountId: accountData.accountId,
          accountType: accountData.accountType,
          accountSize: accountData.accountSize,
          platform: accountData.platform,
          status: accountData.status,
          step: accountData.step
        });
      } else {
        throw new Error('No metrics data available. The user may need to load their dashboard first to generate metrics.');
      }
      
    } catch (err: any) {
      console.error('Error fetching account data:', err);
      setError(err.message || 'Failed to fetch account data');
    } finally {
      setLoading(false);
    }
  };

  const refreshMetrics = async () => {
    setRefreshing(true);
    try {
      // Get the account info
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const accountQuery = query(accountsRef, where('accountId', '==', accountId), limit(1));
      const accountSnapshot = await getDocs(accountQuery);
      
      if (accountSnapshot.empty) {
        throw new Error('Account not found');
      }
      
      const accountData = accountSnapshot.docs[0].data();
      
      // If we don't have account info yet, set it now
      if (!accountInfo) {
        setAccountInfo({
          accountId: accountData.accountId,
          accountType: accountData.accountType,
          accountSize: accountData.accountSize,
          platform: accountData.platform,
          status: accountData.status,
          step: accountData.step
        });
        setAccountStatus(accountData.status);
        
        // Also try to get user info if we don't have it
        if (!userInfo) {
          const usersRef = collection(db, 'users');
          const userQuery = query(usersRef, where('uid', '==', accountData.userId), limit(1));
          const userSnapshot = await getDocs(userQuery);
          
          if (!userSnapshot.empty) {
            setUserInfo(userSnapshot.docs[0].data());
          }
        }
      }
      
      // Call the API to fetch fresh data
      const response = await fetch('/api/metaapi/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accountId: accountData.accountId,
          accountToken: accountData.accountToken,
          accountType: accountData.accountType,
          accountSize: accountData.accountSize,
          isAdmin: true // Add flag to bypass user auth check
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to refresh metrics');
      }

      const data = await response.json();
      
      // Update the UI
      setMetrics(data.metrics);
      setObjectives(data.objectives);
      
      // Update cached metrics in Firebase
      await updateCachedMetrics(accountId, {
        accountId: accountId,
        balance: data.metrics.balance,
        equity: data.metrics.equity,
        averageProfit: data.metrics.averageWin,
        averageLoss: data.metrics.averageLoss,
        numberOfTrades: data.metrics.trades,
        averageRRR: data.metrics.avgRRR,
        lots: data.metrics.lots,
        expectancy: data.metrics.expectancy,
        winRate: data.metrics.winRate,
        profitFactor: data.metrics.profitFactor,
        maxDrawdown: data.metrics.maxDrawdown,
        dailyDrawdown: data.metrics.relativeDrawdown,
        maxDailyDrawdown: data.objectives.maxDailyDrawdown.current,
        currentProfit: data.metrics.profit,
        tradingDays: data.objectives.minTradingDays.current
      });
      
      setLastUpdate(new Date());
      
      // Clear any errors
      setError(null);
    } catch (err: any) {
      console.error('Error refreshing metrics:', err);
      setError('Failed to refresh metrics: ' + err.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAccountData();
  }, [accountId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#0FF1CE] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-red-500/30 p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white text-center mb-2">Error Loading Account</h2>
          <p className="text-gray-400 text-center mb-6">{error}</p>
          
          <div className="space-y-3">
            {/* Show fetch metrics button if the error is about missing cached data */}
            {error.toLowerCase().includes('no metrics') && (
              <button
                onClick={async () => {
                  setError(null);
                  await refreshMetrics();
                  await fetchAccountData();
                }}
                disabled={refreshing}
                className="w-full bg-[#0FF1CE] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {refreshing ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Fetching Metrics...
                  </>
                ) : (
                  <>
                    <RefreshCw size={20} />
                    Fetch Metrics from MetaAPI
                  </>
                )}
              </button>
            )}
            
            <button
              onClick={() => router.push('/admin/accounts')}
              className="w-full bg-white/10 text-white font-semibold py-2 px-4 rounded-lg hover:bg-white/20 transition-colors"
            >
              Back to Accounts
            </button>
          </div>
        </div>
      </div>
    );
  }

  const winRate = metrics?.winRate || 0;
  const avgRRR = metrics?.avgRRR || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/admin/accounts')}
            className="p-2 rounded-lg bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30 transition-all"
          >
            <ArrowLeft size={20} className="text-white" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin: Account Metrics</h1>
            <div className="flex items-center gap-2 mt-1">
              <User size={16} className="text-gray-400" />
              <p className="text-sm text-gray-400">
                {userInfo?.email || 'Unknown User'} • {accountId.slice(0, 8)}...
              </p>
            </div>
            {lastUpdate && (
              <p className="text-xs text-gray-500 mt-1">
                Last updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={refreshMetrics}
          disabled={refreshing}
          className="bg-[#0FF1CE] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          Refresh Data
        </button>
      </div>

      {/* Account Status Notice */}
      {accountStatus === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Challenge Failed</h3>
              <p className="text-gray-300 text-sm">
                This challenge has been marked as failed. The data shown represents the final state of the account.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Account Info Card */}
      {accountInfo && (
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6 mb-8">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Server size={20} />
            Account Information
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Account Type</p>
              <p className="text-white font-medium">
                {accountInfo.accountType === 'standard' ? 'Shockwave Standard' : 'Shockwave Instant'}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Account Size</p>
              <p className="text-white font-medium">${accountInfo.accountSize?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Platform</p>
              <p className="text-white font-medium">{accountInfo.platform?.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Challenge Step</p>
              <p className="text-white font-medium">Step {accountInfo.step}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <MetricCard title="Balance" value={metrics?.balance || 0} icon={DollarSign} format="currency" />
        <MetricCard title="Equity" value={metrics?.equity || 0} icon={TrendingUp} format="currency" />
        <MetricCard title="Profit/Loss" value={metrics?.profit || 0} icon={metrics?.profit >= 0 ? TrendingUp : TrendingDown} format="currency" />
        <MetricCard title="Total Trades" value={metrics?.trades || 0} icon={Activity} />
        <MetricCard title="Average RRR" value={avgRRR} icon={Target} suffix=":1" />
        <MetricCard title="Total Lots" value={metrics?.lots || 0} icon={BarChart2} />
        <MetricCard title="Expectancy" value={metrics?.expectancy || 0} icon={Target} format="currency" />
        <MetricCard title="Win Rate" value={winRate} icon={Activity} format="percent" />
        <MetricCard title="Profit Factor" value={metrics?.profitFactor || 0} icon={TrendingUp} />
        <MetricCard title="Max Drawdown" value={metrics?.maxDrawdown || 0} icon={TrendingDown} format="percent" />
      </div>

      {/* Trading Objectives */}
      {objectives && <TradingObjectivesTable objectives={objectives} />}

      {/* Risk Events */}
      {riskEvents.length > 0 && <RiskEventsTable riskEvents={riskEvents} />}

      {/* Period Statistics */}
      {periodStats.length > 0 && <PeriodStatsChart periodStats={periodStats} />}
    </div>
  );
} 