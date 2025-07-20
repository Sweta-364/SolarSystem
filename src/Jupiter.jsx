import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, Vector3, MathUtils } from "three";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import Jupiter texture
import jupiterTexture from "./assets/textures/2k_jupiter.jpg";

// Enhanced Jupiter component
function Jupiter3D() {
  const jupiterRef = useRef();
  const jupiterTex = useLoader(TextureLoader, jupiterTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (jupiterRef.current) {
      // Jupiter rotation (9.9 hours = 1 Jupiter day)
      jupiterRef.current.rotation.y += 0.01;

      // Subtle wobble
      jupiterRef.current.rotation.x = Math.sin(time * 0.1) * 0.005;
    }
  });

  return (
    <mesh ref={jupiterRef} castShadow receiveShadow>
      <sphereGeometry args={[3.5, 256, 256]} />
      <meshStandardMaterial
        map={jupiterTex}
        roughness={0.7}
        metalness={0.0}
        color="#d8ca9d"
      />
    </mesh>
  );
}

// Shooting star component for Jupiter
function JupiterShootingStar({
  initialPosition,
  direction,
  speed,
  delay,
  color,
}) {
  const starRef = useRef();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(initialPosition.clone());

  useFrame(() => {
    if (starRef.current && visible) {
      const newPos = position
        .clone()
        .add(direction.clone().multiplyScalar(speed));
      setPosition(newPos);
      starRef.current.position.copy(newPos);

      // Reset star when it goes too far
      if (newPos.length() > 100) {
        setVisible(false);
        setTimeout(() => {
          setPosition(initialPosition.clone());
          setVisible(true);
        }, Math.random() * 4000 + 1000);
      }
    }
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <group>
      <mesh ref={starRef} position={position}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh position={position}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      <mesh
        position={[
          position.x - direction.x * 1.5,
          position.y - direction.y * 1.5,
          position.z - direction.z * 1.5,
        ]}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

// Jupiter moon component with tilted random orbits
function JupiterMoon({
  name,
  size,
  orbitRadius,
  orbitSpeed,
  color,
  offset = 0,
  tiltX = 0,
  tiltZ = 0,
}) {
  const moonRef = useRef();
  const jupiterTex = useLoader(TextureLoader, jupiterTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (moonRef.current) {
      const angle = time * orbitSpeed + offset;

      // Basic circular orbit
      let x = Math.cos(angle) * orbitRadius;
      let y = Math.sin(angle * 0.1) * (orbitRadius * 0.02);
      let z = Math.sin(angle) * orbitRadius;

      // Apply orbital tilt transformations
      const cosX = Math.cos(tiltX);
      const sinX = Math.sin(tiltX);
      const cosZ = Math.cos(tiltZ);
      const sinZ = Math.sin(tiltZ);

      // Rotate around X-axis (tilt)
      const y1 = y * cosX - z * sinX;
      const z1 = y * sinX + z * cosX;

      // Rotate around Z-axis (inclination)
      const x2 = x * cosZ - y1 * sinZ;
      const y2 = x * sinZ + y1 * cosZ;

      moonRef.current.position.set(x2, y2, z1);

      // Moon rotation
      moonRef.current.rotation.y += 0.02;
    }
  });

  return (
    <mesh ref={moonRef} castShadow receiveShadow>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        map={jupiterTex}
        roughness={0.9}
        metalness={0.0}
        color={color}
      />
    </mesh>
  );
}

// Jupiter's complete 95 moons system with random tilted orbits
function JupiterMoonSystem() {
  const all95Moons = useMemo(() => {
    const moonColors = [
      "#8B7355",
      "#A0522D",
      "#CD853F",
      "#DEB887",
      "#696969",
      "#D2B48C",
      "#F4A460",
      "#BC8F8F",
      "#778899",
      "#708090",
      "#FFFF99",
      "#E6E6FA",
      "#FFE4E1",
      "#F0E68C",
      "#DDA0DD",
    ];

    const moons = [];

    // Major Galilean moons (4)
    moons.push(
      {
        name: "Io",
        size: 0.15,
        orbitRadius: 5.5,
        orbitSpeed: 0.8,
        color: "#FFFF99",
      },
      {
        name: "Europa",
        size: 0.12,
        orbitRadius: 6.5,
        orbitSpeed: 0.6,
        color: "#E6E6FA",
      },
      {
        name: "Ganymede",
        size: 0.18,
        orbitRadius: 8.0,
        orbitSpeed: 0.4,
        color: "#8B7355",
      },
      {
        name: "Callisto",
        size: 0.16,
        orbitRadius: 10.0,
        orbitSpeed: 0.3,
        color: "#696969",
      }
    );

    // Other notable larger moons (8)
    moons.push(
      {
        name: "Amalthea",
        size: 0.06,
        orbitRadius: 4.8,
        orbitSpeed: 1.2,
        color: "#CD853F",
      },
      {
        name: "Himalia",
        size: 0.05,
        orbitRadius: 15.0,
        orbitSpeed: 0.15,
        color: "#A0522D",
      },
      {
        name: "Lysithea",
        size: 0.03,
        orbitRadius: 18.0,
        orbitSpeed: 0.12,
        color: "#8B4513",
      },
      {
        name: "Elara",
        size: 0.04,
        orbitRadius: 16.5,
        orbitSpeed: 0.13,
        color: "#DEB887",
      },
      {
        name: "Thebe",
        size: 0.04,
        orbitRadius: 5.2,
        orbitSpeed: 1.0,
        color: "#BC8F8F",
      },
      {
        name: "Adrastea",
        size: 0.02,
        orbitRadius: 4.2,
        orbitSpeed: 1.5,
        color: "#778899",
      },
      {
        name: "Metis",
        size: 0.02,
        orbitRadius: 4.0,
        orbitSpeed: 1.8,
        color: "#708090",
      },
      {
        name: "Leda",
        size: 0.025,
        orbitRadius: 20.0,
        orbitSpeed: 0.1,
        color: "#D2B48C",
      }
    );

    // Generate the remaining 83 moons with completely random properties
    for (let i = 12; i < 95; i++) {
      moons.push({
        name: `Moon${i + 1}`,
        size: 0.008 + Math.random() * 0.035, // Very small to small
        orbitRadius: 4.0 + Math.random() * 45.0, // Wide range of orbits
        orbitSpeed: 0.02 + Math.random() * 0.3, // Various speeds
        color: moonColors[Math.floor(Math.random() * moonColors.length)],
        offset: Math.random() * Math.PI * 2, // Random starting position
        tiltX: (Math.random() - 0.5) * Math.PI * 0.8, // Random X tilt (-72° to +72°)
        tiltZ: (Math.random() - 0.5) * Math.PI * 0.6, // Random Z tilt (-54° to +54°)
      });
    }

    // Add random tilts to all moons (including major ones)
    return moons.map((moon) => ({
      ...moon,
      tiltX: moon.tiltX || (Math.random() - 0.5) * Math.PI * 0.4,
      tiltZ: moon.tiltZ || (Math.random() - 0.5) * Math.PI * 0.3,
      offset: moon.offset || Math.random() * Math.PI * 2,
    }));
  }, []);

  return (
    <>
      {/* All 95 moons */}
      {all95Moons.map((moon) => (
        <JupiterMoon
          key={moon.name}
          name={moon.name}
          size={moon.size}
          orbitRadius={moon.orbitRadius}
          orbitSpeed={moon.orbitSpeed}
          color={moon.color}
          offset={moon.offset}
          tiltX={moon.tiltX}
          tiltZ={moon.tiltZ}
        />
      ))}
    </>
  );
}

// Enhanced space background for Jupiter
function JupiterSpaceBackground() {
  const shootingStars = useMemo(() => {
    const starColors = [
      "#ffffff",
      "#ffdddd",
      "#ddddff",
      "#ffffdd",
      "#ffddaa",
      "#ddffdd",
      "#ffddff",
      "#ddffff",
    ];

    return Array.from({ length: 10 }, (_, i) => ({
      id: i,
      initialPosition: new Vector3(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 150
      ),
      direction: new Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: 0.2 + Math.random() * 0.3,
      delay: Math.random() * 5000,
      color: starColors[i % starColors.length],
    }));
  }, []);

  return (
    <>
      {/* Enhanced stars with color variations */}
      <Stars
        radius={400}
        depth={80}
        count={15000}
        factor={10}
        saturation={0.3}
        fade={true}
        speed={0.2}
      />

      {/* Additional star field */}
      <Stars
        radius={600}
        depth={120}
        count={8000}
        factor={15}
        saturation={0.4}
        fade={true}
        speed={0.1}
      />

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <JupiterShootingStar
          key={star.id}
          initialPosition={star.initialPosition}
          direction={star.direction}
          speed={star.speed}
          delay={star.delay}
          color={star.color}
        />
      ))}
    </>
  );
}

