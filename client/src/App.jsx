import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/home';
import Profile from './pages/Profile';
import ChangePassword from './pages/ChangePassword';
import Dashboard from './pages/Dashboard';
import AdminLogin from './components/admin/adminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { GoogleMapsProvider } from './context/GoogleMapsContext';
import AdminConfig from './pages/admin/AdminConfig';
import AdminProfile from './pages/admin/AdminProfile';
import Reports from './pages/admin/Reports';
import Customers from './pages/admin/Customers';
import Orders from './pages/admin/Orders';
import Analytics from './pages/admin/Analytics';
import LoginForm from './components/loginForm';

function App() {
  return (
    <GoogleMapsProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/change-password" element={<ChangePassword />} />
            <Route path="/admin" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/config" element={<AdminConfig />} />
            <Route path="/admin/profile" element={<AdminProfile />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/customers" element={<Customers />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/admin/analytics" element={<Analytics />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleMapsProvider>
  )
}

export default App
