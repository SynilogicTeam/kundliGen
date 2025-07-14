import React, { useState, useEffect } from 'react';

const Footer = () => {
  const [config, setConfig] = useState({
    companyName: 'KundliGen',
    companyEmail: 'info@kundligen.com',
    companyPhone: '+91-9876543210',
    companyAddress: 'Mumbai, Maharashtra, India'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
        if (response.ok) {
          const configData = await response.json();
          setConfig(configData);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  if (loading) {
    return (
      <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-300 mx-auto"></div>
            <p className="text-slate-300 mt-2">Loading...</p>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="footer-content grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="footer-section">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white text-xl font-bold">KG</span>
              </div>
              <h3 className="text-xl font-bold">{config.companyName}</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Your trusted partner for authentic Vedic astrology insights and personalized predictions.
            </p>
          </div>
          
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Contact Info</h3>
            <div className="space-y-2 text-slate-300">
              <p className="flex items-center space-x-2">
                <span>📧</span>
                <span>{config.companyEmail}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📞</span>
                <span>{config.companyPhone}</span>
              </p>
              <p className="flex items-center space-x-2">
                <span>📍</span>
                <span>{config.companyAddress}</span>
              </p>
            </div>
          </div>
          
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => scrollToSection('services-section')}
                  className="text-slate-300 hover:text-indigo-300 transition-colors duration-200"
                >
                  Our Reports
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('about-section')}
                  className="text-slate-300 hover:text-indigo-300 transition-colors duration-200"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('contact-section')}
                  className="text-slate-300 hover:text-indigo-300 transition-colors duration-200"
                >
                  Contact
                </button>
              </li>
              <li>
                <a 
                  href="/admin/login"
                  className="text-slate-300 hover:text-indigo-300 transition-colors duration-200"
                >
                  Admin Login
                </a>
              </li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h3 className="text-lg font-semibold mb-4 text-indigo-300">Follow Us</h3>
            <p className="text-slate-300 mb-4">
              Stay connected for daily horoscopes and astrology tips
            </p>
            <div className="flex space-x-4 text-2xl">
              <span className="hover:scale-110 transition-transform duration-200 cursor-pointer">🌟</span>
              <span className="hover:scale-110 transition-transform duration-200 cursor-pointer">⭐</span>
              <span className="hover:scale-110 transition-transform duration-200 cursor-pointer">🔮</span>
              <span className="hover:scale-110 transition-transform duration-200 cursor-pointer">💫</span>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom border-t border-slate-700 mt-12 pt-8 text-center">
          <p className="text-slate-400">
            &copy; 2024 {config.companyName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 