import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from './loginForm';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isUserDropdownOpen && !event.target.closest('.user-dropdown')) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isUserDropdownOpen]);

  const handleLogin = () => {
    setIsLoginFormOpen(true);
  };

  const handleCloseLoginForm = () => {
    setIsLoginFormOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsUserDropdownOpen(false);
  };



  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed navbar height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavigation = (sectionId) => {
    if (sectionId === 'home') {
      // Scroll to top of page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Scroll to specific section
      scrollToSection(sectionId);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-lg lg:text-xl font-bold">KG</span>
              </div>
              <span className={`text-xl lg:text-2xl font-bold ${
                isScrolled ? 'text-slate-800' : 'text-white'
              }`}>
                KundliGen
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => handleNavigation('home')}
              className={`font-medium transition-colors duration-200 hover:text-indigo-600 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              Home
            </button>
            <button 
              onClick={() => handleNavigation('services-section')}
              className={`font-medium transition-colors duration-200 hover:text-indigo-600 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigation('reports-section')}
              className={`font-medium transition-colors duration-200 hover:text-indigo-600 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              Reports
            </button>
            <button 
              onClick={() => handleNavigation('about-section')}
              className={`font-medium transition-colors duration-200 hover:text-indigo-600 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              About
            </button>
            <button 
              onClick={() => handleNavigation('contact-section')}
              className={`font-medium transition-colors duration-200 hover:text-indigo-600 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              Contact
            </button>
          </div>

          {/* User Menu / Login Button */}
          <div className="hidden md:flex items-center">
            {user ? (
              <div className="relative user-dropdown">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center space-x-2 bg-white/10 backdrop-blur-md hover:bg-white/20 font-medium py-2 px-4 rounded-full transition-all duration-300 border border-white/20"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${
                    isScrolled ? 'text-slate-800' : 'text-white'
                  }`}>{user.name || 'User'}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 transition-colors duration-200 ${
                      isUserDropdownOpen ? 'rotate-180' : ''
                    } ${isScrolled ? 'text-slate-800' : 'text-white'}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                        </svg>
                        <span>Dashboard</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>Profile</span>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigate('/change-password');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                        <span>Change Password</span>
                      </div>
                    </button>
                    
                    <div className="border-t border-gray-100 pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          <span>Logout</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-md transition-colors duration-200 ${
                isScrolled ? 'text-slate-700' : 'text-white'
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md rounded-lg mt-2 shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button
                onClick={() => handleNavigation('home')}
                className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={() => handleNavigation('services-section')}
                className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                Services
              </button>
              <button
                onClick={() => handleNavigation('reports-section')}
                className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                Reports
              </button>
              <button
                onClick={() => handleNavigation('about-section')}
                className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                About
              </button>
              <button
                onClick={() => handleNavigation('contact-section')}
                className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
              >
                Contact
              </button>
              {user ? (
                <div className="pt-2 space-y-2">
                  <div className="px-3 py-2 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
                  >
                    Dashboard
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/profile');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
                  >
                    Profile
                  </button>
                  
                  <button
                    onClick={() => {
                      navigate('/change-password');
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-slate-700 font-medium hover:text-indigo-600 transition-colors duration-200"
                  >
                    Change Password
                  </button>
                  
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-red-600 font-medium hover:text-red-700 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => {
                      handleLogin();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-full transition-all duration-300"
                  >
                    Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {isLoginFormOpen && <LoginForm onClose={handleCloseLoginForm} />}
    </nav>
  );
};

export default Navbar; 