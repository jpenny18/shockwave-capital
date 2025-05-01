'use client';
import React, { useState, useMemo } from 'react';
import Particles from '../../components/Particles';
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  Plus, 
  ExternalLink,
  TrendingUp,
  TrendingDown,
  BarChart2,
  Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Account {
  id: string;
  type: string;
  balance: number;
  status: 'active' | 'pending' | 'completed';
  metrics: {
    equity: number;
    dailyDrawdown: number;
    maxDrawdown: number;
    profitTarget: number;
    winRate: number;
    profitFactor: number;
    totalTrades: number;
    averageWin: number;
    averageLoss: number;
  };
  progress: {
    profitTarget: number;
    maxDrawdown: number;
    minTradingDays: number;
  };
}

interface FilterState {
  status: string;
  type: string;
  sortBy: 'balance' | 'equity' | 'winRate';
  sortOrder: 'asc' | 'desc';
}

const statusColors = {
  active: 'bg-green-500',
  pending: 'bg-yellow-500',
  completed: 'bg-blue-500'
};

const ProgressBar = ({ value, max, label }: { value: number; max: number; label: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-2 bg-[#2F2F2F] rounded-full overflow-hidden">
      <div 
        className="h-full bg-[#0FF1CE] rounded-full transition-all duration-500"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
  </div>
);

const AccountCard = ({ account }: { account: Account }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 overflow-hidden transition-all duration-300 hover:border-[#0FF1CE]/30">
      {/* Main Card Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{account.type}</h3>
          <div className={`px-3 py-1 rounded-full text-sm ${statusColors[account.status]} bg-opacity-20 text-white`}>
            {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
          </div>
        </div>
        
        <div className="mb-6">
          <div className="text-3xl font-bold text-[#0FF1CE]">${account.balance.toLocaleString()}</div>
          <div className="text-gray-400 text-sm">Balance</div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-lg font-semibold text-white">${account.metrics.equity.toLocaleString()}</div>
            <div className="text-gray-400 text-sm">Equity</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-white">{account.metrics.profitTarget}%</div>
            <div className="text-gray-400 text-sm">Profit Target</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-[#0FF1CE] hover:text-[#0FF1CE]/80 transition-colors"
          >
            <span className="text-sm">View Details</span>
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          
          <button className="flex items-center gap-2 text-[#0FF1CE] hover:text-[#0FF1CE]/80 transition-colors">
            <span className="text-sm">Trading Platform</span>
            <ExternalLink size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Details */}
      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-[500px] border-t border-[#2F2F2F]/50' : 'max-h-0'}
      `}>
        <div className="p-6 space-y-6">
          {/* Progress Bars */}
          <div className="space-y-3">
            <ProgressBar 
              value={account.progress.profitTarget} 
              max={100} 
              label="Profit Target Progress" 
            />
            <ProgressBar 
              value={100 - Math.abs(account.metrics.maxDrawdown)} 
              max={100} 
              label="Maximum Drawdown Limit" 
            />
            <ProgressBar 
              value={account.progress.minTradingDays} 
              max={100} 
              label="Minimum Trading Days" 
            />
          </div>

          {/* Trading Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-semibold text-white">{account.metrics.winRate}%</div>
              <div className="text-gray-400 text-sm">Win Rate</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">{account.metrics.profitFactor}</div>
              <div className="text-gray-400 text-sm">Profit Factor</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">${account.metrics.averageWin}</div>
              <div className="text-gray-400 text-sm">Average Win</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">${account.metrics.averageLoss}</div>
              <div className="text-gray-400 text-sm">Average Loss</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SummaryCard = ({ accounts }: { accounts: Account[] }) => {
  const totalEquity = accounts.reduce((sum, acc) => sum + acc.metrics.equity, 0);
  const avgWinRate = accounts.reduce((sum, acc) => sum + acc.metrics.winRate, 0) / accounts.length;
  const avgProfitFactor = accounts.reduce((sum, acc) => sum + acc.metrics.profitFactor, 0) / accounts.length;
  
  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
      <h2 className="text-lg font-bold text-white mb-4">Portfolio Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 size={16} className="text-[#0FF1CE]" />
            <div className="text-gray-400 text-sm">Total Equity</div>
          </div>
          <div className="text-2xl font-bold text-white">${totalEquity.toLocaleString()}</div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-[#0FF1CE]" />
            <div className="text-gray-400 text-sm">Average Win Rate</div>
          </div>
          <div className="text-2xl font-bold text-white">{avgWinRate.toFixed(1)}%</div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown size={16} className="text-[#0FF1CE]" />
            <div className="text-gray-400 text-sm">Average Profit Factor</div>
          </div>
          <div className="text-2xl font-bold text-white">{avgProfitFactor.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default function MyAccountsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all',
    sortBy: 'balance',
    sortOrder: 'desc'
  });

  // Sample account data (replace with real data from API)
  const accounts: Account[] = [
    {
      id: '1',
      type: 'Standard Challenge',
      balance: 100000,
      status: 'active',
      metrics: {
        equity: 102500,
        dailyDrawdown: -2.5,
        maxDrawdown: -5.8,
        profitTarget: 8.2,
        winRate: 68.5,
        profitFactor: 2.14,
        totalTrades: 145,
        averageWin: 342,
        averageLoss: 156
      },
      progress: {
        profitTarget: 65,
        maxDrawdown: 75,
        minTradingDays: 80
      }
    },
    {
      id: '2',
      type: 'Instant Funded',
      balance: 25000,
      status: 'pending',
      metrics: {
        equity: 24800,
        dailyDrawdown: -0.8,
        maxDrawdown: -1.2,
        profitTarget: 2.4,
        winRate: 62.3,
        profitFactor: 1.85,
        totalTrades: 78,
        averageWin: 285,
        averageLoss: 142
      },
      progress: {
        profitTarget: 35,
        maxDrawdown: 90,
        minTradingDays: 45
      }
    },
    {
      id: '3',
      type: 'Express Challenge',
      balance: 50000,
      status: 'completed',
      metrics: {
        equity: 53200,
        dailyDrawdown: -1.5,
        maxDrawdown: -3.8,
        profitTarget: 12.4,
        winRate: 71.2,
        profitFactor: 2.45,
        totalTrades: 92,
        averageWin: 412,
        averageLoss: 185
      },
      progress: {
        profitTarget: 100,
        maxDrawdown: 85,
        minTradingDays: 100
      }
    }
  ];

  const filteredAccounts = useMemo(() => {
    return accounts
      .filter(account => 
        (filters.status === 'all' || account.status === filters.status) &&
        (filters.type === 'all' || account.type === filters.type)
      )
      .sort((a, b) => {
        const multiplier = filters.sortOrder === 'desc' ? -1 : 1;
        const getValue = (account: Account) => {
          return filters.sortBy === 'balance' 
            ? account.balance 
            : account.metrics[filters.sortBy];
        };
        return (getValue(a) - getValue(b)) * multiplier;
      });
  }, [filters, accounts]);

  return (
    <div className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">My Accounts</h1>
        
        {/* Lock Overlay */}
        <div className="absolute inset-0 z-50 backdrop-blur-md bg-[#0D0D0D]/50 flex items-center justify-center">
          <div className="max-w-md w-full mx-4 p-8 rounded-2xl bg-[#0D0D0D]/90 border border-[#2F2F2F]/50 text-center">
            <div className="w-16 h-16 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mx-auto mb-6">
              <Lock size={32} className="text-[#0FF1CE]" />
            </div>
            <h2 className="text-xl font-bold text-white mb-3">Account Locked</h2>
            <p className="text-gray-400 mb-6">Please purchase a challenge to see your account metrics</p>
            <button 
              onClick={() => router.push('/dashboard/challenge')}
              className="w-full bg-[#0FF1CE] text-black font-bold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors"
            >
              Start Challenge
            </button>
          </div>
        </div>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            {/* Filter Button */}
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-lg text-white hover:border-[#0FF1CE]/30 transition-colors">
                <Filter size={16} />
                <span>Filter</span>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Create Account Button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#0FF1CE] text-black font-semibold rounded-lg hover:bg-[#0FF1CE]/90 transition-colors">
              <Plus size={16} />
              <span>Create New Account</span>
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mb-8">
          <SummaryCard accounts={accounts} />
        </div>

        {/* Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      <style jsx global>{`
        .background-noise {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 250 250' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.15;
        }
      `}</style>
    </div>
  );
} 