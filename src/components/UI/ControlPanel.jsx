import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ControlPanel.css';

const ControlPanel = ({
  panelPosition = { x: 20, y: 100 },
  onPositionChange,
  isCollapsed = false,
  onToggleCollapse,
  focusedPlanet,
  onPlanetSelect,
  onShowPlanetDetails,
  planets = []
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeTab, setActiveTab] = useState('navigation');
  const panelRef = useRef();
  const dragPositionRef = useRef(panelPosition);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('.drag-handle')) {
      e.preventDefault();
      setIsDragging(true);

      const rect = panelRef.current.getBoundingClientRect();
      const offset = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      setDragOffset(offset);
      dragPositionRef.current = { ...panelPosition };

      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    }
  }, [panelPosition]);

  const handleMouseMove = useCallback((e) => {
    if (isDragging && panelRef.current) {
      e.preventDefault();

      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      const panelWidth = isCollapsed ? 80 : 380;
      const panelHeight = isCollapsed ? 80 : 500;

      const constrainedX = Math.max(0, Math.min(window.innerWidth - panelWidth, newX));
      const constrainedY = Math.max(80, Math.min(window.innerHeight - panelHeight, newY));

      dragPositionRef.current = { x: constrainedX, y: constrainedY };
      
      if (panelRef.current) {
        panelRef.current.style.transform = `translate(${constrainedX}px, ${constrainedY}px)`;
      }
    }
  }, [isDragging, dragOffset, isCollapsed]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      
      if (onPositionChange) {
        onPositionChange(dragPositionRef.current);
      }
    }
  }, [isDragging, onPositionChange]);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const tabs = [
    { id: 'navigation', label: 'Navigate', icon: '🧭' },
    { id: 'info', label: 'Info', icon: 'ℹ️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
    { id: 'tools', label: 'Tools', icon: '🛠️' }
  ];

  const quickActions = [
    { label: 'Reset View', action: 'reset', icon: '🏠' },
    { label: 'Full Screen', action: 'fullscreen', icon: '⛶' },
    { label: 'Screenshot', action: 'screenshot', icon: '📸' },
    { label: 'Share', action: 'share', icon: '🔗' }
  ];

  return (
    <motion.div
      ref={panelRef}
      className={`control-panel ${isCollapsed ? 'collapsed' : 'expanded'} ${isDragging ? 'dragging' : ''}`}
      style={{
        transform: `translate(${panelPosition.x}px, ${panelPosition.y}px)`,
      }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {/* Header with drag handle */}
      <div className="panel-header drag-handle" onMouseDown={handleMouseDown}>
        <div className="panel-title">
          <span className="panel-icon">🌌</span>
          {!isCollapsed && <span className="panel-text">Mission Control</span>}
        </div>
        <div className="panel-controls">
          <motion.button
            className="control-button"
            onClick={onToggleCollapse}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
          >
            {isCollapsed ? '📋' : '📌'}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="panel-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Tab Navigation */}
            <div className="tab-navigation">
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">
              <AnimatePresence mode="wait">
                {activeTab === 'navigation' && (
                  <motion.div
                    key="navigation"
                    className="tab-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="section-title">🚀 Quick Navigation</h3>
                    
                    {/* Current Focus */}
                    {focusedPlanet && (
                      <div className="current-focus">
                        <div className="focus-header">
                          <span className="focus-icon">🎯</span>
                          <span className="focus-label">Currently Viewing</span>
                        </div>
                        <div className="focus-planet">
                          <span className="planet-name">{focusedPlanet}</span>
                          <motion.button
                            className="details-button"
                            onClick={() => onShowPlanetDetails && onShowPlanetDetails(focusedPlanet)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Details
                          </motion.button>
                        </div>
                      </div>
                    )}

                    {/* Planet List */}
                    <div className="planet-list">
                      <h4 className="list-title">Celestial Bodies</h4>
                      <div className="planet-grid">
                        <motion.button
                          className="planet-item sun"
                          onClick={() => onPlanetSelect && onPlanetSelect('Sun')}
                          whileHover={{ scale: 1.05, boxShadow: "0 4px 20px rgba(255, 165, 0, 0.3)" }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="planet-icon">☀️</span>
                          <span className="planet-label">Sun</span>
                        </motion.button>
                        
                        {planets.map((planet, index) => (
                          <motion.button
                            key={planet.name}
                            className={`planet-item ${planet.name.toLowerCase()}`}
                            onClick={() => onPlanetSelect && onPlanetSelect(planet.name)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <span className="planet-icon">{getPlanetIcon(planet.name)}</span>
                            <span className="planet-label">{planet.name}</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'info' && (
                  <motion.div
                    key="info"
                    className="tab-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="section-title">📊 System Information</h3>
                    <div className="info-grid">
                      <div className="info-card">
                        <div className="info-icon">🌍</div>
                        <div className="info-content">
                          <div className="info-label">Planets</div>
                          <div className="info-value">{planets.length}</div>
                        </div>
                      </div>
                      <div className="info-card">
                        <div className="info-icon">⭐</div>
                        <div className="info-content">
                          <div className="info-label">Stars</div>
                          <div className="info-value">1</div>
                        </div>
                      </div>
                      <div className="info-card">
                        <div className="info-icon">🌙</div>
                        <div className="info-content">
                          <div className="info-label">Moons</div>
                          <div className="info-value">200+</div>
                        </div>
                      </div>
                      <div className="info-card">
                        <div className="info-icon">🚀</div>
                        <div className="info-content">
                          <div className="info-label">Missions</div>
                          <div className="info-value">Active</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div
                    key="settings"
                    className="tab-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="section-title">⚙️ Display Settings</h3>
                    <div className="settings-list">
                      <div className="setting-item">
                        <label className="setting-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkmark"></span>
                          Show Orbit Lines
                        </label>
                      </div>
                      <div className="setting-item">
                        <label className="setting-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkmark"></span>
                          Planet Labels
                        </label>
                      </div>
                      <div className="setting-item">
                        <label className="setting-label">
                          <input type="checkbox" />
                          <span className="checkmark"></span>
                          Realistic Scale
                        </label>
                      </div>
                      <div className="setting-item">
                        <label className="setting-label">
                          <input type="checkbox" defaultChecked />
                          <span className="checkmark"></span>
                          Background Stars
                        </label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'tools' && (
                  <motion.div
                    key="tools"
                    className="tab-panel"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="section-title">🛠️ Quick Tools</h3>
                    <div className="tools-grid">
                      {quickActions.map((action, index) => (
                        <motion.button
                          key={action.action}
                          className="tool-button"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="tool-icon">{action.icon}</span>
                          <span className="tool-label">{action.label}</span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// Helper function to get planet icons
const getPlanetIcon = (planetName) => {
  const icons = {
    Mercury: '☿️',
    Venus: '♀️',
    Earth: '🌍',
    Mars: '♂️',
    Jupiter: '♃',
    Saturn: '♄',
    Uranus: '♅',
    Neptune: '♆',
    Pluto: '♇'
  };
  return icons[planetName] || '🪐';
};

export default ControlPanel;
