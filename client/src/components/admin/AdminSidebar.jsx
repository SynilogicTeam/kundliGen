import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/admin');
  };

  const menuItems = [
    {
      title: 'Dashboard',
      icon: '📊',
      path: '/admin/dashboard',
      description: 'Overview and analytics'
    },
    {
      title: 'Orders',
      icon: '📦',
      path: '/admin/orders',
      description: 'Manage customer orders',
      badge: '23' // You can make this dynamic
    },
    {
      title: 'Customers',
      icon: '👥',
      path: '/admin/customers',
      description: 'Customer database'
    },
    {
      title: 'Reports',
      icon: '🔮',
      path: '/admin/reports',
      description: 'Astrology reports',
      badge: '156'
    },
    {
      title: 'Analytics',
      icon: '📈',
      path: '/admin/analytics',
      description: 'Sales and performance'
    },
    {
      title: 'Settings',
      icon: '⚙️',
      path: '/admin/config',
      description: 'System configuration'
    },
    {
      title: 'Profile',
      icon: '👤',
      path: '/admin/profile',
      description: 'Admin profile'
    }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const MenuItem = ({ item }) => (
    <Link
      to={item.path}
      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
        isActive(item.path)
          ? 'bg-indigo-100 text-indigo-700 border-r-2 border-indigo-600'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      } ${isCollapsed ? 'justify-center' : 'justify-start'}`}
    >
      <span className="text-lg mr-3 group-hover:scale-110 transition-transform">
        {item.icon}
      </span>
      {!isCollapsed && (
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span>{item.title}</span>
            {item.badge && (
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">{item.description}</p>
        </div>
      )}
    </Link>
  );

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-white shadow-lg border border-gray-200"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-lg border-r border-gray-200 z-30 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">Astrology Business</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:block p-1 rounded-md hover:bg-gray-100 text-gray-600"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isCollapsed ? "M13 5l7 7-7 7M5 5l7 7-7 7" : "M11 19l-7-7 7-7m8 14l-7-7 7-7"}
              />
            </svg>
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => (
            <MenuItem key={index} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!isCollapsed && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">A</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              isCollapsed ? 'justify-center' : 'justify-start'
            }`}
          >
            <span className="text-lg mr-3">��</span>
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Main content margin for desktop */}
      <div className={`transition-all duration-300 ${isCollapsed ? 'lg:ml-16' : 'lg:ml-64'}`}>
        {/* Mobile content margin */}
        <div className="lg:hidden h-16"></div>
      </div>
    </>
  );
};

export default AdminSidebar; 