'use client';
import React, { useState } from 'react';
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
  RefreshCw
} from 'lucide-react';

// Mock data for demonstration
const orders = [
  { id: '#OSK1001', customer: 'John Doe', email: 'john@example.com', amount: 400, status: 'completed', date: '2023-05-27', type: 'Standard Challenge', accountSize: '$10,000' },
  { id: '#OSK1002', customer: 'Jane Smith', email: 'jane@example.com', amount: 1200, status: 'pending', date: '2023-05-27', type: 'Express Challenge', accountSize: '$25,000' },
  { id: '#OSK1003', customer: 'Mike Johnson', email: 'mike@example.com', amount: 2000, status: 'completed', date: '2023-05-26', type: 'Instant Funding', accountSize: '$50,000' },
  { id: '#OSK1004', customer: 'Sarah Williams', email: 'sarah@example.com', amount: 400, status: 'failed', date: '2023-05-26', type: 'Standard Challenge', accountSize: '$10,000' },
  { id: '#OSK1005', customer: 'Alex Brown', email: 'alex@example.com', amount: 4000, status: 'completed', date: '2023-05-23', type: 'Standard Challenge', accountSize: '$100,000' },
  { id: '#OSK1006', customer: 'Chris Davis', email: 'chris@example.com', amount: 800, status: 'pending', date: '2023-05-22', type: 'Express Challenge', accountSize: '$20,000' },
  { id: '#OSK1007', customer: 'Taylor Jones', email: 'taylor@example.com', amount: 1600, status: 'completed', date: '2023-05-21', type: 'Instant Funding', accountSize: '$25,000' },
  { id: '#OSK1008', customer: 'Morgan Lee', email: 'morgan@example.com', amount: 2400, status: 'completed', date: '2023-05-20', type: 'Standard Challenge', accountSize: '$50,000' },
  { id: '#OSK1009', customer: 'Jordan Bailey', email: 'jordan@example.com', amount: 400, status: 'failed', date: '2023-05-19', type: 'Standard Challenge', accountSize: '$10,000' },
  { id: '#OSK1010', customer: 'Casey Kim', email: 'casey@example.com', amount: 1200, status: 'completed', date: '2023-05-18', type: 'Express Challenge', accountSize: '$25,000' },
];

// Status styles
const statusStyles = {
  completed: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
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
  status: ['All', 'Completed', 'Pending', 'Failed'],
  type: ['All', 'Standard Challenge', 'Express Challenge', 'Instant Funding'],
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterType, setFilterType] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  // Apply filters and search
  const filteredOrders = orders.filter(order => {
    // Status filter
    if (filterStatus !== 'All' && order.status !== filterStatus.toLowerCase()) {
      return false;
    }
    
    // Type filter
    if (filterType !== 'All' && order.type !== filterType) {
      return false;
    }
    
    // Search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.email.toLowerCase().includes(searchLower) ||
        order.type.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  // Apply sorting
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch(sortBy) {
      case 'date_asc':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'date_desc':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'amount_asc':
        return a.amount - b.amount;
      case 'amount_desc':
        return b.amount - a.amount;
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

  const handleResendCredentials = (email: string) => {
    // In a real implementation, this would call an API
    alert(`Credentials will be resent to ${email}`);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <button className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors">
          <Download size={16} />
          <span>Export CSV</span>
        </button>
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
                const Status = statusStyles[order.status as keyof typeof statusStyles].icon;
                const isExpanded = expandedOrderId === order.id;
                
                return (
                  <React.Fragment key={order.id}>
                    <tr 
                      className={`hover:bg-white/5 transition-colors cursor-pointer ${isExpanded ? 'bg-[#0FF1CE]/5' : ''}`}
                      onClick={() => toggleOrderDetails(order.id)}
                    >
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.customer}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.type}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.accountSize}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">${order.amount}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.status as keyof typeof statusStyles].bg} ${statusStyles[order.status as keyof typeof statusStyles].color}`}>
                          <Status size={12} className="mr-1" />
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{new Date(order.date).toLocaleDateString()}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <button className="p-1 text-gray-400 hover:text-[#0FF1CE] transition-colors">
                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
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
                                  <span className="text-white">{order.customer}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Email:</span>
                                  <span className="text-white">{order.email}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div>
                              <h3 className="text-white font-medium mb-3">Order Details</h3>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Challenge Type:</span>
                                  <span className="text-white">{order.type}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Account Size:</span>
                                  <span className="text-white">{order.accountSize}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-400">Status:</span>
                                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status as keyof typeof statusStyles].bg} ${statusStyles[order.status as keyof typeof statusStyles].color}`}>
                                    <Status size={10} className="mr-1" />
                                    <span className="capitalize">{order.status}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-4 justify-end">
                            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#151515] text-white text-xs hover:bg-[#2F2F2F] transition-colors">
                              <Eye size={14} />
                              <span>View Details</span>
                            </button>
                            <button 
                              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0FF1CE] text-black text-xs hover:bg-[#0FF1CE]/90 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleResendCredentials(order.email);
                              }}
                            >
                              <Mail size={14} />
                              <span>Resend Credentials</span>
                            </button>
                            {order.status === 'failed' && (
                              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500 text-black text-xs hover:bg-yellow-600 transition-colors">
                                <RefreshCw size={14} />
                                <span>Retry Payment</span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-400">
            Showing <span className="text-white">{sortedOrders.length}</span> of <span className="text-white">{orders.length}</span> orders
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg bg-[#151515] text-white text-sm hover:bg-[#2F2F2F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <div className="flex items-center">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0FF1CE] text-black font-medium text-sm">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-[#151515] text-sm">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-white hover:bg-[#151515] text-sm">
                3
              </button>
            </div>
            <button className="px-3 py-1 rounded-lg bg-[#151515] text-white text-sm hover:bg-[#2F2F2F] transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 