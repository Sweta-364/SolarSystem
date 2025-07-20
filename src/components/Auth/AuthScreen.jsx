import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './AuthScreen.css';

const AuthScreen = ({ onAuthComplete }) => {
  const [authMode, setAuthMode] = useState('welcome'); // welcome, login, signup
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const containerRef = useRef();

  // Cosmic background animation
  useEffect(() => {
    const createStars = () => {
      const starsContainer = containerRef.current?.querySelector('.cosmic-stars');
      if (!starsContainer) return;

      // Clear existing stars
      starsContainer.innerHTML = '';

      // Create animated stars
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'cosmic-star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 3}s`;
        star.style.animationDuration = `${2 + Math.random() * 3}s`;
        starsContainer.appendChild(star);
      }
    };

    createStars();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (authMode === 'signup') {
      if (!formData.username) {
        newErrors.username = 'Username is required';
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onAuthComplete({
        email: formData.email,
        username: formData.username || formData.email.split('@')[0],
        authMode
      });
    }, 2000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 1, staggerChildren: 0.1 }
    },
    exit: { 
      opacity: 0,
      scale: 0.9,
      transition: { duration: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <motion.div
      ref={containerRef}
      className="auth-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Cosmic Background */}
      <div className="cosmic-background">
        <div className="cosmic-stars"></div>
        <div className="cosmic-nebula"></div>
        <div className="cosmic-planets">
          <div className="floating-planet planet-1"></div>
          <div className="floating-planet planet-2"></div>
          <div className="floating-planet planet-3"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="auth-content">
        <AnimatePresence mode="wait">
          {authMode === 'welcome' && (
            <motion.div
              key="welcome"
              className="welcome-section"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div className="cosmic-logo" variants={itemVariants}>
                <div className="logo-galaxy">🌌</div>
                <h1 className="logo-title">SolarScope</h1>
                <p className="logo-subtitle">Professional Space Exploration Platform</p>
              </motion.div>

              <motion.div className="welcome-text" variants={itemVariants}>
                <h2>Welcome to the Universe</h2>
                <p>Embark on an extraordinary journey through our solar system with cutting-edge 3D visualization and professional-grade astronomical data.</p>
              </motion.div>

              <motion.div className="auth-buttons" variants={itemVariants}>
                <motion.button
                  className="auth-btn primary"
                  onClick={() => setAuthMode('login')}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(59, 130, 246, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">🚀</span>
                  Launch Mission (Login)
                </motion.button>
                
                <motion.button
                  className="auth-btn secondary"
                  onClick={() => setAuthMode('signup')}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(147, 51, 234, 0.4)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="btn-icon">⭐</span>
                  Join the Crew (Sign Up)
                </motion.button>
              </motion.div>

              <motion.div className="features-preview" variants={itemVariants}>
                <div className="feature">
                  <span className="feature-icon">🌍</span>
                  <span className="feature-text">Explore 9 Planets</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🌟</span>
                  <span className="feature-text">Real NASA Data</span>
                </div>
                <div className="feature">
                  <span className="feature-icon">🎮</span>
                  <span className="feature-text">Interactive 3D</span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {(authMode === 'login' || authMode === 'signup') && (
            <motion.div
              key={authMode}
              className="form-section"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.div className="form-header" variants={itemVariants}>
                <button 
                  className="back-btn"
                  onClick={() => setAuthMode('welcome')}
                >
                  ← Back to Mission Control
                </button>
                <h2>{authMode === 'login' ? '🚀 Mission Login' : '⭐ Join the Crew'}</h2>
                <p>{authMode === 'login' ? 'Welcome back, Space Explorer!' : 'Begin your cosmic journey today!'}</p>
              </motion.div>

              <motion.form 
                className="auth-form" 
                onSubmit={handleSubmit}
                variants={itemVariants}
              >
                {authMode === 'signup' && (
                  <motion.div className="form-group" variants={itemVariants}>
                    <label htmlFor="username">👨‍🚀 Astronaut Name</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      placeholder="Enter your space name"
                      className={errors.username ? 'error' : ''}
                    />
                    {errors.username && <span className="error-message">{errors.username}</span>}
                  </motion.div>
                )}

                <motion.div className="form-group" variants={itemVariants}>
                  <label htmlFor="email">📧 Mission Control Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="astronaut@space.com"
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </motion.div>

                <motion.div className="form-group" variants={itemVariants}>
                  <label htmlFor="password">🔐 Security Code</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your secure code"
                    className={errors.password ? 'error' : ''}
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </motion.div>

                {authMode === 'signup' && (
                  <motion.div className="form-group" variants={itemVariants}>
                    <label htmlFor="confirmPassword">🔒 Confirm Security Code</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="Confirm your secure code"
                      className={errors.confirmPassword ? 'error' : ''}
                    />
                    {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  className={`submit-btn ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <>
                      <div className="loading-spinner"></div>
                      {authMode === 'login' ? 'Launching...' : 'Joining Crew...'}
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">{authMode === 'login' ? '🚀' : '⭐'}</span>
                      {authMode === 'login' ? 'Launch Mission' : 'Join the Crew'}
                    </>
                  )}
                </motion.button>
              </motion.form>

              <motion.div className="form-footer" variants={itemVariants}>
                <p>
                  {authMode === 'login' ? "New to space exploration? " : "Already have a mission account? "}
                  <button 
                    className="switch-mode-btn"
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  >
                    {authMode === 'login' ? 'Join the crew here' : 'Login to your mission'}
                  </button>
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Elements */}
      <div className="floating-elements">
        <div className="floating-element element-1">🌟</div>
        <div className="floating-element element-2">🚀</div>
        <div className="floating-element element-3">🛸</div>
        <div className="floating-element element-4">🌙</div>
        <div className="floating-element element-5">⭐</div>
      </div>
    </motion.div>
  );
};

export default AuthScreen;
