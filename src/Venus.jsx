import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, shaderMaterial } from "@react-three/drei";
import { TextureLoader, Vector3, MathUtils } from "three";
import { extend } from "@react-three/fiber";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import Venus textures
import venusTexture from "./assets/textures/2k_venus_surface.jpg";
import venusAtmosphereTexture from "./assets/textures/2k_venus_atmosphere.jpg";

// Venus atmosphere shader material for realistic thick atmosphere
const VenusAtmosphereMaterial = shaderMaterial(
  {
    surfaceTexture: null,
    atmosphereTexture: null,
    sunDirection: new Vector3(1, 0, 0),
    time: 0,
  },
  // Vertex shader
  `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment shader - Realistic Venus with lighter atmosphere and rotation
  `
    uniform sampler2D surfaceTexture;
    uniform sampler2D atmosphereTexture;
    uniform vec3 sunDirection;
    uniform float time;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      // Sample both textures with retrograde atmosphere rotation
      vec3 surfaceColor = texture2D(surfaceTexture, vUv).rgb;
      vec2 atmosphereUV = vUv + vec2(time * -0.002, time * -0.001); // Retrograde rotation
      vec3 atmosphereColor = texture2D(atmosphereTexture, atmosphereUV).rgb;

      // Calculate lighting
      float sunDot = dot(vNormal, normalize(sunDirection));
      float lightIntensity = max(0.3, sunDot);

      // Venus atmosphere tint - lighter and more subtle
      vec3 venusAtmosphere = vec3(1.0, 0.95, 0.8);

      // Mix surface with atmosphere - lighter atmosphere blend
      vec3 finalColor = mix(surfaceColor, atmosphereColor, 0.3);
      finalColor = mix(finalColor, venusAtmosphere, 0.2);

      // Apply brighter lighting
      finalColor *= lightIntensity * 1.4 + 0.4;

      // Subtle atmospheric glow on edges
      float fresnel = 1.0 - abs(dot(vNormal, normalize(cameraPosition - vWorldPosition)));
      finalColor += venusAtmosphere * fresnel * 0.15;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `
);

extend({ VenusAtmosphereMaterial });

// Realistic Venus component with proper atmosphere
function RealisticVenus() {
  const venusRef = useRef();
  const surfaceTex = useLoader(TextureLoader, venusTexture);
  const atmosphereTex = useLoader(TextureLoader, venusAtmosphereTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (venusRef.current) {
      // Venus rotation (243 Earth days = 1 Venus day, retrograde)
      venusRef.current.rotation.y -= 0.0008;

      // Venus's 177.4-degree axial tilt (nearly upside down) with subtle wobble
      venusRef.current.rotation.x =
        (177.4 * Math.PI) / 180 + Math.sin(time * 0.1) * 0.005;
      venusRef.current.rotation.z = Math.cos(time * 0.08) * 0.003;

      // Update shader time for atmosphere animation
      if (venusRef.current.material) {
        venusRef.current.material.time = time;
      }
    }
  });

  return (
    <mesh ref={venusRef}>
      <sphereGeometry args={[1.8, 128, 128]} />
      <venusAtmosphereMaterial
        surfaceTexture={surfaceTex}
        atmosphereTexture={atmosphereTex}
        sunDirection={new Vector3(10, 5, 5).normalize()}
        time={0}
      />
    </mesh>
  );
}

// Shooting star component with enhanced visibility
function ShootingStar({ initialPosition, direction, speed, delay, color }) {
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
      if (newPos.length() > 80) {
        setVisible(false);
        // Reset position after a delay
        setTimeout(() => {
          setPosition(initialPosition.clone());
          setVisible(true);
        }, Math.random() * 2000 + 500); // 0.5-2.5 seconds delay
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
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {/* Bright glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
      {/* Trail effect - longer and more visible */}
      <mesh
        position={[
          position.x - direction.x * 1,
          position.y - direction.y * 1,
          position.z - direction.z * 1,
        ]}
      >
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>
      <mesh
        position={[
          position.x - direction.x * 2,
          position.y - direction.y * 2,
          position.z - direction.z * 2,
        ]}
      >
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      <mesh
        position={[
          position.x - direction.x * 3.5,
          position.y - direction.y * 3.5,
          position.z - direction.z * 3.5,
        ]}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

// Enhanced space background with shooting stars and asteroids
function EnhancedSpaceBackground() {
  const shootingStars = useMemo(() => {
    const starColors = [
      "#ffffff", // White
      "#ffdddd", // Light pink
      "#ddddff", // Light blue
      "#ffffdd", // Light yellow
      "#ddffdd", // Light green
      "#ffddff", // Light magenta
      "#ddffff", // Light cyan
      "#ffeedd", // Light orange
    ];

    return Array.from({ length: 10 }, (_, i) => ({
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
      speed: 0.25 + Math.random() * 0.35,
      delay: Math.random() * 3000, // Even shorter delay for more frequent stars
      color: starColors[i % starColors.length],
    }));
  }, []);

  return (
    <>
      {/* Enhanced stars with color variations */}
      <Stars
        radius={300}
        depth={60}
        count={12000}
        factor={8}
        saturation={0.3}
        fade={true}
        speed={0.3}
      />

      {/* Additional star field with different colors */}
      <Stars
        radius={500}
        depth={100}
        count={5000}
        factor={12}
        saturation={0.4}
        fade={true}
        speed={0.1}
      />

      {/* Third layer for more color variation */}
      <Stars
        radius={400}
        depth={80}
        count={3000}
        factor={10}
        saturation={0.5}
        fade={true}
        speed={0.2}
      />

      {/* Shooting stars */}
      {shootingStars.map((star) => (
        <ShootingStar
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

// Realistic lighting for Venus
function VenusLighting() {
  return (
    <>
      <directionalLight
        position={[10, 5, 5]}
        intensity={2.8}
        color="#ffffff"
        castShadow
      />
      <ambientLight intensity={0.25} color="#fff8e1" />
      {/* Subtle additional light for Venus atmosphere */}
      <pointLight
        position={[15, 10, 8]}
        intensity={1.2}
        color="#ffeb3b"
        distance={50}
      />
    </>
  );
}

// Main Venus component
export default function Venus({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".venus-container", {
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
      className="venus-container"
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
        <EnhancedSpaceBackground />
        <VenusLighting />
        <RealisticVenus />

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
              rgba(255, 198, 73, 0.9) 0%,
              rgba(255, 140, 0, 0.8) 100%
            )
          `,
          border: "1px solid rgba(255, 198, 73, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
          fontWeight: "700",
          fontSize: "14px",
          color: "#ffffff",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          letterSpacing: "1px",
          textTransform: "uppercase",
          boxShadow: `
            0 8px 25px rgba(255, 198, 73, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3),
            0 0 30px rgba(255, 198, 73, 0.3)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          backdropFilter: "blur(10px)",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        ♀️ Return to Solar System
      </button>

      {/* Flashcard Component */}
      <Flashcard
        planet="Venus"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
