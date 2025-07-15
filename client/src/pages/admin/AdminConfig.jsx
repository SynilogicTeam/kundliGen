import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../../components/admin/AdminLayout';

const AdminConfig = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [passwordVisibility, setPasswordVisibility] = useState({});
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('company');

  useEffect(() => {
    fetchConfig();
    fetchUploadedImages();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/config', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConfig(response.data);
    } catch (error) {
      console.error('Fetch config error:', error);
      showMessage('error', 'Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  const fetchUploadedImages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get('http://localhost:5000/api/config/images', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUploadedImages(response.data);
    } catch (error) {
      console.error('Fetch images error:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig({
      ...config,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        showMessage('error', 'Logo file size must be less than 2MB');
        return;
      }
      
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setConfig({
          ...config,
          companyLogo: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Please select a valid image file (JPEG, PNG, GIF, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image file size must be less than 5MB');
      return;
    }

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:5000/api/config/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        const newImage = {
          id: response.data.imageId,
          filename: response.data.filename,
          url: response.data.url,
          uploadedAt: new Date().toISOString()
        };
        
        setUploadedImages(prev => [...prev, newImage]);
        showMessage('success', 'Image uploaded successfully');
        
        // Update config to refresh the display
        await fetchConfig();
      }
    } catch (error) {
      console.error('Image upload error:', error);
      showMessage('error', 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const deleteImage = async (imageId) => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/config/delete-image/${imageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUploadedImages(prev => prev.filter(img => img.id !== imageId));
      showMessage('success', 'Image deleted successfully');
    } catch (error) {
      console.error('Delete image error:', error);
      showMessage('error', 'Failed to delete image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      let response;
      
      if (logoFile) {
        const formData = new FormData();
        Object.keys(config).forEach(key => {
          if (key === 'companyLogo' && logoFile) {
            formData.append('companyLogo', logoFile);
          } else {
            formData.append(key, config[key]);
          }
        });

        response = await axios.put('http://localhost:5000/api/config', formData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await axios.put('http://localhost:5000/api/config', config, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      if (response.data) {
        showMessage('success', 'Configuration updated successfully');
        setLogoFile(null);
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Update config error:', error);
      showMessage('error', 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const togglePasswordVisibility = (fieldName) => {
    setPasswordVisibility(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: '🏢' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'email', label: 'Email', icon: '📧' },
    { id: 'api', label: 'API Keys', icon: '🔑' },
    { id: 'business', label: 'Business', icon: '⏰' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  const PasswordInput = ({ name, label, placeholder, value, onChange, description }) => {
    const isVisible = passwordVisibility[name] || false;
    
    return (
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative">
          <input
            type={isVisible ? 'text' : 'password'}
            name={name}
            className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
            value={value || ''}
            onChange={onChange}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility(name)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-gray-100 rounded-r-xl transition-colors"
          >
            {isVisible ? (
              <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            ) : (
              <svg className="h-5 w-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    );
  };

  const InputField = ({ label, name, type = "text", placeholder, value, onChange, description, rows }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      {type === 'textarea' ? (
        <textarea
          name={name}
          rows={rows || 3}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          name={name}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          min={type === 'number' ? '1' : undefined}
          max={type === 'number' ? '72' : undefined}
        />
      )}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );

  const SelectField = ({ label, name, options, value, onChange, description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>
      <select
        name={name}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
        value={value || ''}
        onChange={onChange}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <p className="mt-6 text-lg font-medium text-gray-700">Loading configuration...</p>
            <p className="text-sm text-gray-500">Please wait while we fetch your settings</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Configuration Settings</h1>
                <p className="mt-2 text-gray-600">Manage your astrology business configuration and settings</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Auto-save enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className="max-w-7xl mx-auto px-6 pt-6">
            <div className={`p-4 rounded-xl shadow-lg border-l-4 ${
              message.type === 'success' 
                ? 'bg-green-50 border-green-400 text-green-800' 
                : 'bg-red-50 border-red-400 text-red-800'
            } animate-slide-down`}>
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {message.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{message.text}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200 bg-white rounded-t-xl shadow-sm">
              <nav className="-mb-px flex space-x-8 px-6" aria-label="Tabs">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Company Information */}
            {activeTab === 'company' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">🏢</span>
                    Company Information
                  </h2>
                  <p className="mt-2 text-blue-100">Configure your business identity and contact details</p>
                </div>
                
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InputField
                      label="Company Name"
                      name="companyName"
                      placeholder="Enter your company name"
                      value={config?.companyName}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Company Email"
                      name="companyEmail"
                      type="email"
                      placeholder="info@company.com"
                      value={config?.companyEmail}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Company Phone"
                      name="companyPhone"
                      placeholder="+91-9876543210"
                      value={config?.companyPhone}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Company Address"
                      name="companyAddress"
                      type="textarea"
                      rows="3"
                      placeholder="Enter complete company address"
                      value={config?.companyAddress}
                      onChange={handleInputChange}
                    />
                  </div>

                  <InputField
                    label="Company Bio"
                    name="company_bio"
                    type="textarea"
                    rows="4"
                    placeholder="Describe your company, services, and what makes you unique..."
                    value={config?.company_bio}
                    onChange={handleInputChange}
                    description="This bio will be displayed on your website and marketing materials."
                  />

                  <InputField
                    label="Report Footer Text"
                    name="reportFooterText"
                    type="textarea"
                    rows="3"
                    placeholder="Enter footer text for generated reports..."
                    value={config?.reportFooterText}
                    onChange={handleInputChange}
                    description="This text will appear at the bottom of all generated astrology reports."
                  />

                  {/* Company Logo Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Company Logo</h3>
                      {config?.companyLogo && (
                        <img 
                          src={config.companyLogo} 
                          alt="Current Logo"
                          className="h-12 w-auto rounded-lg border-2 border-gray-200 shadow-sm"
                        />
                      )}
                    </div>

                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-gray-50 hover:bg-blue-50">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center">
                          {uploadingImage ? (
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                          ) : (
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                            </div>
                          )}
                          <p className="text-lg font-medium text-gray-700 mb-2">
                            {uploadingImage ? 'Uploading...' : 'Upload Company Logo'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            PNG, JPG, GIF, WebP up to 5MB
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Uploaded Images Grid */}
                    {uploadedImages.length > 0 && (
                      <div>
                        <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Uploads</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                          {uploadedImages.map((image) => (
                            <div key={image.id} className="relative group">
                              <img
                                src={image.url}
                                alt="Uploaded"
                                className="w-full h-24 object-cover rounded-lg border border-gray-200 shadow-sm group-hover:shadow-lg transition-shadow"
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => window.open(image.url, '_blank')}
                                    className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                                    title="View full size"
                                  >
                                    <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => deleteImage(image.id)}
                                    className="p-2 bg-red-500 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                                    title="Delete image"
                                  >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Gateway Settings */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-green-500 to-teal-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">💳</span>
                    Payment Gateway Settings
                  </h2>
                  <p className="mt-2 text-green-100">Configure your payment processing options</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <InputField
                      label="Razorpay Key ID"
                      name="razorpayKeyId"
                      placeholder="rzp_test_xxxxxxxxxxxxx"
                      value={config?.razorpayKeyId}
                      onChange={handleInputChange}
                    />
                    <PasswordInput
                      label="Razorpay Key Secret"
                      name="razorpayKeySecret"
                      placeholder="Enter Razorpay secret key"
                      value={config?.razorpayKeySecret}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === 'email' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-blue-500 to-cyan-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">📧</span>
                    Email Settings
                  </h2>
                  <p className="mt-2 text-blue-100">Configure your email delivery settings</p>
                </div>
                
                <div className="p-8 space-y-8">
                  <SelectField
                    label="Email Provider"
                    name="emailProvider"
                    options={[
                      { value: 'smtp', label: 'Gmail' },
                      // { value: 'sendgrid', label: 'SendGrid' }
                    ]}
                    value={config?.emailProvider}
                    onChange={handleInputChange}
                  />

                  {config?.emailProvider === 'smtp' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* <InputField
                        label="SMTP Host"
                        name="smtpHost"
                        placeholder="smtp.gmail.com"
                        value={config?.smtpHost}
                        onChange={handleInputChange}
                      />
                      <InputField
                        label="SMTP Port"
                        name="smtpPort"
                        type="number"
                        placeholder="587"
                        value={config?.smtpPort}
                        onChange={handleInputChange}
                      /> */}
                      <InputField
                        label="SMTP Email"
                        name="smtpUser"
                        type="email"
                        placeholder="your-email@gmail.com"
                        value={config?.smtpUser}
                        onChange={handleInputChange}
                      />
                      <PasswordInput
                        label="SMTP Password"
                        name="smtpPassword"
                        placeholder="Enter SMTP password or app password"
                        value={config?.smtpPassword}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <PasswordInput
                      label="SendGrid API Key"
                      name="sendgridApiKey"
                      placeholder="SG.xxxxxxxxxxxxxxxxxxxxx"
                      value={config?.sendgridApiKey}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeTab === 'api' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">🔑</span>
                    API Keys
                  </h2>
                  <p className="mt-2 text-purple-100">Manage your third-party service integrations</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <PasswordInput
                      label="Astrology API Key"
                      name="astrologyApiKey"
                      placeholder="Enter astrology API key"
                      value={config?.astrologyApiKey}
                      onChange={handleInputChange}
                    />
                    <PasswordInput
                      label="Divine API Key"
                      name="divineApiKey"
                      placeholder="Enter divine API key"
                      value={config?.divineApiKey}
                      onChange={handleInputChange}
                    />
                    <PasswordInput
                      label="Divine API Bearer Token"
                      name="divineApiTokenBearer"
                      placeholder="Enter divine API bearer token"
                      value={config?.divineApiTokenBearer}
                      onChange={handleInputChange}
                    />
                    <PasswordInput
                      label="Google Maps API Key"
                      name="googleMapsApiKey"
                      placeholder="AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={config?.googleMapsApiKey}
                      onChange={handleInputChange}
                    />
                    <InputField
                      label="Report Delivery Hours"
                      name="reportDeliveryHours"
                      type="number"
                      placeholder="12"
                      value={config?.reportDeliveryHours}
                      onChange={handleInputChange}
                      description="Hours within which reports will be delivered"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Business Settings */}
            {activeTab === 'business' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-yellow-500 to-orange-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">⏰</span>
                    Business Settings
                  </h2>
                  <p className="mt-2 text-yellow-100">Configure your business operations and preferences</p>
                </div>
                
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Business Hours</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="time"
                          name="businessStartTime"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                          value={config?.businessStartTime || '09:00'}
                          onChange={handleInputChange}
                        />
                        <input
                          type="time"
                          name="businessEndTime"
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                          value={config?.businessEndTime || '18:00'}
                          onChange={handleInputChange}
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">Start and end time for business hours</p>
                    </div>

                    <SelectField
                      label="Timezone"
                      name="timezone"
                      options={[
                        { value: 'Asia/Kolkata', label: 'India (IST)' },
                        { value: 'America/New_York', label: 'Eastern Time (ET)' },
                        { value: 'America/Chicago', label: 'Central Time (CT)' },
                        { value: 'America/Denver', label: 'Mountain Time (MT)' },
                        { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                        { value: 'Europe/London', label: 'London (GMT)' },
                        { value: 'Europe/Paris', label: 'Paris (CET)' },
                        { value: 'Asia/Dubai', label: 'Dubai (GST)' },
                        { value: 'Asia/Singapore', label: 'Singapore (SGT)' }
                      ]}
                      value={config?.timezone}
                      onChange={handleInputChange}
                    />

                    <SelectField
                      label="Currency"
                      name="currency"
                      options={[
                        { value: 'INR', label: 'Indian Rupee (₹)' },
                        { value: 'USD', label: 'US Dollar ($)' },
                        { value: 'EUR', label: 'Euro (€)' },
                        { value: 'GBP', label: 'British Pound (£)' },
                        { value: 'AED', label: 'UAE Dirham (د.إ)' }
                      ]}
                      value={config?.currency}
                      onChange={handleInputChange}
                    />

                    <SelectField
                      label="Language"
                      name="language"
                      options={[
                        { value: 'en', label: 'English' },
                        { value: 'hi', label: 'Hindi' },
                        { value: 'gu', label: 'Gujarati' },
                        { value: 'mr', label: 'Marathi' },
                        { value: 'bn', label: 'Bengali' },
                        { value: 'ta', label: 'Tamil' },
                        { value: 'te', label: 'Telugu' }
                      ]}
                      value={config?.language}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 bg-gradient-to-r from-red-500 to-pink-600">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    <span className="mr-3">🔔</span>
                    Notification Settings
                  </h2>
                  <p className="mt-2 text-red-100">Manage your notification preferences</p>
                </div>
                
                <div className="p-8 space-y-6">
                  {[
                    { name: 'emailNotifications', label: 'Email Notifications', description: 'Send email notifications for new orders' },
                    { name: 'smsNotifications', label: 'SMS Notifications', description: 'Send SMS notifications for order updates' },
                    { name: 'whatsappNotifications', label: 'WhatsApp Notifications', description: 'Send WhatsApp notifications for reports' }
                  ].map((notification) => (
                    <div key={notification.name} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div>
                        <label className="text-lg font-medium text-gray-900">{notification.label}</label>
                        <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          name={notification.name}
                          checked={config?.[notification.name] || false}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
              <button
                type="submit"
                className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Saving Configuration...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Configuration
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-down {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </AdminLayout>
  );
};

export default AdminConfig;