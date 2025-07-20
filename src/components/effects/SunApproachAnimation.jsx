import React, { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SunApproachAnimation.css";

const SunApproachAnimation = ({ isActive, onComplete }) => {
  const [phase, setPhase] = useState("approaching"); // approaching, 3d-explosion, 3d-flare-storm, complete
  const containerRef = useRef();

  useEffect(() => {
    if (!isActive) return;

    // Shorter, more intense 3D showcase!

    // Phase 1: 3D Approach (2 seconds)
    const approachTimer = setTimeout(() => {
      setPhase("3d-explosion");
    }, 2000);

    // Phase 2: 3D Explosion (2 seconds)
    const explosionTimer = setTimeout(() => {
      setPhase("3d-flare-storm");
    }, 4000);

    // Phase 3: 3D Flare Storm Finale (3 seconds)
    const flareTimer = setTimeout(() => {
      setPhase("complete");
      onComplete && onComplete();
    }, 7000);

    return () => {
      clearTimeout(approachTimer);
      clearTimeout(explosionTimer);
      clearTimeout(flareTimer);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <motion.div
      ref={containerRef}
      className="sun-approach-animation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Heat Distortion Effect */}
      <div className="heat-distortion" />

      {/* Approaching Phase */}
      <AnimatePresence>
        {phase === "approaching" && (
          <motion.div
            className="approaching-phase"
            initial={{ scale: 0.1, opacity: 0, rotateY: -180, z: -1000 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0, z: 0 }}
            exit={{ scale: 1.2, opacity: 0, rotateY: 180, z: 1000 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {/* Sun Core */}
            <div className="sun-core">
              <div className="sun-surface" />
              <div className="sun-glow" />
            </div>

            {/* Approaching Text */}
            <motion.div
              className="approach-text"
              initial={{ y: 50, opacity: 0, rotateX: -90, z: -500 }}
              animate={{ y: 0, opacity: 1, rotateX: 0, z: 0 }}
              transition={{
                delay: 0.5,
                duration: 1.5,
                type: "spring",
                bounce: 0.4,
              }}
            >
              <h2>🚀 INCOMING SOLAR MADNESS!</h2>
              <p>Buckle up for the most EPIC space show ever!</p>
            </motion.div>

            {/* Particle Stream */}
            <div className="particle-stream">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="particle"
                  style={{
                    "--delay": `${i * 0.1}s`,
                    "--angle": `${i * 18}deg`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Explosion Phase */}
      <AnimatePresence>
        {phase === "3d-explosion" && (
          <motion.div
            className="explosion-3d-phase"
            initial={{
              scale: 0.5,
              opacity: 0,
              rotateX: -180,
              rotateY: -180,
              z: -2000,
            }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0, z: 0 }}
            exit={{
              scale: 1.5,
              opacity: 0,
              rotateX: 180,
              rotateY: 180,
              z: 2000,
            }}
            transition={{ duration: 2, ease: "easeInOut" }}
          >
            {/* Exploding Sun */}
            <div className="exploding-sun">
              <div className="sun-surface exploding" />
              <div className="sun-glow explosive" />
            </div>

            {/* Explosion Rings */}
            <div className="explosion-rings">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="explosion-ring"
                  style={{
                    "--ring-delay": `${i * 0.3}s`,
                    "--ring-size": `${200 + i * 100}px`,
                  }}
                />
              ))}
            </div>

            {/* 3D Explosion Text */}
            <motion.div
              className="explosion-text-3d"
              initial={{ scale: 0, rotate: -180, rotateY: -360, z: -1000 }}
              animate={{ scale: 1, rotate: 0, rotateY: 0, z: 0 }}
              transition={{
                delay: 0.3,
                duration: 1.2,
                type: "spring",
                bounce: 0.6,
              }}
            >
              <h2>💥 3D SOLAR EXPLOSION!</h2>
              <p>MIND-BLOWING 3D SOLAR MADNESS!</p>
            </motion.div>

            {/* Bouncing Particles */}
            <div className="bouncing-particles">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="bouncing-particle"
                  style={{
                    "--bounce-delay": `${i * 0.1}s`,
                    "--bounce-x": `${Math.random() * 100}%`,
                    "--bounce-y": `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Flare Storm Finale */}
      <AnimatePresence>
        {phase === "3d-flare-storm" && (
          <motion.div
            className="flare-storm-3d-phase"
            initial={{
              scale: 0.8,
              opacity: 0,
              rotateX: -90,
              rotateY: -90,
              z: -3000,
            }}
            animate={{ scale: 1, opacity: 1, rotateX: 0, rotateY: 0, z: 0 }}
            exit={{ scale: 1.1, opacity: 0, rotateX: 90, rotateY: 90, z: 3000 }}
            transition={{ duration: 3, ease: "easeInOut" }}
          >
            {/* Massive Sun */}
            <div className="massive-sun">
              <div className="sun-surface flaring" />
              <div className="sun-glow intense" />
            </div>

            {/* Solar Flares */}
            <div className="solar-flares">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="solar-flare"
                  style={{
                    "--flare-angle": `${i * 45}deg`,
                    "--flare-delay": `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* 3D Flare Storm Text */}
            <motion.div
              className="flare-storm-text-3d"
              initial={{ scale: 0.5, opacity: 0, rotateZ: -720, z: -2000 }}
              animate={{ scale: 1, opacity: 1, rotateZ: 0, z: 0 }}
              transition={{
                delay: 0.5,
                duration: 2,
                type: "spring",
                bounce: 0.5,
              }}
            >
              <h1>⚡ 3D FLARE STORM FINALE!</h1>
              <p>ULTIMATE 3D SOLAR SPECTACLE!</p>
            </motion.div>

            {/* Energy Waves */}
            <div className="energy-waves">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="energy-wave"
                  style={{ "--wave-delay": `${i * 0.3}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Removed old phases for cleaner 3D experience */}

      {/* All old phases removed for streamlined 3D experience */}
      <AnimatePresence>
        {false && (
          <motion.div
            className="solar-storm-phase"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
          >
            {/* Storm Sun */}
            <div className="storm-sun">
              <div className="sun-surface stormy" />
              <div className="sun-glow storm-glow" />
              <div className="storm-layer" />
            </div>

            {/* Lightning Bolts */}
            <div className="lightning-bolts">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="lightning-bolt"
                  style={{
                    "--bolt-angle": `${i * 30}deg`,
                    "--bolt-delay": `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>

            {/* Epic Finale Text */}
            <motion.div
              className="finale-text"
              initial={{ y: 200, opacity: 0, rotate: 360 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{
                delay: 1.5,
                duration: 2.5,
                type: "spring",
                bounce: 0.3,
              }}
            >
              <h1>⚡ SOLAR STORM FINALE!</h1>
              <p>MAXIMUM SOLAR AWESOMENESS ACHIEVED!</p>
            </motion.div>

            {/* Storm Particles */}
            <div className="storm-particles">
              {[...Array(35)].map((_, i) => (
                <div
                  key={i}
                  className="storm-particle"
                  style={{
                    "--storm-delay": `${i * 0.1}s`,
                    "--storm-x": `${Math.random() * 100}%`,
                    "--storm-y": `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Corona Phase (now unused) */}
      <AnimatePresence>
        {phase === "corona" && (
          <motion.div
            className="corona-phase"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 3.5, ease: "easeOut" }}
          >
            {/* Corona Sun */}
            <div className="corona-sun">
              <div className="sun-surface corona-active" />
              <div className="sun-glow corona-glow" />
              <div className="corona-layer" />
            </div>

            {/* Corona Streams */}
            <div className="corona-streams">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="corona-stream"
                  style={{
                    "--stream-angle": `${i * 30}deg`,
                    "--stream-delay": `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* Welcome Text */}
            <motion.div
              className="welcome-text"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.5, duration: 2.5 }}
            >
              <h1>🌟 Welcome to the Sun!</h1>
              <p>The heart of our solar system</p>
              <div className="sun-stats">
                <div className="stat">
                  <span className="stat-value">5,778K</span>
                  <span className="stat-label">Surface Temperature</span>
                </div>
                <div className="stat">
                  <span className="stat-value">1.989 × 10³⁰</span>
                  <span className="stat-label">Mass (kg)</span>
                </div>
                <div className="stat">
                  <span className="stat-value">696,340</span>
                  <span className="stat-label">Radius (km)</span>
                </div>
              </div>
            </motion.div>

            {/* Floating Particles */}
            <div className="floating-particles">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="floating-particle"
                  style={{
                    "--particle-delay": `${i * 0.2}s`,
                    "--particle-x": `${Math.random() * 100}%`,
                    "--particle-y": `${Math.random() * 100}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Flash Effect */}
      <AnimatePresence>
        {phase === "solar-flare" && (
          <motion.div
            className="screen-flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.5, times: [0, 0.5, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Audio Visualization Bars */}
      <div className="audio-bars">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="audio-bar"
            style={{ "--bar-delay": `${i * 0.05}s` }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SunApproachAnimation;
