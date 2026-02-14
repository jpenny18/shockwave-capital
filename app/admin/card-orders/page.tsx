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
  CreditCard,
  CheckSquare,
  Square
} from 'lucide-react';

interface CardOrder {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  challengeType: string;
  challengeAmount: string;
  platform: string;
  addOns?: string[];
  totalAmount: number;
  customerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  discordUsername?: string;
  paymentMethod: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

type ChallengeTypeFilter = 'ALL' | 'Standard' | '1-Step' | 'Instant' | 'Gauntlet';

export default function CardOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<CardOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'pending' | 'completed' | 'cancelled'>('ALL');
  const [challengeTypeFilter, setChallengeTypeFilter] = useState<ChallengeTypeFilter>('ALL');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/card-orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching card orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: 'completed' | 'cancelled') => {
    try {
      const response = await fetch('/api/card-orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          paymentStatus: newStatus,
        }),
      });

      if (!response.ok) throw new Error('Failed to update order');
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const handleDelete = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      const response = await fetch(`/api/card-orders?orderId=${orderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete order');
      
      // Refresh orders
      await fetchOrders();
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedOrders.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedOrders.size} order(s)?`)) return;

    try {
      const deletePromises = Array.from(selectedOrders).map(orderId =>
        fetch(`/api/card-orders?orderId=${orderId}`, { method: 'DELETE' })
      );
      await Promise.all(deletePromises);
      setSelectedOrders(new Set());
      await fetchOrders();
    } catch (error) {
      console.error('Error bulk deleting orders:', error);
    }
  };

  const handleBulkStatusChange = async (newStatus: 'completed' | 'cancelled') => {
    if (selectedOrders.size === 0) return;
    if (!confirm(`Are you sure you want to mark ${selectedOrders.size} order(s) as ${newStatus}?`)) return;

    try {
      const updatePromises = Array.from(selectedOrders).map(orderId =>
        fetch('/api/card-orders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId, status: newStatus, paymentStatus: newStatus }),
        })
      );
      await Promise.all(updatePromises);
      setSelectedOrders(new Set());
      await fetchOrders();
    } catch (error) {
      console.error('Error bulk updating orders:', error);
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const toggleAllOrders = () => {
    if (selectedOrders.size === filteredOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
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

  const filteredOrders = orders
    .filter((order) => {
      const matchesSearch = 
        order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.challengeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
      const matchesChallengeType = challengeTypeFilter === 'ALL' || order.challengeType === challengeTypeFilter;
      
      return matchesSearch && matchesStatus && matchesChallengeType;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Most recent first

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { bg: 'bg-yellow-500/20', text: 'text-yellow-500', label: 'Pending' },
      completed: { bg: 'bg-green-500/20', text: 'text-green-500', label: 'Completed' },
      cancelled: { bg: 'bg-red-500/20', text: 'text-red-500', label: 'Cancelled' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    
    return (
      <span className={`${config.bg} ${config.text} px-3 py-1 rounded-full text-xs font-bold`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0FF1CE]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#0FF1CE] to-[#00D9FF] text-transparent bg-clip-text">
              Card Orders
            </h1>
            <p className="text-gray-400">Manage Whop checkout orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-[#0FF1CE]/10 border border-[#0FF1CE]/30 rounded-lg hover:bg-[#0FF1CE]/20 transition-all"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Challenge Type Tabs */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          {(['ALL', 'Standard', '1-Step', 'Instant', 'Gauntlet'] as ChallengeTypeFilter[]).map((type) => (
            <button
              key={type}
              onClick={() => setChallengeTypeFilter(type)}
              className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${
                challengeTypeFilter === type
                  ? 'bg-[#0FF1CE] text-black'
                  : 'bg-[#1A1A1A] text-gray-400 hover:bg-[#2F2F2F] border border-[#2F2F2F]'
              }`}
            >
              {type}
              {type !== 'ALL' && (
                <span className="ml-2 text-xs opacity-75">
                  ({orders.filter(o => o.challengeType === type).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Bulk Actions Bar */}
        {selectedOrders.size > 0 && (
          <div className="mb-6 bg-[#0FF1CE]/10 border border-[#0FF1CE]/30 rounded-lg p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={20} className="text-[#0FF1CE]" />
                <span className="text-white font-semibold">{selectedOrders.size} order(s) selected</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkStatusChange('completed')}
                  className="px-4 py-2 bg-green-500/20 text-green-500 rounded-lg hover:bg-green-500/30 transition-all flex items-center gap-2"
                >
                  <Check size={16} />
                  Mark Completed
                </button>
                <button
                  onClick={() => handleBulkStatusChange('cancelled')}
                  className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <X size={16} />
                  Mark Cancelled
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-4 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedOrders(new Set())}
                  className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 transition-all"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by email, name, ID, or challenge type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#0FF1CE] transition-colors"
            />
          </div>

          {/* Status Filter */}
          <div className="relative min-w-[200px]">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg text-white focus:outline-none focus:border-[#0FF1CE] transition-colors appearance-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Orders</div>
            <div className="text-2xl font-bold text-white">{orders.length}</div>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Pending</div>
            <div className="text-2xl font-bold text-yellow-500">
              {orders.filter(o => o.status === 'pending').length}
            </div>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Completed</div>
            <div className="text-2xl font-bold text-green-500">
              {orders.filter(o => o.status === 'completed').length}
            </div>
          </div>
          <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg p-4">
            <div className="text-gray-400 text-sm mb-1">Total Revenue</div>
            <div className="text-2xl font-bold text-[#0FF1CE]">
              ${orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#1A1A1A] border border-[#2F2F2F] rounded-lg overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
              <p>No card orders found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0D0D0D] border-b border-[#2F2F2F]">
                  <tr>
                    <th className="px-4 py-3 text-left" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={toggleAllOrders}
                        className="text-gray-400 hover:text-[#0FF1CE] transition-colors"
                      >
                        {selectedOrders.size === filteredOrders.length && filteredOrders.length > 0 ? (
                          <CheckSquare size={20} />
                        ) : (
                          <Square size={20} />
                        )}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Challenge
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2F2F2F]">
                  {filteredOrders.map((order) => (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-[#1F1F1F] transition-colors"
                      >
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => toggleOrderSelection(order.id)}
                            className="text-gray-400 hover:text-[#0FF1CE] transition-colors"
                          >
                            {selectedOrders.has(order.id) ? (
                              <CheckSquare size={20} className="text-[#0FF1CE]" />
                            ) : (
                              <Square size={20} />
                            )}
                          </button>
                        </td>
                        <td className="px-4 py-4 cursor-pointer" onClick={() => toggleRowExpansion(order.id)}>
                          <div className="flex items-center gap-2">
                            {expandedRows.has(order.id) ? (
                              <ChevronDown size={16} className="text-gray-400" />
                            ) : (
                              <ChevronRight size={16} className="text-gray-400" />
                            )}
                            <div>
                              <div className="text-sm font-mono text-gray-400">
                                {order.id.substring(0, 8)}...
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">
                              {order.firstName} {order.lastName}
                            </div>
                            <div className="text-xs text-gray-400">{order.customerEmail}</div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div>
                            <div className="text-sm font-medium text-white">{order.challengeType}</div>
                            <div className="text-xs text-gray-400">
                              {order.challengeAmount} • {order.platform}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm font-bold text-[#0FF1CE]">
                            ${order.totalAmount.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                          <div className="flex gap-2">
                            {order.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'completed')}
                                  className="p-2 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 transition-colors"
                                  title="Mark as Completed"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  onClick={() => handleStatusChange(order.id, 'cancelled')}
                                  className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                                  title="Cancel Order"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="p-2 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                              title="Delete Order"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      {expandedRows.has(order.id) && (
                        <tr className="bg-[#0D0D0D]">
                          <td colSpan={8} className="px-4 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <div className="text-gray-400 mb-2 font-semibold">Contact Information</div>
                                <div className="space-y-1">
                                  <div><span className="text-gray-500">Email:</span> <span className="text-white">{order.customerEmail}</span></div>
                                  <div><span className="text-gray-500">Phone:</span> <span className="text-white">{order.phone}</span></div>
                                  <div><span className="text-gray-500">Country:</span> <span className="text-white">{order.country}</span></div>
                                  {order.discordUsername && (
                                    <div><span className="text-gray-500">Discord:</span> <span className="text-white">{order.discordUsername}</span></div>
                                  )}
                                </div>
                              </div>
                              <div>
                                <div className="text-gray-400 mb-2 font-semibold">Order Details</div>
                                <div className="space-y-1">
                                  <div><span className="text-gray-500">Payment Method:</span> <span className="text-white">Card</span></div>
                                  <div><span className="text-gray-500">Payment Status:</span> <span className="text-white">{order.paymentStatus}</span></div>
                                  {order.addOns && order.addOns.length > 0 && (
                                    <div><span className="text-gray-500">Add-ons:</span> <span className="text-white">{order.addOns.join(', ')}</span></div>
                                  )}
                                  <div><span className="text-gray-500">Created:</span> <span className="text-white">{new Date(order.createdAt).toLocaleString()}</span></div>
                                  <div><span className="text-gray-500">Updated:</span> <span className="text-white">{new Date(order.updatedAt).toLocaleString()}</span></div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
