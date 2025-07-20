import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Stars, shaderMaterial } from "@react-three/drei";
import { TextureLoader, Vector3 } from "three";
import {
  EffectComposer,
  Bloom,
  ToneMapping,
} from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { extend } from "@react-three/fiber";
import gsap from "gsap";
import Flashcard from "./Flashcard.jsx";

// Import textures
import earthTexture from "./assets/textures/2k_earth_daymap.jpg";
import earthNightTexture from "./assets/textures/2k_earth_nightmap.jpg";
import moonTexture from "./assets/textures/2k_moon.jpg";
import cloudTexture from "./assets/textures/2k_earth_clouds.jpg";

// Clean realistic Earth shader material - no blue tint
const EarthMaterial = shaderMaterial(
  {
    dayTexture: null,
    nightTexture: null,
    cloudTexture: null,
    sunDirection: new Vector3(1, 0, 0),
    time: 0,
    isNightMode: 0.0, // Toggle between day (0.0) and night (1.0)
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
  // Fragment shader - Natural and beautiful day/night
  `
    uniform sampler2D dayTexture;
    uniform sampler2D nightTexture;
    uniform sampler2D cloudTexture;
    uniform vec3 sunDirection;
    uniform float time;
    uniform float isNightMode;

    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;

    void main() {
      // Sample textures
      vec3 dayColor = texture2D(dayTexture, vUv).rgb;
      vec3 nightColor = texture2D(nightTexture, vUv).rgb;

      vec3 earthColor;

      if (isNightMode > 0.5) {
        // Pure night mode - bright city lights
        earthColor = nightColor * 1.1; // Slightly boost city lights
      } else {
        // Day mode - natural, evenly lit Earth without harsh shadows
        vec3 normalizedSunDir = normalize(sunDirection);
        vec3 normalizedNormal = normalize(vNormal);
        float sunDot = dot(normalizedNormal, normalizedSunDir);

        // Gentle day/night transition without harsh shadows
        float dayFactor = smoothstep(-0.1, 0.1, sunDot);

        // Natural lighting without artificial brightness
        float lightIntensity = max(0.3, sunDot); // Minimum 0.3 to avoid dark shadows

        // Clean, natural mix
        earthColor = mix(
          nightColor * 0.6, // Gentle dark side
          dayColor * 0.95, // Natural day side brightness
          dayFactor
        );

        // Gentle, even lighting without harsh contrasts
        earthColor *= (0.8 + 0.2 * lightIntensity);
      }

      // Output clean, natural color
      gl_FragColor = vec4(earthColor, 1.0);
    }
  `
);

extend({ EarthMaterial });

// Clean realistic Earth component with day/night toggle
function RealisticEarth({ onClick, isNightMode, showLayers }) {
  const earthRef = useRef();
  const cloudRef = useRef();
  const earthTex = useLoader(TextureLoader, earthTexture);
  const earthNightTex = useLoader(TextureLoader, earthNightTexture);
  const cloudTex = useLoader(TextureLoader, cloudTexture);

  // Sun direction for realistic lighting (matching the directional light)
  const sunDirection = useMemo(() => new Vector3(15, 5, 10).normalize(), []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (earthRef.current) {
      // Realistic Earth rotation (24 hours = 1 day)
      earthRef.current.rotation.y += 0.005;

      // Subtle axial wobble for realism
      earthRef.current.rotation.x = Math.sin(time * 0.1) * 0.01;
      earthRef.current.rotation.z = Math.cos(time * 0.08) * 0.005;

      // Update shader uniforms
      if (earthRef.current.material.uniforms) {
        earthRef.current.material.uniforms.sunDirection.value = sunDirection;
        earthRef.current.material.uniforms.time.value = time;
        earthRef.current.material.uniforms.isNightMode.value = isNightMode
          ? 1.0
          : 0.0;
      }
    }

    if (cloudRef.current) {
      // Clouds rotate slightly faster than Earth
      cloudRef.current.rotation.y += 0.006;

      // Subtle cloud layer movement
      cloudRef.current.rotation.x = Math.sin(time * 0.05) * 0.005;

      // Adjust cloud visibility for both modes
      cloudRef.current.material.opacity = isNightMode ? 0.2 : 0.5;
    }
  });

  return (
    <group onClick={onClick} scale={showLayers ? [0, 0, 0] : [1, 1, 1]}>
      {/* Clean realistic Earth without blue tint - hidden when showing layers */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[2, 256, 256]} />
        <earthMaterial
          dayTexture={earthTex}
          nightTexture={earthNightTex}
          cloudTexture={cloudTex}
          sunDirection={sunDirection}
          time={0}
          isNightMode={isNightMode ? 1.0 : 0.0}
        />
      </mesh>

      {/* Enhanced cloud layer with better visibility */}
      <mesh ref={cloudRef}>
        <sphereGeometry args={[2.003, 128, 128]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent={true}
          opacity={0.5}
          depthWrite={false}
          roughness={0.8}
          metalness={0.0}
          alphaTest={0.03}
          emissive="#ffffff"
          emissiveIntensity={0.02}
        />
      </mesh>
    </group>
  );
}

// NASA-level realistic Moon component
function RealisticMoon() {
  const moonRef = useRef();
  const moonGroupRef = useRef();
  const moonTex = useLoader(TextureLoader, moonTexture);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (moonGroupRef.current && moonRef.current) {
      // Realistic Moon orbital motion (27.3 days = 1 lunar month)
      moonGroupRef.current.rotation.y += 0.002;

      // Moon's tidally locked rotation
      moonRef.current.rotation.y += 0.002;

      // Realistic orbital inclination (5.14 degrees)
      moonGroupRef.current.rotation.x = Math.sin(time * 0.05) * 0.09;

      // Subtle libration (Moon's wobble)
      moonRef.current.rotation.z = Math.sin(time * 0.03) * 0.02;
    }
  });

  return (
    <group ref={moonGroupRef}>
      <mesh ref={moonRef} position={[8, 0, 0]}>
        <sphereGeometry args={[0.5, 256, 256]} />
        <meshStandardMaterial
          map={moonTex}
          roughness={0.98} // Very rough lunar regolith
          metalness={0.0}
          color="#f8f8f8" // Slightly warmer white
          normalScale={[0.3, 0.3]} // Subtle surface detail
          bumpScale={0.005} // Very subtle bump mapping
          displacementScale={0.001} // Minimal displacement
          // Enhanced for NASA-level realism
          transparent={false}
          opacity={1.0}
          side={0} // FrontSide
        />
      </mesh>
    </group>
  );
}

