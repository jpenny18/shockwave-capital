'use client';
import React, { useState, useEffect } from 'react';
import { 
  BarChart2, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  ArrowUp, 
  ArrowDown,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { collection, query, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { formatDistanceToNow } from 'date-fns';

// Status styles
const statusStyles = {
  completed: { color: 'text-green-500', bg: 'bg-green-500/10', icon: CheckCircle },
  pending: { color: 'text-yellow-500', bg: 'bg-yellow-500/10', icon: Clock },
  processing: { color: 'text-blue-500', bg: 'bg-blue-500/10', icon: Loader2 },
  failed: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertCircle },
  unknown: { color: 'text-gray-500', bg: 'bg-gray-500/10', icon: AlertCircle }
};

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, change, changeType, isLoading }: { 
  title: string; 
  value: string; 
  icon: React.ElementType;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  isLoading?: boolean;
}) => (
  <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6 hover:border-[#0FF1CE]/30 transition-all">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        {isLoading ? (
          <div className="h-8 w-24 bg-white/10 animate-pulse rounded mt-1"></div>
        ) : (
          <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
        )}
        
        {change && !isLoading && (
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

interface Order {
  id: string;
  customerEmail: string;
  firstName: string;
  lastName: string;
  challengeType: string;
  challengeAmount: string;
  totalAmount: number;
  paymentStatus: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: Timestamp;
}

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  avgOrderValue: number;
  monthlyGrowth: {
    orders: number;
    revenue: number;
    customers: number;
    avgOrder: number;
  };
  challengeTypes: {
    [key: string]: number;
  };
}

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('7');
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    avgOrderValue: 0,
    monthlyGrowth: {
      orders: 0,
      revenue: 0,
      customers: 0,
      avgOrder: 0
    },
    challengeTypes: {}
  });

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get the date ranges for comparison
      const now = new Date();
      const timeRangeInDays = parseInt(timeRange);
      const currentPeriodStart = new Date(now.getTime() - (timeRangeInDays * 24 * 60 * 60 * 1000));
      const previousPeriodStart = new Date(currentPeriodStart.getTime() - (timeRangeInDays * 24 * 60 * 60 * 1000));
      
      // Fetch all orders for both periods
      const ordersRef = collection(db, 'orders');
      const currentPeriodQuery = query(
        ordersRef,
        orderBy('createdAt', 'desc')
      );
      
      const ordersSnapshot = await getDocs(currentPeriodQuery);
      const allOrders = ordersSnapshot.docs;
      
      // Separate orders into current and previous periods
      const currentPeriodOrders = allOrders.filter(doc => {
        const orderDate = doc.data().createdAt.toDate();
        return orderDate >= currentPeriodStart && orderDate <= now;
      });
      
      const previousPeriodOrders = allOrders.filter(doc => {
        const orderDate = doc.data().createdAt.toDate();
        return orderDate >= previousPeriodStart && orderDate < currentPeriodStart;
      });
      
      // Calculate current period stats
      const currentCustomers = new Set(currentPeriodOrders.map(doc => doc.data().customerEmail));
      const currentRevenue = currentPeriodOrders.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
      const currentAvgOrder = currentPeriodOrders.length > 0 ? currentRevenue / currentPeriodOrders.length : 0;
      
      // Calculate previous period stats
      const previousCustomers = new Set(previousPeriodOrders.map(doc => doc.data().customerEmail));
      const previousRevenue = previousPeriodOrders.reduce((sum, doc) => sum + (doc.data().totalAmount || 0), 0);
      const previousAvgOrder = previousPeriodOrders.length > 0 ? previousRevenue / previousPeriodOrders.length : 0;
      
      // Calculate growth percentages
      const calculateGrowth = (current: number, previous: number): number => {
        if (previous === 0) return current > 0 ? 100 : 0;
        return ((current - previous) / previous) * 100;
      };
      
      const monthlyGrowth = {
        orders: calculateGrowth(currentPeriodOrders.length, previousPeriodOrders.length),
        revenue: calculateGrowth(currentRevenue, previousRevenue),
        customers: calculateGrowth(currentCustomers.size, previousCustomers.size),
        avgOrder: calculateGrowth(currentAvgOrder, previousAvgOrder)
      };
      
      // Set recent orders (last 5)
      const recentOrdersQuery = query(ordersRef, orderBy('createdAt', 'desc'), limit(5));
      const recentOrdersSnapshot = await getDocs(recentOrdersQuery);
      const recentOrders = recentOrdersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Order[];
      setRecentOrders(recentOrders);
      
      // Calculate challenge type distribution
      const challengeTypes = currentPeriodOrders.reduce((acc: { [key: string]: number }, doc) => {
        const type = doc.data().challengeType;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
      }, {});
      
      // Update stats
      setStats({
        totalOrders: currentPeriodOrders.length,
        totalRevenue: currentRevenue,
        totalCustomers: currentCustomers.size,
        avgOrderValue: currentAvgOrder,
        monthlyGrowth,
        challengeTypes
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (timestamp: Timestamp) => {
    try {
      return formatDistanceToNow(timestamp.toDate(), { addSuffix: true });
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <select 
            className="bg-[#151515] border border-[#2F2F2F] rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[#0FF1CE]/50"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="365">Last 12 months</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Orders" 
          value={stats.totalOrders.toLocaleString()} 
          icon={ShoppingCart} 
          change={`${stats.monthlyGrowth.orders}%`}
          changeType="up"
          isLoading={isLoading}
        />
        <StatCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString()}`} 
          icon={DollarSign} 
          change={`${stats.monthlyGrowth.revenue}%`}
          changeType="up"
          isLoading={isLoading}
        />
        <StatCard 
          title="Customers" 
          value={stats.totalCustomers.toLocaleString()} 
          icon={Users} 
          change={`${stats.monthlyGrowth.customers}%`}
          changeType="up"
          isLoading={isLoading}
        />
        <StatCard 
          title="Avg. Order Value" 
          value={`$${stats.avgOrderValue.toFixed(2)}`} 
          icon={BarChart2} 
          change={`${Math.abs(stats.monthlyGrowth.avgOrder)}%`}
          changeType="down"
          isLoading={isLoading}
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
          
          {isLoading ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#0FF1CE] animate-spin" />
            </div>
          ) : (
            <>
              {/* Placeholder for pie chart */}
              <div className="h-64 flex items-center justify-center border border-dashed border-[#2F2F2F] rounded-lg mb-4">
                <p className="text-gray-500">Pie Chart will be implemented here</p>
              </div>
              
              <div className="space-y-2">
                {Object.entries(stats.challengeTypes).map(([type, count]) => {
                  const percentage = ((count / stats.totalOrders) * 100).toFixed(1);
                  return (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#0FF1CE] mr-2"></div>
                        <span className="text-sm text-gray-400">{type}</span>
                      </div>
                      <span className="text-sm text-white">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-[#0D0D0D]/80 backdrop-blur-sm rounded-xl border border-[#2F2F2F]/50 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <button 
            onClick={() => window.location.href = '/admin/orders'}
            className="text-[#0FF1CE] hover:underline text-sm"
          >
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 text-[#0FF1CE] animate-spin" />
            </div>
          ) : (
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
                  const Status = statusStyles[order.paymentStatus]?.icon || statusStyles.unknown.icon;
                  return (
                    <tr key={order.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-white">#{order.id.slice(0, 8)}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{`${order.firstName} ${order.lastName}`}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.challengeType}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{order.challengeAmount}</td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">${order.totalAmount}</td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[order.paymentStatus]?.bg || statusStyles.unknown.bg} ${statusStyles[order.paymentStatus]?.color || statusStyles.unknown.color}`}>
                          <Status size={12} className="mr-1" />
                          <span className="capitalize">{order.paymentStatus}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-300">{formatDate(order.createdAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
} 