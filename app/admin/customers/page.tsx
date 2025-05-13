'use client';
import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Loader
} from 'lucide-react';
import { UserData, getAllUsers, updateUser, Timestamp } from '@/lib/firebase';

interface Customer extends Omit<UserData, 'lastOrderDate'> {
  id: string;
  joinDate: string; // Formatted date string
  lastOrderDate?: string; // Formatted date string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  // Fetch customers from Firebase
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const usersData = await getAllUsers();
        
        // Transform Firebase user data to Customer interface
        const transformedCustomers: Customer[] = usersData.map(user => ({
          id: user.uid,
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || 'Unknown',
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || 'N/A',
          country: user.country || 'Unknown',
          joinDate: user.createdAt.toDate().toISOString().split('T')[0], // Format as YYYY-MM-DD
          totalSpent: user.totalSpent || 0,
          orderCount: user.orderCount || 0,
          lastOrderDate: user.lastOrderDate ? user.lastOrderDate.toDate().toISOString().split('T')[0] : undefined,
          status: user.status || 'inactive',
          notes: user.notes || '',
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          lastLoginAt: user.lastLoginAt
        }));
        
        setCustomers(transformedCustomers);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, []);
  
  // Filter and sort customers
  const filteredCustomers = customers
    .filter(customer => 
      (statusFilter === 'all' || customer.status === statusFilter) &&
      (
        (customer.displayName && customer.displayName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.phone && customer.phone.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    )
    .sort((a, b) => {
      switch(sortBy) {
        case 'newest':
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
        case 'oldest':
          return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime();
        case 'highest-spend':
          return (b.totalSpent || 0) - (a.totalSpent || 0);
        case 'most-orders':
          return (b.orderCount || 0) - (a.orderCount || 0);
        case 'name-az':
          return (a.displayName || '').localeCompare(b.displayName || '');
        case 'name-za':
          return (b.displayName || '').localeCompare(a.displayName || '');
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

  const handleStatusChange = async (customerId: string, newStatus: 'active' | 'inactive') => {
    try {
      // Update in Firebase
      await updateUser(customerId, { status: newStatus });
      
      // Update local state
      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, status: newStatus } : customer
      ));
      
      // Update selected customer if it's the one being edited
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
    }
  };

  const handleUpdateNotes = async (customerId: string, notes: string) => {
    try {
      // Update in Firebase
      await updateUser(customerId, { notes });
      
      // Update local state
      setCustomers(customers.map(customer => 
        customer.id === customerId ? { ...customer, notes } : customer
      ));
      
      // Update selected customer if it's the one being edited
      if (selectedCustomer && selectedCustomer.id === customerId) {
        setSelectedCustomer({ ...selectedCustomer, notes });
      }
    } catch (error) {
      console.error('Error updating customer notes:', error);
    }
  };

  const handleExportCustomers = () => {
    // Define CSV headers
    const headers = [
      'ID',
      'Email',
      'Display Name',
      'First Name',
      'Last Name',
      'Phone',
      'Country',
      'Join Date',
      'Total Spent',
      'Order Count',
      'Last Order Date',
      'Status',
      'Notes'
    ].join(',');

    // Convert customers to CSV rows
    const rows = filteredCustomers.map(customer => [
      customer.id,
      customer.email,
      customer.displayName,
      customer.firstName || '',
      customer.lastName || '',
      customer.phone,
      customer.country,
      customer.joinDate,
      customer.totalSpent || 0,
      customer.orderCount || 0,
      customer.lastOrderDate || '',
      customer.status,
      // Escape notes to handle commas and quotes
      customer.notes ? `"${customer.notes.replace(/"/g, '""')}"` : ''
    ].join(','));

    // Combine headers and rows
    const csvContent = [headers, ...rows].join('\n');

    // Create blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set download attributes
    link.setAttribute('href', url);
    link.setAttribute('download', `shockwave-customers-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    // Append to document, click, and cleanup
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <button
          onClick={handleExportCustomers}
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
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader className="h-8 w-8 text-[#0FF1CE] animate-spin" />
              <span className="ml-4 text-gray-400">Loading customers...</span>
            </div>
          ) : (
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
                          <div className="font-medium">{customer.displayName}</div>
                        <div className="text-gray-400 text-sm">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-medium">{customer.orderCount || 0}</div>
                    <div className="text-gray-400 text-sm">orders</div>
                  </td>
                  <td className="px-6 py-4">
                      <div className="font-medium">${(customer.totalSpent || 0).toLocaleString()}</div>
                    <div className="text-gray-400 text-sm">total</div>
                  </td>
                  <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        customer.status === 'active' 
                          ? 'bg-green-500/20 text-green-500' 
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
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
                      <div className="font-medium">{customer.lastOrderDate ? new Date(customer.lastOrderDate).toLocaleDateString() : 'No orders'}</div>
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
          )}
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
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-[#0FF1CE]/20 flex items-center justify-center text-[#0FF1CE]">
                    <User size={32} />
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold text-white">{selectedCustomer.displayName}</h3>
                    <p className="text-gray-400">{selectedCustomer.email}</p>
                  </div>
                  
                  <div className="ml-auto">
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedCustomer.status}
                        onChange={(e) => handleStatusChange(selectedCustomer.id, e.target.value as 'active' | 'inactive')}
                        className={`appearance-none rounded-full px-3 py-1 text-xs font-medium ${
                          selectedCustomer.status === 'active' 
                            ? 'bg-green-500/20 text-green-500' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Phone</div>
                    <div className="text-white">{selectedCustomer.phone || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Country</div>
                    <div className="text-white">{selectedCustomer.country || 'Not provided'}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Join Date</div>
                    <div className="text-white">{new Date(selectedCustomer.joinDate).toLocaleDateString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Last Login</div>
                    <div className="text-white">{selectedCustomer.lastLoginAt ? selectedCustomer.lastLoginAt.toDate().toLocaleDateString() : 'Never'}</div>
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
                  <div className="text-2xl font-semibold text-white">${(selectedCustomer.totalSpent || 0).toLocaleString()}</div>
                </div>
                <div className="bg-[#151515] rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">Orders</div>
                  <div className="text-2xl font-semibold text-white">{selectedCustomer.orderCount || 0}</div>
                </div>
                <div className="bg-[#151515] rounded-xl p-5">
                  <div className="text-sm text-gray-400 mb-1">Avg. Order Value</div>
                  <div className="text-2xl font-semibold text-white">
                    ${selectedCustomer.orderCount && selectedCustomer.orderCount > 0 ? Math.round((selectedCustomer.totalSpent || 0) / selectedCustomer.orderCount).toLocaleString() : 0}
                  </div>
                </div>
              </div>
              
              {/* Notes Section */}
              <div className="bg-[#151515] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Notes</h3>
                <textarea
                  value={selectedCustomer.notes || ''}
                  onChange={(e) => {
                    // Update local state temporarily
                    setSelectedCustomer({
                      ...selectedCustomer,
                      notes: e.target.value
                    });
                  }}
                  onBlur={() => {
                    // Save to Firebase when focus is lost
                    if (selectedCustomer) {
                      handleUpdateNotes(selectedCustomer.id, selectedCustomer.notes || '');
                    }
                  }}
                  className="w-full bg-[#0D0D0D] border border-[#2F2F2F] rounded-lg p-3 text-white min-h-24 resize-none focus:outline-none focus:border-[#0FF1CE]/50"
                  placeholder="Add notes about this customer..."
                />
              </div>
              
              {/* Login Details */}
              <div className="bg-[#151515] rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Account Info</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">User ID</div>
                    <div className="text-white font-mono text-sm bg-[#0D0D0D] p-2 rounded overflow-x-auto">
                      {selectedCustomer.uid}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Created</div>
                    <div className="text-white">
                      {selectedCustomer.createdAt.toDate().toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Last Updated</div>
                    <div className="text-white">
                      {selectedCustomer.updatedAt.toDate().toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 