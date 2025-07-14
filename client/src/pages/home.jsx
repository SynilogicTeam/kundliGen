import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const scrollContainerRef = useRef(null);
  const [config, setConfig] = useState({
    companyName: 'KundliGen',
    companyEmail: 'info@kundligen.com',
    companyPhone: '+91-9876543210',
    companyAddress: 'Mumbai, Maharashtra, India'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/config');
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

  // Sample reports data
  const reports = [
    {
      _id: '1',
      name: 'Complete Birth Chart Analysis',
      description: 'Comprehensive analysis of your natal chart including personality traits, strengths, weaknesses, and life path guidance',
      price: 2999
    },
    {
      _id: '2',
      name: 'Career & Professional Guidance',
      description: 'Detailed career analysis with job recommendations, timing for career changes, and professional success strategies',
      price: 1999
    },
    {
      _id: '3',
      name: 'Love & Relationship Compatibility',
      description: 'In-depth relationship analysis including compatibility with partners, marriage timing, and relationship advice',
      price: 2499
    },
    {
      _id: '4',
      name: 'Health & Wellness Report',
      description: 'Health predictions based on planetary positions, dietary recommendations, and wellness guidance',
      price: 1799
    },
    {
      _id: '5',
      name: 'Financial Prosperity Analysis',
      description: 'Wealth predictions, investment guidance, and financial planning based on your astrological chart',
      price: 2199
    },
    {
      _id: '6',
      name: 'Yearly Horoscope & Predictions',
      description: 'Detailed yearly predictions covering all aspects of life including career, health, relationships, and finances',
      price: 1499
    }
  ];

  const reportIcons = ['🌟', '💼', '💕', '🏥', '💰', '🔮'];

  useEffect(() => {
    // Add scroll animations when component mounts
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

    // Observe all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .float-animation, .scale-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e) => {
      e.preventDefault();
      const scrollAmount = e.deltaY;
      scrollContainer.scrollLeft += scrollAmount;
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
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

    // Simulate form submission
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
      
      // Reset status after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000);
    }, 2000);
  };

  const scrollToReports = () => {
    const reportsSection = document.getElementById('reports-section');
    if (reportsSection) {
      reportsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };

  return (
    <div className="home-page">
      <Navbar />
      {/* Hero Section */}
      <section className="hero-section fade-in bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Background Stars Effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="star absolute bg-white rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: `${Math.random() * 3 + 1}px`,
                  height: `${Math.random() * 3 + 1}px`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${Math.random() * 3 + 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="hero-content text-center max-w-4xl mx-auto">
            <h1 className="slide-up text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Discover Your Destiny with Professional Astrology Reports
            </h1>
            <p className="slide-up text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Get personalized insights into your life, career, relationships, and future through our comprehensive astrology analysis crafted by expert astrologers
            </p>
            <div className="hero-cta slide-up mb-12" style={{ animationDelay: '0.4s' }}>
              <button 
                className="btn btn-primary btn-large bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                onClick={scrollToReports}
              >
                ✨ Explore Your Cosmic Journey
              </button>
            </div>
            <div className="hero-stats slide-up grid grid-cols-1 sm:grid-cols-3 gap-8" style={{ animationDelay: '0.6s' }}>
              <div className="stat text-center">
                <h3 className="float-animation text-4xl font-bold text-amber-400 mb-2">50+</h3>
                <p className="text-slate-300">Years of Experience</p>
              </div>
              <div className="stat text-center">
                <h3 className="float-animation text-4xl font-bold text-amber-400 mb-2" style={{ animationDelay: '0.5s' }}>10K+</h3>
                <p className="text-slate-300">Happy Clients</p>
              </div>
              <div className="stat text-center">
                <h3 className="float-animation text-4xl font-bold text-amber-400 mb-2" style={{ animationDelay: '1s' }}>100%</h3>
                <p className="text-slate-300">Authentic Reports</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services-section" className="services-section py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-in text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Our Premium Astrology Reports
            </h2>
            <p className="section-subtitle text-lg text-slate-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of personalized astrology reports, each crafted to provide deep insights into different aspects of your life
            </p>
          </div>
          
          <div className="reports-container overflow-x-auto pb-4 custom-scrollbar" ref={scrollContainerRef}>
            <div className="reports-grid flex gap-6 min-w-max px-2">
              {reports.slice(0, 5).map((report, index) => (
                <div 
                  key={report._id} 
                  className={`report-card scale-in bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-4 cursor-pointer w-72 flex-shrink-0 ${
                    selectedReport?._id === report._id ? 'ring-2 ring-indigo-500 bg-indigo-50' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={() => handleReportSelect(report)}
                >
                  <div className="report-icon text-center mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                      <span className="text-xl">{reportIcons[index] || '🔮'}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-800 mb-2 text-center">{report.name}</h3>
                  <p className="text-slate-600 mb-3 text-center text-sm leading-relaxed">{report.description}</p>
                  <div className="report-price text-center mb-3">
                    <span className="price text-xl font-bold text-indigo-600">₹{report.price.toLocaleString()}</span>
                    <span className="duration block text-xs text-slate-500 mt-1">Detailed Analysis</span>
                  </div>
                  <button 
                    className={`w-full py-2 px-3 rounded-lg font-semibold transition-all duration-300 text-sm ${
                      selectedReport?._id === report._id 
                        ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                        : 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white hover:from-indigo-600 hover:to-blue-700'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReportSelect(report);
                    }}
                    style={{ position: 'relative', zIndex: 1 }}
                  >
                    {selectedReport?._id === report._id ? '✓ Selected' : 'Select Report'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports Section */}
      <section id="reports-section" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Choose Your Astrology Report
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Select from our range of comprehensive astrology reports designed to provide deep insights into different aspects of your life
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Report Cards */}
            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌟</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Birth Chart Analysis</h3>
                <p className="text-slate-600 mb-4">Comprehensive analysis of your natal chart revealing your core personality and life path</p>
                <button className="bg-indigo-500 text-white px-6 py-2 rounded-lg hover:bg-indigo-600 transition-colors">
                  Get Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💫</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Career Guidance</h3>
                <p className="text-slate-600 mb-4">Discover your ideal career path and professional opportunities based on your astrological profile</p>
                <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  Get Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💕</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Relationship Compatibility</h3>
                <p className="text-slate-600 mb-4">Understand your relationship dynamics and find your perfect cosmic match</p>
                <button className="bg-rose-500 text-white px-6 py-2 rounded-lg hover:bg-rose-600 transition-colors">
                  Get Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="features-section py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Why Choose Our Astrology Reports?
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Experience the difference with our expert-led, personalized astrology consultations
            </p>
          </div>

          <div className="features-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="feature-card fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="feature-icon text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Accurate Predictions</h3>
              <p className="text-slate-600 leading-relaxed">
                Our expert astrologers use time-tested Vedic astrology principles to provide highly accurate predictions and insights.
              </p>
            </div>
            <div className="feature-card fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="feature-icon text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">100% Confidential</h3>
              <p className="text-slate-600 leading-relaxed">
                Your personal information and birth details are kept completely secure and confidential. We never share your data.
              </p>
            </div>
            <div className="feature-card fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.4s' }}>
              <div className="feature-icon text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Quick Delivery</h3>
              <p className="text-slate-600 leading-relaxed">
                Receive your detailed astrology report within 12 hours directly in your email inbox with downloadable PDF format.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials-section" className="testimonials-section py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Read testimonials from our satisfied clients who have experienced the power of authentic astrology
            </p>
          </div>
          
          <div className="testimonials-grid grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="testimonial-card fade-in bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="testimonial-content mb-6">
                <div className="text-2xl text-amber-400 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-600 leading-relaxed italic">
                  "The insights provided in my report were incredibly accurate and helped me make important life decisions. Highly recommended!"
                </p>
              </div>
              <div className="testimonial-author text-center">
                <h4 className="font-semibold text-slate-800">Priya Sharma</h4>
                <span className="text-sm text-slate-500">Software Engineer, Mumbai</span>
              </div>
            </div>
            
            <div className="testimonial-card fade-in bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="testimonial-content mb-6">
                <div className="text-2xl text-amber-400 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-600 leading-relaxed italic">
                  "Amazing service! The report was detailed and delivered exactly on time. The predictions have been very helpful."
                </p>
              </div>
              <div className="testimonial-author text-center">
                <h4 className="font-semibold text-slate-800">Rajesh Kumar</h4>
                <span className="text-sm text-slate-500">Business Owner, Delhi</span>
              </div>
            </div>
            
            <div className="testimonial-card fade-in bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.4s' }}>
              <div className="testimonial-content mb-6">
                <div className="text-2xl text-amber-400 mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-slate-600 leading-relaxed italic">
                  "Professional and authentic astrology service. The compatibility report helped us in our marriage planning."
                </p>
              </div>
              <div className="testimonial-author text-center">
                <h4 className="font-semibold text-slate-800">Anita & Vikram</h4>
                <span className="text-sm text-slate-500">Couple, Bangalore</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="fade-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Founded in 2003, KundliGen began as a small family practice with a mission to make authentic Vedic astrology accessible to everyone. What started with a single astrologer has grown into a team of certified professionals serving thousands of clients worldwide.
              </p>
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                Our journey has been guided by the ancient wisdom of Vedic astrology, combined with modern technology to deliver accurate, personalized reports that help people make informed life decisions.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">20+</div>
                  <div className="text-slate-600">Years of Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">50K+</div>
                  <div className="text-slate-600">Happy Clients</div>
                </div>
              </div>
            </div>
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-8">
                <div className="text-center">
                  <div className="text-6xl mb-4">🔮</div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Vedic Wisdom</h3>
                  <p className="text-slate-600">
                    Rooted in ancient Indian astrology traditions, our methods have been passed down through generations of expert astrologers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We are committed to providing authentic, accurate, and personalized astrology guidance to help you navigate life's journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Authenticity</h3>
              <p className="text-slate-600">
                We maintain the highest standards of Vedic astrology, ensuring every prediction and analysis is based on time-tested principles.
              </p>
            </div>
            <div className="fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Trust</h3>
              <p className="text-slate-600">
                Building lasting relationships with our clients through transparency, confidentiality, and reliable service.
              </p>
            </div>
            <div className="fade-in bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">Innovation</h3>
              <p className="text-slate-600">
                Combining traditional wisdom with modern technology to deliver comprehensive and accessible astrology services.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Our certified astrologers bring decades of combined experience in Vedic astrology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="fade-in bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">👨‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Dr. Rajesh Sharma</h3>
              <p className="text-indigo-600 font-medium mb-3">Lead Astrologer</p>
              <p className="text-slate-600 text-sm">
                PhD in Vedic Astrology with 25+ years of experience. Specializes in birth chart analysis and career guidance.
              </p>
            </div>

            <div className="fade-in bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.2s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">👩‍🎓</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Dr. Priya Patel</h3>
              <p className="text-indigo-600 font-medium mb-3">Relationship Specialist</p>
              <p className="text-slate-600 text-sm">
                Expert in compatibility analysis and marriage timing. 20+ years helping couples find their perfect match.
              </p>
            </div>

            <div className="fade-in bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{ animationDelay: '0.4s' }}>
              <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-3xl">👨‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Amit Kumar</h3>
              <p className="text-indigo-600 font-medium mb-3">Financial Astrologer</p>
              <p className="text-slate-600 text-sm">
                Specializes in financial prosperity analysis and investment guidance based on planetary positions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact-section" className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Have questions about our astrology services? We're here to help you find the perfect guidance for your journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="fade-in">
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Send Us a Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your phone number"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select a subject</option>
                      <option value="general">General Inquiry</option>
                      <option value="birth-chart">Birth Chart Analysis</option>
                      <option value="career">Career Guidance</option>
                      <option value="relationship">Relationship Compatibility</option>
                      <option value="health">Health & Wellness</option>
                      <option value="financial">Financial Prosperity</option>
                      <option value="support">Technical Support</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 ${
                    isSubmitting 
                      ? 'bg-slate-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? 'Sending Message...' : 'Send Message'}
                </button>

                {submitStatus === 'success' && (
                  <div className="bg-emerald-100 border border-emerald-400 text-emerald-700 px-4 py-3 rounded-lg">
                    Thank you! Your message has been sent successfully. We'll get back to you soon.
                  </div>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="fade-in" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold text-slate-800 mb-6">Contact Information</h3>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Office Address</h4>
                    <p className="text-slate-600">
                      {config.companyAddress}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Email Us</h4>
                    <p className="text-slate-600">
                      <a href={`mailto:${config.companyEmail}`} className="hover:text-indigo-600 transition-colors">
                        {config.companyEmail}
                      </a><br />
                      <a href="mailto:support@kundligen.com" className="hover:text-indigo-600 transition-colors">
                        support@kundligen.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Call Us</h4>
                    <p className="text-slate-600">
                      <a href={`tel:${config.companyPhone}`} className="hover:text-indigo-600 transition-colors">
                        {config.companyPhone}
                      </a><br />
                      {/* <a href="tel:+919876543211" className="hover:text-indigo-600 transition-colors">
                        +91 98765 43211
                      </a> */}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🕒</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800 mb-2">Business Hours</h4>
                    <p className="text-slate-600">
                      Monday - Friday: 9:00 AM - 7:00 PM<br />
                      Saturday: 10:00 AM - 6:00 PM<br />
                      Sunday: 10:00 AM - 4:00 PM<br />
                      <span className="text-sm text-slate-500">(IST - Indian Standard Time)</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-blue-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Discover Your Cosmic Path?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied clients who have found clarity and direction through our astrology services
          </p>
          <button className="bg-white text-indigo-600 font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Start Your Journey Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(50px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .fade-in {
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out;
        }

        .fade-in.animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .slide-up {
          opacity: 0;
          transform: translateY(50px);
          transition: all 0.8s ease-out;
        }

        .slide-up.animate-fade-in {
          opacity: 1;
          transform: translateY(0);
        }

        .scale-in {
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.8s ease-out;
        }

        .scale-in.animate-fade-in {
          opacity: 1;
          transform: scale(1);
        }

        .float-animation {
          animation: float 3s ease-in-out infinite;
        }

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }

        .stars-container {
          position: absolute;
          width: 100%;
          height: 100%;
        }

        .report-card.selected {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Custom Scrollbar Styles */
        .custom-scrollbar::-webkit-scrollbar {
          height: 10px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: linear-gradient(to right, #f8fafc, #e2e8f0);
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to right, #6366f1, #3b82f6);
          border-radius: 8px;
          border: 1px solid #4f46e5;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to right, #4f46e5, #2563eb);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:active {
          background: linear-gradient(to right, #3730a3, #1d4ed8);
        }

        /* Firefox scrollbar styles */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #6366f1 #f8fafc;
        }
      `}</style>
    </div>
  );
};

export default Home;
