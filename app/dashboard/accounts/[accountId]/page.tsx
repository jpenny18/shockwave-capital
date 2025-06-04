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
  Activity
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Dynamically import ApexCharts to avoid SSR issues
const ApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Define interfaces locally to avoid importing from metaapi-extended
interface TradingObjectives {
  minTradingDays: { target: number; current: number; passed: boolean };
  maxDrawdown: { target: number; current: number; passed: boolean };
  maxDailyDrawdown: { target: number; current: number; passed: boolean };
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

// Trading Journal Component
const TradingJournal = ({ trades }: { trades: TradeData[] }) => {
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
              trades.map((trade) => (
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

      // Get user's MetaAPI account mapping
      const userAccount = await getUserMetaApiAccount(user.uid);
      if (!userAccount) {
        setError('No active trading account found.');
        return;
      }

      // Check if account is failed and show notice
      const isFailed = userAccount.status === 'failed';
      setAccountStatus(userAccount.status);

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
          accountSize: userAccount.accountSize
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
    if (user) {
      fetchMetrics();
      
      // Set up auto-refresh every 30 minutes (only for non-failed accounts)
      // We'll check the status after the first fetch
      const interval = setInterval(() => {
        if (accountStatus !== 'failed') {
          fetchMetrics(false);
        }
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

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Trading Objectives */}
        <div className="lg:col-span-1">
          {objectives && <TradingObjectivesTable objectives={objectives} />}
        </div>

        {/* Account Information */}
        <div className="lg:col-span-2">
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
                  {accountInfo?.createdAt ? new Date(accountInfo.createdAt).toLocaleDateString() : '-'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Account Size</p>
                <p className="text-sm text-white">${accountInfo?.balance?.toLocaleString() || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Account Type</p>
                <p className="text-sm text-white">Shockwave Standard</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Platform</p>
                <p className="text-sm text-white uppercase">{accountInfo?.platform || 'MT5'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-1">Server</p>
                <p className="text-sm text-white">{accountInfo?.server || '-'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equity Growth Chart */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6 mb-8">
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

      {/* Trading Journal */}
      <TradingJournal trades={trades} />
    </div>
  );
} 