import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [allReports, setAllReports] = useState([]); // Store all reports for search
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingReport, setEditingReport] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [filters, setFilters] = useState({
    pdfReportType: '',
    isActive: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    limit: 10
  });

  // API options mapping
  const apiOptions = {
    'Vedic Reports': [
      { name: 'Kundali PDF - Sampoorna', value: 'https://pdf.divineapi.com/indian-api/v1/kundali-sampoorna' },
      { name: 'Kundali PDF - Ananta', value: 'https://pdf.divineapi.com/indian-api/v1/kundali-ananta' },
      { name: 'Kundali PDF - Prakash', value: 'https://pdf.divineapi.com/indian-api/v1/kundali-prakash' },
      { name: 'Match Making PDF', value: 'https://pdf.divineapi.com/indian-api/v1/match-making' },
      { name: 'Government Job Report', value: 'https://pdf.divineapi.com/indian-api/v1/government-job-report' },
      { name: 'Foreign Travel and Settlement', value: 'https://pdf.divineapi.com/indian-api/v1/foreign-travel-settlement' },
      { name: 'Vedic Yearly Prediction 5 Year', value: 'https://pdf.divineapi.com/indian-api/v1/vedic-yearly-prediction-5-year' },
      { name: 'Vedic Yearly Prediction 10 Year', value: 'https://pdf.divineapi.com/indian-api/v1/vedic-yearly-prediction-10-year' },
      { name: 'Vedic Yearly Prediction 15 Year', value: 'https://pdf.divineapi.com/indian-api/v1/vedic-yearly-prediction-15-year' }
    ],
    'Natal Report': [
      { name: 'Natal Report', value: 'https://pdf.divineapi.com/astrology/v2/report' }
    ],
    'Natal Couple Report': [
      { name: 'Natal Couple Report', value: 'https://pdf.divineapi.com/astrology/v1/couple' }
    ],
    'Prediction Report': [
      { name: 'Prediction Report', value: 'https://pdf.divineapi.com/numerology/v1/prediction_reports' }
    ],
    'Numerology Report': [
      { name: 'Numerology Report', value: 'https://pdf.divineapi.com/numerology/v2/report' }
    ]
  };

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    pdfReportType: '',
    divineReportType: '',
    isActive: true
  });

  useEffect(() => {
    fetchReports();
  }, [pagination.currentPage, filters.pdfReportType, filters.isActive]);

  // Separate effect for search to avoid refetching from server
  useEffect(() => {
    applySearchFilter();
  }, [filters.search, allReports]);

  // Check if admin is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('adminToken');
    return !!token;
  };

  const fetchReports = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', pagination.currentPage.toString());
      params.append('limit', pagination.limit.toString());
      
      // Add filters only if they have values
      if (filters.pdfReportType) params.append('pdfReportType', filters.pdfReportType);
      if (filters.isActive !== '') params.append('isActive', filters.isActive);
      
      const response = await axios.get(`/api/reports?${params}`);
      
      if (response.data.success) {
        const fetchedReports = response.data.data.reports;
        setAllReports(fetchedReports); // Store all fetched reports
        
        // Apply search filter if exists
        if (filters.search) {
          const filteredReports = fetchedReports.filter(report =>
            report.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            report.description.toLowerCase().includes(filters.search.toLowerCase()) ||
            report.divineReportType.toLowerCase().includes(filters.search.toLowerCase())
          );
          setReports(filteredReports);
        } else {
          setReports(fetchedReports);
        }
        
        setPagination(prev => ({
          ...prev,
          totalPages: response.data.data.pagination.totalPages,
          totalReports: response.data.data.pagination.totalReports
        }));
      }
    } catch (error) {
      console.error('Fetch reports error:', error);
      if (error.response?.status === 401) {
        showMessage('error', 'Authentication failed. Please login again.');
        // Redirect to admin login
        window.location.href = '/admin/login';
      } else {
        showMessage('error', 'Failed to fetch reports. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter on the current set of reports
  const applySearchFilter = () => {
    if (!filters.search) {
      setReports(allReports);
      return;
    }

    const filteredReports = allReports.filter(report =>
      report.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      report.divineReportType.toLowerCase().includes(filters.search.toLowerCase())
    );
    
    setReports(filteredReports);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'pdfReportType') {
      // Reset divineReportType when pdfReportType changes
      setFormData({
        ...formData,
        [name]: value,
        divineReportType: ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset pagination when changing filters
    if (name === 'pdfReportType' || name === 'isActive') {
      setPagination(prev => ({ ...prev, currentPage: 1 }));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      description: '',
      pdfReportType: '',
      divineReportType: '',
      isActive: true
    });
    setEditingReport(null);
  };

  const validateForm = () => {
    const errors = [];
    
    if (!formData.name.trim()) errors.push('Report name is required');
    if (!formData.price || formData.price <= 0) errors.push('Price must be greater than 0');
    if (!formData.description.trim()) errors.push('Description is required');
    if (!formData.pdfReportType) errors.push('PDF Report type is required');
    if (!formData.divineReportType.trim()) errors.push('Divine API report type is required');
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateForm();
    if (errors.length > 0) {
      showMessage('error', errors.join(', '));
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      showMessage('error', 'Authentication required. Please login again.');
      window.location.href = '/admin/login';
      return;
    }

    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        name: formData.name.trim(),
        description: formData.description.trim(),
        divineReportType: formData.divineReportType.trim()
      };

      let response;

      if (editingReport) {
        response = await axios.put(`/api/reports/${editingReport._id}`, submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } else {
        response = await axios.post('/api/reports', submitData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      if (response.data.success) {
        showMessage('success', editingReport ? 'Report updated successfully' : 'Report created successfully');
        setShowForm(false);
        resetForm();
        fetchReports();
      }
    } catch (error) {
      console.error('Save report error:', error);
      
      if (error.response?.status === 401) {
        showMessage('error', 'Authentication failed. Please login again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 400) {
        showMessage('error', error.response.data.message || 'Invalid data provided');
      } else if (error.response?.status === 409) {
        showMessage('error', 'A report with this name already exists');
      } else {
        showMessage('error', 'Failed to save report. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (report) => {
    setEditingReport(report);
    setFormData({
      name: report.name,
      price: report.price.toString(),
      description: report.description,
      pdfReportType: report.pdfReportType || '',
      divineReportType: report.divineReportType,
      isActive: report.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report? This action cannot be undone.')) {
      return;
    }

    // Check authentication
    if (!isAuthenticated()) {
      showMessage('error', 'Authentication required. Please login again.');
      window.location.href = '/admin/login';
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.delete(`/api/reports/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showMessage('success', 'Report deleted successfully');
        fetchReports();
      }
    } catch (error) {
      console.error('Delete report error:', error);
      
      if (error.response?.status === 401) {
        showMessage('error', 'Authentication failed. Please login again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 404) {
        showMessage('error', 'Report not found');
      } else {
        showMessage('error', 'Failed to delete report. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (reportId, currentStatus) => {
    // Check authentication
    if (!isAuthenticated()) {
      showMessage('error', 'Authentication required. Please login again.');
      window.location.href = '/admin/login';
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.patch(`/api/reports/${reportId}/toggle-status`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        showMessage('success', `Report ${currentStatus ? 'deactivated' : 'activated'} successfully`);
        fetchReports();
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      
      if (error.response?.status === 401) {
        showMessage('error', 'Authentication failed. Please login again.');
        window.location.href = '/admin/login';
      } else if (error.response?.status === 404) {
        showMessage('error', 'Report not found');
      } else {
        showMessage('error', 'Failed to toggle report status. Please try again.');
      }
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Get current API options based on selected PDF Report type
  const getCurrentApiOptions = () => {
    return apiOptions[formData.pdfReportType] || [];
  };

  const getStatusBadge = (isActive) => (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      isActive 
        ? 'bg-green-100 text-green-800' 
        : 'bg-red-100 text-red-800'
    }`}>
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );

  const getTypeBadge = (type) => {
    const colors = {
      'Basic': 'bg-blue-100 text-blue-800',
      'Sampoorna': 'bg-purple-100 text-purple-800',
      'Ananta': 'bg-indigo-100 text-indigo-800',
      'Match Making': 'bg-pink-100 text-pink-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  // Show authentication error if not logged in
  if (!isAuthenticated()) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-600 text-xl mb-4">Authentication Required</div>
            <p className="text-gray-600 mb-4">Please login to access the reports management.</p>
            <button
              onClick={() => window.location.href = '/admin/login'}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go to Login
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reports...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Calculate filtered count for display
  const filteredCount = reports.length;
  const totalCount = pagination.totalReports;

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Reports Management</h1>
                <p className="mt-2 text-gray-600">Manage astrology reports and their configurations</p>
              </div>
              <button
                onClick={() => {
                  setShowForm(true);
                  resetForm();
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add New Report
              </button>
            </div>
          </div>

          {/* Message Alert */}
          {message.text && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-800' 
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}>
              {message.text}
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                <input
                  type="text"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  placeholder="Search by name, description, or API type..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PDF Report Type</label>
                <select
                  name="pdfReportType"
                  value={filters.pdfReportType}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All PDF Report Types</option>
                  <option value="Vedic Reports">Vedic Reports</option>
                  <option value="Natal Report">Natal Report</option>
                  <option value="Natal Couple Report">Natal Couple Report</option>
                  <option value="Prediction Report">Prediction Report</option>
                  <option value="Numerology Report">Numerology Report</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="isActive"
                  value={filters.isActive}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setFilters({ pdfReportType: '', isActive: '', search: '' });
                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingReport ? 'Edit Report' : 'Add New Report'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Report Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Enter report name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹) *</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">PDF Report API Type *</label>
                      <select
                        name="pdfReportType"
                        value={formData.pdfReportType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="">Select PDF Report Type</option>
                        <option value="Vedic Reports">Vedic Reports</option>
                        <option value="Natal Report">Natal Report</option>
                        <option value="Natal Couple Report">Natal Couple Report</option>
                        <option value="Prediction Report">Prediction Report</option>
                        <option value="Numerology Report">Numerology Report</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Divine API Report Type *</label>
                      <select
                        name="divineReportType"
                        value={formData.divineReportType}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.pdfReportType}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      >
                        <option value="">
                          {formData.pdfReportType ? 'Select API Report' : 'Select PDF Report Type first'}
                        </option>
                        {getCurrentApiOptions().map((option, index) => (
                          <option key={index} value={option.value}>
                            {option.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Enter report description"
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">Active</label>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        resetForm();
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          {editingReport ? 'Updating...' : 'Creating...'}
                        </div>
                      ) : (
                        editingReport ? 'Update Report' : 'Create Report'
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Reports Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                Reports ({filteredCount} of {totalCount})
                {filters.search && (
                  <span className="text-sm text-gray-500 ml-2">
                    • Filtered by "{filters.search}"
                  </span>
                )}
              </h3>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      PDF Report Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                          <div className="text-sm text-gray-500 max-w-xs truncate">{report.description}</div>
                          <div className="text-xs text-gray-400 mt-1">API: {report.divineReportType}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.pdfReportType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{report.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(report.isActive)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(report)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleToggleStatus(report._id, report.isActive)}
                            className={`${
                              report.isActive 
                                ? 'text-red-600 hover:text-red-900' 
                                : 'text-green-600 hover:text-green-900'
                            }`}
                          >
                            {report.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                          <button
                            onClick={() => handleDelete(report._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination - Only show if not searching */}
            {pagination.totalPages > 1 && !filters.search && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{' '}
                      <span className="font-medium">{(pagination.currentPage - 1) * pagination.limit + 1}</span>
                      {' '}to{' '}
                      <span className="font-medium">
                        {Math.min(pagination.currentPage * pagination.limit, pagination.totalReports)}
                      </span>
                      {' '}of{' '}
                      <span className="font-medium">{pagination.totalReports}</span>
                      {' '}results
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                        disabled={pagination.currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setPagination(prev => ({ ...prev, currentPage: page }))}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === pagination.currentPage
                              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                      <button
                        onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {reports.length === 0 && !loading && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filters.search || filters.pdfReportType || filters.isActive 
                    ? 'Try adjusting your filters to find what you\'re looking for.'
                    : 'Get started by creating a new report.'
                  }
                </p>
                {!filters.search && !filters.pdfReportType && !filters.isActive && (
                  <div className="mt-6">
                    <button
                      onClick={() => {
                        setShowForm(true);
                        resetForm();
                      }}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add New Report
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
