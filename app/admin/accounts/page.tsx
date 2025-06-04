'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, getAllUsers, setUserMetaApiAccount, getUserMetaApiAccount, UserData, UserMetaApiAccount, Timestamp, getCachedMetrics } from '../../../lib/firebase';
import { 
  Search, 
  User, 
  Key, 
  Save, 
  AlertCircle, 
  CheckCircle,
  Server,
  Activity,
  Edit2,
  Loader2,
  XCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertTriangle,
  Bell,
  Download,
  Filter,
  RefreshCw,
  Power,
  Eye,
  Users,
  Target,
  BarChart,
  Shield,
  Trash2,
  X,
  Plus,
  Clock,
  Mail
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface UserWithAccount extends UserData {
  metaApiAccount?: UserMetaApiAccount;
  cachedMetrics?: any;
}

interface Alert {
  id: string;
  type: 'breach' | 'pass' | 'warning' | 'info';
  accountId: string;
  userEmail: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export default function AdminAccountsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [allAccounts, setAllAccounts] = useState<UserWithAccount[]>([]);
  const [filteredAccounts, setFilteredAccounts] = useState<UserWithAccount[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserWithAccount | null>(null);
  const [accountForm, setAccountForm] = useState({
    accountId: '',
    accountToken: '',
    accountType: 'standard' as 'standard' | 'instant',
    accountSize: 10000,
    platform: 'mt5' as 'mt4' | 'mt5',
    status: 'active' as 'active' | 'inactive' | 'passed' | 'failed',
    step: 1 as 1 | 2
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchUserEmail, setSearchUserEmail] = useState('');
  const [searchedUser, setSearchedUser] = useState<UserData | null>(null);
  const [refreshingAccounts, setRefreshingAccounts] = useState<Set<string>>(new Set());
  const [bulkRefreshing, setBulkRefreshing] = useState(false);
  const [refreshQueue, setRefreshQueue] = useState<string[]>([]);
  const [processedAlerts, setProcessedAlerts] = useState<Set<string>>(new Set());

  // Load all accounts function
  const loadAllAccounts = async () => {
    setLoading(true);
    try {
      // Query userMetaApiAccounts directly instead of loading all users
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const accountsSnapshot = await getDocs(accountsRef);
      
      const accountPromises = accountsSnapshot.docs.map(async (doc) => {
        const accountData = doc.data() as UserMetaApiAccount;
        
        // Get user data for this account
        const userRef = collection(db, 'users');
        const userQuery = query(userRef, where('uid', '==', accountData.userId), limit(1));
        const userSnapshot = await getDocs(userQuery);
        
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data() as UserData;
          
          // Get cached metrics
          const metrics = await getCachedMetrics(accountData.accountId);
          
          return {
            ...userData,
            metaApiAccount: accountData,
            cachedMetrics: metrics
          };
        }
        return null;
      });
      
      const users = (await Promise.all(accountPromises)).filter(Boolean) as UserWithAccount[];
      
      setAllAccounts(users);
      setFilteredAccounts(users);
      
      // Check for alerts
      checkForAlerts(users);
    } catch (error) {
      console.error('Error loading accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load all accounts with real-time updates
  useEffect(() => {
    loadAllAccounts();
    
    // Set up real-time listener for account updates
    const accountsRef = collection(db, 'userMetaApiAccounts');
    const unsubscribe = onSnapshot(accountsRef, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'modified') {
          // Reload accounts when changes occur
          loadAllAccounts();
        }
      });
    });

    return () => unsubscribe();
  }, []);

  // Check for alerts (breaches, passes, etc.)
  const checkForAlerts = (accounts: UserWithAccount[]) => {
    const newAlerts: Alert[] = [];
    
    accounts.forEach((account) => {
      if (!account.cachedMetrics || !account.metaApiAccount) return;
      
      const metrics = account.cachedMetrics;
      const config = account.metaApiAccount;
      
      // Create unique alert keys to prevent duplicates
      const maxDDKey = `${account.uid}-maxdd-${metrics.maxDrawdown?.toFixed(2)}`;
      const dailyDDKey = `${account.uid}-dailydd-${(metrics.maxDailyDrawdown || metrics.dailyDrawdown)?.toFixed(2)}`;
      const profitKey = `${account.uid}-profit-${((metrics.balance - config.accountSize) / config.accountSize * 100).toFixed(2)}`;
      const warningKey = `${account.uid}-warning-${metrics.maxDrawdown?.toFixed(2)}`;
      
      // Check for objective breaches
      if (metrics.maxDrawdown > (config.accountType === 'standard' ? 15 : 12) && !processedAlerts.has(maxDDKey)) {
        newAlerts.push({
          id: maxDDKey,
          type: 'breach',
          accountId: config.accountId,
          userEmail: account.email,
          message: `Maximum drawdown breach: ${metrics.maxDrawdown.toFixed(2)}%`,
          timestamp: new Date(),
          read: false
        });
        setProcessedAlerts(prev => new Set(prev).add(maxDDKey));
      }
      
      if ((metrics.maxDailyDrawdown || metrics.dailyDrawdown) > (config.accountType === 'standard' ? 8 : 4) && !processedAlerts.has(dailyDDKey)) {
        newAlerts.push({
          id: dailyDDKey,
          type: 'breach',
          accountId: config.accountId,
          userEmail: account.email,
          message: `Daily drawdown breach: ${(metrics.maxDailyDrawdown || metrics.dailyDrawdown).toFixed(2)}%`,
          timestamp: new Date(),
          read: false
        });
        setProcessedAlerts(prev => new Set(prev).add(dailyDDKey));
      }
      
      // Check for profit target achievement
      const profitPercent = ((metrics.balance - config.accountSize) / config.accountSize) * 100;
      const targetProfit = config.accountType === 'standard' ? 10 : 12;
      
      if (profitPercent >= targetProfit && config.status === 'active' && !processedAlerts.has(profitKey)) {
        newAlerts.push({
          id: profitKey,
          type: 'pass',
          accountId: config.accountId,
          userEmail: account.email,
          message: `Profit target achieved: ${profitPercent.toFixed(2)}%! Challenge may be complete.`,
          timestamp: new Date(),
          read: false
        });
        setProcessedAlerts(prev => new Set(prev).add(profitKey));
      }
      
      // Warning for approaching limits
      if (metrics.maxDrawdown > (config.accountType === 'standard' ? 12 : 10) && 
          metrics.maxDrawdown < (config.accountType === 'standard' ? 15 : 12) &&
          !processedAlerts.has(warningKey)) {
        newAlerts.push({
          id: warningKey,
          type: 'warning',
          accountId: config.accountId,
          userEmail: account.email,
          message: `Approaching max drawdown limit: ${metrics.maxDrawdown.toFixed(2)}%`,
          timestamp: new Date(),
          read: false
        });
        setProcessedAlerts(prev => new Set(prev).add(warningKey));
      }
    });
    
    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 50)); // Keep last 50 alerts
    }
  };

  // Refresh single account metrics
  const refreshAccount = async (account: UserWithAccount) => {
    if (!account.metaApiAccount) return;
    
    const { accountId, accountToken, accountType, accountSize } = account.metaApiAccount;
    
    setRefreshingAccounts(prev => new Set(prev).add(account.uid));
    
    try {
      const response = await fetch('/api/metaapi/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          accountId,
          accountToken,
          accountType,
          accountSize,
          isAdmin: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh metrics');
      }
      
      // Reload accounts to get updated data
      await loadAllAccounts();
    } catch (error) {
      console.error('Error refreshing account:', error);
      setMessage({ type: 'error', text: `Failed to refresh account ${accountId}` });
    } finally {
      setRefreshingAccounts(prev => {
        const newSet = new Set(prev);
        newSet.delete(account.uid);
        return newSet;
      });
    }
  };

  // Process refresh queue
  useEffect(() => {
    const processQueue = async () => {
      if (refreshQueue.length === 0 || bulkRefreshing) return;
      
      setBulkRefreshing(true);
      const accountId = refreshQueue[0];
      const account = allAccounts.find(a => a.uid === accountId);
      
      if (account) {
        await refreshAccount(account);
      }
      
      setRefreshQueue(prev => prev.slice(1));
      setBulkRefreshing(false);
    };
    
    processQueue();
  }, [refreshQueue, bulkRefreshing, allAccounts]);

  // Bulk refresh accounts
  const handleBulkRefresh = () => {
    const accountsToRefresh = selectedAccounts.length > 0 
      ? selectedAccounts 
      : filteredAccounts.filter(a => a.metaApiAccount?.status === 'active').map(a => a.uid);
    
    if (accountsToRefresh.length === 0) {
      setMessage({ type: 'error', text: 'No active accounts to refresh' });
      return;
    }
    
    setRefreshQueue(accountsToRefresh);
    setMessage({ type: 'info', text: `Refreshing ${accountsToRefresh.length} accounts...` });
  };

  // Filter accounts
  useEffect(() => {
    let filtered = [...allAccounts];
    
    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(account => 
        account.metaApiAccount?.status === statusFilter
      );
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(account => {
        const emailMatch = account.email?.toLowerCase().includes(query);
        const accountIdMatch = account.metaApiAccount?.accountId?.toLowerCase().includes(query);
        const nameMatch = account.displayName?.toLowerCase().includes(query) || 
                         `${account.firstName} ${account.lastName}`.toLowerCase().includes(query);
        
        return emailMatch || accountIdMatch || nameMatch;
      });
    }
    
    setFilteredAccounts(filtered);
  }, [allAccounts, statusFilter, searchQuery]);

  // Handle account disconnect
  const handleDisconnect = async (userId: string) => {
    if (!confirm('Are you sure you want to disconnect this account?')) return;
    
    try {
      // First, find the document ID for this user's account
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const q = query(accountsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const accountRef = doc(db, 'userMetaApiAccounts', docId);
        await updateDoc(accountRef, {
          status: 'inactive',
          updatedAt: Timestamp.now()
        });
        
        setMessage({ type: 'success', text: 'Account disconnected successfully' });
        
        // Reload accounts after update
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure update is processed
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: 'Account not found' });
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
      setMessage({ type: 'error', text: 'Failed to disconnect account' });
    }
  };

  // Handle account fail
  const handleFail = async (userId: string) => {
    if (!confirm('Are you sure you want to mark this account as failed?')) return;
    
    try {
      // First, find the document ID for this user's account
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const q = query(accountsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        const accountRef = doc(db, 'userMetaApiAccounts', docId);
        await updateDoc(accountRef, {
          status: 'failed',
          updatedAt: Timestamp.now()
        });
        
        setMessage({ type: 'success', text: 'Account marked as failed' });
        
        // Reload accounts after update
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay to ensure update is processed
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: 'Account not found' });
      }
    } catch (error) {
      console.error('Error updating account:', error);
      setMessage({ type: 'error', text: 'Failed to update account status' });
    }
  };

  // Handle account delete
  const handleDelete = async (userId: string, accountId: string) => {
    if (!confirm('Are you sure you want to permanently delete this account? This action cannot be undone.')) return;
    
    try {
      // First, find the document ID for this user's account
      const accountsRef = collection(db, 'userMetaApiAccounts');
      const q = query(accountsRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        
        // Delete the account document
        await deleteDoc(doc(db, 'userMetaApiAccounts', docId));
        
        // Also delete the cached metrics if they exist
        try {
          await deleteDoc(doc(db, 'cachedMetrics', accountId));
        } catch (err) {
          // Ignore if cached metrics don't exist
          console.log('No cached metrics to delete');
        }
        
        setMessage({ type: 'success', text: 'Account deleted successfully' });
        
        // Reload accounts after deletion
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        setMessage({ type: 'error', text: 'Account not found' });
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage({ type: 'error', text: 'Failed to delete account' });
    }
  };

  // Bulk actions
  const handleBulkDisconnect = async () => {
    if (selectedAccounts.length === 0) return;
    if (!confirm(`Disconnect ${selectedAccounts.length} accounts?`)) return;
    
    try {
      const accountsRef = collection(db, 'userMetaApiAccounts');
      
      for (const userId of selectedAccounts) {
        // Find the document ID for each user's account
        const q = query(accountsRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const docId = querySnapshot.docs[0].id;
          const accountRef = doc(db, 'userMetaApiAccounts', docId);
          await updateDoc(accountRef, {
            status: 'inactive',
            updatedAt: Timestamp.now()
          });
        }
      }
      
      setSelectedAccounts([]);
      setMessage({ type: 'success', text: `${selectedAccounts.length} accounts disconnected` });
      
      // Reload accounts after updates
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (error) {
      console.error('Error in bulk disconnect:', error);
      setMessage({ type: 'error', text: 'Failed to disconnect some accounts' });
    }
  };

  // Export accounts data
  const handleExport = () => {
    const data = filteredAccounts.map(account => ({
      email: account.email,
      accountId: account.metaApiAccount?.accountId,
      status: account.metaApiAccount?.status,
      accountType: account.metaApiAccount?.accountType,
      accountSize: account.metaApiAccount?.accountSize,
      balance: account.cachedMetrics?.balance,
      equity: account.cachedMetrics?.equity,
      maxDrawdown: account.cachedMetrics?.maxDrawdown,
      dailyDrawdown: account.cachedMetrics?.dailyDrawdown,
      maxDailyDrawdown: account.cachedMetrics?.maxDailyDrawdown || account.cachedMetrics?.dailyDrawdown,
      profitFactor: account.cachedMetrics?.profitFactor,
      winRate: account.cachedMetrics?.winRate,
      trades: account.cachedMetrics?.numberOfTrades
    }));
    
    const csv = [
      Object.keys(data[0]).join(','),
      ...data.map(row => Object.values(row).join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accounts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Search for user by email
  const searchUserByEmail = async () => {
    if (!searchUserEmail) {
      setMessage({ type: 'error', text: 'Please enter an email address' });
      return;
    }

    setLoading(true);
    setSearchedUser(null);
    
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', searchUserEmail.toLowerCase()));
      const snapshot = await getDocs(q);
      
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data() as UserData;
        
        // Check how many active accounts this user has
        const accountsRef = collection(db, 'userMetaApiAccounts');
        const accountQuery = query(
          accountsRef, 
          where('userId', '==', userData.uid),
          where('status', 'in', ['active', 'inactive']) // Don't count failed/passed accounts
        );
        const accountSnapshot = await getDocs(accountQuery);
        
        if (accountSnapshot.size >= 5) {
          setMessage({ type: 'error', text: 'This user already has 5 active challenge accounts (maximum allowed)' });
          setSearchedUser(null);
        } else {
          setSearchedUser(userData);
          const remainingSlots = 5 - accountSnapshot.size;
          setMessage({ 
            type: 'success', 
            text: `User found! They have ${accountSnapshot.size} active account(s) and can add ${remainingSlots} more.` 
          });
        }
      } else {
        setMessage({ type: 'error', text: 'No user found with this email address' });
      }
    } catch (error) {
      console.error('Error searching for user:', error);
      setMessage({ type: 'error', text: 'Failed to search for user' });
    } finally {
      setLoading(false);
    }
  };

  // Save MetaAPI account configuration
  const handleSaveAccount = async () => {
    if (!selectedUser) return;
    
    if (!accountForm.accountId || !accountForm.accountToken) {
      setMessage({ type: 'error', text: 'Account ID and Token are required.' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await setUserMetaApiAccount({
        userId: selectedUser.uid,
        accountId: accountForm.accountId,
        accountToken: accountForm.accountToken,
        accountType: accountForm.accountType,
        accountSize: accountForm.accountSize,
        platform: accountForm.platform,
        status: accountForm.status,
        step: accountForm.step,
        startDate: selectedUser.metaApiAccount?.startDate || Timestamp.now()
      });

      setMessage({ type: 'success', text: 'Account configuration saved successfully!' });
      setShowEditModal(false);
      
      // Reload accounts
      window.location.reload();
    } catch (error) {
      console.error('Error saving account:', error);
      setMessage({ type: 'error', text: 'Failed to save account configuration.' });
    } finally {
      setSaving(false);
    }
  };

  const accountSizes = [5000, 10000, 25000, 50000, 100000, 200000];

  // Account sizes based on type
  const standardAccountSizes = [5000, 10000, 25000, 50000, 100000, 200000, 500000];
  const instantAccountSizes = [25000, 50000, 100000];
  
  const getAccountSizes = (accountType: 'standard' | 'instant') => {
    return accountType === 'standard' ? standardAccountSizes : instantAccountSizes;
  };

  // Calculate overview statistics
  const stats = {
    total: allAccounts.length,
    active: allAccounts.filter(a => a.metaApiAccount?.status === 'active').length,
    passed: allAccounts.filter(a => a.metaApiAccount?.status === 'passed').length,
    failed: allAccounts.filter(a => a.metaApiAccount?.status === 'failed').length,
    totalBalance: allAccounts.reduce((sum, a) => sum + (a.cachedMetrics?.balance || 0), 0),
    totalEquity: allAccounts.reduce((sum, a) => sum + (a.cachedMetrics?.equity || 0), 0)
  };

  // Send challenge pass email
  const sendPassEmail = async (account: UserWithAccount) => {
    if (!account.metaApiAccount) return;
    
    const { accountType, step, accountSize } = account.metaApiAccount;
    const isStandard = accountType === 'standard';
    const stepText = isStandard ? (step === 1 ? 'Step 1' : 'Step 2') : 'Instant Challenge';
    
    try {
      const response = await fetch('/api/send-challenge-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'pass',
          email: account.email,
          name: account.displayName || `${account.firstName} ${account.lastName}`.trim() || account.email,
          challengeType: accountType,
          step: stepText,
          accountSize,
          adminEmail: 'support@shockwave-capital.com'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setMessage({ type: 'success', text: `Pass email sent to ${account.email}` });
    } catch (error) {
      console.error('Error sending pass email:', error);
      setMessage({ type: 'error', text: 'Failed to send pass email' });
    }
  };

  // Send challenge fail email
  const sendFailEmail = async (account: UserWithAccount) => {
    if (!account.metaApiAccount) return;
    
    const { accountType, accountSize } = account.metaApiAccount;
    const metrics = account.cachedMetrics;
    
    // Determine breach type
    let breachType = '';
    const maxDDLimit = accountType === 'standard' ? 15 : 12;
    const dailyDDLimit = accountType === 'standard' ? 8 : 4;
    
    const maxDDBreached = metrics?.maxDrawdown > maxDDLimit;
    const dailyDDBreached = (metrics?.maxDailyDrawdown || metrics?.dailyDrawdown) > dailyDDLimit;
    
    if (maxDDBreached && dailyDDBreached) {
      breachType = 'both';
    } else if (maxDDBreached) {
      breachType = 'maxDrawdown';
    } else if (dailyDDBreached) {
      breachType = 'dailyDrawdown';
    }
    
    try {
      const response = await fetch('/api/send-challenge-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'fail',
          email: account.email,
          name: account.displayName || `${account.firstName} ${account.lastName}`.trim() || account.email,
          challengeType: accountType,
          accountSize,
          breachType,
          maxDrawdown: metrics?.maxDrawdown || 0,
          dailyDrawdown: metrics?.maxDailyDrawdown || metrics?.dailyDrawdown || 0,
          adminEmail: 'support@shockwave-capital.com'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setMessage({ type: 'success', text: `Fail email sent to ${account.email}` });
    } catch (error) {
      console.error('Error sending fail email:', error);
      setMessage({ type: 'error', text: 'Failed to send fail email' });
    }
  };

  // Send drawdown warning email
  const sendDrawdownWarningEmail = async (account: UserWithAccount) => {
    if (!account.metaApiAccount || !account.cachedMetrics) return;
    
    const { accountType, accountSize } = account.metaApiAccount;
    const { maxDrawdown } = account.cachedMetrics;
    
    try {
      const response = await fetch('/api/send-challenge-emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'drawdown-warning',
          email: account.email,
          name: account.displayName || `${account.firstName} ${account.lastName}`.trim() || account.email,
          challengeType: accountType,
          accountSize,
          currentDrawdown: maxDrawdown,
          adminEmail: 'support@shockwave-capital.com'
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send email');
      }
      
      setMessage({ type: 'success', text: `Drawdown warning email sent to ${account.email}` });
    } catch (error) {
      console.error('Error sending drawdown warning email:', error);
      setMessage({ type: 'error', text: 'Failed to send drawdown warning email' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header with Alerts */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Account Management Dashboard</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setShowAddModal(true);
              setSearchUserEmail('');
              setSearchedUser(null);
              setAccountForm({
                accountId: '',
                accountToken: '',
                accountType: 'standard' as 'standard' | 'instant',
                accountSize: 10000,
                platform: 'mt5' as 'mt4' | 'mt5',
                status: 'active' as 'active' | 'inactive' | 'passed' | 'failed',
                step: 1 as 1 | 2
              });
            }}
            className="bg-[#0FF1CE] text-black font-semibold px-4 py-2 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Add Account
          </button>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} />
          </button>
          <div className="relative">
            <button
              onClick={() => setShowAlerts(!showAlerts)}
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
              <Bell size={20} />
              {alerts.filter(a => !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {alerts.filter(a => !a.read).length}
                </span>
              )}
            </button>
            
            {/* Alerts Dropdown */}
            {showAlerts && (
              <div className="absolute right-0 mt-2 w-96 bg-[#0D0D0D] border border-[#2F2F2F] rounded-xl shadow-2xl z-50 max-h-96 overflow-y-auto">
                <div className="p-4 border-b border-[#2F2F2F]">
                  <h3 className="text-white font-semibold">Notifications</h3>
                </div>
                {alerts.length === 0 ? (
                  <p className="p-4 text-gray-400 text-sm">No notifications</p>
                ) : (
                  alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 border-b border-[#2F2F2F]/50 hover:bg-white/5 transition-colors ${
                        !alert.read ? 'bg-white/5' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {alert.type === 'breach' && <XCircle className="text-red-400 mt-1" size={16} />}
                        {alert.type === 'pass' && <CheckCircle className="text-green-400 mt-1" size={16} />}
                        {alert.type === 'warning' && <AlertTriangle className="text-yellow-400 mt-1" size={16} />}
                        {alert.type === 'info' && <AlertCircle className="text-blue-400 mt-1" size={16} />}
                        <div className="flex-1">
                          <p className="text-sm text-white">{alert.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {alert.userEmail} • {formatDistanceToNow(alert.timestamp, { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <Users className="text-[#0FF1CE]" size={20} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total}</p>
              <p className="text-xs text-gray-400">Total Accounts</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <Activity className="text-green-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.active}</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.passed}</p>
              <p className="text-xs text-gray-400">Passed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-red-400" size={20} />
            <div>
              <p className="text-2xl font-bold text-white">{stats.failed}</p>
              <p className="text-xs text-gray-400">Failed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <DollarSign className="text-yellow-400" size={20} />
            <div>
              <p className="text-xl font-bold text-white">${(stats.totalBalance / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-400">Total Balance</p>
            </div>
          </div>
        </div>
        
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-purple-400" size={20} />
            <div>
              <p className="text-xl font-bold text-white">${(stats.totalEquity / 1000).toFixed(1)}k</p>
              <p className="text-xs text-gray-400">Total Equity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by email, name, or account ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg pl-10 pr-10 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
            </select>
            
            <button
              onClick={handleBulkRefresh}
              disabled={bulkRefreshing || refreshQueue.length > 0}
              className="bg-[#0FF1CE]/10 text-[#0FF1CE] px-4 py-2 rounded-lg hover:bg-[#0FF1CE]/20 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw size={16} className={bulkRefreshing || refreshQueue.length > 0 ? 'animate-spin' : ''} />
              {refreshQueue.length > 0 
                ? `Refreshing (${refreshQueue.length})` 
                : selectedAccounts.length > 0 
                  ? `Refresh (${selectedAccounts.length})`
                  : 'Refresh All'
              }
            </button>
            
            {selectedAccounts.length > 0 && (
              <button
                onClick={handleBulkDisconnect}
                className="bg-red-500/10 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/20 transition-colors flex items-center gap-2"
              >
                <Power size={16} />
                Disconnect ({selectedAccounts.length})
              </button>
            )}
            
            <button
              onClick={handleExport}
              className="bg-[#0FF1CE]/10 text-[#0FF1CE] px-4 py-2 rounded-lg hover:bg-[#0FF1CE]/20 transition-colors flex items-center gap-2"
            >
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
        
        {/* Search Results Info */}
        {(searchQuery || statusFilter !== 'all') && (
          <div className="mt-3 text-sm text-gray-400">
            Found {filteredAccounts.length} {filteredAccounts.length === 1 ? 'account' : 'accounts'}
            {searchQuery && <span> matching "{searchQuery}"</span>}
            {statusFilter !== 'all' && <span> with status "{statusFilter}"</span>}
          </div>
        )}
      </div>

      {/* Accounts Table */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 text-[#0FF1CE] animate-spin" />
          </div>
        ) : filteredAccounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Users className="w-12 h-12 text-gray-500 mb-4" />
            <p className="text-gray-400">No accounts found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2F2F2F] bg-[#151515]">
                  <th className="text-left p-4">
                    <input
                      type="checkbox"
                      checked={selectedAccounts.length === filteredAccounts.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAccounts(filteredAccounts.map(a => a.uid));
                        } else {
                          setSelectedAccounts([]);
                        }
                      }}
                      className="rounded border-gray-600"
                    />
                  </th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">User</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Account ID</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Balance</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Equity</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Max DD</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400" title="Highest daily drawdown achieved during the challenge">Daily DD (Peak)</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Last Updated</th>
                  <th className="text-center p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2F2F2F]/50">
                {filteredAccounts.map((account) => {
                  const metrics = account.cachedMetrics;
                  const config = account.metaApiAccount;
                  const isBreached = metrics && (
                    metrics.maxDrawdown > (config?.accountType === 'standard' ? 15 : 12) ||
                    (metrics.maxDailyDrawdown || metrics.dailyDrawdown) > (config?.accountType === 'standard' ? 8 : 4)
                  );
                  
                  return (
                    <tr key={account.uid} className={`hover:bg-white/5 transition-colors ${
                      isBreached ? 'bg-red-500/5' : ''
                    }`}>
                      <td className="p-4">
                        <input
                          type="checkbox"
                          checked={selectedAccounts.includes(account.uid)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAccounts([...selectedAccounts, account.uid]);
                            } else {
                              setSelectedAccounts(selectedAccounts.filter(id => id !== account.uid));
                            }
                          }}
                          className="rounded border-gray-600"
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-sm text-white font-medium">{account.email}</p>
                          <p className="text-xs text-gray-400">
                            {account.displayName || `${account.firstName} ${account.lastName}`.trim() || 'No name'}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-300 font-mono cursor-help" title={config?.accountId || 'No ID'}>
                          {config?.accountId ? `${config.accountId.slice(0, 12)}...` : 'No ID'}
                        </p>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          config?.status === 'active'
                            ? 'bg-green-500/20 text-green-400'
                            : config?.status === 'passed'
                            ? 'bg-blue-500/20 text-blue-400'
                            : config?.status === 'failed'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {config?.status?.toUpperCase() || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Shield size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-300">
                            {config?.accountType === 'standard' ? 'Standard' : 'Instant'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm text-white font-medium">
                          ${metrics?.balance?.toLocaleString() || '-'}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className="text-sm text-white">
                          ${metrics?.equity?.toLocaleString() || '-'}
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className={`text-sm font-medium ${
                          metrics && metrics.maxDrawdown > (config?.accountType === 'standard' ? 15 : 12)
                            ? 'text-red-400'
                            : metrics && metrics.maxDrawdown > (config?.accountType === 'standard' ? 12 : 10)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}>
                          {metrics?.maxDrawdown?.toFixed(2) || '-'}%
                        </p>
                      </td>
                      <td className="p-4 text-right">
                        <p className={`text-sm font-medium ${
                          metrics && (metrics.maxDailyDrawdown || metrics.dailyDrawdown) > (config?.accountType === 'standard' ? 8 : 4)
                            ? 'text-red-400'
                            : metrics && (metrics.maxDailyDrawdown || metrics.dailyDrawdown) > (config?.accountType === 'standard' ? 6 : 3)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}>
                          {(metrics?.maxDailyDrawdown || metrics?.dailyDrawdown)?.toFixed(2) || '-'}%
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-400">
                          {metrics?.lastUpdated 
                            ? formatDistanceToNow(metrics.lastUpdated.toDate ? metrics.lastUpdated.toDate() : new Date(metrics.lastUpdated), { addSuffix: true })
                            : config?.updatedAt 
                              ? formatDistanceToNow(config.updatedAt.toDate(), { addSuffix: true })
                              : 'Never'
                          }
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => window.location.href = `/admin/accounts/${config?.accountId}`}
                            className="p-1.5 text-gray-400 hover:text-[#0FF1CE] transition-colors"
                            title="View Account"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => refreshAccount(account)}
                            disabled={refreshingAccounts.has(account.uid)}
                            className="p-1.5 text-gray-400 hover:text-[#0FF1CE] transition-colors disabled:opacity-50"
                            title="Refresh Account"
                          >
                            <RefreshCw size={16} className={refreshingAccounts.has(account.uid) ? 'animate-spin' : ''} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedUser(account);
                              setAccountForm({
                                accountId: config?.accountId || '',
                                accountToken: config?.accountToken || '',
                                accountType: config?.accountType || 'standard',
                                accountSize: config?.accountSize || 10000,
                                platform: config?.platform || 'mt5',
                                status: config?.status || 'active',
                                step: config?.step || 1
                              });
                              setShowEditModal(true);
                            }}
                            className="p-1.5 text-gray-400 hover:text-[#0FF1CE] transition-colors"
                            title="Edit Account"
                          >
                            <Edit2 size={16} />
                          </button>
                          
                          {/* Email Actions */}
                          {(config?.status === 'active' || config?.status === 'failed' || config?.status === 'passed') && (
                            <div className="flex items-center gap-1 border-l border-[#2F2F2F]/50 pl-2 ml-1">
                              {config?.status === 'passed' && (
                                <button
                                  onClick={() => sendPassEmail(account)}
                                  className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                                  title="Send Pass Email"
                                >
                                  <Mail size={16} />
                                </button>
                              )}
                              {config?.status === 'failed' && (
                                <button
                                  onClick={() => sendFailEmail(account)}
                                  className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                  title="Send Fail Email"
                                >
                                  <Mail size={16} />
                                </button>
                              )}
                              {config?.status === 'active' && (
                                <>
                                  <button
                                    onClick={() => sendPassEmail(account)}
                                    className="p-1.5 text-gray-400 hover:text-green-400 transition-colors"
                                    title="Send Pass Email"
                                  >
                                    <Mail size={16} />
                                  </button>
                                  <button
                                    onClick={() => sendFailEmail(account)}
                                    className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                    title="Send Fail Email"
                                  >
                                    <Mail size={16} />
                                  </button>
                                  {metrics && metrics.maxDrawdown >= 6 && (
                                    <button
                                      onClick={() => sendDrawdownWarningEmail(account)}
                                      className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
                                      title="Send Drawdown Warning Email"
                                    >
                                      <Mail size={16} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          )}
                          
                          {config?.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleDisconnect(account.uid)}
                                className="p-1.5 text-gray-400 hover:text-yellow-400 transition-colors"
                                title="Disconnect Account"
                              >
                                <Power size={16} />
                              </button>
                              <button
                                onClick={() => handleFail(account.uid)}
                                className="p-1.5 text-gray-400 hover:text-red-400 transition-colors"
                                title="Mark as Failed"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => handleDelete(account.uid, config?.accountId || '')}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Delete Account"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D0D0D] border border-[#2F2F2F] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2F2F2F]">
              <h2 className="text-xl font-semibold text-white">Edit Account Configuration</h2>
              <p className="text-sm text-gray-400 mt-1">{selectedUser.email}</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    MetaAPI Account ID <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={accountForm.accountId}
                    onChange={(e) => setAccountForm({ ...accountForm, accountId: e.target.value })}
                    placeholder="e.g., 50e36bcb-f0c2-49d2-939f-4aea4ea8eb94"
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    MetaAPI Token <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="password"
                      value={accountForm.accountToken}
                      onChange={(e) => setAccountForm({ ...accountForm, accountToken: e.target.value })}
                      placeholder="Enter MetaAPI token"
                      className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Account Type
                  </label>
                  <select
                    value={accountForm.accountType}
                    onChange={(e) => {
                      const newType = e.target.value as 'standard' | 'instant';
                      const sizes = getAccountSizes(newType);
                      setAccountForm({ 
                        ...accountForm, 
                        accountType: newType,
                        accountSize: sizes[0] // Reset to first available size for the new type
                      });
                    }}
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                  >
                    <option value="standard">Shockwave Standard</option>
                    <option value="instant">Shockwave Instant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Account Size
                  </label>
                  <select
                    value={accountForm.accountSize}
                    onChange={(e) => setAccountForm({ ...accountForm, accountSize: parseInt(e.target.value) })}
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                  >
                    {getAccountSizes(accountForm.accountType).map((size) => (
                      <option key={size} value={size}>
                        ${size.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Platform
                  </label>
                  <select
                    value={accountForm.platform}
                    onChange={(e) => setAccountForm({ ...accountForm, platform: e.target.value as 'mt4' | 'mt5' })}
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                  >
                    <option value="mt4">MetaTrader 4</option>
                    <option value="mt5">MetaTrader 5</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Status
                  </label>
                  <select
                    value={accountForm.status}
                    onChange={(e) => setAccountForm({ ...accountForm, status: e.target.value as any })}
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="passed">Passed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Challenge Step
                  </label>
                  <select
                    value={accountForm.step}
                    onChange={(e) => setAccountForm({ ...accountForm, step: parseInt(e.target.value) as 1 | 2 })}
                    className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                  >
                    <option value={1}>Step 1</option>
                    <option value={2}>Step 2</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              {message.text && (
                <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${
                  message.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                }`}>
                  {message.type === 'error' ? (
                    <AlertCircle size={20} />
                  ) : message.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedUser(null);
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAccount}
                  disabled={saving || !accountForm.accountId || !accountForm.accountToken}
                  className="bg-[#0FF1CE] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#0D0D0D] border border-[#2F2F2F] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-[#2F2F2F]">
              <h2 className="text-xl font-semibold text-white">Add New MetaAPI Account</h2>
              <p className="text-sm text-gray-400 mt-1">Search for a user and configure their MetaAPI account</p>
            </div>
            
            <div className="p-6">
              {/* User Search */}
              {!searchedUser && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Search User by Email
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={searchUserEmail}
                      onChange={(e) => setSearchUserEmail(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && searchUserByEmail()}
                      placeholder="Enter user email address"
                      className="flex-1 bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                    />
                    <button
                      onClick={searchUserByEmail}
                      disabled={!searchUserEmail}
                      className="bg-[#0FF1CE] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Search size={20} />
                      Search
                    </button>
                  </div>
                </div>
              )}

              {/* User Found - Show Configuration Form */}
              {searchedUser && (
                <>
                  <div className="bg-[#151515] border border-[#2F2F2F] rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-400 mb-1">Configuring account for:</p>
                    <p className="text-white font-medium">{searchedUser.email}</p>
                    <p className="text-sm text-gray-400">
                      {searchedUser.displayName || `${searchedUser.firstName} ${searchedUser.lastName}`.trim() || 'No name'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        MetaAPI Account ID <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={accountForm.accountId}
                        onChange={(e) => setAccountForm({ ...accountForm, accountId: e.target.value })}
                        placeholder="e.g., 50e36bcb-f0c2-49d2-939f-4aea4ea8eb94"
                        className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        MetaAPI Token <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="password"
                          value={accountForm.accountToken}
                          onChange={(e) => setAccountForm({ ...accountForm, accountToken: e.target.value })}
                          placeholder="Enter MetaAPI token"
                          className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE]/50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Account Type
                      </label>
                      <select
                        value={accountForm.accountType}
                        onChange={(e) => {
                          const newType = e.target.value as 'standard' | 'instant';
                          const sizes = getAccountSizes(newType);
                          setAccountForm({ 
                            ...accountForm, 
                            accountType: newType,
                            accountSize: sizes[0] // Reset to first available size for the new type
                          });
                        }}
                        className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                      >
                        <option value="standard">Shockwave Standard</option>
                        <option value="instant">Shockwave Instant</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Account Size
                      </label>
                      <select
                        value={accountForm.accountSize}
                        onChange={(e) => setAccountForm({ ...accountForm, accountSize: parseInt(e.target.value) })}
                        className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                      >
                        {getAccountSizes(accountForm.accountType).map((size) => (
                          <option key={size} value={size}>
                            ${size.toLocaleString()}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Platform
                      </label>
                      <select
                        value={accountForm.platform}
                        onChange={(e) => setAccountForm({ ...accountForm, platform: e.target.value as 'mt4' | 'mt5' })}
                        className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                      >
                        <option value="mt4">MetaTrader 4</option>
                        <option value="mt5">MetaTrader 5</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Challenge Step
                      </label>
                      <select
                        value={accountForm.step}
                        onChange={(e) => setAccountForm({ ...accountForm, step: parseInt(e.target.value) as 1 | 2 })}
                        className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#0FF1CE]/50"
                      >
                        <option value={1}>Step 1</option>
                        <option value={2}>Step 2</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Messages */}
              {message.text && (
                <div className={`p-4 rounded-lg mb-4 flex items-center gap-3 ${
                  message.type === 'error'
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400'
                    : message.type === 'success'
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                }`}>
                  {message.type === 'error' ? (
                    <AlertCircle size={20} />
                  ) : message.type === 'success' ? (
                    <CheckCircle size={20} />
                  ) : (
                    <AlertCircle size={20} />
                  )}
                  {message.text}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setSearchedUser(null);
                    setSearchUserEmail('');
                    setMessage({ type: '', text: '' });
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                {searchedUser && (
                  <button
                    onClick={() => {
                      setSelectedUser(searchedUser);
                      handleSaveAccount();
                    }}
                    disabled={saving || !accountForm.accountId || !accountForm.accountToken}
                    className="bg-[#0FF1CE] text-black font-semibold px-6 py-3 rounded-lg hover:bg-[#0FF1CE]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    Create Account
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 