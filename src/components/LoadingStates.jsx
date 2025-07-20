import React, { useState, useEffect } from 'react';

// Main Loading Screen Component
export function LoadingScreen({ 
  isLoading, 
  progress = 0, 
  message = "Loading...", 
  subMessage = "",
  showProgress = true 
}) {
  const [dots, setDots] = useState('');

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!isLoading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9998,
      color: 'white',
      fontFamily: '"Space Mono", monospace'
    }}>
      {/* Animated Solar System Loader */}
      <div style={{
        position: 'relative',
        width: '120px',
        height: '120px',
        marginBottom: '2rem'
      }}>
        {/* Sun */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '20px',
          height: '20px',
          background: 'linear-gradient(45deg, #ffaa00, #ff6600)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 20px rgba(255, 170, 0, 0.8)',
          animation: 'pulse 2s infinite'
        }} />

        {/* Orbiting Planets */}
        {[1, 2, 3].map((planet, index) => (
          <div
            key={planet}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${40 + index * 25}px`,
              height: `${40 + index * 25}px`,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              animation: `orbit ${2 + index}s linear infinite`
            }}
          >
            <div style={{
              position: 'absolute',
              top: '-3px',
              left: '50%',
              width: '6px',
              height: '6px',
              background: `hsl(${200 + index * 60}, 70%, 60%)`,
              borderRadius: '50%',
              transform: 'translateX(-50%)',
              boxShadow: `0 0 10px hsla(${200 + index * 60}, 70%, 60%, 0.8)`
            }} />
          </div>
        ))}
      </div>

      {/* Loading Message */}
      <h2 style={{
        fontSize: '1.8rem',
        fontWeight: '700',
        marginBottom: '0.5rem',
        background: 'linear-gradient(45deg, #667eea, #764ba2)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontFamily: '"Orbitron", sans-serif'
      }}>
        {message}{dots}
      </h2>

      {/* Sub Message */}
      {subMessage && (
        <p style={{
          fontSize: '1rem',
          opacity: 0.8,
          marginBottom: '2rem',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          {subMessage}
        </p>
      )}

      {/* Progress Bar */}
      {showProgress && (
        <div style={{
          width: '300px',
          height: '4px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '2px',
          overflow: 'hidden',
          marginBottom: '1rem'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #667eea, #764ba2)',
            borderRadius: '2px',
            transition: 'width 0.3s ease',
            boxShadow: '0 0 10px rgba(102, 126, 234, 0.5)'
          }} />
        </div>
      )}

      {/* Progress Percentage */}
      {showProgress && (
        <p style={{
          fontSize: '0.9rem',
          opacity: 0.7,
          fontWeight: '600'
        }}>
          {Math.round(progress)}%
        </p>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        
        @keyframes orbit {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Skeleton Loader for Planet Cards
export function PlanetCardSkeleton() {
  return (
    <div style={{
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '15px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      animation: 'shimmer 2s infinite'
    }}>
      <div style={{
        width: '100%',
        height: '200px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '10px',
        marginBottom: '15px'
      }} />
      
      <div style={{
        width: '60%',
        height: '20px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '10px'
      }} />
      
      <div style={{
        width: '80%',
        height: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px',
        marginBottom: '8px'
      }} />
      
      <div style={{
        width: '40%',
        height: '16px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '4px'
      }} />

      <style jsx>{`
        @keyframes shimmer {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// Inline Loading Spinner
export function LoadingSpinner({ size = 40, color = '#667eea' }) {
  return (
    <div style={{
      width: `${size}px`,
      height: `${size}px`,
      border: `3px solid rgba(255, 255, 255, 0.3)`,
      borderTop: `3px solid ${color}`,
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

// Button Loading State
export function LoadingButton({ 
  children, 
  isLoading, 
  onClick, 
  disabled,
  style = {},
  ...props 
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: isLoading ? 0.7 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        ...style
      }}
      {...props}
    >
      {isLoading && <LoadingSpinner size={16} color="currentColor" />}
      <span style={{ opacity: isLoading ? 0.7 : 1 }}>
        {isLoading ? 'Loading...' : children}
      </span>
    </button>
  );
}

// Progress Bar Component
export function ProgressBar({ 
  progress, 
  showPercentage = true, 
  height = 8, 
  color = '#667eea',
  backgroundColor = 'rgba(255, 255, 255, 0.1)' 
}) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    }}>
      <div style={{
        width: '100%',
        height: `${height}px`,
        background: backgroundColor,
        borderRadius: `${height / 2}px`,
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${Math.min(100, Math.max(0, progress))}%`,
          height: '100%',
          background: `linear-gradient(90deg, ${color}, ${color}dd)`,
          borderRadius: `${height / 2}px`,
          transition: 'width 0.3s ease',
          boxShadow: `0 0 10px ${color}80`
        }} />
      </div>
      
      {showPercentage && (
        <div style={{
          textAlign: 'center',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)',
          fontFamily: '"Space Mono", monospace'
        }}>
          {Math.round(progress)}%
        </div>
      )}
    </div>
  );
}
