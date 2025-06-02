'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Check, 
  X, 
  Trash2, 
  Clock, 
  RefreshCw,
  Search,
  ChevronDown,
  Filter,
  ChevronRight,
  ChevronUp,
  Copy
} from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';

interface CryptoOrder {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  challengeStatus?: 'IN_PROGRESS' | 'FAILED' | 'PASSED';
  cryptoType: string;
  cryptoAmount: string;
  cryptoAddress: string;
  usdAmount: number;
  verificationPhrase: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  discountCode?: string;
  discountId?: string;
  originalAmount?: number;
  createdAt: string;
  updatedAt: string;
}

export default function CryptoOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CryptoOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [cryptoFilter, setCryptoFilter] = useState<'ALL' | 'BTC' | 'ETH' | 'USDT'>('ALL');
  const [challengeStatusFilter, setChallengeStatusFilter] = useState<'ALL' | 'IN_PROGRESS' | 'FAILED' | 'PASSED'>('ALL');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  useEffect(() => {
    // Subscribe to crypto orders collection
    const q = query(collection(db, 'crypto-orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: CryptoOrder[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as CryptoOrder);
      });
      setOrders(ordersData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      const orderRef = doc(db, 'crypto-orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date().toISOString()
      });

      // If order is marked as completed, send success email
      if (newStatus === 'COMPLETED') {
        const order = orders.find(o => o.id === orderId);
        if (order) {
          try {
            const response = await fetch('/api/send-crypto-emails', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...order,
                id: orderId,
                status: newStatus
              }),
            });

            if (!response.ok) {
              throw new Error('Failed to send emails');
            }
          } catch (error) {
            console.error('Error sending emails:', error);
          }
        }
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteDoc(doc(db, 'crypto-orders', orderId));
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const toggleRowExpansion = (orderId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(orderId)) {
      newExpandedRows.delete(orderId);
    } else {
      newExpandedRows.add(orderId);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.usdAmount, 0);
    const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
    const passedChallenges = orders.filter(order => order.challengeStatus === 'PASSED').length;
    const failedChallenges = orders.filter(order => order.challengeStatus === 'FAILED').length;
    const inProgressChallenges = orders.filter(order => order.challengeStatus === 'IN_PROGRESS').length;

    return {
      totalOrders,
      totalValue,
      completedOrders,
      passedChallenges,
      failedChallenges,
      inProgressChallenges
    };
  };

  const handleChallengeStatusChange = async (orderId: string, newStatus: 'IN_PROGRESS' | 'FAILED' | 'PASSED') => {
    try {
      const orderRef = doc(db, 'crypto-orders', orderId);
      await updateDoc(orderRef, { 
        challengeStatus: newStatus,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating challenge status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.verificationPhrase.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cryptoAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesCrypto = cryptoFilter === 'ALL' || order.cryptoType === cryptoFilter;
    const matchesChallengeStatus = challengeStatusFilter === 'ALL' || order.challengeStatus === challengeStatusFilter;

    return matchesSearch && matchesStatus && matchesCrypto && matchesChallengeStatus;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Crypto Orders</h1>
        <button
          onClick={() => setLoading(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-[#0FF1CE] rounded-lg"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Total Orders</div>
          <div className="text-2xl font-bold text-white">{getStats().totalOrders}</div>
        </div>
        
        {/* Total Value */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Total Value</div>
          <div className="text-2xl font-bold text-[#0FF1CE]">${getStats().totalValue.toFixed(2)}</div>
        </div>

        {/* Completed Orders */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Completed Orders</div>
          <div className="text-2xl font-bold text-white">{getStats().completedOrders}</div>
        </div>

        {/* Passed Challenges */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Passed Challenges</div>
          <div className="text-2xl font-bold text-green-400">{getStats().passedChallenges}</div>
        </div>

        {/* Failed Challenges */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Failed Challenges</div>
          <div className="text-2xl font-bold text-red-400">{getStats().failedChallenges}</div>
        </div>

        {/* In Progress Challenges */}
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">In Progress</div>
          <div className="text-2xl font-bold text-yellow-400">{getStats().inProgressChallenges}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by email, name, phrase, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#0FF1CE]/50"
            />
          </div>
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={cryptoFilter}
            onChange={(e) => setCryptoFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="ALL">All Crypto</option>
            <option value="BTC">Bitcoin</option>
            <option value="ETH">Ethereum</option>
            <option value="USDT">USDT</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>

        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <select
            value={challengeStatusFilter}
            onChange={(e) => setChallengeStatusFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="ALL">All Challenge Status</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="FAILED">Failed</option>
            <option value="PASSED">Passed</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#2F2F2F]/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400"></th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Challenge</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="animate-spin" size={16} />
                    <span>Loading orders...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <>
                  <tr key={order.id} className="border-b border-[#2F2F2F]/50 hover:bg-[#151515]">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleRowExpansion(order.id)}
                        className="p-1 hover:bg-[#2F2F2F]/20 rounded"
                      >
                        {expandedRows.has(order.id) ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronRight size={16} className="text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm">
                      <div className="text-white">{new Date(order.createdAt).toLocaleDateString()}</div>
                      <div className="text-gray-400 text-xs">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">{order.customerName}</div>
                      <div className="text-sm text-gray-400">{order.customerEmail}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">{order.challengeType}</div>
                      <div className="text-sm text-gray-400">{order.challengeAmount}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white">${order.usdAmount.toFixed(2)}</div>
                      <div className="text-sm text-gray-400">
                        {order.cryptoAmount} {order.cryptoType}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          order.status === 'COMPLETED' ? 'bg-green-400/10 text-green-400' :
                          order.status === 'CANCELLED' ? 'bg-red-400/10 text-red-400' :
                          'bg-yellow-400/10 text-yellow-400'
                        }`}>
                          {order.status === 'COMPLETED' && <Check size={12} className="mr-1" />}
                          {order.status === 'CANCELLED' && <X size={12} className="mr-1" />}
                          {order.status === 'PENDING' && <Clock size={12} className="mr-1" />}
                          {order.status}
                        </span>
                        
                        {/* Challenge Status Badge */}
                        {order.challengeStatus && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.challengeStatus === 'PASSED' ? 'bg-green-400/10 text-green-400' :
                            order.challengeStatus === 'FAILED' ? 'bg-red-400/10 text-red-400' :
                            'bg-yellow-400/10 text-yellow-400'
                          }`}>
                            {order.challengeStatus === 'PASSED' && <Check size={12} className="mr-1" />}
                            {order.challengeStatus === 'FAILED' && <X size={12} className="mr-1" />}
                            {order.challengeStatus === 'IN_PROGRESS' && <Clock size={12} className="mr-1" />}
                            {order.challengeStatus.replace('_', ' ')}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {/* Challenge Status Controls */}
                        <div className="flex items-center gap-1 border-r border-[#2F2F2F]/50 pr-2 mr-2">
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'IN_PROGRESS')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'IN_PROGRESS' 
                                ? 'bg-yellow-400/20 text-yellow-400' 
                                : 'text-gray-400 hover:bg-[#2F2F2F]/20'
                            }`}
                            title="Mark Challenge as In Progress"
                          >
                            <Clock size={16} />
                          </button>
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'FAILED')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'FAILED' 
                                ? 'bg-red-400/20 text-red-400' 
                                : 'text-gray-400 hover:bg-[#2F2F2F]/20'
                            }`}
                            title="Mark Challenge as Failed"
                          >
                            <X size={16} />
                          </button>
                          <button
                            onClick={() => handleChallengeStatusChange(order.id, 'PASSED')}
                            className={`p-1.5 rounded transition-colors ${
                              order.challengeStatus === 'PASSED' 
                                ? 'bg-green-400/20 text-green-400' 
                                : 'text-gray-400 hover:bg-[#2F2F2F]/20'
                            }`}
                            title="Mark Challenge as Passed"
                          >
                            <Check size={16} />
                          </button>
                        </div>

                        {/* Original Order Status Controls */}
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                              className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                              title="Mark Order as Completed"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                              title="Mark Order as Cancelled"
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleDelete(order.id)}
                          className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(order.id) && (
                    <tr className="bg-[#151515]/50">
                      <td colSpan={7} className="px-8 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {/* Customer Details */}
                          <div>
                            <h3 className="text-[#0FF1CE] font-medium mb-2">Customer Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Full Name</div>
                                <div className="text-white">{order.customerName}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Email</div>
                                <div className="text-white">{order.customerEmail}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Phone</div>
                                <div className="text-white">{order.customerPhone}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Country</div>
                                <div className="text-white">{order.customerCountry}</div>
                              </div>
                              {order.customerDiscordUsername && (
                                <div>
                                  <div className="text-gray-400">Discord</div>
                                  <div className="text-white">{order.customerDiscordUsername}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Challenge Details */}
                          <div>
                            <h3 className="text-[#0FF1CE] font-medium mb-2">Challenge Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Type</div>
                                <div className="text-white">{order.challengeType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Amount</div>
                                <div className="text-white">{order.challengeAmount}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Platform</div>
                                <div className="text-white">{order.platform}</div>
                              </div>
                              {order.discountCode && (
                                <div>
                                  <div className="text-gray-400">Discount Applied</div>
                                  <div className="text-white">{order.discountCode}</div>
                                </div>
                              )}
                              {order.originalAmount && (
                                <div>
                                  <div className="text-gray-400">Original Price</div>
                                  <div className="text-white">${order.originalAmount.toFixed(2)}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h3 className="text-[#0FF1CE] font-medium mb-2">Payment Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Crypto Type</div>
                                <div className="text-white">{order.cryptoType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Crypto Amount</div>
                                <div className="text-white">{order.cryptoAmount} {order.cryptoType}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">USD Amount</div>
                                <div className="text-white">${order.usdAmount.toFixed(2)}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Wallet Address</div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs truncate text-white">{order.cryptoAddress}</span>
                                  <button
                                    onClick={() => handleCopyAddress(order.cryptoAddress)}
                                    className="p-1 hover:bg-[#2F2F2F]/20 rounded"
                                  >
                                    {copiedAddress === order.cryptoAddress ? (
                                      <Check size={14} className="text-green-400" />
                                    ) : (
                                      <Copy size={14} className="text-gray-400" />
                                    )}
                                  </button>
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400">Verification Phrase</div>
                                <div className="font-mono text-xs text-white">{order.verificationPhrase}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 