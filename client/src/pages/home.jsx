import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Reports from './reports';

const Home = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const reportsScrollRef = useRef(null);
  const [config, setConfig] = useState({
    companyName: 'KundliGen',
    companyEmail: 'info@kundligen.com',
    companyPhone: '+91-9876543210',
    companyAddress: 'Mumbai, Maharashtra, India'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/config');
        if (response.ok) {
          const configData = await response.json();
          setConfig(configData);
        }
      } catch (error) {
        console.error('Failed to fetch config:', error);
      }
    };

    fetchConfig();
  }, []);

  useEffect(() => {
    // Enhanced scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.fade-in, .slide-up, .float-animation, .scale-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reportsScrollContainer = reportsScrollRef.current;
    
    if (!reportsScrollContainer) return;

    const handleReportsWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY;
      reportsScrollContainer.scrollLeft += scrollAmount;
    };

    reportsScrollContainer.addEventListener('wheel', handleReportsWheel, { passive: false });

    return () => {
      reportsScrollContainer.removeEventListener('wheel', handleReportsWheel);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  const scrollToReports = () => {
    const reportsSection = document.getElementById('reports-section');
    if (reportsSection) {
      reportsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      
      {/* Enhanced Hero Section */}
      <section className="hero-section fade-in bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated Gradient Orbs */}
          <div className="absolute top-10 left-10 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
          
          {/* Enhanced Stars */}
          <div className="stars-container">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="star absolute bg-gradient-to-r from-white to-yellow-200 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 4 + 1}px`,
                  height: `${Math.random() * 4 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 4 + 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="hero-content text-center max-w-5xl mx-auto">
            <div className="slide-up mb-8">
              <span className="inline-block px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 text-sm font-medium mb-6">
                ✨ Trusted by 50,000+ People Worldwide
              </span>
            </div>
            
            <h1 className="slide-up text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Unlock Your 
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent"> Cosmic</span>
              <br />Destiny
            </h1>
            
            <p className="slide-up text-xl sm:text-2xl text-slate-200 mb-12 leading-relaxed max-w-3xl mx-auto" style={{ animationDelay: '0.2s' }}>
              Get personalized insights into your life, career, relationships, and future through our comprehensive astrology analysis crafted by expert astrologers
            </p>
            
            <div className="hero-cta slide-up mb-16" style={{ animationDelay: '0.4s' }}>
              <button 
                className="group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-5 px-10 rounded-full text-xl shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
                onClick={scrollToReports}
              >
                <span className="relative z-10 flex items-center justify-center">
                  🌟 Explore Your Cosmic Journey
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
            
            <div className="hero-stats slide-up grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ animationDelay: '0.6s' }}>
              <div className="stat text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <h3 className="float-animation text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent mb-2">50+</h3>
                  <p className="text-slate-300 font-medium">Years of Experience</p>
                </div>
              </div>
              <div className="stat text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <h3 className="float-animation text-5xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2" style={{ animationDelay: '0.5s' }}>50K+</h3>
                  <p className="text-slate-300 font-medium">Happy Clients</p>
                </div>
              </div>
              <div className="stat text-center group">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <h3 className="float-animation text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2" style={{ animationDelay: '1s' }}>100%</h3>
                  <p className="text-slate-300 font-medium">Authentic Reports</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <Reports />

      {/* Enhanced Features Section */}
      <section id="features-section" className="features-section py-24 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-4">
              Why Choose Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Experience the Difference
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands who have transformed their lives with our expert-led, personalized astrology consultations
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card fade-in group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Accurate Predictions</h3>
                <p className="text-slate-600 leading-relaxed">
                  Our expert astrologers use time-tested Vedic astrology principles to provide highly accurate predictions and insights for your life journey.
                </p>
              </div>
            </div>

            <div className="feature-card fade-in group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                  🔒
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">100% Confidential</h3>
                <p className="text-slate-600 leading-relaxed">
                  Your personal information and birth details are kept completely secure and confidential. We never share your data with anyone.
                </p>
              </div>
            </div>

            <div className="feature-card fade-in group bg-white rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="feature-icon w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg text-3xl text-white group-hover:scale-110 transition-transform duration-300">
                  ⚡
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Quick Delivery</h3>
                <p className="text-slate-600 leading-relaxed">
                  Receive your detailed astrology report within 12 hours directly in your email inbox with downloadable PDF format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section id="testimonials-section" className="testimonials-section py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-4">
              Testimonials
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              What Our Clients Say
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Real stories from our satisfied clients who have experienced the transformative power of authentic astrology
            </p>
          </div>
          
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card fade-in group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 to-pink-400"></div>
              <div className="testimonial-content mb-8">
                <div className="flex text-2xl text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "The insights provided in my report were incredibly accurate and helped me make important life decisions. The level of detail was amazing!"
                </p>
              </div>
              <div className="testimonial-author flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  P
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Priya Sharma</h4>
                  <span className="text-sm text-slate-500">Software Engineer, Mumbai</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card fade-in group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
              <div className="testimonial-content mb-8">
                <div className="flex text-2xl text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "Amazing service! The report was detailed and delivered exactly on time. The predictions have been very helpful for my business."
                </p>
              </div>
              <div className="testimonial-author flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Rajesh Kumar</h4>
                  <span className="text-sm text-slate-500">Business Owner, Delhi</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card fade-in group bg-white rounded-3xl shadow-xl p-8 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-400"></div>
              <div className="testimonial-content mb-8">
                <div className="flex text-2xl text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}>⭐</span>
                  ))}
                </div>
                <p className="text-slate-600 leading-relaxed text-lg italic">
                  "Professional and authentic astrology service. The compatibility report helped us tremendously in our marriage planning."
                </p>
              </div>
              <div className="testimonial-author flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  A
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">Anita & Vikram</h4>
                  <span className="text-sm text-slate-500">Couple, Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced About Section */}
      <section id="about-section" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="fade-in">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-6">
                Our Story
              </span>
              <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-8">
                20 Years of Cosmic Wisdom
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Founded in 2003, KundliGen began as a small family practice with a mission to make authentic Vedic astrology accessible to everyone. What started with a single astrologer has grown into a team of certified professionals serving thousands of clients worldwide.
              </p>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Our journey has been guided by the ancient wisdom of Vedic astrology, combined with modern technology to deliver accurate, personalized reports that help people make informed life decisions.
              </p>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">20+</div>
                  <div className="text-slate-600 font-medium">Years of Experience</div>
                </div>
                <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">50K+</div>
                  <div className="text-slate-600 font-medium">Happy Clients</div>
                </div>
              </div>
            </div>
            
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 opacity-90"></div>
                <div className="relative z-10 text-center">
                  <div className="text-8xl mb-6">🔮</div>
                  <h3 className="text-3xl font-bold mb-6">Ancient Vedic Wisdom</h3>
                  <p className="text-purple-100 text-lg leading-relaxed">
                    Rooted in authentic Indian astrology traditions, our methods have been passed down through generations of expert astrologers, ensuring the highest accuracy in predictions.
                  </p>
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-white/5 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Mission & Values */}
      <section className="py-24 bg-gradient-to-br from-slate-50 to-purple-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-4">
              Our Values
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Mission & Values
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              We are committed to providing authentic, accurate, and personalized astrology guidance to help you navigate life's journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in group bg-white rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl text-white group-hover:scale-110 transition-transform duration-300">
                  🎯
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Authenticity</h3>
                <p className="text-slate-600 leading-relaxed">
                  We maintain the highest standards of Vedic astrology, ensuring every prediction and analysis is based on time-tested principles.
                </p>
              </div>
            </div>

            <div className="fade-in group bg-white rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl text-white group-hover:scale-110 transition-transform duration-300">
                  🤝
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Trust</h3>
                <p className="text-slate-600 leading-relaxed">
                  Building lasting relationships with our clients through transparency, confidentiality, and reliable service.
                </p>
              </div>
            </div>

            <div className="fade-in group bg-white rounded-3xl shadow-xl p-10 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-slate-100 relative overflow-hidden" style={{ animationDelay: '0.4s' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl text-white group-hover:scale-110 transition-transform duration-300">
                  💡
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Innovation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Combining traditional wisdom with modern technology to deliver comprehensive and accessible astrology services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Team Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 rounded-full text-purple-600 text-sm font-medium mb-4">
              Our Experts
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-6">
              Meet Our Expert Team
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our certified astrologers bring decades of combined experience in authentic Vedic astrology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="fade-in group bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-purple-100">
              <div className="w-28 h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl text-white">👨‍🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Dr. Rajesh Sharma</h3>
              <p className="text-purple-600 font-bold mb-4 text-lg">Lead Astrologer</p>
              <p className="text-slate-600 leading-relaxed">
                PhD in Vedic Astrology with 25+ years of experience. Specializes in birth chart analysis and career guidance with over 10,000 successful consultations.
              </p>
            </div>

            <div className="fade-in group bg-gradient-to-br from-blue-50 to-cyan-50 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-blue-100" style={{ animationDelay: '0.2s' }}>
              <div className="w-28 h-28 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl text-white">👩‍🎓</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Dr. Priya Patel</h3>
              <p className="text-blue-600 font-bold mb-4 text-lg">Relationship Specialist</p>
              <p className="text-slate-600 leading-relaxed">
                Expert in compatibility analysis and marriage timing. 20+ years helping couples find their perfect match with 95% accuracy rate.
              </p>
            </div>

            <div className="fade-in group bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl shadow-xl p-8 text-center hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-green-100" style={{ animationDelay: '0.4s' }}>
              <div className="w-28 h-28 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <span className="text-4xl text-white">👨‍💼</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">Amit Kumar</h3>
              <p className="text-green-600 font-bold mb-4 text-lg">Financial Astrologer</p>
              <p className="text-slate-600 leading-relaxed">
                Specializes in financial prosperity analysis and investment guidance based on planetary positions. Trusted by 5,000+ business owners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section */}
      <section id="contact-section" className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-40 h-40 bg-purple-400/20 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-20 w-60 h-60 bg-pink-400/20 rounded-full blur-xl"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-purple-200 text-sm font-medium mb-4">
              Contact Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Get In Touch
            </h2>
            <p className="text-xl text-purple-200 max-w-3xl mx-auto">
              Have questions about our astrology services? We're here to help you find the perfect guidance for your journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Enhanced Contact Form */}
            <div className="fade-in">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-purple-200 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-purple-200 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-purple-200 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-purple-200 mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                      >
                        <option value="" className="text-slate-800">Select a subject</option>
                        <option value="general" className="text-slate-800">General Inquiry</option>
                        <option value="birth-chart" className="text-slate-800">Birth Chart Analysis</option>
                        <option value="career" className="text-slate-800">Career Guidance</option>
                        <option value="relationship" className="text-slate-800">Relationship Compatibility</option>
                        <option value="health" className="text-slate-800">Health & Wellness</option>
                        <option value="financial" className="text-slate-800">Financial Prosperity</option>
                        <option value="support" className="text-slate-800">Technical Support</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-purple-200 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-purple-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
                      placeholder="Tell us about your inquiry..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                      isSubmitting 
                        ? 'bg-white/20 cursor-not-allowed text-purple-300' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white transform hover:scale-105 shadow-lg hover:shadow-purple-500/25'
                    }`}
                  >
                    {isSubmitting ? 'Sending Message...' : 'Send Message ✨'}
                  </button>

                  {submitStatus === 'success' && (
                    <div className="bg-green-500/20 backdrop-blur-sm border border-green-400/30 text-green-200 px-4 py-3 rounded-xl">
                      Thank you! Your message has been sent successfully. We'll get back to you soon.
                    </div>
                  )}
                </form>
              </div>
            </div>

            {/* Enhanced Contact Information */}
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-pink-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Office Address</h4>
                    <p className="text-purple-200 text-lg">
                      {config.companyAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Email Us</h4>
                    <p className="text-purple-200 text-lg">
                      <a href={`mailto:${config.companyEmail}`} className="hover:text-pink-300 transition-colors">
                        {config.companyEmail}
                      </a><br />
                      <a href="mailto:support@kundligen.com" className="hover:text-pink-300 transition-colors">
                        support@kundligen.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Call Us</h4>
                    <p className="text-purple-200 text-lg">
                      <a href={`tel:${config.companyPhone}`} className="hover:text-pink-300 transition-colors">
                        {config.companyPhone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 group">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white text-xl">🕒</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">Business Hours</h4>
                    <p className="text-purple-200 text-lg">
                      Monday - Friday: 9:00 AM - 7:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM<br />
                      <span className="text-sm text-purple-300">(IST - Indian Standard Time)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/50 to-pink-900/50"></div>
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Discover Your 
            <span className="block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">Cosmic Path?</span>
          </h2>
          <p className="text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied clients who have found clarity and direction through our astrology services
          </p>
          <button 
            className="group bg-white text-purple-600 font-bold py-6 px-12 rounded-full text-xl shadow-2xl hover:shadow-white/25 transform hover:scale-110 transition-all duration-300 relative overflow-hidden"
            onClick={scrollToReports}
          >
            <span className="relative z-10 flex items-center justify-center">
              ✨ Start Your Journey Today
              <svg className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(60px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }

        .fade-in {
          opacity: 0;
          transform: translateY(40px);
          transition: all 1s ease-out;
        }

        .fade-in.animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-up {
          opacity: 0;
          transform: translateY(60px);
          transition: all 1s ease-out;
        }

        .slide-up.animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          transition: all 1s ease-out;
        }

        .scale-in.animate-fade-in {
          opacity: 1;
          transform: scale(1);
        }

        .float-animation {
          animation: float 4s ease-in-out infinite;
        }

        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};

export default Home;
