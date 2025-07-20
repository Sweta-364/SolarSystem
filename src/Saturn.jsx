import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, Vector3, MathUtils } from "three";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import Saturn textures
import saturnTexture from "./assets/textures/2k_saturn.jpg";
import saturnRingTexture from "./assets/textures/2k_saturn_ring_alpha.png";

// Saturn planet component
function Saturn3D() {
  const saturnRef = useRef();
  const saturnTex = useLoader(TextureLoader, saturnTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (saturnRef.current) {
      // Saturn rotation (10.7 hours = 1 Saturn day) - fast rotation
      saturnRef.current.rotation.y += 0.009;

      // Saturn's 26.7-degree axial tilt with subtle wobble
      saturnRef.current.rotation.x =
        (26.7 * Math.PI) / 180 + Math.sin(time * 0.1) * 0.01;
      saturnRef.current.rotation.z = Math.cos(time * 0.08) * 0.005;
    }
  });

  return (
    <mesh ref={saturnRef} castShadow receiveShadow>
      <sphereGeometry args={[3.0, 256, 256]} />
      <meshStandardMaterial
        map={saturnTex}
        roughness={0.8}
        metalness={0.0}
        color="#fab95b"
        normalScale={[0.3, 0.3]}
      />
    </mesh>
  );
}

// Saturn ring particle component
function SaturnRingParticle({ position, size, color }) {
  const particleRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (particleRef.current) {
      // Gentle floating animation
      particleRef.current.position.y =
        position[1] + Math.sin(time * 0.5 + position[0] * 10) * 0.02;
      particleRef.current.rotation.x += 0.01;
      particleRef.current.rotation.y += 0.005;
      particleRef.current.rotation.z += 0.008;
    }
  });

  return (
    <mesh ref={particleRef} position={position} castShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial
        color={color}
        roughness={0.9}
        metalness={0.1}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
}

// Saturn rings system with realistic particle distribution
function SaturnRings() {
  const ringParticles = useMemo(() => {
    const particles = [];
    const ringZones = [
      {
        inner: 4.2,
        outer: 5.8,
        density: 150,
        colors: ["#ffffff", "#f0f0f0", "#e8e8e8"],
      }, // Inner rings (white)
      {
        inner: 5.8,
        outer: 7.2,
        density: 200,
        colors: ["#f5e6a3", "#e6d68a", "#d4c76e"],
      }, // Middle rings (yellow)
      {
        inner: 7.2,
        outer: 8.5,
        density: 120,
        colors: ["#d2b48c", "#c19a6b", "#a0522d"],
      }, // Outer rings (brown)
    ];

    ringZones.forEach((zone) => {
      for (let i = 0; i < zone.density; i++) {
        const radius = MathUtils.randFloat(zone.inner, zone.outer);
        const angle = MathUtils.randFloat(0, Math.PI * 2);
        const height = MathUtils.randFloat(-0.1, 0.1);

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const size = MathUtils.randFloat(0.02, 0.08);
        const color =
          zone.colors[Math.floor(Math.random() * zone.colors.length)];

        particles.push({
          position: [x, height, z],
          size,
          color,
          key: `particle-${i}-${zone.inner}`,
        });
      }
    });

    return particles;
  }, []);

  return (
    <group>
      {ringParticles.map((particle) => (
        <SaturnRingParticle
          key={particle.key}
          position={particle.position}
          size={particle.size}
          color={particle.color}
        />
      ))}
    </group>
  );
}

// Simple lighting for Saturn
function SaturnLighting() {
  return (
    <>
      <directionalLight
        position={[15, 8, 10]}
        intensity={3.0}
        color="#ffffff"
      />
      <ambientLight intensity={0.2} color="#ffffff" />
    </>
  );
}

// Main Saturn component
export default function Saturn({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".saturn-container", {
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
      className="saturn-container"
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #000011 0%, #000033 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 75 }}
        style={{ background: "transparent" }}
      >
        <Stars
          radius={300}
          depth={60}
          count={8000}
          factor={7}
          saturation={0}
          fade={true}
          speed={0.5}
        />

        <SaturnLighting />
        <Saturn3D />
        <SaturnRings />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={4}
          maxDistance={20}
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
              rgba(250, 185, 91, 0.9) 0%,
              rgba(218, 165, 32, 0.8) 100%
            )
          `,
          border: "1px solid rgba(250, 185, 91, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(250, 185, 91, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(250, 185, 91, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        ♄ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Saturn"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
