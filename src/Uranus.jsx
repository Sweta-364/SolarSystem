import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader, MathUtils } from "three";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import Uranus texture
import uranusTexture from "./assets/textures/2k_uranus.jpg";

// Uranus planet component with proper 98-degree tilt
function Uranus3D() {
  const uranusRef = useRef();
  const uranusTex = useLoader(TextureLoader, uranusTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (uranusRef.current) {
      // Uranus rotation (17.2 hours = 1 Uranus day)
      uranusRef.current.rotation.y += 0.006;

      // Uranus's extreme 98-degree axial tilt (essentially sideways)
      uranusRef.current.rotation.z =
        (98 * Math.PI) / 180 + Math.sin(time * 0.1) * 0.01;
      uranusRef.current.rotation.x = Math.cos(time * 0.08) * 0.005;
    }
  });

  return (
    <mesh ref={uranusRef} castShadow receiveShadow>
      <sphereGeometry args={[2.5, 256, 256]} />
      <meshStandardMaterial
        map={uranusTex}
        roughness={0.6}
        metalness={0.0}
        color="#4fd0e7"
        normalScale={[0.2, 0.2]}
      />
    </mesh>
  );
}

// Uranus rings - thin, shiny white, and transparent
function UranusRings() {
  const ringParticles = useMemo(() => {
    const particles = [];
    const ringZones = [
      { inner: 3.2, outer: 3.4, density: 80, opacity: 0.6 }, // Inner ring
      { inner: 3.6, outer: 3.8, density: 90, opacity: 0.7 }, // Middle ring
      { inner: 4.0, outer: 4.2, density: 70, opacity: 0.5 }, // Outer ring
    ];

    ringZones.forEach((zone, zoneIndex) => {
      for (let i = 0; i < zone.density; i++) {
        const radius = MathUtils.randFloat(zone.inner, zone.outer);
        const angle = MathUtils.randFloat(0, Math.PI * 2);
        const height = MathUtils.randFloat(-0.02, 0.02); // Very thin rings

        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const size = MathUtils.randFloat(0.01, 0.03);

        particles.push({
          position: [x, height, z],
          size,
          opacity: zone.opacity,
          key: `uranus-ring-${zoneIndex}-${i}`,
        });
      }
    });

    return particles;
  }, []);

  return (
    <group rotation={[0, 0, (98 * Math.PI) / 180]}>
      {" "}
      {/* Match Uranus's tilt */}
      {ringParticles.map((particle) => (
        <mesh key={particle.key} position={particle.position}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.1}
            metalness={0.8}
            transparent={true}
            opacity={particle.opacity}
            emissive="#ffffff"
            emissiveIntensity={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

// Simple lighting for Uranus
function UranusLighting() {
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

// Main Uranus component
export default function Uranus({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".uranus-container", {
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
      className="uranus-container"
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #000011 0%, #000033 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
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

        <UranusLighting />
        <Uranus3D />
        <UranusRings />

        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={18}
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
              rgba(79, 208, 231, 0.9) 0%,
              rgba(30, 144, 255, 0.8) 100%
            )
          `,
          border: "1px solid rgba(79, 208, 231, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(79, 208, 231, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(79, 208, 231, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        ⛢ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Uranus"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
