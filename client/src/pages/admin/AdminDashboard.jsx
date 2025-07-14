import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/admin');
        return;
      }

      // Mock data for demonstration
      const mockData = {
        totalOrders: 156,
        pendingOrders: 23,
        completedOrders: 133,
        totalRevenue: 125000,
        recentOrders: [
          {
            _id: '1',
            name: 'Rahul Sharma',
            email: 'rahul@example.com',
            reportType: 'Birth Chart',
            amount: 2500,
            paymentStatus: 'paid',
            deliveryStatus: 'delivered',
            createdAt: new Date('2024-01-15')
          },
          {
            _id: '2',
            name: 'Priya Patel',
            email: 'priya@example.com',
            reportType: 'Marriage Compatibility',
            amount: 3500,
            paymentStatus: 'paid',
            deliveryStatus: 'processing',
            createdAt: new Date('2024-01-14')
          },
          {
            _id: '3',
            name: 'Amit Kumar',
            email: 'amit@example.com',
            reportType: 'Career Guidance',
            amount: 2000,
            paymentStatus: 'pending',
            deliveryStatus: 'pending',
            createdAt: new Date('2024-01-13')
          },
          {
            _id: '4',
            name: 'Neha Singh',
            email: 'neha@example.com',
            reportType: 'Health Analysis',
            amount: 1800,
            paymentStatus: 'paid',
            deliveryStatus: 'delivered',
            createdAt: new Date('2024-01-12')
          },
          {
            _id: '5',
            name: 'Vikram Malhotra',
            email: 'vikram@example.com',
            reportType: 'Business Horoscope',
            amount: 4000,
            paymentStatus: 'paid',
            deliveryStatus: 'processing',
            createdAt: new Date('2024-01-11')
          }
        ]
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      setDashboardData(mockData);
    } catch (error) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, description, trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 text-6xl opacity-5 transform translate-x-4 -translate-y-4">
        {icon}
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-lg text-white text-xl`} style={{ backgroundColor: color }}>
            {icon}
          </div>
          {trend && (
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
          {title}
        </h3>
        
        <p className="text-3xl font-bold mb-2" style={{ color: color }}>
          {value}
        </p>
        
        {description && (
          <p className="text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const stats = [
    {
      title: 'Total Orders',
      value: dashboardData?.totalOrders || 0,
      icon: '📦',
      color: '#667eea',
      description: 'All time orders',
      trend: 12
    },
    {
      title: 'Pending Orders',
      value: dashboardData?.pendingOrders || 0,
      icon: '⏳',
      color: '#f59e0b',
      description: 'Awaiting processing',
      trend: -5
    },
    {
      title: 'Completed Orders',
      value: dashboardData?.completedOrders || 0,
      icon: '✅',
      color: '#10b981',
      description: 'Successfully delivered',
      trend: 18
    },
    {
      title: 'Total Revenue',
      value: `₹${(dashboardData?.totalRevenue || 0).toLocaleString()}`,
      icon: '💰',
      color: '#06b6d4',
      description: 'All time earnings',
      trend: 25
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      delivered: 'bg-green-100 text-green-800',
      processing: 'bg-blue-100 text-blue-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusConfig[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl font-bold mb-3">
            Welcome back! 👋
          </h1>
          <p className="text-xl opacity-90 mb-6 max-w-2xl">
            Here's an overview of your astrology business performance. Monitor your orders, revenue, and customer satisfaction all in one place.
          </p>
          
          <div className="flex gap-4 flex-wrap">
            <button 
              onClick={() => navigate('/admin/orders')}
              className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all"
            >
              📋 View Orders
            </button>
            <button 
              onClick={() => navigate('/admin/reports')}
              className="bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 text-white px-6 py-3 rounded-lg hover:bg-opacity-30 transition-all"
            >
              🔮 Manage Reports
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={stat.title} style={{ animationDelay: `${index * 0.1}s` }}>
            <StatCard {...stat} />
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Recent Orders</h2>
            <p className="text-gray-600">
              Latest customer orders and their status
            </p>
          </div>
          <button 
            onClick={() => navigate('/admin/orders')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View All Orders
          </button>
        </div>

        {dashboardData?.recentOrders?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Delivery Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dashboardData.recentOrders.slice(0, 5).map((order, index) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{order.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {order.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-gray-100 text-gray-800 px-2 py-1 text-xs font-medium rounded-md">
                        {order.reportType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-indigo-600">
                      ₹{order.amount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.deliveryStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 text-sm">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h3>
            <p className="text-gray-600">Orders will appear here once customers start purchasing reports.</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Analytics</h3>
          <p className="text-gray-600 mb-4">
            View detailed sales and performance analytics
          </p>
          <button 
            onClick={() => navigate('/admin/analytics')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Analytics
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Customers</h3>
          <p className="text-gray-600 mb-4">
            Manage your customer database and relationships
          </p>
          <button 
            onClick={() => navigate('/admin/customers')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            View Customers
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
          <div className="text-5xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Settings</h3>
          <p className="text-gray-600 mb-4">
            Configure your system settings and preferences
          </p>
          <button 
            onClick={() => navigate('/admin/config')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Manage Settings
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard; 