// Natural Earth system lighting - beautiful and even
function EarthSystemLighting({ isNightMode }) {
  const sunLightRef = useRef();
  const fillLightRef = useRef();

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Keep primary sun light fixed for consistent illumination
    if (sunLightRef.current) {
      sunLightRef.current.position.set(15, 5, 10);
      sunLightRef.current.lookAt(0, 0, 0);
      // Natural intensity for both modes
      sunLightRef.current.intensity = isNightMode ? 1.5 : 3.0;
    }

    // Fill light for natural, even illumination
    if (fillLightRef.current) {
      fillLightRef.current.position.x = -8 + Math.sin(time * 0.1) * 0.5;
      fillLightRef.current.position.z = -5 + Math.cos(time * 0.1) * 0.3;
      // Gentle fill light in both modes
      fillLightRef.current.intensity = isNightMode ? 0.3 : 1.2;
    }
  });

  return (
    <>
      {/* Primary sun-like directional light - natural intensity */}
      <directionalLight
        ref={sunLightRef}
        position={[15, 5, 10]}
        intensity={isNightMode ? 1.5 : 3.0}
        color="#ffffff"
        castShadow={false} // Disable shadows for cleaner look
      />

      {/* Fill light for even illumination */}
      <directionalLight
        ref={fillLightRef}
        position={[-8, -2, -5]}
        intensity={isNightMode ? 0.3 : 1.2}
        color="#ffffff"
        castShadow={false}
      />

      {/* Ambient light for natural space illumination */}
      <ambientLight intensity={isNightMode ? 0.1 : 0.3} color="#ffffff" />
    </>
  );
}

