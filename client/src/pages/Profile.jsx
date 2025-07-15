import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useGoogleMaps } from '../context/GoogleMapsContext';
import { Autocomplete } from '@react-google-maps/api';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const { isLoaded, loadError } = useGoogleMaps();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth || '',
    address: user?.address || ''
  });
  
  // Add missing state variables
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Add location state
  const [location, setLocation] = useState({
    formattedAddress: user?.location?.formattedAddress || '',
    coordinates: user?.location?.coordinates || [0, 0],
    placeId: user?.location?.placeId || ''
  });
  const autocompleteRef = useRef(null);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth || '',
        address: user.address || ''
      });
      setLocation({
        formattedAddress: user?.location?.formattedAddress || '',
        coordinates: user?.location?.coordinates || [0, 0],
        placeId: user?.location?.placeId || ''
      });
    }
  }, [user]);

  // Handle Google Places selection
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place && place.geometry) {
        setLocation({
          formattedAddress: place.formatted_address,
          coordinates: [
            place.geometry.location.lng(),
            place.geometry.location.lat()
          ],
          placeId: place.place_id
        });
        
        // Clear any location-related errors
        if (errors.location) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.location;
            return newErrors;
          });
        }
      }
    }
  };

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
    setLocation(prev => ({
      ...prev,
      formattedAddress: value,
      // Clear coordinates when manually typing
      coordinates: [0, 0],
      placeId: ''
    }));
    
    // Clear location errors
    if (errors.location) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.location;
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
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
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          location // <-- send location object
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      // Update user context with new data
      updateUser({ ...user, ...formData, location });
      setSuccessMessage('Profile updated successfully!');
      setIsEditing(false);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      
    } catch (error) {
      console.error('Profile update error:', error);
      setErrors({ general: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      dateOfBirth: user?.dateOfBirth || '',
      address: user?.address || ''
    });
    setLocation({
      formattedAddress: user?.location?.formattedAddress || '',
      coordinates: user?.location?.coordinates || [0, 0],
      placeId: user?.location?.placeId || ''
    });
    setErrors({});
    setIsEditing(false);
  };

  // Handle Google Maps loading error
  if (loadError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Google Maps Error</h2>
          <p className="text-gray-600 mb-4">Unable to load Google Maps. Some features may be limited.</p>
          <p className="text-sm text-gray-500">Please refresh the page or try again later.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your profile</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              {successMessage}
            </div>
          )}

          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            {/* General Error */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    isEditing 
                      ? 'bg-white border-gray-300' 
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    isEditing 
                      ? 'bg-white border-gray-300' 
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    isEditing 
                      ? 'bg-white border-gray-300' 
                      : 'bg-gray-50 border-gray-200'
                  } ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              {/* Date of Birth */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    isEditing 
                      ? 'bg-white border-gray-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                />
              </div>

              {/* Address */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows="3"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    isEditing 
                      ? 'bg-white border-gray-300' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                  placeholder="Enter your address"
                />
              </div>

              {/* Location with Google Places Autocomplete */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Location {!isLoaded && isEditing && <span className="text-gray-500 text-xs">(Loading Google Places...)</span>}
                </label>
                
                {isEditing ? (
                  <>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={ref => (autocompleteRef.current = ref)}
                        onPlaceChanged={onPlaceChanged}
                        options={{
                          types: ['(cities)'],
                          fields: ['place_id', 'geometry', 'name', 'formatted_address']
                        }}
                      >
                        <input
                          type="text"
                          value={location.formattedAddress}
                          onChange={handleLocationInputChange}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                            errors.location ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Search for your location (e.g., New Delhi, India)"
                          autoComplete="off"
                        />
                      </Autocomplete>
                    ) : (
                      <input
                        type="text"
                        value={location.formattedAddress}
                        onChange={handleLocationInputChange}
                        disabled={!isLoaded}
                        className="w-full px-4 py-3 border rounded-lg bg-gray-100 border-gray-300"
                        placeholder="Loading Google Places..."
                      />
                    )}
                    
                    {/* Location Status */}
                    {location.coordinates && location.coordinates[0] !== 0 && location.coordinates[1] !== 0 && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Location verified (Lat: {location.coordinates[1]?.toFixed(4)}, Lng: {location.coordinates[0]?.toFixed(4)})
                      </p>
                    )}
                    
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      value={location.formattedAddress}
                      className="w-full px-4 py-3 border rounded-lg bg-gray-50 border-gray-200"
                      disabled
                      placeholder="No location set"
                    />
                    {location.coordinates && location.coordinates[0] !== 0 && location.coordinates[1] !== 0 && (
                      <div className="text-xs text-gray-500 mt-1">
                        Coordinates: {location.coordinates[1]?.toFixed(4)}, {location.coordinates[0]?.toFixed(4)}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Submit Button - Only show when editing */}
              {isEditing && (
                <div className="mb-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* Action Buttons - Outside the form */}
            <div className="flex flex-col sm:flex-row gap-4">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Edit Profile
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile; 