import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/loginForm';

const Login = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Redirect if user is already logged in
  React.useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  const handleClose = () => {
    navigate('/');
  };

  const handleLoginSuccess = () => {
    // LoginForm will handle the login logic and redirect
    // This is just a fallback
    navigate('/dashboard');
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show login form if user is already logged in
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <LoginForm onClose={handleClose} onSuccess={handleLoginSuccess} />
    </div>
  );
};

export default Login; 