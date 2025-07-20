import React, { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { TextureLoader } from "three";
import gsap from "gsap";
import SplashCursor from "./assets/effects/SplashCursor.jsx";
import Flashcard from "./Flashcard.jsx";

// Import Mercury texture
import mercuryTexture from "./assets/textures/2k_mercury.jpg";

// Simple Mercury component
function SimpleMercury() {
  const mercuryRef = useRef();
  const mercuryTex = useLoader(TextureLoader, mercuryTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (mercuryRef.current) {
      // Mercury rotation (58.6 Earth days = 1 Mercury day)
      mercuryRef.current.rotation.y += 0.001;

      // Subtle wobble
      mercuryRef.current.rotation.x = Math.sin(time * 0.1) * 0.01;
    }
  });

  return (
    <mesh ref={mercuryRef}>
      <sphereGeometry args={[1.5, 128, 128]} />
      <meshStandardMaterial
        map={mercuryTex}
        roughness={0.9}
        metalness={0.1}
        color="#8c7853"
      />
    </mesh>
  );
}

// Simple lighting for Mercury
function MercuryLighting() {
  return (
    <>
      <directionalLight position={[10, 5, 5]} intensity={3.0} color="#ffffff" />
      <ambientLight intensity={0.2} color="#ffffff" />
    </>
  );
}

// Main Mercury component
export default function Mercury({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".mercury-container", {
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
      className="mercury-container"
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #000011 0%, #000033 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 75 }}
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

        <MercuryLighting />
        <SimpleMercury />

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

      {/* SplashCursor Effect */}
      <SplashCursor
        SIM_RESOLUTION={128}
        DYE_RESOLUTION={1024}
        DENSITY_DISSIPATION={2.8}
        VELOCITY_DISSIPATION={1.8}
        PRESSURE={0.12}
        CURL={4}
        SPLAT_RADIUS={0.15}
        SPLAT_FORCE={4500}
        SHADING={true}
        COLOR_UPDATE_SPEED={8}
        BACK_COLOR={{ r: 0.4, g: 0.3, b: 0.2 }}
        TRANSPARENT={true}
      />

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
              rgba(140, 120, 83, 0.9) 0%,
              rgba(180, 150, 100, 0.8) 100%
            )
          `,
          border: "1px solid rgba(140, 120, 83, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(140, 120, 83, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(140, 120, 83, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
          zIndex: 100,
          pointerEvents: isTransitioning ? "none" : "auto",
        }}
      >
        ☿️ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Mercury"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
