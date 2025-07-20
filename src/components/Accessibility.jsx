import React, { useEffect, useRef, useState } from 'react';

// Focus Management Hook
export function useFocusManagement() {
  const focusStack = useRef([]);
  
  const pushFocus = (element) => {
    if (document.activeElement) {
      focusStack.current.push(document.activeElement);
    }
    if (element && element.focus) {
      element.focus();
    }
  };
  
  const popFocus = () => {
    const previousElement = focusStack.current.pop();
    if (previousElement && previousElement.focus) {
      previousElement.focus();
    }
  };
  
  const clearFocusStack = () => {
    focusStack.current = [];
  };
  
  return { pushFocus, popFocus, clearFocusStack };
}

// Screen Reader Announcements
export function useScreenReader() {
  const announcementRef = useRef();
  
  const announce = (message, priority = 'polite') => {
    if (!announcementRef.current) {
      // Create announcement element if it doesn't exist
      const element = document.createElement('div');
      element.setAttribute('aria-live', priority);
      element.setAttribute('aria-atomic', 'true');
      element.style.position = 'absolute';
      element.style.left = '-10000px';
      element.style.width = '1px';
      element.style.height = '1px';
      element.style.overflow = 'hidden';
      document.body.appendChild(element);
      announcementRef.current = element;
    }
    
    // Clear and set new message
    announcementRef.current.textContent = '';
    setTimeout(() => {
      if (announcementRef.current) {
        announcementRef.current.textContent = message;
      }
    }, 100);
  };
  
  useEffect(() => {
    return () => {
      if (announcementRef.current) {
        document.body.removeChild(announcementRef.current);
      }
    };
  }, []);
  
  return { announce };
}

// Skip Links Component
export function SkipLinks({ links = [] }) {
  const defaultLinks = [
    { href: '#main-content', label: 'Skip to main content' },
    { href: '#navigation', label: 'Skip to navigation' },
    { href: '#search', label: 'Skip to search' }
  ];
  
  const allLinks = links.length > 0 ? links : defaultLinks;
  
  return (
    <div style={{
      position: 'absolute',
      top: '-100px',
      left: '0',
      zIndex: 10001
    }}>
      {allLinks.map((link, index) => (
        <a
          key={index}
          href={link.href}
          style={{
            position: 'absolute',
            left: '-10000px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            background: '#000',
            color: '#fff',
            padding: '8px 16px',
            textDecoration: 'none',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.3s ease'
          }}
          onFocus={(e) => {
            e.target.style.position = 'static';
            e.target.style.left = 'auto';
            e.target.style.width = 'auto';
            e.target.style.height = 'auto';
            e.target.style.overflow = 'visible';
          }}
          onBlur={(e) => {
            e.target.style.position = 'absolute';
            e.target.style.left = '-10000px';
            e.target.style.width = '1px';
            e.target.style.height = '1px';
            e.target.style.overflow = 'hidden';
          }}
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}

// Accessible Button Component
export function AccessibleButton({
  children,
  onClick,
  ariaLabel,
  ariaDescribedBy,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ...props
}) {
  const buttonRef = useRef();
  
  const baseStyles = {
    border: 'none',
    borderRadius: '8px',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontFamily: '"Space Mono", monospace',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    opacity: disabled ? 0.6 : 1,
    outline: 'none',
    position: 'relative'
  };
  
  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
      border: '1px solid rgba(255, 255, 255, 0.3)'
    },
    danger: {
      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      color: 'white',
      boxShadow: '0 4px 15px rgba(245, 87, 108, 0.4)'
    }
  };
  
  const sizes = {
    small: { padding: '8px 16px', fontSize: '0.8rem' },
    medium: { padding: '12px 24px', fontSize: '1rem' },
    large: { padding: '16px 32px', fontSize: '1.2rem' }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && onClick) {
        onClick(e);
      }
    }
  };
  
  return (
    <button
      ref={buttonRef}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      style={{
        ...baseStyles,
        ...variants[variant],
        ...sizes[size]
      }}
      onFocus={(e) => {
        e.target.style.outline = '2px solid #667eea';
        e.target.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.target.style.outline = 'none';
      }}
      onMouseEnter={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(-2px)';
          if (variant === 'primary') {
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          e.target.style.transform = 'translateY(0)';
          if (variant === 'primary') {
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
          }
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
}

// Accessible Modal Component
export function AccessibleModal({
  isOpen,
  onClose,
  title,
  children,
  closeOnEscape = true,
  closeOnOverlayClick = true,
  initialFocus = null
}) {
  const modalRef = useRef();
  const overlayRef = useRef();
  const { pushFocus, popFocus } = useFocusManagement();
  
  useEffect(() => {
    if (isOpen) {
      // Focus management
      if (initialFocus) {
        pushFocus(initialFocus);
      } else if (modalRef.current) {
        pushFocus(modalRef.current);
      }
      
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements?.[0];
      const lastElement = focusableElements?.[focusableElements.length - 1];
      
      const handleTabKey = (e) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        popFocus();
      };
    }
  }, [isOpen, initialFocus, pushFocus, popFocus]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose?.();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(10px)'
      }}
      onClick={(e) => {
        if (closeOnOverlayClick && e.target === overlayRef.current) {
          onClose?.();
        }
      }}
    >
      <div
        ref={modalRef}
        tabIndex={-1}
        style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
          color: 'white',
          fontFamily: '"Space Mono", monospace',
          outline: 'none'
        }}
      >
        {title && (
          <h2
            id="modal-title"
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Orbitron", sans-serif'
            }}
          >
            {title}
          </h2>
        )}
        
        {children}
      </div>
    </div>
  );
}

// High Contrast Mode Toggle
export function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);
  
  useEffect(() => {
    const savedPreference = localStorage.getItem('highContrast') === 'true';
    setIsHighContrast(savedPreference);
    
    if (savedPreference) {
      document.body.classList.add('high-contrast');
    }
  }, []);
  
  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('highContrast', newValue.toString());
    
    if (newValue) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  };
  
  return (
    <AccessibleButton
      onClick={toggleHighContrast}
      ariaLabel={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      variant="secondary"
      size="small"
    >
      {isHighContrast ? '🔆' : '🌓'} High Contrast
    </AccessibleButton>
  );
}
