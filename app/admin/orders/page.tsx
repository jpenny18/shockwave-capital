'use client';
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  RefreshCw,
  Loader2,
  Trash2,
  X
} from 'lucide-react';
import { collection, query, orderBy, getDocs, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';

interface Order {
  id: string;
  customerEmail: string;
  firstName: string;
  lastName: string;
  phone: string;
  country: string;
  discordUsername?: string;
  challengeType: string;
  challengeAmount: string;
  platform: string;
  totalAmount: number;
  paymentMethod: 'card' | 'crypto';
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  paymentIntentId?: string;
  transactionId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Status styles
const statusStyles = {
  completed: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: RefreshCw },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
  unknown: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle }, // Fallback style
};

// Sort options
const sortOptions = [
  { label: 'Newest first', value: 'date_desc' },
  { label: 'Oldest first', value: 'date_asc' },
  { label: 'Highest amount', value: 'amount_desc' },
  { label: 'Lowest amount', value: 'amount_asc' },
];

// Filter options
const filterOptions = {
  status: ['All', 'Completed', 'Processing', 'Pending', 'Failed'],
  type: ['All', 'Standard Challenge', 'Express Challenge', 'Instant Funding'],
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch orders from Firebase
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const ordersRef = collection(db, 'orders');
        const q = query(ordersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        
        setOrders(fetchedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Apply filters and search
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'All' && order.paymentStatus !== filterStatus.toLowerCase()) {
      return false;
    }
    
    // Type filter
    if (filterType !== 'All' && order.challengeType !== filterType) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.firstName.toLowerCase().includes(searchLower) ||
        order.lastName.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower) ||
        order.challengeType.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Apply sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch(sortBy) {
      case 'date_asc':
        return a.createdAt.seconds - b.createdAt.seconds;
      case 'date_desc':
        return b.createdAt.seconds - a.createdAt.seconds;
      case 'amount_asc':
        return a.totalAmount - b.totalAmount;
      case 'amount_desc':
        return b.totalAmount - a.totalAmount;
      default:
        return 0;
    }
  });

  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };

  const handleResendCredentials = async (email: string) => {
    // TODO: Implement resend credentials functionality
    alert(`Credentials will be resent to ${email}`);
  };

  const handleExportCSV = () => {
    // Convert orders to CSV format
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Type', 'Amount', 'Status', 'Payment Method'];
    const csvData = sortedOrders.map(order => [
      order.id,
      new Date(order.createdAt.seconds * 1000).toLocaleDateString(),
      `${order.firstName} ${order.lastName}`,
      order.customerEmail,
      order.challengeType,
      order.totalAmount,
      order.paymentStatus,
      order.paymentMethod
    ]);

    // Create CSV content
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `orders_${new Date().toISOString()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleSelectOrder = (orderId: string) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === sortedOrders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(sortedOrders.map(order => order.id)));
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    try {
      setIsDeleting(true);
      await deleteDoc(doc(db, 'orders', orderId));
      
      // Remove from local state
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      setSelectedOrders(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(orderId);
        return newSelected;
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Failed to delete order. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setOrderToDelete(null);
    }
  };

  const handleBulkDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete all selected orders
      await Promise.all(
        Array.from(selectedOrders).map(orderId => 
          deleteDoc(doc(db, 'orders', orderId))
        )
      );
      
      // Remove from local state
      setOrders(prevOrders => 
        prevOrders.filter(order => !selectedOrders.has(order.id))
      );
      setSelectedOrders(new Set());
    } catch (error) {
      console.error('Error deleting orders:', error);
      setError('Failed to delete orders. Please try again.');
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#0FF1CE] mx-auto mb-4" />
          <p className="text-gray-400">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 bg-[#0FF1CE]/10 text-[#0FF1CE] px-4 py-2 rounded-lg hover:bg-[#0FF1CE]/20 transition-colors"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <div className="flex items-center gap-4">
          {selectedOrders.size > 0 && (
            <button 
              onClick={() => {
                setOrderToDelete(null);
                setShowDeleteConfirm(true);
              }}
              className="flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
            >
              <Trash2 size={16} />
              <span>Delete Selected ({selectedOrders.size})</span>
            </button>
          )}
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors"
          >
            <Download size={16} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filters Row */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <input 
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
            >
              {filterOptions.status.map((status) => (
                <option key={status} value={status}>{status} Status</option>
              ))}
            </select>
          </div>
          
          {/* Type Filter */}
          <div className="w-full md:w-48">
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
            >
              {filterOptions.type.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div className="w-full md:w-48">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#0FF1CE]/50"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#2F2F2F]">
                <th className="py-3 px-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.size === sortedOrders.length && sortedOrders.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]"
                  />
                </th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Account Size</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F2F2F]">
              {sortedOrders.map((order) => {
                // Add type safety for payment status
                const status = order.paymentStatus && statusStyles[order.paymentStatus] ? order.paymentStatus : 'unknown';
                const Status = statusStyles[status].icon;
                const isExpanded = expandedOrderId === order.id;
                
                return (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors ${isExpanded ? 'bg-[#0FF1CE]/5' : ''}`}
                    >
                      <td className="py-4 px-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.has(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="rounded border-gray-600 text-[#0FF1CE] focus:ring-[#0FF1CE] focus:ring-offset-0 bg-[#1A1A1A]"
                        />
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{`${order.firstName} ${order.lastName}`}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.challengeType}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.challengeAmount}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">${order.totalAmount}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status].bg} ${statusStyles[status].color}`}>
                          <Status size={12} className="mr-1" />
                          <span className="capitalize">{order.paymentStatus || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(order.createdAt.seconds * 1000).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => toggleOrderDetails(order.id)}
                            className="p-1 text-gray-400 hover:text-[#0FF1CE] transition-colors"
                          >
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOrderToDelete(order.id);
                              setShowDeleteConfirm(true);
                            }}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* Expanded details row */}
                    {isExpanded && (
                      <tr className="bg-[#0FF1CE]/5">
                        <td colSpan={8} className="py-4 px-6 text-sm">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h3 className="text-white font-medium mb-3">Customer Details</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Name:</span>
                                  <span className="text-white">{`${order.firstName} ${order.lastName}`}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Email:</span>
                                  <span className="text-white">{order.customerEmail}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Phone:</span>
                                  <span className="text-white">{order.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Country:</span>
                                  <span className="text-white">{order.country}</span>
                                </div>
                                {order.discordUsername && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Discord:</span>
                                    <span className="text-white">{order.discordUsername}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-white font-medium mb-3">Order Details</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Challenge Type:</span>
                                  <span className="text-white">{order.challengeType}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Account Size:</span>
                                  <span className="text-white">{order.challengeAmount}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Platform:</span>
                                  <span className="text-white">{order.platform}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Payment Method:</span>
                                  <span className="text-white capitalize">{order.paymentMethod}</span>
                                </div>
                                {order.paymentIntentId && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Payment ID:</span>
                                    <span className="text-white font-mono text-xs">{order.paymentIntentId}</span>
                                  </div>
                                )}
                                {order.transactionId && (
                                  <div className="flex justify-between">
                                    <span className="text-gray-400">Transaction ID:</span>
                                    <span className="text-white font-mono text-xs">{order.transactionId}</span>
                                  </div>
                                )}
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Created:</span>
                                  <span className="text-white">
                                    {new Date(order.createdAt.seconds * 1000).toLocaleString()}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Last Updated:</span>
                                  <span className="text-white">
                                    {new Date(order.updatedAt.seconds * 1000).toLocaleString()}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-4 border-t border-[#2F2F2F]/50">
                                <button 
                                  onClick={() => handleResendCredentials(order.customerEmail)}
                                  className="w-full flex items-center justify-center gap-2 bg-[#0FF1CE]/10 hover:bg-[#0FF1CE]/20 text-[#0FF1CE] py-2 rounded-lg transition-colors"
                                >
                                  <Mail size={16} />
                                  <span>Resend Credentials</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>

          {sortedOrders.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <p className="text-gray-400">No orders found matching your filters.</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] rounded-xl border border-[#2F2F2F]/50 p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Confirm Delete</h3>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">
              {orderToDelete
                ? 'Are you sure you want to delete this order? This action cannot be undone.'
                : `Are you sure you want to delete ${selectedOrders.size} selected orders? This action cannot be undone.`}
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={() => orderToDelete ? handleDeleteOrder(orderToDelete) : handleBulkDelete()}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 