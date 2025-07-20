import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, Vector3, MathUtils } from "three";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import Mars texture
import marsTexture from "./assets/textures/2k_mars.jpg";
import phobosTexture from "./assets/textures/phobos.jpg";
import deimosTexture from "./assets/textures/deimos.jpg";

// Realistic Mars component
function Mars3D() {
  const marsRef = useRef();
  const marsTex = useLoader(TextureLoader, marsTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (marsRef.current) {
      // Mars rotation (24.6 hours = 1 Mars day)
      marsRef.current.rotation.y += 0.004;

      // Subtle wobble
      marsRef.current.rotation.x = Math.sin(time * 0.1) * 0.005;
    }
  });

  return (
    <mesh ref={marsRef} castShadow receiveShadow>
      <sphereGeometry args={[1.6, 256, 256]} />
      <meshStandardMaterial
        map={marsTex}
        roughness={0.85}
        metalness={0.0}
        color="#cd5c5c"
        normalScale={[0.5, 0.5]}
        bumpScale={0.02}
      />
    </mesh>
  );
}

// Phobos moon component (closer, faster orbit) - More visible and realistic
function Phobos() {
  const phobosRef = useRef();
  const phobosTex = useLoader(TextureLoader, phobosTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (phobosRef.current) {
      // Phobos orbits Mars in 7.6 hours (very fast)
      const orbitSpeed = 0.6; // Slightly slower for better visibility
      const orbitRadius = 3.5; // Slightly farther for better visibility

      phobosRef.current.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
      phobosRef.current.position.z = Math.sin(time * orbitSpeed) * orbitRadius;
      phobosRef.current.position.y = Math.sin(time * orbitSpeed * 0.15) * 0.2; // More vertical movement

      // Phobos rotation - tidally locked but with slight wobble
      phobosRef.current.rotation.y += 0.015;
      phobosRef.current.rotation.x = Math.sin(time * 0.5) * 0.05;
    }
  });

  return (
    <mesh ref={phobosRef} castShadow receiveShadow scale={[1.2, 0.8, 1.0]}>
      <dodecahedronGeometry args={[0.25, 2]} />
      <meshStandardMaterial
        map={phobosTex}
        roughness={0.95}
        metalness={0.0}
        color="#8B7355"
        bumpScale={0.1}
      />
    </mesh>
  );
}

// Deimos moon component (farther, slower orbit) - More visible and realistic
function Deimos() {
  const deimosRef = useRef();
  const deimosTex = useLoader(TextureLoader, deimosTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (deimosRef.current) {
      // Deimos orbits Mars in 30.3 hours (slower)
      const orbitSpeed = 0.25; // Slightly faster for better visibility
      const orbitRadius = 5.2; // Slightly farther for better separation

      deimosRef.current.position.x = Math.cos(time * orbitSpeed) * orbitRadius;
      deimosRef.current.position.z = Math.sin(time * orbitSpeed) * orbitRadius;
      deimosRef.current.position.y = Math.sin(time * orbitSpeed * 0.2) * 0.25; // More vertical movement

      // Deimos rotation - tidally locked but with slight wobble
      deimosRef.current.rotation.y += 0.012;
      deimosRef.current.rotation.z = Math.sin(time * 0.3) * 0.03;
    }
  });

  return (
    <mesh ref={deimosRef} castShadow receiveShadow scale={[0.9, 1.1, 0.8]}>
      <octahedronGeometry args={[0.18, 3]} />
      <meshStandardMaterial
        map={deimosTex}
        roughness={0.95}
        metalness={0.0}
        color="#A0522D"
        bumpScale={0.08}
      />
    </mesh>
  );
}

// Shooting star component for Mars
function MarsShootingStar({ initialPosition, direction, speed, delay, color }) {
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
      if (newPos.length() > 70) {
        setVisible(false);
        // Reset position after a delay
        setTimeout(() => {
          setPosition(initialPosition.clone());
          setVisible(true);
        }, Math.random() * 3000 + 1000); // 1-4 seconds delay
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
      {/* Main bright star */}
      <mesh ref={starRef} position={position}>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Trail effect */}
      <mesh
        position={[
          position.x - direction.x * 1,
          position.y - direction.y * 1,
          position.z - direction.z * 1,
        ]}
      >
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} />
      </mesh>
      <mesh
        position={[
          position.x - direction.x * 2.5,
          position.y - direction.y * 2.5,
          position.z - direction.z * 2.5,
        ]}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Falling asteroid component (occasional)
