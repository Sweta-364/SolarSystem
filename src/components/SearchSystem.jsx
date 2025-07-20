import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AccessibleButton } from './Accessibility';

// Advanced Search Component
export function AdvancedSearch({
  isOpen,
  onClose,
  onSearch,
  onNavigate,
  planets = [],
  searchHistory = [],
  onClearHistory
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchType, setSearchType] = useState('all'); // all, planets, facts, features
  const inputRef = useRef();
  const resultsRef = useRef();

  // Search data including facts and features
  const searchData = useMemo(() => {
    const planetData = planets.map(planet => ({
      type: 'planet',
      name: planet.name,
      description: `Navigate to ${planet.name}`,
      keywords: [planet.name.toLowerCase()],
      action: () => onNavigate?.(planet.name),
      icon: '🪐'
    }));

    const sunData = [{
      type: 'celestial',
      name: 'Sun',
      description: 'Navigate to the Sun',
      keywords: ['sun', 'star', 'solar'],
      action: () => onNavigate?.('Sun'),
      icon: '☀️'
    }];

    const facts = [
      {
        type: 'fact',
        name: 'Earth Layers',
        description: 'Learn about Earth\'s interior structure',
        keywords: ['earth', 'layers', 'core', 'mantle', 'crust', 'interior'],
        action: () => onNavigate?.('Earth'),
        icon: '🌍'
      },
      {
        type: 'fact',
        name: 'Saturn Rings',
        description: 'Explore Saturn\'s magnificent ring system',
        keywords: ['saturn', 'rings', 'particles', 'ice', 'rocks'],
        action: () => onNavigate?.('Saturn'),
        icon: '🪐'
      },
      {
        type: 'fact',
        name: 'Jupiter Moons',
        description: 'Discover Jupiter\'s 95 moons',
        keywords: ['jupiter', 'moons', 'satellites', 'io', 'europa', 'ganymede', 'callisto'],
        action: () => onNavigate?.('Jupiter'),
        icon: '🌕'
      },
      {
        type: 'fact',
        name: 'Mars Exploration',
        description: 'Learn about Mars and its two moons',
        keywords: ['mars', 'red planet', 'phobos', 'deimos', 'exploration'],
        action: () => onNavigate?.('Mars'),
        icon: '🔴'
      }
    ];

    const features = [
      {
        type: 'feature',
        name: 'Day/Night Toggle',
        description: 'Switch between day and night views on Earth',
        keywords: ['day', 'night', 'toggle', 'earth', 'lighting'],
        action: () => onNavigate?.('Earth'),
        icon: '🌓'
      },
      {
        type: 'feature',
        name: 'Cross-Section View',
        description: 'View Earth\'s interior layers in cross-section',
        keywords: ['cross-section', 'layers', 'interior', 'earth', 'geology'],
        action: () => onNavigate?.('Earth'),
        icon: '🔍'
      },
      {
        type: 'feature',
        name: 'Realistic Physics',
        description: 'Experience accurate planetary physics and rotation',
        keywords: ['physics', 'rotation', 'orbit', 'realistic', 'simulation'],
        action: () => {},
        icon: '⚡'
      }
    ];

    return [...planetData, ...sunData, ...facts, ...features];
  }, [planets, onNavigate]);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setSelectedIndex(0);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    const filtered = searchData.filter(item => {
      if (searchType !== 'all' && item.type !== searchType) return false;
      
      return (
        item.name.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.keywords.some(keyword => keyword.includes(searchTerm))
      );
    });

    // Sort by relevance
    const sorted = filtered.sort((a, b) => {
      const aNameMatch = a.name.toLowerCase().startsWith(searchTerm);
      const bNameMatch = b.name.toLowerCase().startsWith(searchTerm);
      
      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;
      
      return a.name.localeCompare(b.name);
    });

    setResults(sorted);
    setSelectedIndex(0);
  }, [query, searchType, searchData]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, results, selectedIndex, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (item) => {
    onSearch?.(item.name);
    item.action?.();
    onClose?.();
    setQuery('');
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '10vh',
      zIndex: 10000,
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        width: '90%',
        maxWidth: '600px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
        color: 'white',
        fontFamily: '"Space Mono", monospace',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>🔍</span>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontFamily: '"Orbitron", sans-serif',
              margin: 0,
              flex: 1
            }}>
              Search Solar System
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '5px',
                transition: 'all 0.3s ease'
              }}
            >
              ✕
            </button>
          </div>

          {/* Search Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search planets, facts, features..."
            style={{
              width: '100%',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              color: 'white',
              fontSize: '1rem',
              fontFamily: '"Space Mono", monospace',
              outline: 'none',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#667eea';
              e.target.style.boxShadow = '0 0 0 2px rgba(102, 126, 234, 0.2)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* Search Type Filters */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            flexWrap: 'wrap'
          }}>
            {[
              { key: 'all', label: 'All', icon: '🌌' },
              { key: 'planet', label: 'Planets', icon: '🪐' },
              { key: 'fact', label: 'Facts', icon: '📚' },
              { key: 'feature', label: 'Features', icon: '⚡' }
            ].map(type => (
              <button
                key={type.key}
                onClick={() => setSearchType(type.key)}
                style={{
                  padding: '6px 12px',
                  background: searchType === type.key 
                    ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                    : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '15px',
                  color: 'white',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>{type.icon}</span>
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div 
          ref={resultsRef}
          style={{
            maxHeight: '400px',
            overflowY: 'auto'
          }}
        >
          {results.length > 0 ? (
            results.map((result, index) => (
              <div
                key={`${result.type}-${result.name}`}
                onClick={() => handleSelect(result)}
                style={{
                  padding: '1rem 1.5rem',
                  background: index === selectedIndex 
                    ? 'rgba(102, 126, 234, 0.2)' 
                    : 'transparent',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span style={{ fontSize: '1.5rem' }}>{result.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    marginBottom: '0.2rem'
                  }}>
                    {result.name}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    opacity: 0.8
                  }}>
                    {result.description}
                  </div>
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  opacity: 0.6,
                  textTransform: 'uppercase',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {result.type}
                </div>
              </div>
            ))
          ) : query.trim() ? (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔍</div>
              <div>No results found for "{query}"</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Try searching for planets, facts, or features
              </div>
            </div>
          ) : (
            <div style={{
              padding: '2rem',
              textAlign: 'center',
              opacity: 0.7
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌌</div>
              <div>Start typing to search the solar system</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Use ↑↓ to navigate, Enter to select, Esc to close
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
