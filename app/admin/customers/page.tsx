'use client';
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  ChevronDown, 
  ChevronUp,
  Mail,
  Phone,
  Globe,
  Edit,
  X, 
  User, 
  Download,
  Eye,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  joinDate: string;
  totalSpent: number;
  orderCount: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
  notes: string;
}

// Mock customer data
const mockCustomers = [
  {
    id: 1,
    name: 'Alex Thompson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    country: 'United States',
    joinDate: '2023-04-18',
    totalSpent: 2499,
    orderCount: 3,
    lastOrderDate: '2023-05-20',
    status: 'active',
    notes: 'Prefers to be contacted via email. Interested in larger account sizes.'
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    phone: '+1 (555) 987-6543',
    country: 'Canada',
    joinDate: '2023-02-05',
    totalSpent: 3599,
    orderCount: 4,
    lastOrderDate: '2023-05-15',
    status: 'active',
    notes: 'Looking to scale up to larger accounts after successful challenges.'
  },
  {
    id: 3,
    name: 'David Miller',
    email: 'david.m@example.com',
    phone: '+44 7700 900123',
    country: 'United Kingdom',
    joinDate: '2023-03-22',
    totalSpent: 1599,
    orderCount: 2,
    lastOrderDate: '2023-04-30',
    status: 'inactive',
    notes: 'Had issues with previous challenge. Follow up about potential retry.'
  },
  {
    id: 4,
    name: 'Maria Rodriguez',
    email: 'maria.r@example.com',
    phone: '+34 612 34 56 78',
    country: 'Spain',
    joinDate: '2023-05-01',
    totalSpent: 999,
    orderCount: 1,
    lastOrderDate: '2023-05-01',
    status: 'active',
    notes: 'New trader, might need extra support with platform questions.'
  },
  {
    id: 5,
    name: 'Jamal Wilson',
    email: 'jwilson@example.com',
    phone: '+1 (555) 234-5678',
    country: 'United States',
    joinDate: '2023-01-17',
    totalSpent: 5198,
    orderCount: 6,
    lastOrderDate: '2023-05-18',
    status: 'active',
    notes: 'Consistent trader, potential candidate for VIP program.'
  },
  {
    id: 6,
    name: 'Emma Johnson',
    email: 'emma.j@example.com',
    phone: '+61 4 1234 5678',
    country: 'Australia',
    joinDate: '2023-04-05',
    totalSpent: 999,
    orderCount: 1,
    lastOrderDate: '2023-04-05',
    status: 'inactive',
    notes: 'No activity since initial purchase. Consider reaching out with special offer.'
  },
  {
    id: 7,
    name: 'Hiroshi Tanaka',
    email: 'h.tanaka@example.com',
    phone: '+81 90-1234-5678',
    country: 'Japan',
    joinDate: '2023-03-14',
    totalSpent: 2598,
    orderCount: 3,
    lastOrderDate: '2023-05-10',
    status: 'active',
    notes: 'Prefers communication in Japanese when possible.'
  }
];

const statusStyles = {
  active: 'bg-green-500/20 text-green-500',
  inactive: 'bg-gray-500/20 text-gray-400',
};

