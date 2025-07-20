import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './LoadingScreen.css';

const LoadingScreen = ({ onComplete, progress = 0 }) => {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [loadingPhase, setLoadingPhase] = useState('initializing');
  const [loadingText, setLoadingText] = useState('Initializing Solar System...');

  const loadingPhases = [
    { phase: 'initializing', text: 'Initializing Solar System...', duration: 1000 },
    { phase: 'textures', text: 'Loading Planet Textures...', duration: 1500 },
    { phase: 'physics', text: 'Calculating Orbital Mechanics...', duration: 1200 },
    { phase: 'rendering', text: 'Preparing 3D Environment...', duration: 1000 },
    { phase: 'finalizing', text: 'Finalizing Experience...', duration: 800 },
    { phase: 'complete', text: 'Ready for Exploration!', duration: 500 }
  ];

  useEffect(() => {
    let phaseIndex = 0;
    let progressValue = 0;

    const updatePhase = () => {
      if (phaseIndex < loadingPhases.length) {
        const currentPhase = loadingPhases[phaseIndex];
        setLoadingPhase(currentPhase.phase);
        setLoadingText(currentPhase.text);

        // Simulate progress for this phase
        const phaseProgress = 100 / loadingPhases.length;
        const startProgress = phaseIndex * phaseProgress;
        const endProgress = (phaseIndex + 1) * phaseProgress;

        const progressInterval = setInterval(() => {
          progressValue += 2;
          const currentPhaseProgress = Math.min(progressValue, endProgress);
          setCurrentProgress(currentPhaseProgress);

          if (currentPhaseProgress >= endProgress) {
            clearInterval(progressInterval);
            phaseIndex++;
            
            if (phaseIndex < loadingPhases.length) {
              setTimeout(updatePhase, 200);
            } else {
              // Loading complete
              setTimeout(() => {
                onComplete && onComplete();
              }, 1000);
            }
          }
        }, 50);
      }
    };

    updatePhase();
  }, [onComplete]);

  const planetIcons = ['☀️', '☿️', '♀️', '🌍', '♂️', '♃', '♄', '♅', '♆'];

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Animated Background */}
      <div className="loading-background">
        <div className="stars-layer"></div>
        <div className="nebula-layer"></div>
        
        {/* Floating Planets */}
        <div className="floating-planets">
          {planetIcons.map((icon, index) => (
            <motion.div
              key={index}
              className="floating-planet"
              style={{
                left: `${10 + (index * 10)}%`,
                top: `${20 + Math.sin(index) * 30}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 3 + index * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              {icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Loading Content */}
      <div className="loading-content">
        {/* Logo Section */}
        <motion.div
          className="loading-logo"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div
            className="logo-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            🌌
          </motion.div>
          <h1 className="logo-title">SolarScope</h1>
          <p className="logo-subtitle">Professional Space Exploration Platform</p>
        </motion.div>

        {/* Loading Progress */}
        <motion.div
          className="loading-progress-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {/* Progress Bar */}
          <div className="progress-container">
            <div className="progress-track">
              <motion.div
                className="progress-fill"
                style={{ width: `${currentProgress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
              <motion.div
                className="progress-glow"
                style={{ left: `${currentProgress}%` }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
            <div className="progress-percentage">
              {Math.round(currentProgress)}%
            </div>
          </div>

          {/* Loading Text */}
          <AnimatePresence mode="wait">
            <motion.div
              key={loadingPhase}
              className="loading-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <span className="loading-phase-icon">
                {getPhaseIcon(loadingPhase)}
              </span>
              <span className="loading-phase-text">{loadingText}</span>
            </motion.div>
          </AnimatePresence>

          {/* Loading Dots Animation */}
          <div className="loading-dots">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="loading-dot"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* System Information */}
        <motion.div
          className="system-info"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <div className="info-grid">
            <div className="info-item">
              <span className="info-icon">🌍</span>
              <span className="info-label">Planets</span>
              <span className="info-value">9</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🌙</span>
              <span className="info-label">Moons</span>
              <span className="info-value">200+</span>
            </div>
            <div className="info-item">
              <span className="info-icon">⭐</span>
              <span className="info-label">Stars</span>
              <span className="info-value">8000+</span>
            </div>
            <div className="info-item">
              <span className="info-icon">🚀</span>
              <span className="info-label">Missions</span>
              <span className="info-value">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          className="loading-tips"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <h3 className="tips-title">💡 Pro Tips</h3>
          <div className="tips-list">
            <motion.div
              className="tip-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2 }}
            >
              <span className="tip-icon">🖱️</span>
              <span className="tip-text">Click on planets to explore them up close</span>
            </motion.div>
            <motion.div
              className="tip-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.3 }}
            >
              <span className="tip-icon">🔍</span>
              <span className="tip-text">Use the search bar to quickly navigate</span>
            </motion.div>
            <motion.div
              className="tip-item"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 2.6 }}
            >
              <span className="tip-icon">📱</span>
              <span className="tip-text">Drag the control panel to reposition it</span>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Version Info */}
      <motion.div
        className="version-info"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
      >
        <span>SolarScope v2.0 | Professional Edition</span>
      </motion.div>
    </motion.div>
  );
};

// Helper function to get phase icons
const getPhaseIcon = (phase) => {
  const icons = {
    initializing: '⚡',
    textures: '🎨',
    physics: '🔬',
    rendering: '🖥️',
    finalizing: '✨',
    complete: '🚀'
  };
  return icons[phase] || '⚡';
};

export default LoadingScreen;
