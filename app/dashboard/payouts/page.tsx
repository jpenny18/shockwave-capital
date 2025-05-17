'use client';
import React, { useState } from 'react';
import Particles from '../../components/Particles';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Plus, 
  Calendar,
  Wallet,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Building,
  Bitcoin,
  Lock
} from 'lucide-react';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  method: 'Bank Transfer' | 'Credit Card' | 'Crypto';
  reference: string;
}

const statusColors = {
  completed: 'bg-green-500',
  pending: 'bg-yellow-500',
  failed: 'bg-red-500'
};

const statusIcons = {
  completed: CheckCircle,
  pending: Clock,
  failed: XCircle
};

const methodIcons = {
  'Bank Transfer': Building,
  'Credit Card': CreditCard,
  'Crypto': Bitcoin
};

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const StatusIcon = statusIcons[transaction.status];
  const MethodIcon = methodIcons[transaction.method];
  
  return (
    <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 overflow-hidden">
      <div className="p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon size={20} className={`
              ${transaction.status === 'completed' ? 'text-green-500' : ''}
              ${transaction.status === 'pending' ? 'text-yellow-500' : ''}
              ${transaction.status === 'failed' ? 'text-red-500' : ''}
            `} />
            <div>
              <div className="text-white font-medium">Withdrawal</div>
              <div className="text-gray-400 text-sm">{transaction.date}</div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-white font-medium">${transaction.amount.toLocaleString()}</div>
              <div className="text-gray-400 text-sm flex items-center justify-end gap-1">
                <MethodIcon size={14} /> {transaction.method}
              </div>
            </div>
            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
          </div>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 pt-0 border-t border-[#2F2F2F]/50 mt-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-400">Status</div>
              <div className={`flex items-center gap-1 capitalize
                ${transaction.status === 'completed' ? 'text-green-500' : ''}
                ${transaction.status === 'pending' ? 'text-yellow-500' : ''}
                ${transaction.status === 'failed' ? 'text-red-500' : ''}
              `}>
                <StatusIcon size={14} /> {transaction.status}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Payment Method</div>
              <div className="text-white flex items-center gap-1">
                <MethodIcon size={14} /> {transaction.method}
              </div>
            </div>
            <div>
              <div className="text-gray-400">Transaction ID</div>
              <div className="text-white">{transaction.id}</div>
            </div>
            <div>
              <div className="text-gray-400">Reference</div>
              <div className="text-white">{transaction.reference}</div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button className="flex items-center gap-2 text-[#0FF1CE] hover:text-[#0FF1CE]/80 transition-colors">
              <Download size={14} />
              <span className="text-sm">Download Receipt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentMethodCard = ({ 
  icon: Icon, 
  title, 
  description,
  isSelected,
  onSelect
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  isSelected: boolean;
  onSelect: () => void;
}) => (
  <div 
    onClick={onSelect}
    className={`p-4 border rounded-lg cursor-pointer transition-all ${
      isSelected 
        ? 'border-[#0FF1CE] bg-[#0FF1CE]/5' 
        : 'border-[#2F2F2F]/50 hover:border-[#0FF1CE]/30'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2 rounded-full ${isSelected ? 'bg-[#0FF1CE]/20' : 'bg-[#2F2F2F]/30'}`}>
        <Icon size={18} className={isSelected ? 'text-[#0FF1CE]' : 'text-gray-400'} />
      </div>
      <div>
        <div className="text-white font-medium">{title}</div>
        <div className="text-gray-400 text-sm">{description}</div>
      </div>
    </div>
  </div>
);

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState<'history' | 'new'>('history');
  const [selectedMethod, setSelectedMethod] = useState<string>('bank');

  // Sample transaction data (replace with real data from API)
  const transactions: Transaction[] = [
    {
      id: 'TRX-98765432',
      date: 'May 15, 2023',
      amount: 2450.75,
      status: 'completed',
      method: 'Bank Transfer',
      reference: 'Profit Withdrawal'
    },
    {
      id: 'TRX-87654321',
      date: 'Apr 28, 2023',
      amount: 1200.00,
      status: 'completed',
      method: 'Credit Card',
      reference: 'Monthly Payout'
    },
    {
      id: 'TRX-76543210',
      date: 'Apr 12, 2023',
      amount: 3500.50,
      status: 'pending',
      method: 'Bank Transfer',
      reference: 'Profit Withdrawal'
    },
    {
      id: 'TRX-65432109',
      date: 'Mar 29, 2023',
      amount: 500.00,
      status: 'failed',
      method: 'Crypto',
      reference: 'Bitcoin Withdrawal'
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-2xl font-bold text-white mb-6">Payouts</h1>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-[#1A1A1A]/50 backdrop-blur-sm rounded-lg p-1 max-w-xs">
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-[#0FF1CE] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            History
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'new'
                ? 'bg-[#0FF1CE] text-black'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            New Payout
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'history' ? (
          <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Transaction History</h2>
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white hover:border-[#0FF1CE]/30 transition-colors">
                <Calendar size={14} />
                <span>Filter by Date</span>
                <ChevronDown size={14} />
              </button>
            </div>
            <div className="text-center text-gray-400 py-8">
              No withdrawal history available
            </div>
          </div>
        ) : (
          <div className="relative">
            {/* Blurred payout form */}
            <div className="blur-sm pointer-events-none">
              <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50">
                <h2 className="text-lg font-bold text-white mb-6">Request Payout</h2>
                
                <div className="space-y-6">
                  {/* Account Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Select Account</label>
                    <div className="relative">
                      <select className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white appearance-none">
                        <option>Standard Challenge - $100,000</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <ChevronDown size={18} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Amount</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <span className="text-gray-400">$</span>
                      </div>
                      <input
                        type="number"
                        placeholder="0.00"
                        className="w-full bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg px-4 py-2.5 pl-8 text-white"
                      />
                    </div>
                  </div>
                  
                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Payment Method</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <PaymentMethodCard
                        icon={Building}
                        title="Bank Transfer"
                        description="3-5 business days"
                        isSelected={selectedMethod === 'bank'}
                        onSelect={() => setSelectedMethod('bank')}
                      />
                      <PaymentMethodCard
                        icon={CreditCard}
                        title="Credit Card"
                        description="Instant processing"
                        isSelected={selectedMethod === 'card'}
                        onSelect={() => setSelectedMethod('card')}
                      />
                      <PaymentMethodCard
                        icon={Bitcoin}
                        title="Cryptocurrency"
                        description="Bitcoin, Ethereum, USDT"
                        isSelected={selectedMethod === 'crypto'}
                        onSelect={() => setSelectedMethod('crypto')}
                      />
                    </div>
                  </div>
                  
                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[#2F2F2F]">
                    <button className="w-full md:w-auto px-6 py-3 bg-[#0FF1CE] text-black font-semibold rounded-lg flex items-center justify-center gap-2">
                      <Wallet size={18} />
                      <span>Request Payout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Locked overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-[#0D0D0D]/95 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50 max-w-md w-full mx-4 text-center transform hover:scale-[1.02] transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
                  <Lock className="text-[#0FF1CE]" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Withdrawals Locked</h2>
                <p className="text-gray-400">
                  You will be able to request a withdrawal after your first withdrawal date. Complete your challenge and maintain profitable trading to unlock withdrawals.
                </p>
              </div>
            </div>
          </div>
        )}
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