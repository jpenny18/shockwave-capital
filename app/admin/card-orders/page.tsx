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
  Copy,
  CreditCard
} from 'lucide-react';

interface AccountConfig {
  type: string;
  amount: string;
  platform: string;
}

interface CardOrder {
  id: string;
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
  subscriptionTier: 'entry' | 'surge' | 'pulse';
  subscriptionPrice: number;
  subscriptionPlanId: string;
  accountsCount: number;
  accounts: AccountConfig[];
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerCountry: string;
  customerDiscordUsername?: string;
  paymentMethod: string;
  paymentStatus: string;
  receiptId?: string;
  planId?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CardOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [tierFilter, setTierFilter] = useState<'ALL' | 'entry' | 'surge' | 'pulse'>('ALL');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/card-orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'COMPLETED' | 'CANCELLED') => {
    try {
      const response = await fetch('/api/card-orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          paymentStatus: newStatus.toLowerCase(),
        })
      });

      if (!response.ok) throw new Error('Failed to update order');

      // Refresh orders after update
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order. Please try again.');
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/card-orders?orderId=${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete order');

      // Refresh orders after delete
      await fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const getStats = () => {
    const totalOrders = orders.length;
    const totalValue = orders.reduce((sum, order) => sum + order.subscriptionPrice, 0);
    const completedOrders = orders.filter(order => order.status === 'COMPLETED').length;
    const pendingOrders = orders.filter(order => order.status === 'PENDING').length;
    const monthlyRevenue = orders.filter(order => order.status === 'COMPLETED').reduce((sum, order) => sum + order.subscriptionPrice, 0);

    return {
      totalOrders,
      totalValue,
      completedOrders,
      pendingOrders,
      monthlyRevenue
    };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.receiptId && order.receiptId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesTier = tierFilter === 'ALL' || order.subscriptionTier === tierFilter;

    return matchesSearch && matchesStatus && matchesTier;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <CreditCard className="text-[#0FF1CE]" size={28} />
          Card Orders (Whop)
        </h1>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-[#0FF1CE] rounded-lg"
        >
          <RefreshCw size={16} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Total Orders</div>
          <div className="text-2xl font-bold text-white">{getStats().totalOrders}</div>
        </div>
        
        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Pending Orders</div>
          <div className="text-2xl font-bold text-yellow-400">{getStats().pendingOrders}</div>
        </div>

        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Completed Orders</div>
          <div className="text-2xl font-bold text-green-400">{getStats().completedOrders}</div>
        </div>

        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Monthly Revenue</div>
          <div className="text-2xl font-bold text-[#0FF1CE]">${getStats().monthlyRevenue}</div>
        </div>

        <div className="bg-[#151515] p-4 rounded-lg border border-[#2F2F2F]/50">
          <div className="text-gray-400 text-sm">Potential Revenue</div>
          <div className="text-2xl font-bold text-white">${getStats().totalValue}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by email, name, or receipt..."
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
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value as any)}
            className="pl-10 pr-8 py-2 bg-[#151515] border border-[#2F2F2F]/50 rounded-lg text-white appearance-none focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="ALL">All Tiers</option>
            <option value="entry">Entry</option>
            <option value="surge">Surge</option>
            <option value="pulse">Pulse</option>
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
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Subscription</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Price</th>
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
                      <div className="flex items-center gap-2">
                        <div>
                          <div className="text-sm font-medium text-white">{order.customerName}</div>
                          <div className="text-sm text-gray-400">{order.customerEmail}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.customerName);
                            }}
                            className="p-1 hover:bg-[#2F2F2F]/20 rounded transition-colors"
                            title="Copy name"
                          >
                            {copiedText === order.customerName ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-400" />
                            )}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.customerEmail);
                            }}
                            className="p-1 hover:bg-[#2F2F2F]/20 rounded transition-colors"
                            title="Copy email"
                          >
                            {copiedText === order.customerEmail ? (
                              <Check size={14} className="text-green-400" />
                            ) : (
                              <Copy size={14} className="text-gray-400" />
                            )}
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-white capitalize">{order.subscriptionTier}</div>
                      <div className="text-sm text-gray-400">{order.accountsCount} {order.accountsCount === 1 ? 'Account' : 'Accounts'}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-[#0FF1CE]">${order.subscriptionPrice}/mo</div>
                    </td>
                    <td className="px-4 py-4">
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
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleStatusChange(order.id, 'COMPLETED')}
                              className="p-1 text-green-400 hover:bg-green-400/10 rounded"
                              title="Mark as Completed"
                            >
                              <Check size={16} />
                            </button>
                            <button
                              onClick={() => handleStatusChange(order.id, 'CANCELLED')}
                              className="p-1 text-red-400 hover:bg-red-400/10 rounded"
                              title="Mark as Cancelled"
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                          {/* Subscription Details */}
                          <div>
                            <h3 className="text-[#0FF1CE] font-medium mb-2">Subscription Details</h3>
                            <div className="space-y-2 text-sm">
                              <div>
                                <div className="text-gray-400">Tier</div>
                                <div className="text-white capitalize">{order.subscriptionTier}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Monthly Price</div>
                                <div className="text-white">${order.subscriptionPrice}/mo</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Active Accounts</div>
                                <div className="text-white">{order.accountsCount}</div>
                              </div>
                              <div>
                                <div className="text-gray-400">Plan ID</div>
                                <div className="text-white text-xs font-mono">{order.subscriptionPlanId}</div>
                              </div>
                              {order.receiptId && (
                                <div>
                                  <div className="text-gray-400">Receipt ID</div>
                                  <div className="text-white text-xs font-mono">{order.receiptId}</div>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Account Configurations */}
                          <div>
                            <h3 className="text-[#0FF1CE] font-medium mb-2">Account Configurations</h3>
                            <div className="space-y-3">
                              {order.accounts.map((account, idx) => (
                                <div key={idx} className="bg-[#1A1A1A] p-3 rounded-lg">
                                  <div className="text-[#0FF1CE] font-semibold mb-2 text-sm">Account {idx + 1}</div>
                                  <div className="grid grid-cols-3 gap-2 text-xs">
                                    <div>
                                      <div className="text-gray-500">Type</div>
                                      <div className="text-white">{account.type}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500">Amount</div>
                                      <div className="text-white">{account.amount}</div>
                                    </div>
                                    <div>
                                      <div className="text-gray-500">Platform</div>
                                      <div className="text-white">{account.platform}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
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
