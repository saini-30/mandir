import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  DollarSign, 
  Heart, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { analyticsAPI, donationsAPI } from '../../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    overview: {
      totalDonations: 0,
      totalAmount: 0,
      averageAmount: 0,
      pendingApprovals: 0,
      activeEvents: 0
    },
    recentDonations: [],
    dailyTrends: [],
    topEvents: []
  });
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await analyticsAPI.getOverview(period);
      setStats(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statCards = [
    {
      title: 'Total Donations',
      value: stats.overview.totalDonations || 0,
      icon: Heart,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Amount',
      value: formatAmount(stats.overview.totalAmount || 0),
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Pending Approvals',
      value: stats.overview.pendingApprovals || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      change: '-5%'
    },
    {
      title: 'Active Events',
      value: stats.overview.activeEvents || 0,
      icon: Calendar,
      color: 'bg-purple-500',
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of temple donations and activities</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
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
        {/* Recent Donations */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Donations</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.recentDonations.slice(0, 5).map((donation, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    donation.adminActions?.isApproved ? 'bg-green-100' : 'bg-yellow-100'
                  }`}>
                    {donation.adminActions?.isApproved ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{donation.donorName}</p>
                    <p className="text-sm text-gray-500">
                      {donation.eventId?.title || 'General Donation'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{formatAmount(donation.amount)}</p>
                  <p className="text-xs text-gray-500">{formatDate(donation.createdAt)}</p>
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
            <h2 className="text-xl font-bold text-gray-900">Top Events</h2>
            <button className="text-primary hover:text-primary/80 text-sm font-medium">
              Manage Events
            </button>
          </div>
          
          <div className="space-y-4">
            {stats.topEvents.slice(0, 5).map((event, index) => (
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
                  <p className="text-xs text-gray-500">Total raised</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
            <Heart className="w-6 h-6 text-primary" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Approve Donations</p>
              <p className="text-sm text-gray-500">{stats.overview.pendingApprovals} pending</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
            <Calendar className="w-6 h-6 text-green-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Create Event</p>
              <p className="text-sm text-gray-500">Add new fundraising event</p>
            </div>
          </button>
          
          <button className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-500">Detailed reports</p>
            </div>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;