// Enhanced lighting for Jupiter system
function JupiterLighting() {
  return (
    <>
      <directionalLight
        position={[15, 8, 10]}
        intensity={3.5}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <ambientLight intensity={0.3} color="#fff8f0" />
      <pointLight
        position={[20, 15, 12]}
        intensity={1.5}
        color="#ffaa88"
        distance={80}
      />
      <pointLight
        position={[-15, 10, 15]}
        intensity={1.0}
        color="#ffffff"
        distance={100}
      />
    </>
  );
}

// Main Jupiter component
export default function Jupiter({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".jupiter-container", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onReturnToSolarSystem();
      },
    });
  };

  return (
    <div
      className="jupiter-container"
      style={{
        width: "100vw",
        height: "100vh",
        background:
          "radial-gradient(ellipse at center, #000000 0%, #000000 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <JupiterSpaceBackground />
        <JupiterLighting />
        <Jupiter3D />
        <JupiterMoonSystem />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={25}
          enableDamping={true}
          dampingFactor={0.02}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.8}
        />
      </Canvas>

      {/* Fun Facts Button */}
      <button
        onClick={() => setShowFlashcard(true)}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "30px",
          padding: "15px 25px",
          background: `
            linear-gradient(135deg,
              rgba(59, 130, 246, 0.9) 0%,
              rgba(147, 51, 234, 0.8) 100%
            )
          `,
          border: "1px solid rgba(59, 130, 246, 0.4)",
          borderRadius: "20px",
          cursor: "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(59, 130, 246, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          zIndex: 100,
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-2px)";
          e.target.style.boxShadow = `
            0 12px 35px rgba(59, 130, 246, 0.5),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 40px rgba(59, 130, 246, 0.4)
          `;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0px)";
          e.target.style.boxShadow = `
            0 8px 25px rgba(59, 130, 246, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(59, 130, 246, 0.3)
          `;
        }}
      >
        ✨ Fun Facts
      </button>

      {/* Return to Solar System Button */}
      <button
        onClick={handleReturnToSolarSystem}
        disabled={isTransitioning}
        style={{
          position: "absolute",
          bottom: "30px",
          right: "30px",
          padding: "15px 25px",
          background: `
            linear-gradient(135deg,
              rgba(216, 202, 157, 0.9) 0%,
              rgba(184, 134, 11, 0.8) 100%
            )
          `,
          border: "1px solid rgba(216, 202, 157, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(216, 202, 157, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(216, 202, 157, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        ♃ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Jupiter"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
