'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db, UserMetaApiAccount, getCachedMetrics } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Particles from '../../components/Particles';
import { Lock, Plus, AlertTriangle, TrendingUp, Loader2, ChevronRight, DollarSign, BarChart } from 'lucide-react';

interface AccountWithMetrics extends UserMetaApiAccount {
  cachedMetrics?: any;
}

export default function MyAccountsPage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);

  useEffect(() => {
    const fetchAllAccounts = async () => {
      if (user) {
        try {
          // Query all accounts for this user
          const accountsRef = collection(db, 'userMetaApiAccounts');
          const q = query(accountsRef, where('userId', '==', user.uid));
          const snapshot = await getDocs(q);
          
          const accountsData: AccountWithMetrics[] = [];
          
          // Fetch each account with its cached metrics
          for (const doc of snapshot.docs) {
            const account = doc.data() as UserMetaApiAccount;
            
            // Try to get cached metrics for each account
            const metrics = await getCachedMetrics(account.accountId);
            
            accountsData.push({
              ...account,
              cachedMetrics: metrics
            });
          }
          
          // Sort accounts: active first, then by creation date
          accountsData.sort((a, b) => {
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            return b.createdAt.toMillis() - a.createdAt.toMillis();
          });
          
          setAccounts(accountsData);
        } catch (error) {
          console.error('Error fetching accounts:', error);
        }
      }
      setLoading(false);
    };

    fetchAllAccounts();
  }, [user]);

  const handleStartChallenge = () => {
    router.push('/challenge');
  };

  const handleViewAccount = (accountId: string) => {
    router.push(`/dashboard/accounts/${accountId}`);
  };
  
  // Determine status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'passed':
        return 'bg-blue-500/20 text-blue-400';
      case 'failed':
        return 'bg-red-500/20 text-red-400';
      case 'inactive':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getBorderStyle = (status: string) => {
    switch (status) {
      case 'active':
        return 'hover:border-[#0FF1CE]/30';
      case 'passed':
        return 'hover:border-blue-400/30';
      case 'failed':
        return 'hover:border-red-400/30';
      case 'inactive':
        return 'hover:border-gray-400/30';
      default:
        return 'hover:border-[#0FF1CE]/30';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#0FF1CE]/10 text-[#0FF1CE]';
      case 'passed':
        return 'bg-blue-500/10 text-blue-400';
      case 'failed':
        return 'bg-red-500/10 text-red-400';
      case 'inactive':
        return 'bg-gray-500/10 text-gray-400';
      default:
        return 'bg-[#0FF1CE]/10 text-[#0FF1CE]';
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-[#0FF1CE] animate-spin" />
      </div>
    );
  }

  // If user has accounts, show them
  if (accounts.length > 0) {
    const activeAccounts = accounts.filter(acc => acc.status === 'active' || acc.status === 'inactive');
    const canAddMore = activeAccounts.length < 5;

    return (
      <div className="relative min-h-screen">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
        <Particles />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">My Trading Accounts</h1>
              <p className="text-sm text-gray-400 mt-1">
                {activeAccounts.length} of 5 active challenge accounts
              </p>
            </div>
            
            {canAddMore && (
              <button 
                onClick={handleStartChallenge}
                className="bg-[#0FF1CE] text-black font-semibold py-2 px-4 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Add Challenge
              </button>
            )}
          </div>

          {/* Account Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {accounts.map((account) => (
              <div 
                key={account.accountId}
                className={`bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-[#2F2F2F]/50 p-6 ${getBorderStyle(account.status)} transition-all cursor-pointer`}
                onClick={() => handleViewAccount(account.accountId)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {account.accountType === 'standard' ? 'Shockwave Standard' : 'Shockwave Instant'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      ${account.accountSize.toLocaleString()} • Step {account.step}
                    </p>
                  </div>
                  <span className={`px-3 py-1 ${getStatusStyle(account.status)} text-xs font-medium rounded-full`}>
                    {account.status.toUpperCase()}
                  </span>
                </div>

                {account.status === 'failed' && (
                  <p className="text-xs text-red-400 mb-4">
                    Challenge failed. View final metrics and history.
                  </p>
                )}

                {/* Quick Stats */}
                {account.cachedMetrics && (
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-[#151515] rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <DollarSign size={14} />
                        Balance
                      </div>
                      <p className="text-white font-medium">
                        ${account.cachedMetrics.balance?.toLocaleString() || '-'}
                      </p>
                    </div>
                    <div className="bg-[#151515] rounded-lg p-3">
                      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                        <BarChart size={14} />
                        Profit
                      </div>
                      <p className={`font-medium ${
                        (account.cachedMetrics.balance - account.accountSize) >= 0 
                          ? 'text-green-400' 
                          : 'text-red-400'
                      }`}>
                        ${((account.cachedMetrics.balance || account.accountSize) - account.accountSize).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-[#2F2F2F]/50">
                  <div className="text-xs text-gray-400">
                    {account.platform.toUpperCase()} • 
                    {account.startDate ? ` Started ${new Date(account.startDate.toDate()).toLocaleDateString()}` : ' Not started'}
                  </div>
                  <ChevronRight className="text-gray-400" size={16} />
                </div>
              </div>
            ))}

            {/* Add New Challenge Card - Only show if less than 5 active */}
            {canAddMore && (
              <div 
                className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl border border-dashed border-[#2F2F2F] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-[#0FF1CE]/30 transition-all min-h-[280px]"
                onClick={handleStartChallenge}
              >
                <div className="w-12 h-12 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center mb-4">
                  <Plus className="text-[#0FF1CE]" size={24} />
                </div>
                <h3 className="text-white font-medium mb-2">Start New Challenge</h3>
                <p className="text-xs text-gray-400 text-center">
                  Add up to {5 - activeAccounts.length} more challenge {5 - activeAccounts.length === 1 ? 'account' : 'accounts'}
                </p>
              </div>
            )}
          </div>

          {!canAddMore && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-500 mt-0.5" size={20} />
                <div>
                  <p className="text-amber-500 font-medium">Maximum Accounts Reached</p>
                  <p className="text-sm text-gray-300 mt-1">
                    You have reached the maximum of 5 active challenge accounts. Complete or close an existing challenge to add a new one.
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

  // Otherwise show the locked state
  return (
    <div className="relative min-h-screen">
      {/* Alert Banner */}
      <div className="relative z-30 hidden">
        <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border-y border-amber-500/20 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-start gap-3">
              <div className="p-1 bg-amber-500/20 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              </div>
              <div className="flex-1">
                <h3 className="text-amber-500 font-medium mb-1">System Alert</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  We are currently experiencing technical difficulties and the metrics dashboard is temporarily offline while our developers work towards a solution. Please manage your risk carefully during this time. We sincerely apologize for this significant inconvenience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full bg-[#0FF1CE]/[0.02] background-noise"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-3/4 h-full rounded-full bg-[#0FF1CE]/[0.03] blur-[150px] opacity-60"></div>
      <Particles />

      {/* Blurred placeholder content */}
      <div className="relative blur-sm pointer-events-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Placeholder cards to show blurred in background */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#2F2F2F]/50 h-64" />
            ))}
          </div>
        </div>
      </div>

      {/* Locked content overlay */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="bg-[#0D0D0D]/95 backdrop-blur-sm rounded-2xl p-8 border border-[#2F2F2F]/50 max-w-md w-full mx-4 text-center transform hover:scale-[1.02] transition-all duration-300">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#0FF1CE]/10 flex items-center justify-center">
            <Lock className="text-[#0FF1CE]" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Account Metrics Locked</h2>
          <p className="text-gray-400 mb-6">
            See your account metrics and performance analytics after purchasing a challenge. Start your journey to becoming a funded trader today.
          </p>
          <button 
            onClick={handleStartChallenge}
            className="bg-[#0FF1CE] text-black font-bold py-3 px-6 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors inline-flex items-center gap-2"
          >
            Start New Challenge
            <Plus size={20} />
          </button>
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