function FallingAsteroid({ initialPosition, direction, speed, delay, size }) {
  const asteroidRef = useRef();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState(initialPosition.clone());

  useFrame(() => {
    if (asteroidRef.current && visible) {
      const newPos = position
        .clone()
        .add(direction.clone().multiplyScalar(speed));
      setPosition(newPos);
      asteroidRef.current.position.copy(newPos);

      // Rotate asteroid
      asteroidRef.current.rotation.x += 0.02;
      asteroidRef.current.rotation.y += 0.015;
      asteroidRef.current.rotation.z += 0.01;

      // Reset asteroid when it goes too far
      if (newPos.length() > 60) {
        setVisible(false);
        // Reset position after a longer delay (asteroids are occasional)
        setTimeout(() => {
          setPosition(initialPosition.clone());
          setVisible(true);
        }, Math.random() * 15000 + 10000); // 10-25 seconds delay
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
    <mesh ref={asteroidRef} position={position}>
      <dodecahedronGeometry args={[size, 1]} />
      <meshStandardMaterial color="#8B4513" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

// Enhanced space background for Mars
function MarsSpaceBackground() {
  const shootingStars = useMemo(() => {
    const starColors = [
      "#ffffff", // White
      "#ffdddd", // Light pink
      "#ddddff", // Light blue
      "#ffffdd", // Light yellow
      "#ffddaa", // Light orange
      "#ddffdd", // Light green
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      initialPosition: new Vector3(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      ),
      direction: new Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize(),
      speed: 0.2 + Math.random() * 0.3,
      delay: Math.random() * 4000,
      color: starColors[i % starColors.length],
    }));
  }, []);

  const fallingAsteroids = useMemo(() => {
    return Array.from({ length: 3 }, (_, i) => ({
      id: i,
      initialPosition: new Vector3(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 80
      ),
      direction: new Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5
      ).normalize(),
      speed: 0.1 + Math.random() * 0.15,
      delay: Math.random() * 20000, // Long initial delay
      size: 0.05 + Math.random() * 0.1,
    }));
  }, []);

  return (
    <>
      {/* Enhanced stars with color variations */}
      <Stars
        radius={300}
        depth={60}
        count={10000}
        factor={8}
        saturation={0.3}
        fade={true}
        speed={0.3}
      />

      {/* Additional star field */}
      <Stars
        radius={500}
        depth={100}
        count={4000}
        factor={12}
        saturation={0.4}
        fade={true}
        speed={0.1}
      />

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <MarsShootingStar
          key={star.id}
          initialPosition={star.initialPosition}
          direction={star.direction}
          speed={star.speed}
          delay={star.delay}
          color={star.color}
        />
      ))}

      {/* Falling asteroids (occasional) */}
      {fallingAsteroids.map((asteroid) => (
        <FallingAsteroid
          key={asteroid.id}
          initialPosition={asteroid.initialPosition}
          direction={asteroid.direction}
          speed={asteroid.speed}
          delay={asteroid.delay}
          size={asteroid.size}
        />
      ))}
    </>
  );
}

// Enhanced realistic lighting for Mars system
function MarsLighting() {
  return (
    <>
      {/* Main sun light */}
      <directionalLight
        position={[10, 5, 5]}
        intensity={4.0}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Ambient light for space visibility */}
      <ambientLight intensity={0.4} color="#fff8f0" />

      {/* Additional lights for moon visibility */}
      <pointLight
        position={[15, 10, 8]}
        intensity={1.2}
        color="#ffaa88"
        distance={60}
      />

      {/* Rim light for Mars atmosphere effect */}
      <pointLight
        position={[-8, 3, 10]}
        intensity={0.8}
        color="#ff8866"
        distance={40}
      />

      {/* Fill light for moon visibility */}
      <pointLight
        position={[0, 15, 0]}
        intensity={0.6}
        color="#ffffff"
        distance={80}
      />
    </>
  );
}

// Main Mars component
export default function Mars({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".mars-container", {
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
      className="mars-container"
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
        camera={{ position: [0, 0, 8], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <MarsSpaceBackground />
        <MarsLighting />
        <Mars3D />
        <Phobos />
        <Deimos />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={15}
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
              rgba(205, 92, 92, 0.9) 0%,
              rgba(139, 69, 19, 0.8) 100%
            )
          `,
          border: "1px solid rgba(205, 92, 92, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(205, 92, 92, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(205, 92, 92, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        ♂️ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Mars"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
