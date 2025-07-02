'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getUserMetaApiAccount, getCachedMetrics, updateCachedMetrics, Timestamp } from '../../../../lib/firebase';
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
  AlertTriangle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define interfaces locally to avoid importing from metaapi-extended
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
  exceededThresholdType: string;
  relativeDrawdown: number;
  absoluteDrawdown: number;
  brokerTime: string;
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
const TradingObjectivesTable = ({ objectives, accountStatus }: { objectives: TradingObjectives; accountStatus?: string }) => {
  const isFunded = accountStatus === 'funded';
  
  const rows = [
    { 
      label: isFunded ? 'Min Trading Days (0.5% gain required)' : 'Min Trading Days', 
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

// Trading Journal Component with Pagination
const TradingJournal = ({ trades }: { trades: TradeData[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tradesPerPage = 20;
  
  // Calculate pagination
  const totalPages = Math.ceil(trades.length / tradesPerPage);
  const startIndex = (currentPage - 1) * tradesPerPage;
  const endIndex = startIndex + tradesPerPage;
  const currentTrades = trades.slice(startIndex, endIndex);
  
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first, last, and pages around current
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };
  
  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Trading Journal</h3>
        <span className="text-sm text-gray-400">
          {trades.length} {trades.length === 1 ? 'Trade' : 'Trades'} Total
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-[#2F2F2F]">
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Symbol</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Type</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Volume</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Open Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Close Price</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Profit</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Open Time</th>
              <th className="text-left py-3 px-4 text-xs font-medium text-gray-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2F2F2F]/50">
            {trades.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-400">No trades found</td>
              </tr>
            ) : (
              currentTrades.map((trade) => (
                <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-sm text-white">{trade.symbol}</td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {trade.type?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">{trade.volume != null ? trade.volume.toFixed(2) : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">{trade.openPrice != null ? trade.openPrice.toFixed(5) : '-'}</td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {trade.closePrice != null ? trade.closePrice.toFixed(5) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={trade.profit != null && trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {trade.profit != null ? `$${trade.profit.toFixed(2)}` : '-'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-300">
                    {trade.openTime ? formatDistanceToNow(new Date(trade.openTime), { addSuffix: true }) : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      trade.state === 'opened' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {trade.state || 'unknown'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#2F2F2F]/50">
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1} to {Math.min(endIndex, trades.length)} of {trades.length} trades
          </div>
          
          <div className="flex items-center gap-1">
            {/* Previous button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-[#151515] border border-[#2F2F2F] rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-2">
              {getPageNumbers().map((page, index) => (
                page === '...' ? (
                  <span key={`ellipsis-${index}`} className="px-2 text-gray-500">...</span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === page
                        ? 'bg-[#0FF1CE] text-black'
                        : 'text-gray-400 bg-[#151515] border border-[#2F2F2F] hover:bg-[#1A1A1A] hover:text-white'
                    }`}
                  >
                    {page}
                  </button>
                )
              ))}
            </div>
            
            {/* Next button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-[#151515] border border-[#2F2F2F] rounded-lg hover:bg-[#1A1A1A] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Risk Alert Component for user dashboard
const RiskAlertBanner = ({ objectives, riskEvents }: { 
  objectives: TradingObjectives; 
  riskEvents: RiskEvent[] 
}) => {
  const hasRecentBreach = objectives.maxDrawdown.recentBreach || objectives.maxDailyDrawdown.recentBreach;
  const recentRiskEvents = riskEvents.filter(event => {
    const eventTime = new Date(event.brokerTime);
    const dayAgo = new Date();
    dayAgo.setDate(dayAgo.getDate() - 1);
    return eventTime > dayAgo;
  });

  if (!hasRecentBreach && recentRiskEvents.length === 0) {
    return null;
  }

  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="text-red-400 mt-0.5" size={20} />
        <div>
          <h3 className="text-red-400 font-semibold mb-1">Risk Alert</h3>
          {hasRecentBreach && (
            <p className="text-gray-300 text-sm mb-2">
              Recent drawdown threshold breach detected. Please review your risk management.
            </p>
          )}
          {recentRiskEvents.length > 0 && (
            <div className="text-sm text-gray-300">
              <p className="mb-1">Recent risk events:</p>
              {recentRiskEvents.slice(0, 3).map((event, index) => (
                <p key={index} className="text-xs text-red-400">
                  • {event.exceededThresholdType}: {event.relativeDrawdown.toFixed(2)}% at {new Date(event.brokerTime).toLocaleString()}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AccountDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any>(null);
  const [objectives, setObjectives] = useState<TradingObjectives | null>(null);
  const [trades, setTrades] = useState<TradeData[]>([]);
  const [chartData, setChartData] = useState<EquityChartPoint[]>([]);
  const [accountInfo, setAccountInfo] = useState<any>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accountStatus, setAccountStatus] = useState<string>('active');
  const [riskEvents, setRiskEvents] = useState<RiskEvent[]>([]);
  const [userAccount, setUserAccount] = useState<any>(null);

  // Chart configuration
  const chartOptions = {
    chart: {
      type: 'area' as const,
      height: 350,
      background: 'transparent',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const, width: 2 },
    colors: ['#0FF1CE', '#3B82F6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.2,
        opacityTo: 0,
        stops: [0, 100]
      }
    },
    xaxis: {
      type: 'datetime' as const,
      labels: { style: { colors: '#9CA3AF' } },
      axisBorder: { show: false },
      axisTicks: { show: false }
    },
    yaxis: {
      labels: {
        style: { colors: '#9CA3AF' },
        formatter: (value: number) => `$${value.toLocaleString()}`
      }
    },
    grid: {
      borderColor: '#374151',
      strokeDashArray: 5,
      xaxis: { lines: { show: false } }
    },
    legend: {
      show: true,
      position: 'top' as const,
      horizontalAlign: 'right' as const,
      labels: { colors: '#9CA3AF' }
    },
    tooltip: {
      theme: 'dark',
      x: { format: 'dd MMM yyyy' },
      y: { formatter: (value: number) => `$${value.toLocaleString()}` }
    }
  };

  const chartSeries = [
    {
      name: 'Equity',
      data: chartData.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.equity
      }))
    },
    {
      name: 'Balance',
      data: chartData.map(point => ({
        x: new Date(point.date).getTime(),
        y: point.balance
      }))
    }
  ];

  const fetchMetrics = async (showLoading = true) => {
    if (!user) return;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Get the accountId from URL params
      const accountId = params.accountId as string;
      
      // Get user's specific MetaAPI account using the accountId from URL
      const userAccount = await getUserMetaApiAccount(user.uid, accountId);
      if (!userAccount) {
        setError('Account not found or you do not have access to this account.');
        return;
      }

      // Store user account data for display
      setUserAccount(userAccount);

      // Check if account is failed and show notice
      const isFailed = userAccount.status === 'failed';
      const isFunded = userAccount.status === 'funded' || userAccount.step === 3;
      setAccountStatus(isFunded ? 'funded' : userAccount.status);

      // Check if we have recent cached data (less than 30 minutes old)
      const cachedData = await getCachedMetrics(userAccount.accountId);
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
      
      if (cachedData && cachedData.lastUpdated.toDate() > thirtyMinutesAgo && !showLoading) {
        // Use cached data
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
          avgRRR: cachedData.averageRRR
        });
        setLastUpdate(cachedData.lastUpdated.toDate());
        return;
      }

      // Fetch fresh data from MetaAPI via our API route
      const token = await user.getIdToken();
      const response = await fetch('/api/metaapi/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          accountId: userAccount.accountId,
          accountToken: userAccount.accountToken,
          accountType: userAccount.accountType,
          accountSize: userAccount.accountSize,
          step: userAccount.step
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        // Handle special case for failed accounts with no cached data
        if (errorData.accountStatus === 'failed' && response.status === 404) {
          setError('This challenge has failed. No historical data is available.');
          return;
        }
        throw new Error(errorData.error || 'Failed to fetch metrics');
      }

      const data = await response.json();

      setMetrics(data.metrics);
      setAccountInfo(data.accountInfo);
      setTrades(data.trades);
      setChartData(data.equityChart);
      setObjectives(data.objectives);
      setRiskEvents(data.riskEvents);

      // Don't update cache if account is failed (we're using cached data)
      if (!isFailed) {
        // Update cached metrics
        await updateCachedMetrics(userAccount.accountId, {
          accountId: userAccount.accountId,
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
      }

      setLastUpdate(new Date());
    } catch (err: any) {
      console.error('Error fetching metrics:', err);
      setError(err.message || 'Failed to fetch account metrics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && params.accountId) {
      fetchMetrics();
    }
  }, [user, params.accountId]);

  // Separate effect for auto-refresh
  useEffect(() => {
    if (user && accountStatus !== 'failed') {
      // Set up auto-refresh every 30 minutes (only for non-failed accounts)
      const interval = setInterval(() => {
        fetchMetrics(false);
      }, 30 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [user, accountStatus]);

  if (!user) {
    router.push('/signin');
    return null;
  }

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
          <h2 className="text-xl font-semibold text-white text-center mb-2">Error Loading Metrics</h2>
          <p className="text-gray-400 text-center mb-4">{error}</p>
          <button
            onClick={() => fetchMetrics()}
            className="w-full bg-[#0FF1CE] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors"
          >
            Try Again
          </button>
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
        <div>
          <h1 className="text-2xl font-bold text-white">Account Metrics</h1>
          {lastUpdate && (
            <p className="text-sm text-gray-400 mt-1">
              Last updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
            </p>
          )}
        </div>
      </div>

      {/* Failed Account Notice */}
      {accountStatus === 'failed' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-400 font-semibold mb-1">Challenge Failed</h3>
              <p className="text-gray-300 text-sm">
                This challenge has been marked as failed. The data shown below represents the final state of your account.
                No new updates will be fetched.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Funded Account Notice */}
      {accountStatus === 'funded' && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 mb-8">
          <div className="flex items-start gap-3">
            <CheckCircle className="text-purple-400 mt-0.5" size={20} />
            <div>
              <h3 className="text-purple-400 font-semibold mb-1">Funded Account Active</h3>
              <p className="text-gray-300 text-sm">
                Congratulations! Your account is now funded. Remember to maintain proper risk management:
              </p>
              <ul className="text-gray-300 text-sm mt-2 list-disc list-inside">
                <li>Maximum drawdown: 15%</li>
                <li>Daily drawdown: 8%</li>
                <li>Risk limit: Maximum 2% risk on open positions</li>
                <li>Payout eligibility: Minimum 5 trading days with 0.5% gain from starting balance</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Dashboard Layout */}
      <div className="space-y-8">
        {/* Row 1: Trading Objectives (60%) + Account Information (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Trading Objectives - 60% width */}
          <div className="lg:col-span-3">
            {objectives && <TradingObjectivesTable objectives={objectives} accountStatus={accountStatus} />}
          </div>

          {/* Account Information - 40% width */}
          <div className="lg:col-span-2">
            <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      accountInfo?.connectionStatus === 'CONNECTED' ? 'bg-green-400' : 'bg-red-400'
                    }`} />
                    <p className="text-sm text-white">
                      {accountInfo?.state || 'In Progress'}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Start Date</p>
                  <p className="text-sm text-white">
                    {userAccount?.startDate ? 
                      (userAccount.startDate.toDate ? userAccount.startDate.toDate().toLocaleDateString() : new Date(userAccount.startDate).toLocaleDateString()) 
                      : '-'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Account Size</p>
                  <p className="text-sm text-white">
                    ${userAccount?.accountSize?.toLocaleString() || '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Challenge Step</p>
                  <p className="text-sm text-white">
                    {userAccount?.step === 3 ? 'Step 3 (Funded)' : userAccount?.step === 2 ? 'Step 2' : userAccount?.step === 1 ? 'Step 1' : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Account Type</p>
                  <p className="text-white font-medium">
                    {userAccount?.accountType === '1-step' ? 'Shockwave 1-Step' : 
                     userAccount?.accountType === 'instant' ? 'Shockwave Instant' : 'Shockwave Standard'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Platform</p>
                  <p className="text-sm text-white uppercase">{userAccount?.platform || accountInfo?.platform || 'MT5'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Server</p>
                  <p className="text-sm text-white">{accountInfo?.server || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Key Metrics Grid - 100% width */}
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            <MetricCard title="Balance" value={metrics?.balance || 0} icon={DollarSign} format="currency" />
            <MetricCard title="Equity" value={metrics?.equity || 0} icon={TrendingUp} format="currency" />
            <MetricCard title="Average Profit" value={metrics?.averageWin || 0} icon={TrendingUp} format="currency" />
            <MetricCard title="Average Loss" value={Math.abs(metrics?.averageLoss || 0)} icon={TrendingDown} format="currency" />
            <MetricCard title="Number of Trades" value={metrics?.trades || 0} icon={BarChart2} />
            <MetricCard title="Average RRR" value={avgRRR} icon={Target} suffix=":1" />
            <MetricCard title="Lots" value={metrics?.lots || 0} icon={Activity} />
            <MetricCard title="Expectancy" value={metrics?.expectancy || 0} icon={Target} format="currency" />
            <MetricCard title="Win Rate" value={winRate} icon={CheckCircle} format="percent" />
            <MetricCard title="Profit Factor" value={metrics?.profitFactor || 0} icon={TrendingUp} />
          </div>
        </div>

        {/* Row 3: Equity Growth Chart - 100% width */}
        <div>
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Equity Growth</h3>
            {chartData.length > 0 ? (
              <ApexChart
                options={chartOptions}
                series={chartSeries}
                type="area"
                height={350}
              />
            ) : (
              <div className="h-[350px] flex items-center justify-center border border-dashed border-[#2F2F2F] rounded-lg">
                <p className="text-gray-500">No chart data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Risk Alert */}
        {objectives && <RiskAlertBanner objectives={objectives} riskEvents={riskEvents} />}

        {/* Row 4: Trading Journal - 100% width */}
        <div>
          <TradingJournal trades={trades} />
        </div>
      </div>
    </div>
  );
} 