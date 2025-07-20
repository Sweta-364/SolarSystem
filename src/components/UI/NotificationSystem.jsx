import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './NotificationSystem.css';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a new notification
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto-remove notification after duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Function to remove a notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  // Expose functions globally for easy access
  useEffect(() => {
    window.showNotification = addNotification;
    window.hideNotification = removeNotification;

    return () => {
      delete window.showNotification;
      delete window.hideNotification;
    };
  }, [addNotification, removeNotification]);

  const getNotificationIcon = (type) => {
    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      loading: '⏳',
      achievement: '🏆',
      discovery: '🔍',
      navigation: '🧭'
    };
    return icons[type] || icons.info;
  };

  const getNotificationColor = (type) => {
    const colors = {
      success: { bg: 'rgba(34, 197, 94, 0.1)', border: 'rgba(34, 197, 94, 0.3)', text: '#22c55e' },
      error: { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.3)', text: '#ef4444' },
      warning: { bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.3)', text: '#f59e0b' },
      info: { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.3)', text: '#3b82f6' },
      loading: { bg: 'rgba(147, 51, 234, 0.1)', border: 'rgba(147, 51, 234, 0.3)', text: '#9333ea' },
      achievement: { bg: 'rgba(255, 215, 0, 0.1)', border: 'rgba(255, 215, 0, 0.3)', text: '#ffd700' },
      discovery: { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.3)', text: '#10b981' },
      navigation: { bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.3)', text: '#6366f1' }
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="notification-system">
      <AnimatePresence>
        {notifications.map((notification, index) => {
          const colors = getNotificationColor(notification.type);
          
          return (
            <motion.div
              key={notification.id}
              className={`notification notification-${notification.type}`}
              style={{
                '--notification-bg': colors.bg,
                '--notification-border': colors.border,
                '--notification-text': colors.text,
              }}
              initial={{ opacity: 0, x: 300, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                x: 0, 
                scale: 1,
                y: index * -80 // Stack notifications
              }}
              exit={{ 
                opacity: 0, 
                x: 300, 
                scale: 0.9,
                transition: { duration: 0.3 }
              }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              layout
            >
              <div className="notification-content">
                <div className="notification-header">
                  <span className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="notification-text">
                    {notification.title && (
                      <div className="notification-title">
                        {notification.title}
                      </div>
                    )}
                    <div className="notification-message">
                      {notification.message}
                    </div>
                  </div>
                  <motion.button
                    className="notification-close"
                    onClick={() => removeNotification(notification.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ×
                  </motion.button>
                </div>

                {notification.actions && (
                  <div className="notification-actions">
                    {notification.actions.map((action, actionIndex) => (
                      <motion.button
                        key={actionIndex}
                        className={`notification-action ${action.primary ? 'primary' : 'secondary'}`}
                        onClick={() => {
                          action.onClick && action.onClick();
                          if (action.closeOnClick !== false) {
                            removeNotification(notification.id);
                          }
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {action.label}
                      </motion.button>
                    ))}
                  </div>
                )}

                {notification.duration > 0 && (
                  <motion.div
                    className="notification-progress"
                    initial={{ width: '100%' }}
                    animate={{ width: '0%' }}
                    transition={{ 
                      duration: notification.duration / 1000,
                      ease: "linear"
                    }}
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

// Utility functions for common notification types
export const showSuccess = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'success',
      message,
      ...options
    });
  }
};

export const showError = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'error',
      message,
      duration: 7000, // Longer duration for errors
      ...options
    });
  }
};

export const showWarning = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'warning',
      message,
      duration: 6000,
      ...options
    });
  }
};

export const showInfo = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'info',
      message,
      ...options
    });
  }
};

export const showLoading = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'loading',
      message,
      duration: 0, // Don't auto-hide loading notifications
      ...options
    });
  }
};

export const showAchievement = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'achievement',
      message,
      duration: 8000, // Longer duration for achievements
      ...options
    });
  }
};

export const showDiscovery = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'discovery',
      message,
      duration: 6000,
      ...options
    });
  }
};

export const showNavigation = (message, options = {}) => {
  if (window.showNotification) {
    return window.showNotification({
      type: 'navigation',
      message,
      duration: 4000,
      ...options
    });
  }
};

export const hideNotification = (id) => {
  if (window.hideNotification) {
    window.hideNotification(id);
  }
};

export default NotificationSystem;
