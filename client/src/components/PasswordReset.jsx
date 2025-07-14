import React, { useState } from 'react';
import OTPVerification from './OTPVerification.jsx';

const PasswordReset = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Email is invalid' });
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    const newErrors = {};

    if (!newPassword) {
      newErrors.password = 'Password is required';
    } else if (newPassword.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setStep('otp');
      setSuccessMessage(data.message);
      
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({ email: error.message || 'Failed to send OTP' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (otpData) => {
    setOtp(otpData.otp);
    setStep('password');
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!validatePassword()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          otp, 
          newPassword 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setSuccessMessage(data.message);
      setTimeout(() => {
        onSuccess && onSuccess();
        onClose && onClose();
      }, 2000);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ password: error.message || 'Password reset failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = (message) => {
    setSuccessMessage(message);
  };

  const goBack = () => {
    if (step === 'otp') {
      setStep('email');
      setOtp('');
      setErrors({});
    } else if (step === 'password') {
      setStep('otp');
      setNewPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  };

  // Email Step
  if (step === 'email') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 min-h-screen">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">KG</span>
              </div>
              <h2 className="text-2xl font-bold">KundliGen</h2>
            </div>
            <h3 className="text-lg font-semibold">Reset Password</h3>
            <p className="text-indigo-100 text-sm mt-1">
              Enter your email to receive reset instructions
            </p>
          </div>

          {/* Form */}
          <div className="p-6">
            <form onSubmit={handleSendOTP} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: '' });
                  }}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending OTP...
                  </div>
                ) : (
                  'Send OTP'
                )}
              </button>

              {/* Back Button */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ← Back to Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // OTP Step
  if (step === 'otp') {
    return (
      <OTPVerification
        email={email}
        type="reset"
        onVerificationSuccess={handleOTPVerification}
        onResendOTP={handleResendOTP}
        onBack={goBack}
      />
    );
  }

  // Password Step
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 min-h-screen">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden transform transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-6 text-white text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">KG</span>
            </div>
            <h2 className="text-2xl font-bold">KundliGen</h2>
          </div>
          <h3 className="text-lg font-semibold">Set New Password</h3>
          <p className="text-indigo-100 text-sm mt-1">
            Enter your new password
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {/* New Password Input */}
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                }}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Confirm new password"
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-green-600 text-sm">{successMessage}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Resetting Password...
                </div>
              ) : (
                'Reset Password'
              )}
            </button>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={goBack}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back to OTP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset; 