// Earth Layers Cross-Section Component with Fun Animations
function EarthLayers({ showLayers }) {
  const groupRef = useRef();
  const coreRef = useRef();
  const outerCoreRef = useRef();
  const mantleRef = useRef();
  const crustRef = useRef();

  // Fun entrance animations when layers appear
  React.useEffect(() => {
    if (showLayers && groupRef.current) {
      // Staggered bouncy entrance animation
      gsap.fromTo(
        coreRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(2)", delay: 0.2 }
      );
      gsap.fromTo(
        outerCoreRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(2)", delay: 0.4 }
      );
      gsap.fromTo(
        mantleRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(2)", delay: 0.6 }
      );
      gsap.fromTo(
        crustRef.current.scale,
        { x: 0, y: 0, z: 0 },
        { x: 1, y: 1, z: 1, duration: 1.2, ease: "back.out(2)", delay: 0.8 }
      );

      // Fun rotation entrance
      gsap.fromTo(
        groupRef.current.rotation,
        { y: Math.PI * 2 },
        { y: -Math.PI / 6, duration: 2, ease: "power3.out", delay: 0.2 }
      );
    }
  }, [showLayers]);

  // Continuous fun animations while layers are visible
  useFrame((state) => {
    if (showLayers && groupRef.current) {
      const time = state.clock.elapsedTime;

      // Gentle floating animation for the whole group
      groupRef.current.position.y = Math.sin(time * 0.5) * 0.1;

      // Individual layer animations - NO ROTATION for clear cross-section view
      if (coreRef.current) {
        // Core pulses with heat
        const pulse = 1 + Math.sin(time * 3) * 0.05;
        coreRef.current.scale.setScalar(pulse);
        coreRef.current.material.emissiveIntensity =
          0.3 + Math.sin(time * 2) * 0.1;
      }

      if (outerCoreRef.current) {
        // Outer core glow variation - NO ROTATION
        outerCoreRef.current.material.emissiveIntensity =
          0.2 + Math.sin(time * 1.5) * 0.05;
      }

      if (mantleRef.current) {
        // Mantle glow variation - NO ROTATION
        mantleRef.current.material.emissiveIntensity =
          0.1 + Math.sin(time * 1) * 0.03;
      }

      // Crust stays static for clear educational view
    }
  });

  if (!showLayers) return null;

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 6, 0]}>
      {/* Inner Core - Yellow (3/4 sphere - upper quarter removed) */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshPhongMaterial
          color="#ffdd00"
          emissive="#ff8800"
          emissiveIntensity={0.3}
          side={2}
        />
      </mesh>

      {/* Outer Core - Orange (3/4 sphere - upper quarter removed) */}
      <mesh ref={outerCoreRef}>
        <sphereGeometry args={[1.4, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshPhongMaterial
          color="#ff6600"
          emissive="#ff3300"
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
          side={2}
        />
      </mesh>

      {/* Mantle - Red (3/4 sphere - upper quarter removed) */}
      <mesh ref={mantleRef}>
        <sphereGeometry args={[2.2, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshPhongMaterial
          color="#dd3300"
          emissive="#bb2200"
          emissiveIntensity={0.1}
          transparent
          opacity={0.7}
          side={2}
        />
      </mesh>

      {/* Crust - Brown (3/4 sphere - upper quarter removed) */}
      <mesh ref={crustRef}>
        <sphereGeometry args={[2.5, 32, 32, 0, Math.PI * 1.5, 0, Math.PI]} />
        <meshPhongMaterial color="#8B4513" transparent opacity={0.6} side={2} />
      </mesh>
    </group>
  );
}

// Main Earth component
export default function Earth({ onReturnToSolarSystem }) {
  const controlsRef = useRef();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isNightMode, setIsNightMode] = useState(false);
  const [showFlashcard, setShowFlashcard] = useState(false);
  const [showLayers, setShowLayers] = useState(false);

  const handleReturnToSolarSystem = () => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    // Smooth fade transition
    gsap.to(".earth-container", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        onReturnToSolarSystem();
      },
    });
  };

  // Handle layers toggle with smooth animation
  const handleLayersToggle = () => {
    setShowLayers(!showLayers);

    // Camera positioning to face cross-sectional view directly
    if (controlsRef.current) {
      if (!showLayers) {
        // Moving to layers view - position to face the cut section directly
        gsap.to(controlsRef.current.object.position, {
          x: 4,
          y: 2,
          z: 4,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => controlsRef.current.update(),
        });

        // Point camera at the cross-section
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 2,
          ease: "power3.out",
          onUpdate: () => controlsRef.current.update(),
        });
      } else {
        // Moving back to normal view
        gsap.to(controlsRef.current.object.position, {
          x: 0,
          y: 5,
          z: 8,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => controlsRef.current.update(),
        });

        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: "power2.out",
          onUpdate: () => controlsRef.current.update(),
        });
      }
    }
  };

  return (
    <div
      className="earth-container"
      style={{
        width: "100vw",
        height: "100vh",
        background: "linear-gradient(to bottom, #000011 0%, #000033 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Enhanced CSS for Earth system */}
      <style jsx>{`
        @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap");

        @keyframes earthGlow {
          0% {
            box-shadow: 0 0 30px rgba(100, 149, 237, 0.5);
          }
          100% {
            box-shadow: 0 0 50px rgba(100, 149, 237, 0.8);
          }
        }

        @keyframes stellarPulse {
          0% {
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 25px rgba(59, 130, 246, 0.2);
          }
          100% {
            box-shadow: 0 8px 30px rgba(59, 130, 246, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              0 0 40px rgba(59, 130, 246, 0.5);
          }
        }

        @keyframes twinkle {
          0% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
        }
      `}</style>

      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        style={{ background: "transparent" }}
        shadows
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          physicallyCorrectLights: true,
        }}
      >
        {/* Enhanced starfield background */}
        <Stars
          radius={300}
          depth={60}
          count={8000}
          factor={7}
          saturation={0}
          fade={true}
          speed={0.5}
        />

        {/* Earth system lighting */}
        <EarthSystemLighting isNightMode={isNightMode} />

        {/* Realistic Earth */}
        <RealisticEarth isNightMode={isNightMode} showLayers={showLayers} />

        {/* Earth Layers - Amazing interior view */}
        <EarthLayers showLayers={showLayers} />

        {/* Labels removed - cross-section view is self-explanatory */}

        {/* Realistic Moon - hide when showing layers */}
        {!showLayers && <RealisticMoon />}

        {/* Enhanced orbital controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={3}
          maxDistance={20}
          enableDamping={true}
          dampingFactor={0.02}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          panSpeed={0.8}
        />

        {/* Minimal post-processing for natural appearance */}
        <EffectComposer>
          <Bloom
            intensity={isNightMode ? 0.4 : 0.3}
            luminanceThreshold={isNightMode ? 0.7 : 0.8}
            luminanceSmoothing={0.9}
            height={300}
            opacity={isNightMode ? 0.6 : 0.4}
          />
          <ToneMapping
            mode={ToneMappingMode.ACES_FILMIC}
            resolution={256}
            whitePoint={isNightMode ? 1.5 : 2.0}
            middleGrey={isNightMode ? 0.7 : 0.8}
            minLuminance={0.01}
            averageLuminance={1.0}
            adaptationRate={1.0}
          />
        </EffectComposer>
      </Canvas>

      {/* Stunning Day/Night Toggle Button */}
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "30px",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          padding: "20px 25px",
          background: `
            linear-gradient(135deg,
              rgba(255, 215, 0, 0.15) 0%,
              rgba(25, 25, 112, 0.15) 100%
            )
          `,
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "25px",
          backdropFilter: "blur(15px)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2),
            0 0 40px rgba(255, 215, 0, 0.1)
          `,
          fontFamily: '"Orbitron", "Arial", sans-serif',
          color: "#ffffff",
          fontSize: "14px",
          fontWeight: "600",
          letterSpacing: "1px",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        <span style={{ opacity: 0.9 }}>
          {isNightMode ? "🌙 Night Mode" : "☀️ Day Mode"}
        </span>

        {/* Stunning Toggle Switch */}
        <div
          onClick={() => setIsNightMode(!isNightMode)}
          style={{
            position: "relative",
            width: "60px",
            height: "30px",
            background: isNightMode
              ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
              : "linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)",
            borderRadius: "15px",
            cursor: "pointer",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            border: isNightMode
              ? "2px solid rgba(100, 149, 237, 0.5)"
              : "2px solid rgba(255, 215, 0, 0.8)",
            boxShadow: isNightMode
              ? "0 0 20px rgba(100, 149, 237, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3)"
              : "0 0 20px rgba(255, 215, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.1)",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = isNightMode
              ? "0 0 30px rgba(100, 149, 237, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.3)"
              : "0 0 30px rgba(255, 215, 0, 0.6), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = isNightMode
              ? "0 0 20px rgba(100, 149, 237, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.3)"
              : "0 0 20px rgba(255, 215, 0, 0.4), inset 0 2px 4px rgba(0, 0, 0, 0.1)";
          }}
        >
          {/* Toggle Ball */}
          <div
            style={{
              position: "absolute",
              top: "2px",
              left: isNightMode ? "32px" : "2px",
              width: "24px",
              height: "24px",
              background: isNightMode
                ? "radial-gradient(circle, #e6e6fa 0%, #b0c4de 100%)"
                : "radial-gradient(circle, #ffffff 0%, #fffacd 100%)",
              borderRadius: "50%",
              transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: isNightMode
                ? "0 2px 8px rgba(0, 0, 0, 0.4), 0 0 15px rgba(230, 230, 250, 0.3)"
                : "0 2px 8px rgba(0, 0, 0, 0.2), 0 0 15px rgba(255, 255, 255, 0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "12px",
            }}
          >
            {isNightMode ? "🌙" : "☀️"}
          </div>

          {/* Background Stars for Night Mode */}
          {isNightMode && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                background: `
                  radial-gradient(1px 1px at 8px 8px, #fff, transparent),
                  radial-gradient(1px 1px at 20px 15px, #fff, transparent),
                  radial-gradient(1px 1px at 45px 10px, #fff, transparent)
                `,
                backgroundSize: "50px 25px",
                opacity: 0.6,
                animation: "twinkle 2s ease-in-out infinite alternate",
              }}
            />
          )}
        </div>
      </div>

      {/* Earth Layers Toggle Button */}
      <button
        onClick={handleLayersToggle}
        style={{
          position: "absolute",
          top: "30px",
          left: "30px",
          padding: "15px 25px",
          background: `
            linear-gradient(135deg,
              rgba(255, 140, 0, 0.9) 0%,
              rgba(255, 69, 0, 0.8) 100%
            )
          `,
          border: "1px solid rgba(255, 140, 0, 0.5)",
          borderRadius: "15px",
          color: "white",
          fontSize: "16px",
          fontWeight: "600",
          fontFamily: '"Orbitron", "Arial", sans-serif',
          cursor: "pointer",
          backdropFilter: "blur(10px)",
          boxShadow: `
            0 8px 25px rgba(255, 140, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: "translateY(0) scale(1)",
          letterSpacing: "0.5px",
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = "translateY(-3px) scale(1.05)";
          e.target.style.boxShadow = `
            0 12px 35px rgba(255, 140, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `;
          e.target.style.background = `
            linear-gradient(135deg,
              rgba(255, 140, 0, 1) 0%,
              rgba(255, 69, 0, 0.9) 100%
            )
          `;
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = "translateY(0) scale(1)";
          e.target.style.boxShadow = `
            0 8px 25px rgba(255, 140, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
          e.target.style.background = `
            linear-gradient(135deg,
              rgba(255, 140, 0, 0.9) 0%,
              rgba(255, 69, 0, 0.8) 100%
            )
          `;
        }}
        onMouseDown={(e) => {
          e.target.style.transform = "translateY(-1px) scale(1.02)";
        }}
        onMouseUp={(e) => {
          e.target.style.transform = "translateY(-3px) scale(1.05)";
        }}
      >
        {showLayers ? "🌍 Show Surface" : "🔥 Show Layers"}
      </button>

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
              rgba(59, 130, 246, 0.9) 0%,
              rgba(147, 51, 234, 0.8) 100%
            )
          `,
          border: "1px solid rgba(59, 130, 246, 0.4)",
          borderRadius: "20px",
          cursor: isTransitioning ? "not-allowed" : "pointer",
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
          animation: "stellarPulse 2s ease-in-out infinite alternate",
          opacity: isTransitioning ? 0.5 : 1,
        }}
        onMouseEnter={(e) => {
          if (!isTransitioning) {
            e.target.style.background = `
              linear-gradient(135deg,
                rgba(59, 130, 246, 1) 0%,
                rgba(147, 51, 234, 1) 100%
              )
            `;
            e.target.style.boxShadow = `
              0 12px 35px rgba(59, 130, 246, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              0 0 50px rgba(59, 130, 246, 0.6)
            `;
            e.target.style.transform = "translateY(-3px) scale(1.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isTransitioning) {
            e.target.style.background = `
              linear-gradient(135deg,
                rgba(59, 130, 246, 0.9) 0%,
                rgba(147, 51, 234, 0.8) 100%
              )
            `;
            e.target.style.boxShadow = `
              0 8px 25px rgba(59, 130, 246, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 30px rgba(59, 130, 246, 0.3)
            `;
            e.target.style.transform = "translateY(0) scale(1)";
          }
        }}
      >
        🌌 Return to Solar System
      </button>

      {/* Earth Layers Info Panel */}
      {showLayers && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: "30px",
            transform: "translateY(-50%)",
            padding: "25px",
            background: `
              linear-gradient(135deg,
                rgba(15, 23, 42, 0.95) 0%,
                rgba(30, 41, 59, 0.9) 100%
              )
            `,
            border: "1px solid rgba(255, 140, 0, 0.3)",
            borderRadius: "20px",
            backdropFilter: "blur(15px)",
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.1)
            `,
            color: "white",
            fontFamily: '"Space Mono", monospace',
            fontSize: "14px",
            lineHeight: "1.6",
            maxWidth: "300px",
            animation: "slideInRight 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              fontSize: "18px",
              fontWeight: "700",
              color: "#ff8800",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              textAlign: "center",
            }}
          >
            🔍 Earth Cross-Section View
          </h3>

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#ffdd00",
                  borderRadius: "50%",
                  marginRight: "10px",
                  boxShadow: "0 0 8px rgba(255, 221, 0, 0.6)",
                }}
              ></div>
              <strong style={{ color: "#ffdd00" }}>Inner Core</strong>
            </div>
            <p
              style={{ margin: "0 0 0 22px", fontSize: "12px", opacity: "0.9" }}
            >
              Solid iron-nickel alloy, 1,220 km radius, 5,000-6,000°C
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#ff6600",
                  borderRadius: "50%",
                  marginRight: "10px",
                  boxShadow: "0 0 8px rgba(255, 102, 0, 0.6)",
                }}
              ></div>
              <strong style={{ color: "#ff6600" }}>Outer Core</strong>
            </div>
            <p
              style={{ margin: "0 0 0 22px", fontSize: "12px", opacity: "0.9" }}
            >
              Liquid iron-nickel, 2,300 km thick, 4,000-5,000°C
            </p>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#dd3300",
                  borderRadius: "50%",
                  marginRight: "10px",
                  boxShadow: "0 0 8px rgba(221, 51, 0, 0.6)",
                }}
              ></div>
              <strong style={{ color: "#dd3300" }}>Mantle</strong>
            </div>
            <p
              style={{ margin: "0 0 0 22px", fontSize: "12px", opacity: "0.9" }}
            >
              Hot silicate rock, 2,900 km thick, 1,000-3,700°C
            </p>
          </div>

          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#8B4513",
                  borderRadius: "50%",
                  marginRight: "10px",
                  boxShadow: "0 0 8px rgba(139, 69, 19, 0.6)",
                }}
              ></div>
              <strong style={{ color: "#8B4513" }}>Crust</strong>
            </div>
            <p
              style={{ margin: "0 0 0 22px", fontSize: "12px", opacity: "0.9" }}
            >
              Solid rock, 5-70 km thick, 0-1,000°C
            </p>
          </div>
        </div>
      )}

      {/* Flashcard Component */}
      <Flashcard
        planet="Earth"
        isVisible={showFlashcard}
        onClose={() => setShowFlashcard(false)}
      />
    </div>
  );
}
