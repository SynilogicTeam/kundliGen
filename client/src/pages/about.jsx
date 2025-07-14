import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
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

  return (
    <div className="about-page">
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
              About KundliGen
            </h1>
            <p className="slide-up text-lg sm:text-xl text-slate-200 mb-8 leading-relaxed" style={{ animationDelay: '0.2s' }}>
              Your trusted partner in authentic Vedic astrology, providing personalized insights and guidance for over two decades
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
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

      {/* Certifications */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">
              Our Certifications & Recognition
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We maintain the highest standards of professional astrology practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="fade-in text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">🏆</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">ISO Certified</h3>
              <p className="text-slate-600 text-sm">Quality Management System</p>
            </div>

            <div className="fade-in text-center" style={{ animationDelay: '0.2s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">📜</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Vedic Council</h3>
              <p className="text-slate-600 text-sm">Recognized Astrology Institute</p>
            </div>

            <div className="fade-in text-center" style={{ animationDelay: '0.4s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Best Service</h3>
              <p className="text-slate-600 text-sm">Award 2023</p>
            </div>

            <div className="fade-in text-center" style={{ animationDelay: '0.6s' }}>
              <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-2xl text-white">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Data Protection</h3>
              <p className="text-slate-600 text-sm">GDPR Compliant</p>
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

export default About; 