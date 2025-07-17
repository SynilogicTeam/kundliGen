import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useGoogleMaps } from '../context/GoogleMapsContext';

const ReportsForm = ({ selectedReport, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { isLoaded, loadError } = useGoogleMaps();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    location: '',
    latitude: '',
    longitude: '',
    language: 'english',
    gender: 'male',
    timeOfBirth: '12:00'
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [hasValidCoordinates, setHasValidCoordinates] = useState(false);
  
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const languageOptions = [
    { value: 'english', label: 'English' },
    { value: 'hindi', label: 'हिंदी (Hindi)' }
  ];

  // Pre-fill form with user data if available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Don't render form if user is not logged in
  if (authLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="ml-3 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Don't render anything if user is not logged in
  }

  // Check if coordinates are valid
  useEffect(() => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    const isValid = !isNaN(lat) && !isNaN(lng) && 
                   lat >= -90 && lat <= 90 && 
                   lng >= -180 && lng <= 180;
    setHasValidCoordinates(isValid);
  }, [formData.latitude, formData.longitude]);

  // Initialize Google Places Autocomplete
  useEffect(() => {
    if (isLoaded && inputRef.current && !autocompleteRef.current) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['(cities)'],
        fields: ['place_id', 'geometry', 'name', 'formatted_address']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          
          setFormData(prev => ({
            ...prev,
            location: place.formatted_address || place.name,
            latitude: lat.toFixed(6),
            longitude: lng.toFixed(6)
          }));

          // Clear location-related errors
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.location;
            delete newErrors.coordinates;
            return newErrors;
          });
        }
      });

      autocompleteRef.current = autocomplete;
    }

    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isLoaded]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLocationInputChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      location: value,
      // Clear coordinates when manually typing (user needs to select from suggestions)
      latitude: '',
      longitude: ''
    }));
    
    if (errors.location || errors.coordinates) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        delete newErrors.coordinates;
        return newErrors;
      });
    }
  };

  const searchLocationManually = async () => {
    if (!isLoaded || !window.google || !formData.location.trim()) {
      return;
    }

    setIsLocationLoading(true);
    
    try {
      const geocoder = new window.google.maps.Geocoder();
      
      const results = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: formData.location }, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(status);
          }
        });
      });
      
      if (results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        
        setFormData(prev => ({
          ...prev,
          location: results[0].formatted_address,
          latitude: lat.toFixed(6),
          longitude: lng.toFixed(6)
        }));

        // Clear location-related errors
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.location;
          delete newErrors.coordinates;
          return newErrors;
        });
      } else {
        throw new Error('No results found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setErrors(prev => ({
        ...prev,
        location: 'Location not found. Please try a different search term.'
      }));
    } finally {
      setIsLocationLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!isLoaded || !window.google || !window.google.maps) {
      setErrors(prev => ({
        ...prev,
        location: 'Google Maps is not loaded. Please try again.'
      }));
      return;
    }

    setIsLocationLoading(true);
    
    if (!navigator.geolocation) {
      setErrors(prev => ({
        ...prev,
        location: 'Geolocation is not supported by this browser'
      }));
      setIsLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Use Google Geocoding to get formatted address
        const geocoder = new window.google.maps.Geocoder();
        const latlng = { lat: latitude, lng: longitude };
        
        try {
          const results = await new Promise((resolve, reject) => {
            geocoder.geocode({ location: latlng }, (results, status) => {
              if (status === 'OK') {
                resolve(results);
              } else {
                reject(status);
              }
            });
          });
          
          if (results[0]) {
            setFormData(prev => ({
              ...prev,
              latitude: latitude.toFixed(6),
              longitude: longitude.toFixed(6),
              location: results[0].formatted_address
            }));

            // Clear location-related errors
            setErrors(prev => {
              const newErrors = { ...prev };
              delete newErrors.location;
              delete newErrors.coordinates;
              return newErrors;
            });
          } else {
            throw new Error('No results found');
          }
        } catch (error) {
          console.error('Geocoding error:', error);
          setErrors(prev => ({
            ...prev,
            location: 'Unable to get location name. Please enter manually.'
          }));
        }
        
        setIsLocationLoading(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        setErrors(prev => ({
          ...prev,
          location: errorMessage
        }));
        setIsLocationLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (birthDate > today) {
        newErrors.dateOfBirth = 'Date of birth cannot be in the future';
      } else if (age > 120) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!hasValidCoordinates) {
      newErrors.coordinates = 'Please select a location from suggestions, use current location, or click "Find Location"';
    }

    if (!formData.language) {
      newErrors.language = 'Please select a language';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }

    if (!formData.timeOfBirth) {
      newErrors.timeOfBirth = 'Time of birth is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const submitData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        dateOfBirth: formData.dateOfBirth,
        location: formData.location.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        language: formData.language === 'english' ? 'en' : 'hi',
        reportId: selectedReport?._id,
        reportName: selectedReport?.name,
        reportPrice: selectedReport?.price,
        divineReportType: selectedReport?.divineReportType,
        gender: formData.gender || 'male', // Add gender field
        timeOfBirth: formData.timeOfBirth || '12:00' // Add time of birth field
      };

      // Call the new Divine API endpoint
      const response = await fetch('/api/reports/generate-divine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to generate report');
      }

      setSuccessMessage('Report generated successfully! Check your email for the PDF link.');
      
      // Call success callback if provided
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(submitData);
        }, 1500);
      } else {
        // Fallback navigation
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
      
    } catch (error) {
      console.error('Form submission error:', error);
      setErrors({ general: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      navigate(-1);
    }
  };

  if (loadError) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 max-w-md mx-auto">
          <p className="text-red-600 text-center">Error loading Google Maps. Please try again later.</p>
          <button onClick={handleClose} className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg">
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white text-center sticky top-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">📊</span>
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold">Create New Report</h1>
                {selectedReport && (
                  <p className="text-indigo-100 text-sm">{selectedReport.name} - ₹{selectedReport.price}</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-indigo-100 text-sm mt-2">
            Please fill in your details to generate your personalized report
          </p>
        </div>

        {/* Form */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* Location Section with Google Places */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  Location * {!isLoaded && <span className="text-gray-500 text-xs">(Loading Places API...)</span>}
                </label>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocationLoading || !isLoaded}
                  className="flex items-center space-x-2 px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLocationLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-700"></div>
                      <span>Getting Location...</span>
                    </>
                  ) : (
                    <>
                      <span>📍</span>
                      <span>Use Current Location</span>
                    </>
                  )}
                </button>
              </div>

              {/* Location Name with Autocomplete */}
              <div>
                <div className="flex space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleLocationInputChange}
                    disabled={!isLoaded}
                    className={`flex-1 px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.location || errors.coordinates ? 'border-red-500' : hasValidCoordinates ? 'border-green-500' : 'border-gray-300'
                    } ${!isLoaded ? 'bg-gray-100' : ''}`}
                    placeholder={isLoaded ? "Start typing location (e.g., New Delhi, India)" : "Loading Google Places..."}
                    autoComplete="off"
                  />
                  {isLoaded && formData.location && !hasValidCoordinates && (
                    <button
                      type="button"
                      onClick={searchLocationManually}
                      disabled={isLocationLoading}
                      className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                      {isLocationLoading ? '...' : 'Find Location'}
                    </button>
                  )}
                </div>
                
                {/* Status Messages */}
                {errors.location && (
                  <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                )}
                {errors.coordinates && (
                  <p className="text-red-500 text-sm mt-1">{errors.coordinates}</p>
                )}
                {hasValidCoordinates && (
                  <p className="text-green-600 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Location verified (Lat: {parseFloat(formData.latitude)?.toFixed(4)}, Lng: {parseFloat(formData.longitude)?.toFixed(4)})
                  </p>
                )}
                {!hasValidCoordinates && formData.location && isLoaded && (
                  <p className="text-orange-600 text-sm mt-1">
                    ⚠️ Please select from suggestions or click "Find Location" to verify coordinates
                  </p>
                )}
              </div>
            </div>

            {/* Language Selection */}
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language *
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.language ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Language</option>
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="text-red-500 text-sm mt-1">{errors.language}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender *
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.gender ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Time of Birth */}
            <div>
              <label htmlFor="timeOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                Time of Birth (24-hour format)
              </label>
              <input
                type="time"
                id="timeOfBirth"
                name="timeOfBirth"
                value={formData.timeOfBirth}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.timeOfBirth ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              <p className="text-gray-500 text-sm mt-1">Leave as 12:00 if exact time is unknown</p>
              {errors.timeOfBirth && (
                <p className="text-red-500 text-sm mt-1">{errors.timeOfBirth}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={isLoading || !isLoaded || !hasValidCoordinates}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading || !isLoaded || !hasValidCoordinates
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating Report...
                  </div>
                ) : !isLoaded ? (
                  'Loading Google Maps...'
                ) : !hasValidCoordinates ? (
                  'Select Location First'
                ) : (
                  'Create Report'
                )}
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportsForm;
