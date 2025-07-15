import React, { useState, useEffect, useRef } from 'react';
import ReportsForm from './reportsForm';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReportsForm, setShowReportsForm] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const reportsScrollRef = useRef(null);

  // Function to get appropriate icon for each report type
  const getReportIcon = (type, index) => {
    const icons = {
      life: '🌟',
      career: '💼',
      love: '💕',
      health: '🌿',
      marriage: '💒',
      education: '📚'
    };
    return icons[type] || ['🔮', '✨', '🌙', '⭐', '🌞', '🔯'][index % 6];
  };

  // Fetch active reports from API
  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/reports/active');
        const result = await response.json();

        if (result.success && result.data) {
          setReports(result.data);
          setError(null);
        } else {
          setReports([]);
          setError('No active reports found');
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
        setReports([]);
        setError('Failed to load reports. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  // Handler for report selection
  const handleGetReport = (report) => {
    console.log('Selected report:', report);
    setSelectedReport(report);
    setShowReportsForm(true);
  };

  const handleCloseForm = () => {
    setShowReportsForm(false);
    setSelectedReport(null);
  };

  const handleFormSuccess = (formData) => {
    console.log('Form submitted with data:', formData);
    console.log('For report:', selectedReport);
    // Here you can handle the form submission
    // e.g., navigate to payment page, create order, etc.
    handleCloseForm();
  };

  return (
    <>
      {/* Removed min-h-screen and changed background to match home page design */}
      <section id="reports-section" className="py-24 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-4">
              Our Services
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Choose Your Astrology Report
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Select from our range of comprehensive astrology reports designed to provide deep insights into different aspects of your life
            </p>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-slate-600">Loading reports...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-xl mb-4">⚠️</div>
              <p className="text-slate-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Try Again
              </button>
            </div>

          ) : reports.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-slate-400 text-xl mb-4">📋</div>
              <p className="text-slate-600">No reports available at the moment.</p>
            </div>
          ) : (
            <div className="reports-container overflow-x-auto pb-4 custom-scrollbar" ref={reportsScrollRef}>
              <div className="reports-grid flex gap-8 min-w-max px-2">
                {reports.map((report, index) => (
                  <div 
                    key={report._id} 
                    className="report-card scale-in group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 p-8 w-80 flex-shrink-0 border border-slate-100 relative overflow-hidden"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-3xl text-white">
                          {getReportIcon(report.type, index)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-4">{report.name}</h3>
                      <p className="text-slate-600 mb-6 text-sm leading-relaxed">{report.description}</p>
                      <div className="report-price text-center mb-6">
                        <span className="price text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">₹{report.price?.toLocaleString() || 'N/A'}</span>
                        <span className="duration block text-xs text-slate-500 mt-2">{report.divineReportType || report.reportType || 'Standard Report'}</span>
                      </div>
                      <button 
                        className="w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
                        onClick={() => handleGetReport(report)}
                      >
                        Get Report ✨
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Updated styling to match home page design */}
        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: linear-gradient(to right, #f8fafc, #e2e8f0);
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(to right, #a855f7, #ec4899);
            border-radius: 8px;
            border: 1px solid #9333ea;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(to right, #9333ea, #db2777);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
          }
          
          .fade-in {
            animation: fadeIn 1s ease-in;
          }
          
          .scale-in {
            animation: scaleIn 0.6s ease-out forwards;
            opacity: 0;
            transform: scale(0.9);
          }
          
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(40px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes scaleIn {
            to { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </section>

      {/* Reports Form Modal */}
      {showReportsForm && (
        <ReportsForm
          selectedReport={selectedReport}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </>
  );
};

export default Reports;
