import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { analyticsAPI } from '../../services/api';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    overview: {},
    dailyTrends: [],
    topEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverview(period);
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateObj) => {
    if (!dateObj || !dateObj._id) return '';
    const { year, month, day } = dateObj._id;
    return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const statCards = [
    {
      title: 'Total Donations',
      value: analytics.overview.totalDonations || 0,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Amount',
      value: formatAmount(analytics.overview.totalAmount || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Average Donation',
      value: formatAmount(analytics.overview.averageAmount || 0),
      icon: TrendingUp,
      color: 'bg-purple-500',
      change: '+5%'
    },
    {
      title: 'Active Events',
      value: analytics.overview.activeEvents || 0,
      icon: Calendar,
      color: 'bg-orange-500',
      change: '+2%'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Detailed insights into donations and temple activities</p>
        </div>
        
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <span className="text-sm font-medium text-green-600">{stat.change}</span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Trends Chart */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Daily Donation Trends</h2>
            <Filter className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.dailyTrends.slice(0, 10).map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{formatDate(trend)}</p>
                  <p className="text-sm text-gray-500">{trend.count} donations</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatAmount(trend.amount)}</p>
                  <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-primary h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((trend.amount / Math.max(...analytics.dailyTrends.map(t => t.amount))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Events */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Top Performing Events</h2>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.topEvents.slice(0, 5).map((event, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.event?.title}</p>
                    <p className="text-sm text-gray-500">{event.donationCount} donations</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatAmount(event.totalAmount)}</p>
                  <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ 
                        width: `${Math.min((event.totalAmount / Math.max(...analytics.topEvents.map(e => e.totalAmount))) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Detailed Reports */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Donation Summary</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Metric</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Period</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Previous Period</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Change</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">Total Donations</td>
                <td className="py-3 px-4 font-medium">{analytics.overview.totalDonations || 0}</td>
                <td className="py-3 px-4 text-gray-600">-</td>
                <td className="py-3 px-4 text-green-600">+12%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">Total Amount</td>
                <td className="py-3 px-4 font-medium">{formatAmount(analytics.overview.totalAmount || 0)}</td>
                <td className="py-3 px-4 text-gray-600">-</td>
                <td className="py-3 px-4 text-green-600">+8%</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 text-gray-900">Average Donation</td>
                <td className="py-3 px-4 font-medium">{formatAmount(analytics.overview.averageAmount || 0)}</td>
                <td className="py-3 px-4 text-gray-600">-</td>
                <td className="py-3 px-4 text-green-600">+5%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 text-gray-900">Pending Approvals</td>
                <td className="py-3 px-4 font-medium">{analytics.overview.pendingApprovals || 0}</td>
                <td className="py-3 px-4 text-gray-600">-</td>
                <td className="py-3 px-4 text-yellow-600">-5%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;