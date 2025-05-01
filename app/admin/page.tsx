'use client';
import React from 'react';
import { 
  BarChart2, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

// Mock data for demonstration
const recentOrders = [
  { id: '#OSK1001', customer: 'John Doe', amount: 400, status: 'completed', date: 'Today, 13:45', type: 'Standard Challenge', accountSize: '$10,000' },
  { id: '#OSK1002', customer: 'Jane Smith', amount: 1200, status: 'pending', date: 'Today, 12:30', type: 'Express Challenge', accountSize: '$25,000' },
  { id: '#OSK1003', customer: 'Mike Johnson', amount: 2000, status: 'completed', date: 'Yesterday, 18:20', type: 'Instant Funding', accountSize: '$50,000' },
  { id: '#OSK1004', customer: 'Sarah Williams', amount: 400, status: 'failed', date: 'Yesterday, 14:15', type: 'Standard Challenge', accountSize: '$10,000' },
  { id: '#OSK1005', customer: 'Alex Brown', amount: 4000, status: 'completed', date: '23 May, 09:45', type: 'Standard Challenge', accountSize: '$100,000' },
];

// Status styles
const statusStyles = {
  completed: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, change, changeType }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
}) => (
  <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6 hover:border-[#0FF1CE]/30 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        
        {change && (
          <div className={`flex items-center mt-2 text-xs font-medium ${
            changeType === 'up' ? 'text-green-500' : 
            changeType === 'down' ? 'text-red-500' : 'text-gray-400'
          }`}>
            {changeType === 'up' ? (
              <ArrowUp size={12} className="mr-1" />
            ) : changeType === 'down' ? (
              <ArrowDown size={12} className="mr-1" />
            ) : null}
            <span>{change} from last month</span>
          </div>
        )}
      </div>
      
      <div className="p-3 rounded-lg bg-[#0FF1CE]/10 text-[#0FF1CE]">
        <Icon size={20} />
      </div>
    </div>
  </div>
);

export default function AdminDashboard() {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select className="bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#0FF1CE]/50">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 3 months</option>
            <option>Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Orders" 
          value="1,258" 
          icon={ShoppingCart} 
          change="12.5%"
          changeType="up"
        />
        <StatCard 
          title="Total Revenue" 
          value="$48,590" 
          icon={DollarSign} 
          change="8.2%"
          changeType="up"
        />
        <StatCard 
          title="Customers" 
          value="953" 
          icon={Users} 
          change="5.1%"
          changeType="up"
        />
        <StatCard 
          title="Avg. Order Value" 
          value="$38.65" 
          icon={BarChart2} 
          change="2.3%"
          changeType="down"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Revenue Overview</h2>
            <select className="bg-[#151515] border border-[#2F2F2F] rounded-lg px-3 py-1 text-white text-xs focus:outline-none focus:border-[#0FF1CE]/50">
              <option>Daily</option>
              <option>Weekly</option>
              <option>Monthly</option>
            </select>
          </div>
          
          {/* Placeholder for chart */}
          <div className="h-64 flex items-center justify-center border border-dashed border-[#2F2F2F] rounded-lg">
            <p className="text-gray-500">Revenue Chart will be implemented here</p>
          </div>
        </div>
        
        {/* Challenge Types Breakdown */}
        <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Challenge Types</h2>
          </div>
          
          {/* Placeholder for pie chart */}
          <div className="h-64 flex items-center justify-center border border-dashed border-[#2F2F2F] rounded-lg mb-4">
            <p className="text-gray-500">Pie Chart will be implemented here</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-[#0FF1CE] mr-2"></div>
                <span className="text-sm text-gray-400">Standard Challenge</span>
              </div>
              <span className="text-sm text-white">58%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                <span className="text-sm text-gray-400">Express Challenge</span>
              </div>
              <span className="text-sm text-white">27%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                <span className="text-sm text-gray-400">Instant Funding</span>
              </div>
              <span className="text-sm text-white">15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <button className="text-[#0FF1CE] hover:underline text-sm">View All</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#2F2F2F]">
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Account Size</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2F2F2F]">
              {recentOrders.map((order) => {
                const Status = statusStyles[order.status as keyof typeof statusStyles].icon;
                return (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors">
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
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.date}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 