export default function CustomersPage() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => 
      (statusFilter === 'all' || customer.status === statusFilter) &&
      (customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       customer.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'oldest':
          return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        case 'highest-spend':
          return b.totalSpent - a.totalSpent;
        case 'most-orders':
          return b.orderCount - a.orderCount;
        case 'name-az':
          return a.name.localeCompare(b.name);
        case 'name-za':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });
  
  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    // Small delay to make the transition smoother
    setTimeout(() => setSelectedCustomer(null), 200);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <button
          className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors"
        >
          <Download size={16} />
          <span>Export Customers</span>
        </button>
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#0FF1CE]/50"
          />
        </div>
        
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 pr-8 text-white focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>
        
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2.5 pr-8 text-white focus:outline-none focus:border-[#0FF1CE]/50"
          >
            <option value="newest">Newest Customers</option>
            <option value="oldest">Oldest Customers</option>
            <option value="highest-spend">Highest Spend</option>
            <option value="most-orders">Most Orders</option>
            <option value="name-az">Name A-Z</option>
            <option value="name-za">Name Z-A</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <ChevronDown size={16} />
          </div>
        </div>
      </div>

      {/* Customers List */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-400 text-sm border-b border-[#2F2F2F]">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spent</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr 
                  key={customer.id} 
                  className="border-b border-[#2F2F2F] last:border-b-0 text-white hover:bg-[#151515] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-gray-400 text-sm">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{customer.orderCount}</div>
                    <div className="text-gray-400 text-sm">orders</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">${customer.totalSpent.toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">total</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[customer.status as keyof typeof statusStyles]}`}>
                      {customer.status === 'active' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Active
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                          Inactive
                        </>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{new Date(customer.lastOrderDate).toLocaleDateString()}</div>
                    <div className="text-gray-400 text-sm">{customer.country}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(customer)}
                        className="p-1.5 rounded hover:bg-[#2F2F2F] transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} className="text-gray-400 hover:text-white" />
                      </button>
                      <button
                        className="p-1.5 rounded hover:bg-[#2F2F2F] transition-colors"
                        title="Send Email"
                      >
                        <Mail size={16} className="text-gray-400 hover:text-white" />
                      </button>
                      <div className="relative">
                        <button
                          className="p-1.5 rounded hover:bg-[#2F2F2F] transition-colors"
                          title="More Actions"
                        >
                          <MoreHorizontal size={16} className="text-gray-400 hover:text-white" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredCustomers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    <User className="mx-auto mb-2" size={24} />
                    <p>No customers found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 border-t border-[#2F2F2F] text-sm text-gray-400">
          Showing {filteredCustomers.length} of {customers.length} customers
        </div>
      </div>
      
      {/* Customer Details Slide-in Panel */}
      {selectedCustomer && (
        <div className={`fixed inset-0 bg-black/50 z-40 backdrop-blur-sm transition-opacity ${isDetailsOpen ? 'opacity-100' : 'opacity-0'}`}>
          <div 
            className={`absolute right-0 top-0 h-full bg-[#0D0D0D] border-l border-[#2F2F2F] w-full max-w-2xl transform transition-transform duration-300 ${isDetailsOpen ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <div className="flex items-center justify-between border-b border-[#2F2F2F] p-6">
              <h2 className="text-xl font-bold text-white">Customer Details</h2>
              <button 
                onClick={handleCloseDetails}
                className="p-1.5 rounded-lg hover:bg-[#151515] text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 h-[calc(100vh-73px)] overflow-y-auto">
              {/* Customer Info Card */}
              <div className="bg-[#151515] rounded-xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
                    <User size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{selectedCustomer.name}</h3>
                    <p className="text-gray-400">{selectedCustomer.email}</p>
                  </div>
                  
                  <div className="ml-auto">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[selectedCustomer.status as keyof typeof statusStyles]}`}>
                      {selectedCustomer.status === 'active' ? (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Active
                        </>
                      ) : (
                        <>
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
                          Inactive
                        </>
                      )}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <div className="text-white">{selectedCustomer.phone}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Country</div>
                    <div className="text-white">{selectedCustomer.country}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Join Date</div>
                    <div className="text-white">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Last Order</div>
                    <div className="text-white">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <button className="flex items-center gap-2 bg-[#0FF1CE] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#0FF1CE]/90 transition-colors">
                    <Mail size={16} />
                    <span>Send Email</span>
                  </button>
                  <button className="flex items-center gap-2 bg-[#151515] border border-[#2F2F2F] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2F2F2F] transition-colors">
                    <Edit size={16} />
                    <span>Edit Customer</span>
                  </button>
                </div>
              </div>
              
              {/* Customer Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-[#151515] rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">Total Spent</div>
                  <div className="text-2xl font-semibold text-white">${selectedCustomer.totalSpent.toLocaleString()}</div>
                </div>
                <div className="bg-[#151515] rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">Orders</div>
                  <div className="text-2xl font-semibold text-white">{selectedCustomer.orderCount}</div>
                </div>
                <div className="bg-[#151515] rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">Avg. Order Value</div>
                  <div className="text-2xl font-semibold text-white">
                    ${selectedCustomer.orderCount > 0 ? Math.round(selectedCustomer.totalSpent / selectedCustomer.orderCount).toLocaleString() : 0}
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="bg-[#151515] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                <div className="text-gray-300">
                  {selectedCustomer.notes}
                </div>
                <div className="mt-4">
                  <button className="text-[#0FF1CE] text-sm font-medium hover:underline">
                    + Add Note
                  </button>
                </div>
              </div>
              
              {/* Recent Orders */}
              <h3 className="text-lg font-semibold text-white mb-4">Recent Orders</h3>
              <div className="bg-[#151515] rounded-xl overflow-hidden mb-6">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-400 text-sm border-b border-[#2F2F2F]">
                      <th className="px-6 py-3 font-medium">Order ID</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock order data - in a real app, this would come from the customer's orders */}
                    <tr className="border-b border-[#2F2F2F] text-white">
                      <td className="px-6 py-3">
                        <div className="text-sm">#ORD-{selectedCustomer.id}001</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm">{new Date(selectedCustomer.lastOrderDate).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-3">
                        <div className="text-sm font-medium">${(selectedCustomer.totalSpent / selectedCustomer.orderCount).toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                          Completed
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <button className="text-[#0FF1CE] text-sm hover:underline font-medium flex items-center">
                          <ExternalLink size={14} className="mr-1" />
                          View
                        </button>
                      </td>
                    </tr>
                    
                    {selectedCustomer.orderCount > 1 && (
                      <tr className="text-white">
                        <td className="px-6 py-3">
                          <div className="text-sm">#ORD-{selectedCustomer.id}002</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</div>
                        </td>
                        <td className="px-6 py-3">
                          <div className="text-sm font-medium">${(selectedCustomer.totalSpent / selectedCustomer.orderCount).toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-500">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            Completed
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <button className="text-[#0FF1CE] text-sm hover:underline font-medium flex items-center">
                            <ExternalLink size={14} className="mr-1" />
                            View
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
                
                {selectedCustomer.orderCount > 2 && (
                  <div className="px-6 py-3 border-t border-[#2F2F2F]">
                    <button className="text-[#0FF1CE] text-sm font-medium hover:underline">
                      View all orders
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 