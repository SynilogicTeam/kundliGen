import React, { useState, useEffect } from 'react';

const OTPVerification = ({ 
  email, 
  type = 'registration', // 'registration' or 'reset'
  onVerificationSuccess, 
  onResendOTP, 
  onBack 
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Clear error when user types
    if (errors.otp) {
      setErrors(prev => ({ ...prev, otp: '' }));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const validateOTP = () => {
    const otpString = otp.join('');
    if (otpString.length !== 4) {
      setErrors({ otp: 'Please enter a 4-digit OTP' });
      return false;
    }
    if (!/^\d{4}$/.test(otpString)) {
      setErrors({ otp: 'OTP must contain only numbers' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateOTP()) {
      return;
    }

    setIsLoading(true);
    
    try {
      if (type === 'registration') {
        // Registration OTP verification
        const response = await fetch('/api/users/verify-registration-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            otp: otp.join('') 
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Verification failed');
        }

        onVerificationSuccess(data);
      } else {
        // Password reset OTP verification - just verify OTP, don't reset password yet
        const response = await fetch('/api/users/verify-reset-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            otp: otp.join('') 
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'OTP verification failed');
        }

        // Pass the OTP to parent component for password reset
        onVerificationSuccess({ ...data, otp: otp.join('') });
      }
      
    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ otp: error.message || 'Invalid OTP. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    
    setIsResending(true);
    
    try {
      const endpoint = type === 'registration' 
        ? '/api/users/resend-registration-otp'
        : '/api/users/resend-reset-otp';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      // Reset countdown
      setCountdown(30);
      setCanResend(false);
      setOtp(['', '', '', '']);
      setErrors({});
      
      if (onResendOTP) {
        onResendOTP(data.message);
      }
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      setErrors({ general: error.message || 'Failed to resend OTP' });
    } finally {
      setIsResending(false);
    }
  };

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
          <h3 className="text-lg font-semibold">
            {type === 'registration' ? 'Verify Your Account' : 'Reset Password'}
          </h3>
          <p className="text-indigo-100 text-sm mt-1">
            Enter the 4-digit code sent to {email}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Enter OTP
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${
                      errors.otp ? 'border-red-500' : 'border-gray-300'
                    }`}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-2 text-center">{errors.otp}</p>
              )}
            </div>

            {/* Error Message */}
            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-600 text-sm">{errors.general}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || otp.join('').length !== 4}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading || otp.join('').length !== 4
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 hover:shadow-lg transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || isResending}
                className={`text-sm font-medium transition-colors ${
                  canResend && !isResending
                    ? 'text-indigo-600 hover:text-indigo-500'
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600 mr-1"></div>
                    Sending...
                  </div>
                ) : canResend ? (
                  'Resend OTP'
                ) : (
                  `Resend in ${countdown}s`
                )}
              </button>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <button
                type="button"
                onClick={onBack}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification; 