import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    document.querySelectorAll('.fade-in, .slide-up, .scale-in').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
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

  return (
    <div className="contact-page">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-section fade-in bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 overflow-hidden">
          <div className="stars-container">
            {[...Array(30)].map((_, i) => (
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
              Get In Touch
            </h1>
            <p className="slide-up text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Have questions about our astrology services? We're here to help you find the perfect guidance for your journey
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="fade-in">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Send Us a Message</h2>
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
              <h2 className="text-3xl font-bold text-slate-800 mb-6">Contact Information</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">📍</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Office Address</h3>
                    <p className="text-slate-600">
                      123 Astrology Lane<br />
                      Andheri West, Mumbai<br />
                      Maharashtra 400058, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Email Us</h3>
                    <p className="text-slate-600">
                      <a href="mailto:info@kundligen.com" className="hover:text-indigo-600 transition-colors">
                        info@kundligen.com
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
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Call Us</h3>
                    <p className="text-slate-600">
                      <a href="tel:+919876543210" className="hover:text-indigo-600 transition-colors">
                        +91 98765 43210
                      </a><br />
                      <a href="tel:+919876543211" className="hover:text-indigo-600 transition-colors">
                        +91 98765 43211
                      </a>
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                    <span className="text-white text-xl">🕒</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">Business Hours</h3>
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

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Find answers to common questions about our astrology services
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="fade-in bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">How accurate are your predictions?</h3>
              <p className="text-slate-600">
                Our predictions are based on authentic Vedic astrology principles and have an accuracy rate of over 85%. We use precise planetary calculations and expert analysis.
              </p>
            </div>

            <div className="fade-in bg-white rounded-xl shadow-lg p-6" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">How long does it take to receive my report?</h3>
              <p className="text-slate-600">
                Most reports are delivered within 12-24 hours. Complex analyses may take up to 48 hours. You'll receive an email notification when your report is ready.
              </p>
            </div>

            <div className="fade-in bg-white rounded-xl shadow-lg p-6" style={{ animationDelay: '0.4s' }}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Is my personal information secure?</h3>
              <p className="text-slate-600">
                Absolutely! We follow strict data protection protocols. Your birth details and personal information are encrypted and never shared with third parties.
              </p>
            </div>

            <div className="fade-in bg-white rounded-xl shadow-lg p-6" style={{ animationDelay: '0.6s' }}>
              <h3 className="text-lg font-semibold text-slate-800 mb-3">Can I get a refund if I'm not satisfied?</h3>
              <p className="text-slate-600">
                We offer a 100% satisfaction guarantee. If you're not completely satisfied with your report, we'll provide a full refund within 7 days of purchase.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Find Us</h2>
            <p className="text-lg text-slate-600">
              Visit our office for in-person consultations
            </p>
          </div>
          
          <div className="fade-in bg-slate-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Interactive Map</h3>
              <p className="text-slate-600">
                Map integration coming soon<br />
                Address: 123 Astrology Lane, Andheri West, Mumbai
              </p>
            </div>
          </div>
        </div>
      </section>

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

        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
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

export default Contact; 