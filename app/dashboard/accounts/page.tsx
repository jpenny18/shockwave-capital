'use client';
import React, { useState, useMemo, useEffect } from 'react';
import Particles from '../../components/Particles';
import { ChevronDown, ChevronUp, Filter, Plus, ExternalLink, TrendingUp, TrendingDown, BarChart2, Lock } from 'lucide-react';
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

      <div className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${isExpanded ? 'max-h-[500px] border-t border-[#2F2F2F]/50' : 'max-h-0'}
      `}>
        <div className="p-6 space-y-6">
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

  const [accounts, setAccounts] = useState<Account[]>([]);

  // Fetch accounts from the API
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const token = localStorage.getItem('token'); // Adjust token storage based on your auth
        const response = await fetch('/api/accounts', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAccounts(data.accounts);
        } else {
          console.error('Failed to fetch accounts');
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

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
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.06] z-0">
        <Particles />
      </div>
      <div className="relative z-10">
        <SummaryCard accounts={filteredAccounts} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredAccounts.map(account => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>
    </div>
  );
}
