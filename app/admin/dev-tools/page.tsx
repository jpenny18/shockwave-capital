'use client';

/**
 * DEV TOOLS PAGE — DEVELOPMENT ENVIRONMENT ONLY
 * Accessible at /admin/dev-tools in development mode.
 * Creates mock payout data for marketing/screenshot purposes.
 */

import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getAllUsers, getWithdrawalRequest, UserData } from '../../../lib/firebase';
import {
  createMockPayout,
  deleteMockPayout,
  MOCK_SCENARIOS,
  MockScenarioConfig,
} from '../../../lib/devTools';
import { toast } from 'react-hot-toast';
import {
  FlaskConical,
  Search,
  Trash2,
  CheckCircle,
  Clock,
  Eye,
  Zap,
  RotateCcw,
  AlertTriangle,
  DollarSign,
  Settings2,
  User,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  X,
  Smartphone,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

if (process.env.NODE_ENV === 'production') {
  throw new Error('Dev Tools page cannot be loaded in production.');
}

const STATUS_STYLES: Record<string, string> = {
  completed: 'text-green-400 bg-green-400/10 border-green-400/30',
  approved: 'text-blue-400 bg-blue-400/10 border-blue-400/30',
  pending: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30',
};

function ScenarioCard({
  id,
  scenario,
  onApply,
  applying,
}: {
  id: string;
  scenario: MockScenarioConfig;
  onApply: (id: string) => void;
  applying: boolean;
}) {
  const payoutAmount = (scenario.amountOwed * scenario.profitSplit) / 100;

  return (
    <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-white font-semibold text-sm">{scenario.label}</h3>
          <p className="text-gray-500 text-xs mt-0.5">{scenario.description}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-1 rounded-full border whitespace-nowrap"
          style={{
            color: scenario.badgeColor ?? '#0FF1CE',
            backgroundColor: `${scenario.badgeColor ?? '#0FF1CE'}18`,
            borderColor: `${scenario.badgeColor ?? '#0FF1CE'}40`,
          }}
        >
          {scenario.badge ?? `$${payoutAmount.toLocaleString()}`}
        </span>
      </div>

      <div className="flex gap-3 text-xs text-gray-400">
        <span>Profit: ${scenario.amountOwed.toLocaleString()}</span>
        <span>·</span>
        <span>Split: {scenario.profitSplit}%</span>
        <span>·</span>
        <span
          className={`px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[scenario.status] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30'}`}
        >
          {scenario.status}
        </span>
      </div>

      <button
        onClick={() => onApply(id)}
        disabled={applying}
        className="w-full mt-1 bg-[#0FF1CE] text-black font-semibold py-2 rounded-lg text-sm hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Zap size={14} />
        {applying ? 'Applying...' : 'Apply Scenario'}
      </button>
    </div>
  );
}

// ─── Trust Wallet Mock ───────────────────────────────────────────────────────

const TW_TOKENS = ['USDT', 'USDC', 'BTC', 'ETH', 'SOL', 'TRX', 'BNB'] as const;
type TWToken = (typeof TW_TOKENS)[number];

const TW_NETWORKS: Record<TWToken, string> = {
  USDT: 'TRX',
  USDC: 'SOL',
  BTC: 'BTC',
  ETH: 'ETH',
  SOL: 'SOL',
  TRX: 'TRX',
  BNB: 'BNB',
};

interface TWConfig {
  token: TWToken;
  amount: string;
  usdValue: string;
  date: string;
  time: string;
  senderAddress: string;
  status: 'Completed' | 'Pending' | 'Failed';
  networkFee: string;
  direction: 'Receive' | 'Send';
}

function truncateAddress(addr: string): string {
  if (addr.length <= 14) return addr;
  return `${addr.slice(0, 7)}...${addr.slice(-5)}`;
}

function TrustWalletScreen({ config, compact = false }: { config: TWConfig; compact?: boolean }) {
  const network = TW_NETWORKS[config.token];
  const isCompleted = config.status === 'Completed';
  const isFailed = config.status === 'Failed';
  const isReceive = config.direction === 'Receive';

  const statusColor = isCompleted ? '#ffffff' : isFailed ? '#FF3B30' : '#FF9F0A';
  const amountColor = isCompleted && isReceive ? '#4CD964' : isFailed ? '#FF3B30' : '#FF9F0A';
  const amountPrefix = isReceive ? '+' : '-';

  return (
    <div
      style={{
        background: '#000000',
        width: compact ? '100%' : '375px',
        minHeight: compact ? 'auto' : '680px',
        borderRadius: compact ? '0' : '44px',
        overflow: 'hidden',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", sans-serif',
        userSelect: 'none',
      }}
    >
      {/* iOS Status Bar */}
      {!compact && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 28px 4px',
            color: '#ffffff',
          }}
        >
          <span style={{ fontSize: '15px', fontWeight: 600 }}>5:20</span>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <svg width="17" height="12" viewBox="0 0 17 12" fill="white">
              <rect x="0" y="3" width="3" height="9" rx="1" opacity="0.4"/>
              <rect x="4.5" y="2" width="3" height="10" rx="1" opacity="0.6"/>
              <rect x="9" y="0" width="3" height="12" rx="1" opacity="0.8"/>
              <rect x="13.5" y="0" width="3" height="12" rx="1"/>
            </svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
              <path d="M8 2.4C10.8 2.4 13.3 3.6 15 5.5L16 4.4C14 2.2 11.2 0.8 8 0.8C4.8 0.8 2 2.2 0 4.4L1 5.5C2.7 3.6 5.2 2.4 8 2.4Z" opacity="0.4"/>
              <path d="M8 5.2C9.9 5.2 11.6 6 12.8 7.3L13.8 6.2C12.3 4.7 10.3 3.6 8 3.6C5.7 3.6 3.7 4.6 2.2 6.2L3.2 7.3C4.4 6 6.1 5.2 8 5.2Z" opacity="0.7"/>
              <path d="M8 8C9.1 8 10.1 8.4 10.8 9.1L11.9 8C10.8 6.8 9.5 6 8 6C6.5 6 5.2 6.8 4.1 8L5.2 9.1C5.9 8.4 6.9 8 8 8Z"/>
              <circle cx="8" cy="11.2" r="0.8"/>
            </svg>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <div style={{ width: '25px', height: '12px', border: '1.5px solid rgba(255,255,255,0.35)', borderRadius: '3px', padding: '2px', display: 'flex', alignItems: 'center' }}>
                <div style={{ background: '#fff', height: '100%', width: '75%', borderRadius: '1px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: compact ? '16px 20px 12px' : '12px 20px',
          color: '#ffffff',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <svg width="10" height="17" viewBox="0 0 10 17" fill="none">
            <path d="M9 1L1.5 8.5L9 16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <span style={{ fontSize: '17px', fontWeight: 600, color: '#ffffff' }}>
          {config.direction} {config.token}
        </span>
        <div
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <path d="M9 1V15M9 1L5 5M9 1L13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M1 17V19C1 20.1 1.9 21 3 21H15C16.1 21 17 20.1 17 19V17" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      {/* Amount */}
      <div style={{ textAlign: 'center', padding: '20px 20px 28px' }}>
        <div style={{ fontSize: compact ? '36px' : '40px', fontWeight: 700, color: amountColor, letterSpacing: '-0.5px' }}>
          {amountPrefix}{config.amount} {config.token}
        </div>
        <div style={{ fontSize: '16px', color: 'rgba(255,255,255,0.45)', marginTop: '4px' }}>
          ${config.usdValue}
        </div>
      </div>

      {/* Details Card */}
      <div style={{ padding: '0 16px', marginBottom: '12px' }}>
        <div style={{ background: '#1C1C1E', borderRadius: '16px', overflow: 'hidden' }}>
          {/* Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>Date</span>
            <span style={{ fontSize: '15px', color: '#ffffff' }}>{config.date} at {config.time}</span>
          </div>
          {/* Status */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>Status</span>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3A3A3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>i</span>
              </div>
            </div>
            <span style={{ fontSize: '15px', color: statusColor, fontWeight: 400 }}>{config.status}</span>
          </div>
          {/* Sender */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
            <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>
              {isReceive ? 'Sender' : 'Recipient'}
            </span>
            <span style={{ fontSize: '15px', color: '#ffffff' }}>
              {truncateAddress(config.senderAddress)}
            </span>
          </div>
        </div>
      </div>

      {/* Network Fee Card */}
      <div style={{ padding: '0 16px', marginBottom: '24px' }}>
        <div style={{ background: '#1C1C1E', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)' }}>Network fee</span>
              <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: '#3A3A3C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontWeight: 700 }}>i</span>
              </div>
            </div>
            <span style={{ fontSize: '15px', color: '#ffffff' }}>
              {config.networkFee}
            </span>
          </div>
        </div>
      </div>

      {/* Block Explorer Link */}
      <div style={{ textAlign: 'center', padding: '4px 16px 32px' }}>
        <div
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            border: '0.5px solid rgba(255,255,255,0.12)',
            borderRadius: '10px',
            color: '#4CD964',
            fontSize: '15px',
            fontWeight: 400,
            cursor: 'pointer',
            background: 'transparent',
          }}
        >
          View on block explorer
        </div>
      </div>
    </div>
  );
}

// ─── Default TW config helper ─────────────────────────────────────────────────
function getDefaultTWConfig(): TWConfig {
  const now = new Date();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const date = `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 || 12;
  const time = `${displayHour}:${minutes} ${ampm}`;
  return {
    token: 'USDT',
    amount: '10',
    usdValue: '9.99',
    date,
    time,
    senderAddress: 'TQ8y7omYKqbGPdNzxlvbwxjk97Q',
    status: 'Completed',
    networkFee: '0 TRX ($0.00)',
    direction: 'Receive',
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DevToolsPage() {
  const [user] = useAuthState(auth);
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [currentMock, setCurrentMock] = useState<any>(null);
  const [loadingMock, setLoadingMock] = useState(false);
  const [applying, setApplying] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  // Trust Wallet mock state
  const [twConfig, setTWConfig] = useState<TWConfig>(getDefaultTWConfig);
  const [twFullscreen, setTWFullscreen] = useState(false);

  const updateTW = (patch: Partial<TWConfig>) =>
    setTWConfig((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTWFullscreen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Custom form state
  const [customAmount, setCustomAmount] = useState('10000');
  const [customSplit, setCustomSplit] = useState('80');
  const [customStatus, setCustomStatus] = useState<'pending' | 'approved' | 'completed'>('completed');
  const [customWallet, setCustomWallet] = useState('Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Tc1JoE5J');
  const [customTxHash, setCustomTxHash] = useState('5GvF9VmRCPQKstpJvDdJrQ8m4ZLqpZNKkqXKk7bFGGPWwi8yRaqNmDsGxqJvZ8kHYmEbTpK');
  const [customPaymentMethod, setCustomPaymentMethod] = useState<'usdc_solana' | 'usdt_trc20'>('usdc_solana');

  useEffect(() => {
    getAllUsers()
      .then(setAllUsers)
      .catch(() => toast.error('Failed to load users'));
  }, []);

  const filteredUsers = searchTerm.trim()
    ? allUsers.filter(
        (u) =>
          u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleSelectUser = async (u: UserData) => {
    setSelectedUser(u);
    setSearchTerm(u.email ?? '');
    setShowDropdown(false);
    setLoadingMock(true);
    try {
      const existing = await getWithdrawalRequest(u.uid);
      setCurrentMock(existing);
    } catch {
      setCurrentMock(null);
    } finally {
      setLoadingMock(false);
    }
  };

  const handleApplyScenario = async (scenarioKey: string) => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }
    setApplying(true);
    try {
      await createMockPayout(selectedUser.uid, selectedUser.email ?? '', { scenarioKey });
      const updated = await getWithdrawalRequest(selectedUser.uid);
      setCurrentMock(updated);
      toast.success(`Mock payout applied: ${MOCK_SCENARIOS[scenarioKey].label}`);
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to apply scenario');
    } finally {
      setApplying(false);
    }
  };

  const handleApplyCustom = async () => {
    if (!selectedUser) {
      toast.error('Please select a user first');
      return;
    }
    const amt = parseFloat(customAmount);
    const spl = parseFloat(customSplit);
    if (!amt || amt <= 0) return toast.error('Invalid amount');
    if (!spl || spl <= 0 || spl > 100) return toast.error('Invalid split %');

    setApplying(true);
    try {
      await createMockPayout(selectedUser.uid, selectedUser.email ?? '', {
        amountOwed: amt,
        profitSplit: spl,
        status: customStatus,
        paymentMethod: customPaymentMethod,
        walletAddress: customWallet || undefined,
        transactionHash: customStatus === 'completed' ? customTxHash || undefined : undefined,
        submitted: customStatus !== 'pending' && !!customWallet,
      });
      const updated = await getWithdrawalRequest(selectedUser.uid);
      setCurrentMock(updated);
      toast.success('Custom mock payout applied');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to apply custom payout');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    if (!confirm(`Delete mock payout for ${selectedUser.email}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteMockPayout(selectedUser.uid);
      setCurrentMock(null);
      toast.success('Mock payout deleted');
    } catch (err: any) {
      toast.error(err?.message ?? 'Failed to delete mock payout');
    } finally {
      setDeleting(false);
    }
  };

  const customPayout =
    parseFloat(customAmount || '0') && parseFloat(customSplit || '0')
      ? ((parseFloat(customAmount) * parseFloat(customSplit)) / 100).toFixed(2)
      : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-5 md:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-2 bg-orange-500/15 border border-orange-500/40 px-3 py-1.5 rounded-full">
            <FlaskConical size={14} className="text-orange-400" />
            <span className="text-orange-400 text-xs font-bold uppercase tracking-wider">Dev Only</span>
          </div>
        </div>
        <h1 className="text-xl md:text-3xl font-bold text-white">Mock Payout Generator</h1>
        <p className="text-gray-400 text-sm md:text-base mt-1">
          Create mock withdrawal records for marketing screenshots.
        </p>

        <div className="mt-3 md:mt-4 bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 md:p-4 flex items-start gap-3">
          <AlertTriangle size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
          <p className="text-orange-300 text-xs md:text-sm leading-relaxed">
            This page is only accessible in <strong>development mode</strong>. Mock payouts write to the real{' '}
            <code className="bg-orange-500/20 px-1 rounded font-mono">withdrawalRequests</code> collection and will appear
            in the admin withdrawals panel. Use the Delete button to clean up after capturing screenshots.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 md:gap-8">
        {/* Left: User Selection + Status */}
        <div className="space-y-6">
          {/* User Selector */}
          <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4 flex items-center gap-2">
              <User size={18} className="text-[#0FF1CE]" />
              Target User
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search by email or name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                  if (selectedUser && e.target.value !== selectedUser.email) {
                    setSelectedUser(null);
                    setCurrentMock(null);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full bg-[#151515] text-white pl-9 pr-4 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
              />

              {showDropdown && filteredUsers.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-[#151515] border border-[#2F2F2F] rounded-lg shadow-xl max-h-52 overflow-y-auto">
                  {filteredUsers.slice(0, 10).map((u) => (
                    <button
                      key={u.uid}
                      type="button"
                      onClick={() => handleSelectUser(u)}
                      className="w-full text-left px-4 py-3 hover:bg-[#2F2F2F]/50 transition-colors border-b border-[#2F2F2F]/30 last:border-0"
                    >
                      <p className="text-white text-sm font-medium">{u.email}</p>
                      {(u.displayName || u.firstName || u.lastName) && (
                        <p className="text-gray-400 text-xs">
                          {u.displayName || `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim()}
                        </p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedUser && (
              <div className="mt-4 bg-[#151515] rounded-lg p-3 border border-[#0FF1CE]/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#0FF1CE] text-xs font-medium mb-0.5">Selected</p>
                    <p className="text-white text-sm font-medium">{selectedUser.email}</p>
                    <p className="text-gray-500 text-xs font-mono mt-0.5">{selectedUser.uid}</p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null);
                      setSearchTerm('');
                      setCurrentMock(null);
                    }}
                    className="text-gray-400 hover:text-red-400 p-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Current Mock Status */}
          <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Settings2 size={18} className="text-[#0FF1CE]" />
              Current Payout Status
            </h2>

            {!selectedUser ? (
              <p className="text-gray-500 text-sm">Select a user to see their payout status.</p>
            ) : loadingMock ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0FF1CE]" />
                Loading...
              </div>
            ) : currentMock ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Status</span>
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full border capitalize ${STATUS_STYLES[currentMock.status] ?? 'text-gray-400 bg-gray-400/10 border-gray-400/30'}`}
                  >
                    {currentMock.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Payout Amount</span>
                  <span className="text-[#0FF1CE] font-bold">${currentMock.payoutAmount?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Profit Total</span>
                  <span className="text-white text-sm">${currentMock.amountOwed?.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 text-sm">Dev Mock</span>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full border ${currentMock._isMockDev ? 'text-orange-400 bg-orange-400/10 border-orange-400/30' : 'text-gray-500 bg-gray-500/10 border-gray-500/30'}`}
                  >
                    {currentMock._isMockDev ? 'Yes' : 'No — real data'}
                  </span>
                </div>

                <div className="flex gap-2 pt-2">
                  <a
                    href="/dashboard/payouts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 text-[#0FF1CE] border border-[#0FF1CE]/30 rounded-lg py-2 text-xs font-medium hover:bg-[#0FF1CE]/10 transition-colors"
                  >
                    <Eye size={13} />
                    Preview
                    <ExternalLink size={11} />
                  </a>
                  {currentMock._isMockDev && (
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="flex-1 flex items-center justify-center gap-1.5 text-red-400 border border-red-400/30 rounded-lg py-2 text-xs font-medium hover:bg-red-400/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 size={13} />
                      {deleting ? 'Deleting...' : 'Delete Mock'}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Clock size={28} className="text-gray-600 mx-auto mb-2" />
                <p className="text-gray-500 text-sm">No payout exists for this user.</p>
                <p className="text-gray-600 text-xs mt-1">Apply a scenario below to create one.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Scenarios + Custom */}
        <div className="xl:col-span-2 space-y-6">
          {/* Quick Scenarios */}
          <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-white mb-1 flex items-center gap-2">
              <Zap size={18} className="text-[#0FF1CE]" />
              Quick Scenarios
            </h2>
            <p className="text-gray-500 text-sm mb-4 md:mb-5">
              Pre-built payout states. Select a user above then click to apply.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {Object.entries(MOCK_SCENARIOS).map(([id, scenario]) => (
                <ScenarioCard
                  key={id}
                  id={id}
                  scenario={scenario}
                  onApply={handleApplyScenario}
                  applying={applying}
                />
              ))}
            </div>
          </div>

          {/* Custom Builder */}
          <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl overflow-hidden">
            <button
              onClick={() => setShowCustom(!showCustom)}
              className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings2 size={18} className="text-[#0FF1CE]" />
                Custom Builder
              </h2>
              {showCustom ? (
                <ChevronUp size={18} className="text-gray-400" />
              ) : (
                <ChevronDown size={18} className="text-gray-400" />
              )}
            </button>

            {showCustom && (
              <div className="px-6 pb-6 border-t border-[#2F2F2F]/50">
                <p className="text-gray-500 text-sm mt-4 mb-5">
                  Build a custom mock payout with exact values for your screenshot.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Total Profit Made ($)
                    </label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="10000"
                      className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Profit Split (%)
                    </label>
                    <input
                      type="number"
                      value={customSplit}
                      onChange={(e) => setCustomSplit(e.target.value)}
                      placeholder="80"
                      min="1"
                      max="100"
                      className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                    <select
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value as any)}
                      className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Payment Method</label>
                    <select
                      value={customPaymentMethod}
                      onChange={(e) => setCustomPaymentMethod(e.target.value as any)}
                      className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                    >
                      <option value="usdc_solana">USDC (Solana)</option>
                      <option value="usdt_trc20">USDT (TRC20)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">
                      Wallet Address
                    </label>
                    <input
                      type="text"
                      value={customWallet}
                      onChange={(e) => setCustomWallet(e.target.value)}
                      placeholder="Solana wallet address..."
                      className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm font-mono"
                    />
                  </div>

                  {customStatus === 'completed' && (
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-gray-400 mb-1.5">
                        Transaction Hash
                      </label>
                      <input
                        type="text"
                        value={customTxHash}
                        onChange={(e) => setCustomTxHash(e.target.value)}
                        placeholder="Blockchain transaction hash..."
                        className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm font-mono"
                      />
                    </div>
                  )}
                </div>

                {customPayout && (
                  <div className="mt-4 bg-[#151515] rounded-lg p-3 border border-[#0FF1CE]/20 flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Payout Amount</span>
                    <span className="text-[#0FF1CE] text-xl font-bold">${parseFloat(customPayout).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <button
                  onClick={handleApplyCustom}
                  disabled={applying || !selectedUser}
                  className="w-full mt-4 bg-[#0FF1CE] text-black font-semibold py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <RotateCcw size={15} />
                  {applying ? 'Applying...' : 'Apply Custom Payout'}
                </button>

                {!selectedUser && (
                  <p className="text-center text-gray-500 text-xs mt-2">Select a user first</p>
                )}
              </div>
            )}
          </div>

          {/* Usage Guide */}
          <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <CheckCircle size={18} className="text-[#0FF1CE]" />
              How to Use
            </h2>
            <ol className="space-y-3 text-sm text-gray-400">
              <li className="flex gap-3">
                <span className="text-[#0FF1CE] font-bold flex-shrink-0">1.</span>
                <span>Search for a user account (use your own account for marketing screenshots).</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0FF1CE] font-bold flex-shrink-0">2.</span>
                <span>
                  Apply a <strong className="text-white">Quick Scenario</strong> for common presets, or use the{' '}
                  <strong className="text-white">Custom Builder</strong> for exact values.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0FF1CE] font-bold flex-shrink-0">3.</span>
                <span>
                  Click <strong className="text-white">Preview</strong> to open the user payout dashboard in a new tab
                  and take your screenshot.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#0FF1CE] font-bold flex-shrink-0">4.</span>
                <span>
                  Click <strong className="text-white">Delete Mock</strong> to remove the test data after you&apos;re done.
                </span>
              </li>
            </ol>

            <div className="mt-5 bg-[#151515] rounded-lg p-4 border border-[#2F2F2F]/50">
              <h3 className="text-white text-sm font-medium mb-2">Quick Links</h3>
              <div className="flex flex-wrap gap-2">
                <a
                  href="/dashboard/payouts"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#0FF1CE] text-xs hover:underline"
                >
                  <ExternalLink size={11} />
                  User Payout Dashboard
                </a>
                <span className="text-gray-600">·</span>
                <a
                  href="/admin/withdrawals"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[#0FF1CE] text-xs hover:underline"
                >
                  <ExternalLink size={11} />
                  Admin Withdrawals
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Trust Wallet Transaction Mock ─────────────────────────────── */}
      <div className="mt-12">
        <div className="flex items-center gap-3 mb-2">
          <Smartphone size={22} className="text-[#0FF1CE]" />
          <h2 className="text-2xl font-bold text-white">Trust Wallet Transaction Mock</h2>
        </div>
        <p className="text-gray-400 text-sm mb-6">
          Generate a pixel-perfect Trust Wallet transaction screen for marketing screenshots. 100% client-side — no Firebase writes.
        </p>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-5">
            {/* Quick Presets */}
            <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Zap size={16} className="text-[#0FF1CE]" /> Quick Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { label: '+$10 USDT', config: { token: 'USDT' as TWToken, amount: '10', usdValue: '9.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$100 USDT', config: { token: 'USDT' as TWToken, amount: '100', usdValue: '99.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$500 USDT', config: { token: 'USDT' as TWToken, amount: '500', usdValue: '499.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$1,000 USDT', config: { token: 'USDT' as TWToken, amount: '1000', usdValue: '999.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$5,000 USDT', config: { token: 'USDT' as TWToken, amount: '5000', usdValue: '4999.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$10,000 USDT', config: { token: 'USDT' as TWToken, amount: '10000', usdValue: '9999.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$40,000 USDT', config: { token: 'USDT' as TWToken, amount: '40000', usdValue: '39999.99', status: 'Completed' as const, networkFee: '0 TRX ($0.00)', direction: 'Receive' as const } },
                  { label: '+$80,000 USDC', config: { token: 'USDC' as TWToken, amount: '80000', usdValue: '79999.99', status: 'Completed' as const, networkFee: '0.0001 SOL ($0.02)', direction: 'Receive' as const } },
                ] as { label: string; config: Partial<TWConfig> }[]).map(({ label, config: preset }) => (
                  <button
                    key={label}
                    onClick={() => updateTW(preset)}
                    className="bg-[#151515] hover:bg-[#0FF1CE]/10 hover:border-[#0FF1CE]/40 border border-[#2F2F2F] text-white text-sm font-medium py-2 px-3 rounded-lg transition-all text-left"
                  >
                    <span className="text-[#0FF1CE]">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Controls */}
            <div className="bg-[#0D0D0D]/80 border border-[#2F2F2F]/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Settings2 size={16} className="text-[#0FF1CE]" /> Customize
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Direction</label>
                  <select
                    value={twConfig.direction}
                    onChange={(e) => updateTW({ direction: e.target.value as TWConfig['direction'] })}
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  >
                    <option value="Receive">Receive</option>
                    <option value="Send">Send</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Token</label>
                  <select
                    value={twConfig.token}
                    onChange={(e) => {
                      const tok = e.target.value as TWToken;
                      const net = TW_NETWORKS[tok];
                      updateTW({ token: tok, networkFee: `0 ${net} ($0.00)` });
                    }}
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  >
                    {TW_TOKENS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Amount</label>
                  <input
                    type="text"
                    value={twConfig.amount}
                    onChange={(e) => updateTW({ amount: e.target.value })}
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">USD Value</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                    <input
                      type="text"
                      value={twConfig.usdValue}
                      onChange={(e) => updateTW({ usdValue: e.target.value })}
                      className="w-full bg-[#151515] text-white pl-7 pr-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Status</label>
                  <select
                    value={twConfig.status}
                    onChange={(e) => updateTW({ status: e.target.value as TWConfig['status'] })}
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  >
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Time</label>
                  <input
                    type="text"
                    value={twConfig.time}
                    onChange={(e) => updateTW({ time: e.target.value })}
                    placeholder="9:46 AM"
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Date</label>
                  <input
                    type="text"
                    value={twConfig.date}
                    onChange={(e) => updateTW({ date: e.target.value })}
                    placeholder="Feb 20, 2026"
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">
                    {twConfig.direction === 'Receive' ? 'Sender' : 'Recipient'} Address
                  </label>
                  <input
                    type="text"
                    value={twConfig.senderAddress}
                    onChange={(e) => updateTW({ senderAddress: e.target.value })}
                    placeholder="TQ8y7omYKqbGPdNzxlvbwxjk97Q"
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm font-mono"
                  />
                  <p className="text-gray-600 text-xs mt-1">
                    Shown as: {truncateAddress(twConfig.senderAddress || '---')}
                  </p>
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-400 mb-1.5">Network Fee</label>
                  <input
                    type="text"
                    value={twConfig.networkFee}
                    onChange={(e) => updateTW({ networkFee: e.target.value })}
                    placeholder="0 TRX ($0.00)"
                    className="w-full bg-[#151515] text-white px-3 py-2.5 rounded-lg border border-[#2F2F2F] focus:border-[#0FF1CE]/50 focus:outline-none text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => setTWConfig(getDefaultTWConfig())}
                className="mt-4 w-full flex items-center justify-center gap-2 text-gray-400 border border-[#2F2F2F] rounded-lg py-2 text-sm hover:border-[#0FF1CE]/30 hover:text-[#0FF1CE] transition-colors"
              >
                <RefreshCw size={13} />
                Reset to Default
              </button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-between w-full max-w-[375px]">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Eye size={16} className="text-[#0FF1CE]" /> Live Preview
              </h3>
              <button
                onClick={() => setTWFullscreen(true)}
                className="flex items-center gap-1.5 text-[#0FF1CE] text-xs border border-[#0FF1CE]/30 px-3 py-1.5 rounded-lg hover:bg-[#0FF1CE]/10 transition-colors"
              >
                <Maximize2 size={12} />
                Fullscreen
              </button>
            </div>

            {/* Phone frame */}
            <div
              style={{
                background: '#111',
                borderRadius: '48px',
                padding: '6px',
                boxShadow: '0 0 0 1.5px #2a2a2a, 0 0 0 3px #1a1a1a, 0 30px 80px rgba(0,0,0,0.8)',
                width: '375px',
                maxWidth: '100%',
              }}
            >
              <div style={{ borderRadius: '44px', overflow: 'hidden' }}>
                <TrustWalletScreen config={twConfig} />
              </div>
            </div>

            <p className="text-gray-600 text-xs text-center max-w-sm">
              Click <strong className="text-gray-400">Fullscreen</strong> for a clean view to screenshot. The phone frame above is for preview only.
            </p>
          </div>
        </div>
      </div>

      {/* Fullscreen TW Modal */}
      {twFullscreen && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setTWFullscreen(false)}
        >
          <button
            className="absolute top-5 right-5 text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setTWFullscreen(false)}
          >
            <X size={22} />
          </button>
          <p className="absolute top-5 left-1/2 -translate-x-1/2 text-gray-500 text-xs pointer-events-none">
            Click anywhere or press Esc to close
          </p>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#111',
              borderRadius: '48px',
              padding: '6px',
              boxShadow: '0 0 0 1.5px #2a2a2a, 0 0 0 3px #1a1a1a, 0 40px 120px rgba(0,0,0,0.9)',
              width: '375px',
            }}
          >
            <div style={{ borderRadius: '44px', overflow: 'hidden' }}>
              <TrustWalletScreen config={twConfig} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
