import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Header.css';

const Header = ({ 
  onSearch, 
  searchValue, 
  onSearchChange, 
  searchMessage,
  onAuthClick,
  isAuthenticated = false,
  user = null 
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchValue);
    }
  };

  const menuItems = [
    { label: 'Solar System', href: '#home', icon: '🌌' },
    { label: 'Planets', href: '#planets', icon: '🪐' },
    { label: 'Exploration', href: '#explore', icon: '🚀' },
    { label: 'Education', href: '#learn', icon: '📚' },
    { label: 'Settings', href: '#settings', icon: '⚙️' }
  ];

  return (
    <motion.header 
      className="professional-header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="header-container">
        {/* Logo and Brand */}
        <motion.div 
          className="brand-section"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="logo">
            <span className="logo-icon">🌌</span>
            <span className="logo-text">SolarScope</span>
          </div>
          <span className="tagline">Professional Space Exploration</span>
        </motion.div>

        {/* Navigation Menu */}
        <nav className="main-navigation">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <motion.li 
                key={item.label}
                className="nav-item"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <a href={item.href} className="nav-link">
                  <span className="nav-icon">{item.icon}</span>
                  <span className="nav-label">{item.label}</span>
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>

        {/* Search Section */}
        <div className="search-section">
          <form onSubmit={handleSearchSubmit} className="search-form">
            <motion.div 
              className={`search-container ${isSearchFocused ? 'focused' : ''}`}
              whileFocus={{ scale: 1.02 }}
            >
              <input
                type="text"
                placeholder="Search planets, sun..."
                value={searchValue}
                onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="search-input"
              />
              <motion.button 
                type="submit" 
                className="search-button"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                🔍
              </motion.button>
            </motion.div>
          </form>
          
          <AnimatePresence>
            {searchMessage && (
              <motion.div 
                className="search-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {searchMessage}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User Section */}
        <div className="user-section">
          {isAuthenticated ? (
            <motion.div 
              className="user-profile"
              whileHover={{ scale: 1.05 }}
            >
              <div className="user-avatar">
                {user?.avatar || '👤'}
              </div>
              <span className="user-name">{user?.name || 'Explorer'}</span>
              <motion.button 
                className="dropdown-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                whileTap={{ scale: 0.95 }}
              >
                ▼
              </motion.button>
              
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div 
                    className="user-dropdown"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <a href="#profile" className="dropdown-item">Profile</a>
                    <a href="#settings" className="dropdown-item">Settings</a>
                    <a href="#logout" className="dropdown-item">Logout</a>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.button 
              className="auth-button"
              onClick={onAuthClick}
              whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)" }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="auth-icon">🚀</span>
              <span>Sign In</span>
            </motion.button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className="mobile-menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <span className={`hamburger ${isMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            className="mobile-navigation"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mobile-nav-content">
              {menuItems.map((item, index) => (
                <motion.a 
                  key={item.label}
                  href={item.href} 
                  className="mobile-nav-item"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span className="mobile-nav-icon">{item.icon}</span>
                  <span className="mobile-nav-label">{item.label}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
