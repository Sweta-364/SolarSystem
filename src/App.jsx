import React, { useRef, useState, useEffect, useCallback } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  TextureLoader,
  Vector3,
  BufferGeometry,
  LineBasicMaterial,
  FrontSide,
  BackSide,
  InstancedMesh,
  Object3D,
  SphereGeometry,
  MeshStandardMaterial,
  BoxGeometry,
  IcosahedronGeometry,
  Color,
  InstancedBufferAttribute,
} from "three";
import gsap from "gsap";
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
  ToneMapping,
} from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import Earth from "./Earth.jsx";
import Mercury from "./Mercury.jsx";
import Venus from "./Venus.jsx";
import Mars from "./Mars.jsx";
import Jupiter from "./Jupiter.jsx";
import Saturn from "./Saturn.jsx";
import Uranus from "./Uranus.jsx";
import Neptune from "./Neptune.jsx";
import Pluto from "./Pluto.jsx";
import Hyperspeed from "./assets/effects/Hyperspeed.jsx";

// Professional UI Components (for enhancements)
import {
  NotificationSystem,
  showSuccess,
  showInfo,
  showNavigation,
  showDiscovery,
} from "./components/UI";

// Epic Sun Animation
import SunApproachAnimation from "./components/effects/SunApproachAnimation.jsx";

// Stunning Authentication System
import AuthScreen from "./components/auth/AuthScreen.jsx";

// Professional Effects
import CosmicCursor from "./components/effects/CosmicCursor.jsx";

// Enhanced Components
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { LoadingScreen, LoadingButton } from "./components/LoadingStates.jsx";
import {
  useKeyboardNavigation,
  KeyboardHelpModal,
} from "./components/KeyboardNavigation.jsx";
import {
  SkipLinks,
  useScreenReader,
  HighContrastToggle,
} from "./components/Accessibility.jsx";
import { AdvancedSearch } from "./components/SearchSystem.jsx";

// Futuristic Components
import {
  AIVoiceAssistant,
  HolographicOverlay,
  NeuralNetworkBG,
  QuantumParticles,
  DataStream,
} from "./components/FuturisticFeatures.jsx";
import {
  ARModeSimulator,
  VRModeSimulator,
  GestureControl,
} from "./components/ARVRSimulation.jsx";
import {
  QuantumComputer,
  AIAnalytics,
  BlockchainLedger,
} from "./components/QuantumAI.jsx";

// Textures
import mercuryTexture from "./assets/textures/2k_mercury.jpg";
import venusTexture from "./assets/textures/2k_venus_surface.jpg";
import earthTexture from "./assets/textures/2k_earth_daymap.jpg";
import marsTexture from "./assets/textures/2k_mars.jpg";
import jupiterTexture from "./assets/textures/2k_jupiter.jpg";
import saturnTexture from "./assets/textures/2k_saturn.jpg";
import uranusTexture from "./assets/textures/2k_uranus.jpg";
import neptuneTexture from "./assets/textures/2k_neptune.jpg";
import plutoTexture from "./assets/textures/2k_ceres_fictional.jpg";
import sunTexture from "./assets/textures/2k_sun.jpg";
// Ring texture for Saturn
import saturnRingTexture from "./assets/textures/2k_saturn_ring_alpha.png";
// Milky Way background
import milkyWayTexture from "./assets/textures/2k_stars_milky_way.jpg";

// Planet data with axial tilts & rings
const planets = [
  {
    name: "Mercury",
    distance: 4,
    size: 0.2,
    speed: 2,
    tex: mercuryTexture,
    tilt: 0,
  },
  {
    name: "Venus",
    distance: 6,
    size: 0.3,
    speed: 1.6,
    tex: venusTexture,
    tilt: (177.4 * Math.PI) / 180,
  },
  {
    name: "Earth",
    distance: 8,
    size: 0.35,
    speed: 1.2,
    tex: earthTexture,
    tilt: (23.4 * Math.PI) / 180,
  },
  {
    name: "Mars",
    distance: 10,
    size: 0.25,
    speed: 1.0,
    tex: marsTexture,
    tilt: (25 * Math.PI) / 180,
  },
  {
    name: "Jupiter",
    distance: 13,
    size: 0.9,
    speed: 0.7,
    tex: jupiterTexture,
    tilt: (3.1 * Math.PI) / 180,
  },
  {
    name: "Saturn",
    distance: 16,
    size: 0.8,
    speed: 0.5,
    tex: saturnTexture,
    tilt: (26.7 * Math.PI) / 180,
    ring: { inner: 0.7, outer: 1.1, texture: saturnRingTexture, opacity: 0.8 },
  },
  {
    name: "Uranus",
    distance: 20,
    size: 0.6,
    speed: 0.3,
    tex: uranusTexture,
    tilt: (97.8 * Math.PI) / 180,
    ring: { inner: 0.72, outer: 0.88, opacity: 0.1 }, // More realistic ring dimensions
  },
  {
    name: "Neptune",
    distance: 24,
    size: 0.6,
    speed: 0.2,
    tex: neptuneTexture,
    tilt: (28.3 * Math.PI) / 180,
    ring: { inner: 0.68, outer: 0.85, opacity: 0.1 }, // More realistic ring dimensions
  },
  {
    name: "Pluto",
    distance: 28,
    size: 0.1,
    speed: 0.1,
    tex: plutoTexture,
    tilt: (122.5 * Math.PI) / 180,
  },
];

// Optimized star field component for perfect balance
function RealisticStarField() {
  const starRef = useRef();
  const twinkleRef = useRef(0);
  const starCount = 8000; // Reduced for better balance

  // Create star positions and properties
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    // Better distributed positions in multiple layers
    const layer = Math.random();
    let radius;
    if (layer < 0.3) {
      radius = 350 + Math.random() * 50; // Close layer
    } else if (layer < 0.7) {
      radius = 420 + Math.random() * 60; // Medium layer
    } else {
      radius = 500 + Math.random() * 80; // Far layer
    }

    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    // Enhanced star colors with better brightness
    const starType = Math.random();
    const brightness = 0.7 + Math.random() * 0.3; // 0.7-1.0 range

    if (starType < 0.6) {
      // White stars (most common)
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness;
      colors[i * 3 + 2] = brightness;
    } else if (starType < 0.8) {
      // Blue-white stars
      colors[i * 3] = brightness * 0.9;
      colors[i * 3 + 1] = brightness * 0.95;
      colors[i * 3 + 2] = brightness;
    } else if (starType < 0.95) {
      // Yellow-white stars
      colors[i * 3] = brightness;
      colors[i * 3 + 1] = brightness * 0.95;
      colors[i * 3 + 2] = brightness * 0.8;
    } else {
      // Bright stars (rare)
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 1.0;
    }

    // Better proportioned star sizes
    const sizeType = Math.random();
    if (sizeType < 0.7) {
      sizes[i] = 1.0 + Math.random() * 1.5; // Normal stars
    } else if (sizeType < 0.9) {
      sizes[i] = 2.5 + Math.random() * 1.0; // Bright stars
    } else {
      sizes[i] = 4.0 + Math.random() * 2.0; // Very bright stars
    }
  }

  useFrame((state) => {
    if (starRef.current) {
      // Smooth rotation with time-based animation
      const time = state.clock.elapsedTime;
      starRef.current.rotation.y = time * 0.00003; // Smoother rotation

      // Subtle breathing effect for twinkling
      twinkleRef.current = 0.7 + Math.sin(time * 0.5) * 0.1;
      starRef.current.material.opacity = twinkleRef.current;
    }
  });

  return (
    <points ref={starRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={starCount}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={starCount}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={2.0} // Increased base size for better visibility
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        opacity={0.7}
        alphaTest={0.1}
      />
    </points>
  );
}

// Pure Milky Way background - natural black space
function MilkyWayBackground() {
  const milkyWayRef = useRef();
  const milkyWayTex = useLoader(TextureLoader, milkyWayTexture);

  useFrame((state) => {
    if (milkyWayRef.current) {
      // Smooth time-based galactic rotation
      const time = state.clock.elapsedTime;
      milkyWayRef.current.rotation.y = time * 0.00002; // Smoother, time-based
      milkyWayRef.current.rotation.z = Math.sin(time * 0.01) * 0.002; // Subtle oscillation
    }
  });

  return (
    <group>
      {/* Pure Milky Way texture - natural black space */}
      <mesh ref={milkyWayRef}>
        <sphereGeometry args={[500, 128, 64]} />
        <meshBasicMaterial
          map={milkyWayTex}
          side={BackSide}
          transparent={false}
          opacity={1.0}
        />
      </mesh>

      {/* Realistic star field overlay */}
      <RealisticStarField />
    </group>
  );
}

const Sun = React.forwardRef(({ onClick }, ref) => {
  const sunRef = useRef();
  const tex = useLoader(TextureLoader, sunTexture);

  // Use the forwarded ref or the internal ref
  const meshRef = ref || sunRef;

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Rotate the sun with slight variation
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(time * 0.1) * 0.02;

      // Dynamic emissive intensity for lava-like pulsing
      const material = meshRef.current.material;
      if (material) {
        // Pulsing lava effect
        const basePulse = 4 + Math.sin(time * 2) * 0.8;
        const flickerPulse =
          basePulse + Math.sin(time * 8) * 0.3 + Math.sin(time * 12) * 0.2;
        material.emissiveIntensity = flickerPulse;

        // Slight color variation for realistic lava effect
        const heatVariation = 0.1 + Math.sin(time * 3) * 0.05;
        material.emissive.setRGB(
          1.0,
          0.4 + heatVariation,
          0.1 + heatVariation * 0.5
        );
      }
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 8, 0]}
      onClick={() => onClick && onClick(meshRef)}
    >
      <sphereGeometry args={[1.5, 128, 128]} />
      <meshStandardMaterial
        map={tex}
        emissive="#ff6600"
        emissiveIntensity={4}
        emissiveMap={tex}
        roughness={0.8}
        metalness={0}
        // Enhanced for realistic lava appearance
        transparent={false}
        opacity={1}
        side={FrontSide}
      />
    </mesh>
  );
});

function OrbitRing({ distance }) {
  const segments = 128;
  const points = [];
  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * 2 * Math.PI;
    points.push(
      new Vector3(distance * Math.cos(theta), 8, distance * Math.sin(theta)) // Moved to Y=8
    );
  }
  const geo = new BufferGeometry().setFromPoints(points);
  const mat = new LineBasicMaterial({
    color: "#ffffff",
    transparent: true,
    opacity: 0.4, // Increased opacity for better visibility
    linewidth: 2, // Thicker lines
  });
  return (
    <group>
      {/* Main orbit ring */}
      <line geometry={geo} material={mat} />
      {/* Glowy effect - slightly larger ring with lower opacity */}
      <line
        geometry={geo}
        material={
          new LineBasicMaterial({
            color: "#aaccff",
            transparent: true,
            opacity: 0.15,
            linewidth: 4,
          })
        }
        scale={[1.002, 1, 1.002]} // Slightly larger for glow effect
      />
    </group>
  );
}

// Realistic Saturn ring rocks with varied shapes and textures
function RockRing({
  geometry,
  material,
  particleCount,
  innerRadius,
  outerRadius,
}) {
  const meshRef = useRef();
  const tempObject = useRef(new Object3D());
  const positions = useRef([]);
  const rotationSpeeds = useRef([]);
  const colors = useRef([]);
  const particleSizes = useRef([]);

  // Initialize particle data
  React.useEffect(() => {
    positions.current = [];
    rotationSpeeds.current = [];
    colors.current = [];
    particleSizes.current = [];

    for (let i = 0; i < particleCount; i++) {
      // Random position in ring
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const height = (Math.random() - 0.5) * 0.03; // Slight vertical variation

      positions.current.push({
        angle,
        radius,
        height,
        originalAngle: angle,
      });

      // Smooth, elegant orbital speeds (reduced for graceful motion)
      const orbitalSpeed = 0.0003 + (1 / radius) * 0.0002;
      rotationSpeeds.current.push(orbitalSpeed);

      // Enhanced Saturn ring colors with beautiful white, yellow, and brown variations
      const colorVariants = [
        // Brilliant whites and pure ice (30% of particles)
        new Color(1.8, 1.75, 1.7), // Brilliant pure white ice
        new Color(1.6, 1.55, 1.5), // Bright white ice
        new Color(1.7, 1.65, 1.6), // Clean white ice
        new Color(1.5, 1.45, 1.4), // Soft white ice
        new Color(1.9, 1.8, 1.75), // Ultra-bright white
        new Color(1.4, 1.35, 1.3), // Gentle white

        // Golden yellows and warm tones (25% of particles)
        new Color(1.6, 1.5, 1.2), // Bright golden yellow
        new Color(1.4, 1.3, 1.0), // Warm golden ice
        new Color(1.7, 1.6, 1.3), // Brilliant yellow-white
        new Color(1.3, 1.2, 0.9), // Soft yellow ice
        new Color(1.5, 1.4, 1.1), // Creamy yellow
        new Color(1.8, 1.7, 1.4), // Intense golden glow

        // Light browns and tans (20% of particles)
        new Color(1.2, 1.0, 0.8), // Light tan
        new Color(1.1, 0.95, 0.75), // Warm light brown
        new Color(1.3, 1.1, 0.85), // Bright tan
        new Color(1.0, 0.9, 0.7), // Soft beige
        new Color(1.25, 1.05, 0.8), // Golden tan

        // Medium browns and earth tones (15% of particles)
        new Color(0.9, 0.8, 0.6), // Medium brown
        new Color(0.95, 0.82, 0.65), // Warm brown
        new Color(0.85, 0.75, 0.55), // Dusty brown
        new Color(1.0, 0.85, 0.65), // Light chocolate

        // Darker accents (10% of particles)
        new Color(0.8, 0.7, 0.5), // Dark tan
        new Color(0.75, 0.65, 0.45), // Deep brown
        new Color(0.7, 0.6, 0.4), // Rich dark brown
        new Color(0.65, 0.55, 0.35), // Very dark brown
      ];
      // Simple approach - no vertex colors needed
      colors.current.push(new Color(1, 1, 1)); // Placeholder

      // Static size calculation - set once and keep forever
      const baseSize = 0.004 + Math.random() * 0.008;
      const distanceEffect = (1 / radius) * 0.006;
      const materialVariation = Math.random() * 0.004;

      // Create realistic size distribution (most particles small, few large)
      const sizeType = Math.random();
      let sizeFactor;
      if (sizeType < 0.7) {
        sizeFactor = 0.8 + Math.random() * 0.4; // Small particles (70%)
      } else if (sizeType < 0.9) {
        sizeFactor = 1.2 + Math.random() * 0.6; // Medium particles (20%)
      } else {
        sizeFactor = 1.8 + Math.random() * 1.0; // Large boulders (10%)
      }

      const finalSize =
        (baseSize + distanceEffect + materialVariation) * sizeFactor;
      particleSizes.current.push(finalSize);
    }

    // No vertex color setup needed - using material color
  }, [particleCount, innerRadius, outerRadius]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    for (let i = 0; i < particleCount; i++) {
      const particle = positions.current[i];
      const rotSpeed = rotationSpeeds.current[i];

      // Update orbital position with gentle perturbations
      const baseAngle = particle.originalAngle + time * rotSpeed;
      const angularFloat =
        baseAngle +
        Math.sin(time * 0.3 + i * 0.03) * 0.01 + // Gentle angular drift
        Math.sin(time * 0.12 + particle.radius * 0.05) * 0.005; // Ring resonance effects

      particle.angle = angularFloat;

      // Calculate 3D position with smooth, realistic floating motion
      // Gentle gravitational perturbations and ring dynamics
      const floatingY =
        particle.height +
        Math.sin(time * 0.4 + i * 0.02) * 0.002 + // Very gentle vertical drift
        Math.sin(time * 0.15 + particle.radius * 0.1) * 0.001; // Ring wave motion

      // Subtle radial breathing (ring expansion/contraction)
      const radialFloat =
        particle.radius + Math.sin(time * 0.25 + i * 0.05) * 0.008; // Gentle radial variation

      const floatingX = radialFloat * Math.cos(particle.angle);
      const floatingZ = radialFloat * Math.sin(particle.angle);

      tempObject.current.position.set(floatingX, floatingY, floatingZ);

      // Smooth, elegant tumbling motion
      tempObject.current.rotation.set(
        time * rotSpeed * 0.8 + i * 0.03, // Much slower X rotation
        time * rotSpeed * 1.0 + i * 0.05, // Gentle Y rotation
        time * rotSpeed * 0.6 + i * 0.02 // Subtle Z rotation
      );

      // Use pre-calculated static size (no more random changes)
      tempObject.current.scale.setScalar(particleSizes.current[i]);

      tempObject.current.updateMatrix();
      meshRef.current.setMatrixAt(i, tempObject.current.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[geometry, material, particleCount]}
      castShadow
      receiveShadow
    />
  );
}

// Realistic Uranus ring system - thin, dark, and sparse like NASA observations
function UranusRings({ innerRadius, outerRadius }) {
  // Uranus has 13 known rings - very thin, dark, and made of organic compounds
  const uranusRingGeometries = [
    new IcosahedronGeometry(0.2, 0), // Small dark particles
    new BoxGeometry(0.15, 0.05, 0.2), // Tiny elongated chunks
    new SphereGeometry(0.1, 4, 3), // Micro particles
    new BoxGeometry(0.08, 0.03, 0.12), // Dust particles
  ];

  // Dark organic materials - Uranus rings are very dark (albedo ~0.02) but enhanced for visibility
  const darkOrganicMaterial = new MeshStandardMaterial({
    color: "#3a3a3a", // Dark gray-black but more visible
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.95,
    emissive: "#151515", // Enhanced dark glow for better visibility
    emissiveIntensity: 0.15,
  });

  const veryDarkMaterial = new MeshStandardMaterial({
    color: "#2f2f2f", // Dark but more detectable
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.85,
    emissive: "#0a0a0a", // Subtle glow
    emissiveIntensity: 0.1,
  });

  const faintMaterial = new MeshStandardMaterial({
    color: "#252525", // Dark but visible
    roughness: 0.98,
    metalness: 0.0,
    transparent: true,
    opacity: 0.7,
    emissive: "#080808",
    emissiveIntensity: 0.06,
  });

  return (
    <group>
      {/* Epsilon Ring - brightest and densest (most prominent) */}
      <RockRing
        innerRadius={innerRadius + 0.12}
        outerRadius={innerRadius + 0.14}
        particleCount={400}
        geometry={uranusRingGeometries[0]}
        material={darkOrganicMaterial}
      />

      {/* Delta Ring */}
      <RockRing
        innerRadius={innerRadius + 0.08}
        outerRadius={innerRadius + 0.09}
        particleCount={180}
        geometry={uranusRingGeometries[1]}
        material={veryDarkMaterial}
      />

      {/* Gamma Ring */}
      <RockRing
        innerRadius={innerRadius + 0.05}
        outerRadius={innerRadius + 0.06}
        particleCount={120}
        geometry={uranusRingGeometries[2]}
        material={faintMaterial}
      />

      {/* Beta Ring */}
      <RockRing
        innerRadius={innerRadius + 0.02}
        outerRadius={innerRadius + 0.03}
        particleCount={90}
        geometry={uranusRingGeometries[3]}
        material={faintMaterial}
      />

      {/* Alpha Ring */}
      <RockRing
        innerRadius={innerRadius - 0.02}
        outerRadius={innerRadius - 0.01}
        particleCount={80}
        geometry={uranusRingGeometries[0]}
        material={veryDarkMaterial}
      />
    </group>
  );
}

// Realistic Neptune ring system - faint arcs and complete rings
function NeptuneRings({ innerRadius, outerRadius }) {
  // Neptune has 5 main rings with distinctive arc segments
  const neptuneRingGeometries = [
    new SphereGeometry(0.15, 4, 3), // Small rounded particles
    new IcosahedronGeometry(0.12, 0), // Tiny angular fragments
    new BoxGeometry(0.08, 0.04, 0.12), // Micro debris
    new SphereGeometry(0.06, 3, 2), // Dust particles
  ];

  // Neptune ring materials - dark with slight reddish tint (enhanced visibility)
  const adamsRingMaterial = new MeshStandardMaterial({
    color: "#4a3f3a", // Dark with slight red tint - brightest ring (more visible)
    roughness: 0.85,
    metalness: 0.0,
    transparent: true,
    opacity: 0.8,
    emissive: "#252015", // Enhanced warm glow
    emissiveIntensity: 0.12,
  });

  const leverrierRingMaterial = new MeshStandardMaterial({
    color: "#3a322f", // Dark brownish but more visible
    roughness: 0.9,
    metalness: 0.0,
    transparent: true,
    opacity: 0.6,
    emissive: "#15120f",
    emissiveIntensity: 0.08,
  });

  const galleRingMaterial = new MeshStandardMaterial({
    color: "#2f2a27", // Dark brownish but detectable
    roughness: 0.95,
    metalness: 0.0,
    transparent: true,
    opacity: 0.45,
    emissive: "#0f0d0a",
    emissiveIntensity: 0.05,
  });

  return (
    <group>
      {/* Adams Ring - outermost with bright arcs (most prominent) */}
      <RockRing
        innerRadius={outerRadius - 0.03}
        outerRadius={outerRadius - 0.01}
        particleCount={280}
        geometry={neptuneRingGeometries[0]}
        material={adamsRingMaterial}
      />

      {/* Le Verrier Ring - narrow and well-defined */}
      <RockRing
        innerRadius={innerRadius + 0.12}
        outerRadius={innerRadius + 0.14}
        particleCount={180}
        geometry={neptuneRingGeometries[1]}
        material={leverrierRingMaterial}
      />

      {/* Galle Ring - broad and faint */}
      <RockRing
        innerRadius={innerRadius + 0.04}
        outerRadius={innerRadius + 0.1}
        particleCount={150}
        geometry={neptuneRingGeometries[2]}
        material={galleRingMaterial}
      />

      {/* Lassell Ring - between Galle and Le Verrier */}
      <RockRing
        innerRadius={innerRadius + 0.08}
        outerRadius={innerRadius + 0.09}
        particleCount={90}
        geometry={neptuneRingGeometries[3]}
        material={galleRingMaterial}
      />

      {/* Arago Ring - faint inner ring */}
      <RockRing
        innerRadius={innerRadius + 0.06}
        outerRadius={innerRadius + 0.07}
        particleCount={70}
        geometry={neptuneRingGeometries[2]}
        material={galleRingMaterial}
      />
    </group>
  );
}

// Main Saturn rings component with ultra-realistic rock types
function FloatingRockRings({ innerRadius, outerRadius }) {
  // Create highly varied rock geometries for maximum realism
  const rockGeometries = [
    // Ice chunks and boulders
    new IcosahedronGeometry(1, 0), // Sharp angular ice chunks
    new IcosahedronGeometry(1, 1), // Weathered ice boulders
    new IcosahedronGeometry(0.8, 0), // Small ice fragments
    new IcosahedronGeometry(1.2, 1), // Large ice masses

    // Rocky debris
    new BoxGeometry(1, 0.8, 1.2), // Irregular rock chunks
    new BoxGeometry(0.7, 1.1, 0.9), // Elongated rocky pieces
    new BoxGeometry(1.3, 0.6, 1.0), // Flat rock slabs
    new BoxGeometry(0.9, 1.4, 0.8), // Tall rocky spires
    new BoxGeometry(0.8, 1.2, 0.7), // Tall rocky fragments
    new BoxGeometry(1.1, 0.9, 1.3), // Chunky rock blocks

    // Irregular shapes
    new SphereGeometry(1, 6, 4), // Lumpy rounded rocks
    new SphereGeometry(0.9, 8, 6), // Medium detail rocks
    new SphereGeometry(1.1, 4, 3), // Very rough rocks

    // Dust and small particles
    new SphereGeometry(0.5, 6, 4), // Small pebbles
    new BoxGeometry(0.6, 0.3, 0.4), // Tiny rock chips
    new IcosahedronGeometry(0.4, 0), // Micro ice crystals
  ];

  // Realistic Saturn ring materials - natural rock and ice appearance
  const iceMaterial = new MeshStandardMaterial({
    color: "#ffffff", // Pure white ice particles
    roughness: 0.8, // Rough ice surface
    metalness: 0.0, // No metallic properties
    transparent: true,
    opacity: 0.95,
  });

  const lightIceMaterial = new MeshStandardMaterial({
    color: "#f8f8f0", // Light cream ice
    roughness: 0.85,
    metalness: 0.0,
    transparent: true,
    opacity: 0.92,
  });

  const yellowRockMaterial = new MeshStandardMaterial({
    color: "#e6d68a", // Saturn's characteristic yellow
    roughness: 0.9, // Rocky texture
    metalness: 0.0,
    transparent: true,
    opacity: 0.9,
  });

  const lightBrownMaterial = new MeshStandardMaterial({
    color: "#c4a373", // Light brown rocky material
    roughness: 0.95, // Very rough rock surface
    metalness: 0.0,
    transparent: true,
    opacity: 0.88,
  });

  const mediumBrownMaterial = new MeshStandardMaterial({
    color: "#8b6f47", // Medium brown rocks
    roughness: 0.98, // Extremely rough surface
    metalness: 0.0,
    transparent: true,
    opacity: 0.85,
  });

  return (
    <group>
      {/* Inner C Ring - Pure white ice (closest to Saturn) */}
      <RockRing
        innerRadius={innerRadius}
        outerRadius={innerRadius + 0.3}
        particleCount={400}
        geometry={rockGeometries[0]}
        material={iceMaterial}
      />
      <RockRing
        innerRadius={innerRadius + 0.1}
        outerRadius={innerRadius + 0.4}
        particleCount={300}
        geometry={rockGeometries[1]}
        material={lightIceMaterial}
      />

      {/* Cassini Division - Sparse white ice transition */}
      <RockRing
        innerRadius={innerRadius + 0.35}
        outerRadius={innerRadius + 0.45}
        particleCount={150}
        geometry={rockGeometries[2]}
        material={iceMaterial}
      />

      {/* Inner B Ring - White to yellow transition */}
      <RockRing
        innerRadius={innerRadius + 0.5}
        outerRadius={innerRadius + 0.8}
        particleCount={600}
        geometry={rockGeometries[3]}
        material={lightIceMaterial}
      />
      <RockRing
        innerRadius={innerRadius + 0.6}
        outerRadius={innerRadius + 0.9}
        particleCount={800}
        geometry={rockGeometries[4]}
        material={yellowRockMaterial}
      />

      {/* Mid B Ring - Yellow rocky materials */}
      <RockRing
        innerRadius={innerRadius + 0.8}
        outerRadius={innerRadius + 1.2}
        particleCount={1000}
        geometry={rockGeometries[5]}
        material={yellowRockMaterial}
      />
      <RockRing
        innerRadius={innerRadius + 1.0}
        outerRadius={innerRadius + 1.4}
        particleCount={900}
        geometry={rockGeometries[6]}
        material={lightBrownMaterial}
      />

      {/* Outer B Ring - Yellow to brown transition */}
      <RockRing
        innerRadius={innerRadius + 1.3}
        outerRadius={innerRadius + 1.7}
        particleCount={700}
        geometry={rockGeometries[7]}
        material={lightBrownMaterial}
      />

      {/* A Ring - Brown rocky materials (outermost) */}
      <RockRing
        innerRadius={innerRadius + 1.6}
        outerRadius={outerRadius}
        particleCount={800}
        geometry={rockGeometries[8]}
        material={mediumBrownMaterial}
      />
      <RockRing
        innerRadius={innerRadius + 1.8}
        outerRadius={outerRadius + 0.1}
        particleCount={550}
        geometry={rockGeometries[9]}
        material={mediumBrownMaterial}
      />
    </group>
  );
}

function Planet({ data, onClick, onRefReady }) {
  const group = useRef();
  const body = useRef();
  const tex = useLoader(TextureLoader, data.tex);
  const angle = useRef(0);

  // Store the ref for search functionality
  useEffect(() => {
    if (onRefReady && group.current) {
      onRefReady(data.name, group);
    }
  }, [data.name, onRefReady]);

  useFrame((_, dt) => {
    angle.current += data.speed * dt * 0.2;
    group.current.position.set(
      data.distance * Math.cos(angle.current),
      8, // Moved solar system higher on Y-axis
      data.distance * Math.sin(angle.current)
    );
    body.current.rotation.y += 0.01;
  });

  // Enhanced material properties for perfect texture visibility
  const getMaterialProps = () => {
    const baseProps = {
      map: tex,
      roughness: 0.7,
      metalness: 0.0,
      // Enhanced for perfect texture visibility
      transparent: false,
      opacity: 1.0,
      side: FrontSide,
    };

    switch (data.name) {
      case "Mercury":
        return {
          ...baseProps,
          roughness: 0.8,
          metalness: 0.1,
          // Slight warm glow for Mercury's hot surface
          emissive: "#221100",
          emissiveIntensity: 0.05,
        };
      case "Venus":
        return {
          ...baseProps,
          roughness: 0.4,
          metalness: 0.0,
          // Venus atmospheric glow
          emissive: "#332200",
          emissiveIntensity: 0.08,
        };
      case "Earth":
        return {
          ...baseProps,
          roughness: 0.5,
          metalness: 0.15,
          // Subtle blue glow for Earth's atmosphere
          emissive: "#001122",
          emissiveIntensity: 0.03,
        };
      case "Mars":
        return {
          ...baseProps,
          roughness: 0.8,
          metalness: 0.05,
          // Mars red surface glow
          emissive: "#220000",
          emissiveIntensity: 0.04,
        };
      case "Jupiter":
        return {
          ...baseProps,
          roughness: 0.3,
          metalness: 0.0,
          emissive: "#221100",
          emissiveIntensity: 0.02,
        };
      case "Saturn":
        return {
          ...baseProps,
          roughness: 0.4,
          metalness: 0.0,
          emissive: "#221100",
          emissiveIntensity: 0.02,
        };
      case "Uranus":
        return {
          ...baseProps,
          roughness: 0.2,
          metalness: 0.0,
          emissive: "#001122",
          emissiveIntensity: 0.02,
        };
      case "Neptune":
        return {
          ...baseProps,
          roughness: 0.2,
          metalness: 0.0,
          emissive: "#000022",
          emissiveIntensity: 0.02,
        };
      default:
        return baseProps;
    }
  };

  return (
    <group>
      <OrbitRing distance={data.distance} />
      <group ref={group} rotation={[data.tilt, 0, 0]}>
        <mesh ref={body} onClick={() => onClick(group, data.name)}>
          <sphereGeometry args={[data.size, 64, 64]} />
          <meshStandardMaterial {...getMaterialProps()} />
        </mesh>

        {data.ring && data.name === "Saturn" && (
          <group rotation={[Math.PI / 2 + 0.4, 0, 0.2]}>
            <FloatingRockRings
              innerRadius={data.ring.inner}
              outerRadius={data.ring.outer}
            />
          </group>
        )}

        {data.ring && data.name === "Uranus" && (
          <group rotation={[Math.PI / 2, 0, 0]}>
            <UranusRings
              innerRadius={data.ring.inner}
              outerRadius={data.ring.outer}
            />
          </group>
        )}

        {data.ring && data.name === "Neptune" && (
          <group rotation={[Math.PI / 2, 0, 0]}>
            <NeptuneRings
              innerRadius={data.ring.inner}
              outerRadius={data.ring.outer}
            />
          </group>
        )}
      </group>
    </group>
  );
}

function CameraRig({ focusRef, controlsRef }) {
  const { camera } = useThree();
  const offset = useRef(new Vector3(2, 1.5, 2));
  const targetPosition = useRef(new Vector3());
  const targetLookAt = useRef(new Vector3());
  const isTransitioning = useRef(false);

  useFrame((_, delta) => {
    const planet = focusRef.current;
    const controls = controlsRef.current;

    if (planet && controls) {
      // Calculate target positions
      targetPosition.current.copy(planet.position).add(offset.current);
      targetLookAt.current.copy(planet.position);

      // Smooth interpolation with delta time for frame-rate independence
      const lerpSpeed = Math.min(delta * 3, 0.15); // Adaptive lerp speed

      // Only update if there's significant movement needed
      const positionDistance = camera.position.distanceTo(
        targetPosition.current
      );
      const targetDistance = controls.target.distanceTo(targetLookAt.current);

      if (positionDistance > 0.01 || targetDistance > 0.01) {
        isTransitioning.current = true;

        // Smooth camera movement
        camera.position.lerp(targetPosition.current, lerpSpeed);
        controls.target.lerp(targetLookAt.current, lerpSpeed);

        // Update controls only when necessary
        controls.update();
      } else if (isTransitioning.current) {
        // Snap to final position to avoid infinite micro-movements
        camera.position.copy(targetPosition.current);
        controls.target.copy(targetLookAt.current);
        controls.update();
        isTransitioning.current = false;
      }
    }
  });
  return null;
}

export default function App() {
  const controlsRef = useRef();
  const focusRef = useRef();
  const sunRef = useRef();
  const planetRefs = useRef({});

  // Professional UI state
  const [showAuth, setShowAuth] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Control panel state
  const [panelPosition, setPanelPosition] = useState({ x: 20, y: 100 });
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const panelRef = useRef();
  const dragPositionRef = useRef({ x: 20, y: 100 });

  // Planet page states
  const [showEarthPage, setShowEarthPage] = useState(false);
  const [showMercuryPage, setShowMercuryPage] = useState(false);
  const [showVenusPage, setShowVenusPage] = useState(false);
  const [showMarsPage, setShowMarsPage] = useState(false);
  const [showJupiterPage, setShowJupiterPage] = useState(false);
  const [showSaturnPage, setShowSaturnPage] = useState(false);
  const [showUranusPage, setShowUranusPage] = useState(false);
  const [showNeptunePage, setShowNeptunePage] = useState(false);
  const [showPlutoPage, setShowPlutoPage] = useState(false);
  const [focusedPlanet, setFocusedPlanet] = useState(null);

  // Epic Sun Animation state
  const [showSunAnimation, setShowSunAnimation] = useState(false);

  // Enhanced UI States
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  // Futuristic Features States
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [showHolographicUI, setShowHolographicUI] = useState(false);
  const [showQuantumComputer, setShowQuantumComputer] = useState(false);
  const [showAIAnalytics, setShowAIAnalytics] = useState(false);
  const [showBlockchain, setShowBlockchain] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [vrMode, setVrMode] = useState(false);
  const [gestureMode, setGestureMode] = useState(false);

  // Accessibility and Navigation
  const { announce } = useScreenReader();
  const { currentPlanetIndex, showHelp, setShowHelp } = useKeyboardNavigation({
    onPlanetSelect: (planet) => {
      const planetRef = planetRefs.current[planet.name];
      if (planetRef) {
        focusOnObject(planetRef, planet.name);
        announce(`Navigating to ${planet.name}`);
      }
    },
    onSunSelect: () => {
      if (sunRef.current) {
        focusOnObject(sunRef, "Sun");
        announce("Navigating to the Sun");
      }
    },
    onEscape: () => {
      setShowAdvancedSearch(false);
      setShowHelp(false);
    },
    onSearch: () => {
      setShowAdvancedSearch(true);
      announce("Search opened");
    },
    onTogglePanel: () => {
      setIsCollapsed(!isCollapsed);
      announce(`Control panel ${isCollapsed ? "expanded" : "collapsed"}`);
    },
    planets: planets,
    isEnabled: !showAuth && !showWelcome,
  });

  // Loading simulation
  React.useEffect(() => {
    if (isLoading) {
      const loadingSteps = [
        { progress: 20, message: "Initializing solar system...", delay: 500 },
        { progress: 40, message: "Loading planetary textures...", delay: 800 },
        {
          progress: 60,
          message: "Calculating orbital mechanics...",
          delay: 600,
        },
        { progress: 80, message: "Rendering celestial bodies...", delay: 700 },
        { progress: 100, message: "Mission ready!", delay: 500 },
      ];

      let currentStep = 0;
      const runLoadingStep = () => {
        if (currentStep < loadingSteps.length) {
          const step = loadingSteps[currentStep];
          setLoadingProgress(step.progress);

          setTimeout(() => {
            currentStep++;
            if (currentStep < loadingSteps.length) {
              runLoadingStep();
            } else {
              setTimeout(() => setIsLoading(false), 300);
            }
          }, step.delay);
        }
      };

      runLoadingStep();
    }
  }, [isLoading]);

  // Handle authentication completion with smooth transition
  const handleAuthComplete = (authData) => {
    setUser(authData);
    setIsAuthenticated(true);

    // Show mission briefing notification
    showSuccess(`Authentication successful! Preparing mission briefing...`, {
      title: "✅ Access Granted",
      duration: 3000,
    });

    // Smooth transition to welcome screen
    setTimeout(() => {
      setShowAuth(false);
      setShowWelcome(true);

      // Show welcome notification after transition
      setTimeout(() => {
        showSuccess(`Welcome aboard, Commander ${authData.username}! 🚀`, {
          title: "🌟 Mission Briefing",
          duration: 5000,
        });
      }, 1000);
    }, 1500);
  };

  // Optimized function to handle focusing on any celestial body - no more stuttering
  const focusOnObject = useCallback(
    (meshRef, objectName = "") => {
      if (!meshRef.current || !controlsRef.current) return;

      // Prevent multiple rapid clicks with smooth feedback
      if (controlsRef.current.isAnimating) {
        showInfo("Navigation in progress, please wait...", {
          title: "⏳ Please Wait",
          duration: 1500,
        });
        return;
      }
      controlsRef.current.isAnimating = true;

      focusRef.current = meshRef.current;
      const objectPosition = meshRef.current.position.clone();

      // Pre-calculated distances for instant response
      const distanceMap = {
        Sun: 8,
        Mercury: 2.5,
        Venus: 3.5,
        Earth: 4.2,
        Mars: 3.0,
        Jupiter: 10.8,
        Saturn: 9.6,
        Uranus: 7.2,
        Neptune: 7.2,
        Pluto: 1.2,
      };

      const distance = distanceMap[objectName] || 5.0;

      // Special epic animation for the Sun! 🌞
      if (objectName === "Sun") {
        // Trigger the spectacular Sun animation without annoying popup
        setShowSunAnimation(true);

        // Continue with normal camera movement after a short delay
        setTimeout(() => {
          proceedWithNormalNavigation();
        }, 500);

        return; // Exit early for Sun - animation will handle the rest
      }

      // Clean navigation without popup spam

      proceedWithNormalNavigation();

      function proceedWithNormalNavigation() {
        // Smooth control disable with easing
        controlsRef.current.enabled = false;
        controlsRef.current.enableDamping = true;
        controlsRef.current.dampingFactor = 0.05; // Smoother damping

        // Kill any existing animations with smooth cleanup
        gsap.killTweensOf(controlsRef.current.object.position);
        gsap.killTweensOf(controlsRef.current.target);

        // Calculate optimal camera position with smooth approach angle
        const cameraTarget = objectPosition.clone();
        const approachAngle = Math.PI / 6; // 30 degrees for cinematic approach
        const cameraPosition = objectPosition.clone().add(
          new Vector3(
            distance * Math.cos(approachAngle),
            distance * 0.4, // Slightly higher for better view
            distance * Math.sin(approachAngle)
          )
        );

        // Buttery smooth camera animation with professional easing
        const timeline = gsap.timeline({
          ease: "power3.out", // Ultra smooth easing
          onStart: () => {
            // Smooth start feedback
            document.body.style.cursor = "wait";
          },
          onComplete: () => {
            // Re-enable controls with ultra-smooth settings
            controlsRef.current.enabled = true;
            controlsRef.current.enableDamping = true;
            controlsRef.current.dampingFactor = 0.012; // Even smoother
            controlsRef.current.rotateSpeed = 0.5; // Smoother rotation
            controlsRef.current.zoomSpeed = 0.8; // Smoother zoom
            controlsRef.current.panSpeed = 0.8; // Smoother pan
            controlsRef.current.isAnimating = false;
            controlsRef.current.update();

            // Reset cursor
            document.body.style.cursor = "";

            // Arrival complete - no annoying popup needed
          },
        });

        // Animate camera position and target with buttery smooth curves
        timeline
          .to(
            controlsRef.current.object.position,
            {
              x: cameraPosition.x,
              y: cameraPosition.y,
              z: cameraPosition.z,
              duration: 1.2, // Slightly longer for smoothness
              ease: "power3.out", // Ultra smooth easing curve
              force3D: true,
            },
            0
          )
          .to(
            controlsRef.current.target,
            {
              x: cameraTarget.x,
              y: cameraTarget.y,
              z: cameraTarget.z,
              duration: 1.2,
              ease: "power3.out", // Matching smooth easing
              force3D: true,
              onUpdate: () => {
                controlsRef.current.update();
              },
            },
            0
          );

        // Clear any previous search messages smoothly
        if (searchMessage) {
          gsap.to(
            { opacity: 1 },
            {
              opacity: 0,
              duration: 0.3,
              onComplete: () => setSearchMessage(""),
            }
          );
        }

        // Track focused planet smoothly
        setFocusedPlanet(objectName);
      }
    },
    [setSearchMessage, setFocusedPlanet, searchMessage]
  );

  const handleClick = (meshRef, planetName) => {
    // Clean click handling without annoying popups
    focusOnObject(meshRef, planetName);
  };

  // Enhanced search functionality with debouncing
  const handleSearch = (inputValue) => {
    const searchTerm = inputValue.toLowerCase().trim();

    if (!searchTerm) {
      setSearchMessage("");
      return;
    }

    // Add to search history only on successful search
    const addToHistory = (term) => {
      if (!searchHistory.includes(term)) {
        setSearchHistory((prev) => [term, ...prev.slice(0, 9)]); // Keep last 10 searches
      }
    };

    // Check for Sun (exact match only)
    if (searchTerm === "sun") {
      if (sunRef.current) {
        focusOnObject(sunRef, "Sun");
        setSearchMessage("");
        setSearchInput("");
        addToHistory(inputValue);
        announce("Navigating to the Sun");
        return;
      }
    }

    // Check for planets (exact match first, then partial)
    let planet = planets.find((p) => p.name.toLowerCase() === searchTerm);

    // If no exact match, try partial match but only if search term is at least 3 characters
    if (!planet && searchTerm.length >= 3) {
      planet = planets.find((p) => p.name.toLowerCase().startsWith(searchTerm));
    }

    if (planet) {
      const planetRef = planetRefs.current[planet.name];
      if (planetRef) {
        focusOnObject(planetRef, planet.name);
        setSearchMessage("");
        setSearchInput("");
        addToHistory(inputValue);
        announce(`Navigating to ${planet.name}`);
        return;
      }
    }

    // If no match and search term is long enough, show suggestions
    if (searchTerm.length >= 2) {
      const suggestions = planets.filter((p) =>
        p.name.toLowerCase().includes(searchTerm)
      );

      if (suggestions.length > 0) {
        setSearchMessage(
          `Did you mean: ${suggestions.map((p) => p.name).join(", ")}?`
        );
      } else {
        setSearchMessage(
          `"${inputValue}" not found. Try: ${planets
            .slice(0, 3)
            .map((p) => p.name)
            .join(", ")}, or Sun`
        );
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setSearchMessage("");
      }, 3000);
    }
  };

  // Handle advanced search navigation
  const handleAdvancedSearchNavigate = (objectName) => {
    if (objectName === "Sun") {
      if (sunRef.current) {
        focusOnObject(sunRef, "Sun");
      }
    } else {
      const planetRef = planetRefs.current[objectName];
      if (planetRef) {
        focusOnObject(planetRef, objectName);
      }
    }
  };

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    const cmd = command.toLowerCase();

    if (cmd.includes("go to") || cmd.includes("show me")) {
      const planetNames = [
        "mercury",
        "venus",
        "earth",
        "mars",
        "jupiter",
        "saturn",
        "uranus",
        "neptune",
        "pluto",
        "sun",
      ];
      const foundPlanet = planetNames.find((planet) => cmd.includes(planet));

      if (foundPlanet) {
        if (foundPlanet === "sun") {
          if (sunRef.current) {
            focusOnObject(sunRef, "Sun");
            announce(`Voice command: Navigating to the Sun`);
          }
        } else {
          const planetName =
            foundPlanet.charAt(0).toUpperCase() + foundPlanet.slice(1);
          const planetRef = planetRefs.current[planetName];
          if (planetRef) {
            focusOnObject(planetRef, planetName);
            announce(`Voice command: Navigating to ${planetName}`);
          }
        }
      }
    } else if (cmd.includes("quantum") || cmd.includes("computer")) {
      setShowQuantumComputer(true);
      announce("Quantum computer activated");
    } else if (cmd.includes("analytics") || cmd.includes("ai")) {
      setShowAIAnalytics(true);
      announce("AI Analytics dashboard opened");
    } else if (cmd.includes("blockchain") || cmd.includes("ledger")) {
      setShowBlockchain(true);
      announce("Blockchain ledger opened");
    } else if (cmd.includes("search")) {
      setShowAdvancedSearch(true);
      announce("Advanced search opened");
    } else if (cmd.includes("help")) {
      setShowHelp(true);
      announce("Help modal opened");
    }
  };

  // Handle gesture commands
  const handleGestureCommand = (direction) => {
    if (direction === "disable") {
      setGestureMode(false);
      announce("Gesture control disabled");
      return;
    }

    const currentIndex = planets.findIndex((p) => p.name === currentFocus);

    switch (direction) {
      case "left":
        if (currentIndex > 0) {
          const prevPlanet = planets[currentIndex - 1];
          const planetRef = planetRefs.current[prevPlanet.name];
          if (planetRef) {
            focusOnObject(planetRef, prevPlanet.name);
            announce(`Gesture: Navigated to ${prevPlanet.name}`);
          }
        }
        break;
      case "right":
        if (currentIndex < planets.length - 1) {
          const nextPlanet = planets[currentIndex + 1];
          const planetRef = planetRefs.current[nextPlanet.name];
          if (planetRef) {
            focusOnObject(planetRef, nextPlanet.name);
            announce(`Gesture: Navigated to ${nextPlanet.name}`);
          }
        }
        break;
      case "up":
        setShowHolographicUI(true);
        announce("Holographic UI activated");
        break;
      case "down":
        setShowHolographicUI(false);
        announce("Holographic UI deactivated");
        break;
    }
  };

  // Optimized drag functionality for buttery smooth movement
  const handleMouseDown = useCallback(
    (e) => {
      if (e.target.closest(".drag-handle")) {
        e.preventDefault();
        setIsDragging(true);

        const rect = panelRef.current.getBoundingClientRect();
        const offset = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
        setDragOffset(offset);

        // Store initial position in ref for smooth updates
        dragPositionRef.current = { ...panelPosition };

        // Add cursor style to body for better UX with smooth transition
        document.body.style.cursor = "grabbing";
        document.body.style.userSelect = "none";
        document.body.style.transition = "cursor 0.2s ease";

        // Show professional notification for first-time users
        showInfo("Drag the control panel to reposition it anywhere on screen", {
          title: "📱 Moveable Panel",
          duration: 2000,
        });
      }
    },
    [panelPosition]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (isDragging && panelRef.current) {
        e.preventDefault();

        // Calculate new position
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Get panel dimensions dynamically
        const panelWidth = isCollapsed ? 80 : 380;
        const panelHeight = isCollapsed ? 80 : 400; // Estimated height

        // Keep panel within viewport bounds with padding
        const padding = 10;
        const maxX = window.innerWidth - panelWidth - padding;
        const maxY = window.innerHeight - panelHeight - padding;

        const constrainedX = Math.max(padding, Math.min(newX, maxX));
        const constrainedY = Math.max(padding, Math.min(newY, maxY));

        // Update position immediately using ref for smooth movement
        dragPositionRef.current = { x: constrainedX, y: constrainedY };

        // Apply position directly to DOM for immediate visual feedback with smooth interpolation
        if (panelRef.current) {
          panelRef.current.style.left = `${constrainedX}px`;
          panelRef.current.style.top = `${constrainedY}px`;
          panelRef.current.style.transition = "none"; // Disable transition during drag
          panelRef.current.style.willChange = "transform"; // Optimize for movement
        }
      }
    },
    [isDragging, dragOffset, isCollapsed]
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      // Update state with final position
      setPanelPosition(dragPositionRef.current);

      // Reset cursor styles with smooth transition
      document.body.style.cursor = "";
      document.body.style.userSelect = "";

      // Re-enable smooth transitions on panel
      if (panelRef.current) {
        panelRef.current.style.transition =
          "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)";
        panelRef.current.style.willChange = "auto";
      }

      // Show completion feedback
      showSuccess("Panel repositioned successfully!", {
        title: "✅ Position Updated",
        duration: 1500,
      });
    }
  }, [isDragging]);

  // Optimized event listeners with proper cleanup
  useEffect(() => {
    if (isDragging) {
      // Use passive: false for preventDefault to work
      const mouseMoveOptions = { passive: false };
      const mouseUpOptions = { passive: true };

      document.addEventListener("mousemove", handleMouseMove, mouseMoveOptions);
      document.addEventListener("mouseup", handleMouseUp, mouseUpOptions);

      // Also handle mouse leave to prevent stuck drag state
      document.addEventListener("mouseleave", handleMouseUp, mouseUpOptions);

      return () => {
        document.removeEventListener(
          "mousemove",
          handleMouseMove,
          mouseMoveOptions
        );
        document.removeEventListener("mouseup", handleMouseUp, mouseUpOptions);
        document.removeEventListener(
          "mouseleave",
          handleMouseUp,
          mouseUpOptions
        );

        // Cleanup cursor styles on unmount
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Simple and Smooth Hyperspeed Welcome Screen
  function WelcomeScreen({ onComplete }) {
    const [phase, setPhase] = useState("loading"); // loading, hyperspeed, text, complete
    const welcomeRef = useRef();
    const titleRef = useRef();
    const subtitleRef = useRef();

    useEffect(() => {
      console.log("Welcome Screen with loading state activated");

      // Give Hyperspeed a moment to initialize, then start
      const loadingTimer = setTimeout(() => {
        console.log("Starting Hyperspeed phase");
        setPhase("hyperspeed");
      }, 500); // Short delay to let WebGL initialize

      // Phase 1: Hyperspeed (4 seconds after loading)
      const hyperspeedTimer = setTimeout(() => {
        console.log("Switching to text phase");
        setPhase("text");
      }, 4500); // 500ms loading + 4000ms hyperspeed

      // Phase 2: Text phase (3 seconds)
      const textTimer = setTimeout(() => {
        console.log("Starting exit animation");

        // Smooth exit animation
        gsap.to(welcomeRef.current, {
          opacity: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: () => {
            setPhase("complete");
            onComplete();
          },
        });
      }, 7500); // Total: 500ms loading + 4000ms hyperspeed + 3000ms text

      return () => {
        clearTimeout(loadingTimer);
        clearTimeout(hyperspeedTimer);
        clearTimeout(textTimer);
      };
    }, [onComplete]);

    // Text entrance animation when phase changes
    useEffect(() => {
      if (phase === "text" && titleRef.current && subtitleRef.current) {
        console.log("Animating text entrance");

        // Set initial states
        gsap.set([titleRef.current, subtitleRef.current], {
          opacity: 0,
          y: 30,
          scale: 0.9,
        });

        // Animate in
        const tl = gsap.timeline();
        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: "back.out(1.7)",
        }).to(
          subtitleRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power2.out",
          },
          "-=0.8"
        );
      }
    }, [phase]);

    if (phase === "complete") return null;

    return (
      <div
        ref={welcomeRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          background:
            "linear-gradient(135deg, #000000 0%, #1a0033 50%, #000000 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          overflow: "hidden",
        }}
      >
        {/* Phase 0: Loading */}
        {phase === "loading" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1004,
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                border: "3px solid rgba(255,255,255,0.3)",
                borderTop: "3px solid #ffffff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                marginBottom: "20px",
              }}
            />
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontFamily: '"Space Mono", monospace',
                fontSize: "14px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              Initializing...
            </p>
          </div>
        )}

        {/* Phase 1: Hyperspeed Only */}
        {phase === "hyperspeed" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 1001,
            }}
          >
            <Hyperspeed
              effectOptions={{
                distortion: "turbulentDistortion",
                length: 400,
                roadWidth: 10,
                islandWidth: 2,
                lanesPerRoad: 4,
                fov: 90,
                fovSpeedUp: 150,
                speedUp: 2,
                carLightsFade: 0.4,
                totalSideLightSticks: 20,
                lightPairsPerRoadWay: 40,
                shoulderLinesWidthPercentage: 0.05,
                brokenLinesWidthPercentage: 0.1,
                brokenLinesLengthPercentage: 0.5,
                lightStickWidth: [0.12, 0.5],
                lightStickHeight: [1.3, 1.7],
                movingAwaySpeed: [60, 80],
                movingCloserSpeed: [-120, -160],
                carLightsLength: [400 * 0.03, 400 * 0.2],
                carLightsRadius: [0.05, 0.14],
                carWidthPercentage: [0.3, 0.5],
                carShiftX: [-0.8, 0.8],
                carFloorSeparation: [0, 5],
                colors: {
                  roadColor: 0x080808,
                  islandColor: 0x0a0a0a,
                  background: 0x000000,
                  shoulderLines: 0xffffff,
                  brokenLines: 0xffffff,
                  leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
                  rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
                  sticks: 0x03b3c3,
                },
              }}
            />
          </div>
        )}

        {/* Phase 2: Text Only */}
        {phase === "text" && (
          <>
            {/* Cosmic background */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                background: `
                radial-gradient(2px 2px at 20px 30px, #fff, transparent),
                radial-gradient(2px 2px at 40px 70px, rgba(255,255,255,0.8), transparent),
                radial-gradient(1px 1px at 90px 40px, #fff, transparent),
                radial-gradient(1px 1px at 130px 80px, rgba(255,255,255,0.6), transparent),
                radial-gradient(2px 2px at 160px 30px, #fff, transparent),
                radial-gradient(1px 1px at 200px 90px, rgba(255,255,255,0.8), transparent),
                radial-gradient(2px 2px at 240px 50px, #fff, transparent),
                radial-gradient(1px 1px at 280px 10px, rgba(255,255,255,0.9), transparent),
                radial-gradient(1px 1px at 320px 70px, #fff, transparent),
                radial-gradient(2px 2px at 360px 40px, rgba(255,255,255,0.7), transparent)
              `,
                backgroundSize: "400px 200px",
                animation: "twinkle 4s ease-in-out infinite alternate",
                zIndex: 1002,
              }}
            />

            {/* Main title */}
            <h1
              ref={titleRef}
              style={{
                fontSize: "clamp(3rem, 8vw, 6rem)",
                fontWeight: "bold",
                background:
                  "linear-gradient(45deg, #ffffff, #a8e6cf, #88d8c0, #ffffff)",
                backgroundSize: "400% 400%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textAlign: "center",
                margin: "0 0 1rem 0",
                fontFamily: '"Orbitron", "Arial", sans-serif',
                textShadow: "0 0 30px rgba(255,255,255,0.5)",
                animation: "galaxyGlow 3s ease-in-out infinite alternate",
                letterSpacing: "0.1em",
                zIndex: 1003,
                position: "relative",
              }}
            >
              SOLAR SYSTEM
            </h1>

            {/* Subtitle */}
            <p
              ref={subtitleRef}
              style={{
                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                color: "rgba(255,255,255,0.8)",
                textAlign: "center",
                margin: 0,
                fontFamily: '"Space Mono", monospace',
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                zIndex: 1003,
                position: "relative",
              }}
            >
              Journey Through the Cosmos
            </p>
          </>
        )}

        {/* Enhanced CSS animations */}
        <style jsx>{`
          @import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap");

          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }

          @keyframes galaxyGlow {
            0% {
              background-position: 0% 50%;
              filter: brightness(1)
                drop-shadow(0 0 20px rgba(168, 230, 207, 0.3));
            }
            100% {
              background-position: 100% 50%;
              filter: brightness(1.2)
                drop-shadow(0 0 40px rgba(168, 230, 207, 0.6));
            }
          }

          @keyframes twinkle {
            0% {
              opacity: 0.3;
              transform: scale(1);
            }
            100% {
              opacity: 1;
              transform: scale(1.1);
            }
          }
        `}</style>
      </div>
    );
  }

  // Earth page transition functions
  const handleMoreAboutEarth = () => {
    // Smooth fade transition to Earth page
    gsap.to(".solar-system-container", {
      opacity: 0,
      duration: 0.8,
      ease: "power2.inOut",
      onComplete: () => {
        setShowEarthPage(true);
        // Fade in Earth page
        gsap.fromTo(
          ".earth-container",
          { opacity: 0 },
          { opacity: 1, duration: 0.8, ease: "power2.inOut" }
        );
      },
    });
  };

  const handleReturnFromEarth = () => {
    setShowEarthPage(false);

    // Reset camera to solar system overview position
    if (controlsRef.current) {
      // Reset the camera position and target to show full solar system
      gsap.set(controlsRef.current.object.position, { x: 0, y: 25, z: 50 });
      gsap.set(controlsRef.current.target, { x: 0, y: 8, z: 0 });
      controlsRef.current.update();
    }

    // Clear focused planet state
    setFocusedPlanet(null);
    focusRef.current = null;

    // Fade in solar system
    gsap.fromTo(
      ".solar-system-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.inOut" }
    );
  };

  // Generic planet page handlers
  const createPlanetHandlers = (planetName, setShowPage) => ({
    handleMoreAbout: () => {
      gsap.to(".solar-system-container", {
        opacity: 0,
        duration: 0.8,
        ease: "power2.inOut",
        onComplete: () => {
          setShowPage(true);
          gsap.fromTo(
            `.${planetName.toLowerCase()}-container`,
            { opacity: 0 },
            { opacity: 1, duration: 0.8, ease: "power2.inOut" }
          );
        },
      });
    },
    handleReturn: () => {
      setShowPage(false);

      // Reset camera to solar system overview position (same as Earth)
      if (controlsRef.current) {
        // Reset the camera position and target to show full solar system
        gsap.set(controlsRef.current.object.position, { x: 0, y: 25, z: 50 });
        gsap.set(controlsRef.current.target, { x: 0, y: 8, z: 0 });
        controlsRef.current.update();
      }

      // Clear focused planet state (this was missing!)
      setFocusedPlanet(null);
      focusRef.current = null;

      // Fade in solar system
      gsap.fromTo(
        ".solar-system-container",
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: "power2.inOut" }
      );
    },
  });

  // Create handlers for all planets
  const mercuryHandlers = createPlanetHandlers("Mercury", setShowMercuryPage);
  const venusHandlers = createPlanetHandlers("Venus", setShowVenusPage);
  const marsHandlers = createPlanetHandlers("Mars", setShowMarsPage);
  const jupiterHandlers = createPlanetHandlers("Jupiter", setShowJupiterPage);
  const saturnHandlers = createPlanetHandlers("Saturn", setShowSaturnPage);
  const uranusHandlers = createPlanetHandlers("Uranus", setShowUranusPage);
  const neptuneHandlers = createPlanetHandlers("Neptune", setShowNeptunePage);
  const plutoHandlers = createPlanetHandlers("Pluto", setShowPlutoPage);

  // Render planet pages if active
  if (showEarthPage) {
    return <Earth onReturnToSolarSystem={handleReturnFromEarth} />;
  }
  if (showMercuryPage) {
    return <Mercury onReturnToSolarSystem={mercuryHandlers.handleReturn} />;
  }
  if (showVenusPage) {
    return <Venus onReturnToSolarSystem={venusHandlers.handleReturn} />;
  }
  if (showMarsPage) {
    return <Mars onReturnToSolarSystem={marsHandlers.handleReturn} />;
  }
  if (showJupiterPage) {
    return <Jupiter onReturnToSolarSystem={jupiterHandlers.handleReturn} />;
  }
  if (showSaturnPage) {
    return <Saturn onReturnToSolarSystem={saturnHandlers.handleReturn} />;
  }
  if (showUranusPage) {
    return <Uranus onReturnToSolarSystem={uranusHandlers.handleReturn} />;
  }
  if (showNeptunePage) {
    return <Neptune onReturnToSolarSystem={neptuneHandlers.handleReturn} />;
  }
  if (showPlutoPage) {
    return <Pluto onReturnToSolarSystem={plutoHandlers.handleReturn} />;
  }

  return (
    <ErrorBoundary>
      {/* Skip Links for Accessibility */}
      <SkipLinks />

      {/* Loading Screen */}
      <LoadingScreen
        isLoading={isLoading}
        progress={loadingProgress}
        message="Loading Solar System"
        subMessage="Preparing your cosmic journey..."
      />

      {/* Keyboard Help Modal */}
      <KeyboardHelpModal
        isVisible={showHelp}
        onClose={() => setShowHelp(false)}
      />

      {/* Advanced Search Modal */}
      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={(query) => {
          if (!searchHistory.includes(query)) {
            setSearchHistory((prev) => [query, ...prev.slice(0, 9)]);
          }
        }}
        onNavigate={handleAdvancedSearchNavigate}
        planets={planets}
        searchHistory={searchHistory}
        onClearHistory={() => setSearchHistory([])}
      />

      {/* Stunning Authentication Screen */}
      {showAuth && !isLoading && (
        <AuthScreen onAuthComplete={handleAuthComplete} />
      )}

      {/* Stunning Galaxy Welcome Screen */}
      {showWelcome && !isLoading && (
        <WelcomeScreen onComplete={() => setShowWelcome(false)} />
      )}

      {/* Professional Notification System */}
      <NotificationSystem />

      {/* Professional Cosmic Cursor Effect */}
      {!showAuth && !isLoading && <CosmicCursor />}

      {/* Futuristic Background Effects */}
      {!showAuth && !isLoading && !showWelcome && (
        <>
          <NeuralNetworkBG />
          <QuantumParticles />
          <DataStream />
        </>
      )}

      {/* AI Voice Assistant */}
      {!showAuth && !isLoading && !showWelcome && (
        <AIVoiceAssistant
          onCommand={handleVoiceCommand}
          isListening={isVoiceListening}
          setIsListening={setIsVoiceListening}
        />
      )}

      {/* AR/VR Simulators */}
      {!showAuth && !isLoading && !showWelcome && (
        <>
          <ARModeSimulator isActive={arMode} onToggle={setArMode} />
          <VRModeSimulator isActive={vrMode} onToggle={setVrMode} />
          <GestureControl
            onGesture={handleGestureCommand}
            isActive={gestureMode}
          />
        </>
      )}

      {/* Quantum & AI Components */}
      <QuantumComputer
        isActive={showQuantumComputer}
        onToggle={() => setShowQuantumComputer(false)}
      />
      <AIAnalytics
        isActive={showAIAnalytics}
        onToggle={() => setShowAIAnalytics(false)}
        planetData={planets}
      />
      <BlockchainLedger
        isActive={showBlockchain}
        onToggle={() => setShowBlockchain(false)}
      />

      {/* Holographic Control Center */}
      <HolographicOverlay isActive={showHolographicUI}>
        <div
          style={{
            color: "white",
            fontFamily: '"Orbitron", sans-serif',
            width: "500px",
            maxWidth: "90vw",
          }}
        >
          {/* Header with Close Button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
              paddingBottom: "1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.8rem",
                margin: 0,
                background: "linear-gradient(45deg, #00ffff, #ff00ff)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              🚀 Control Center
            </h2>
            <button
              onClick={() => setShowHolographicUI(false)}
              style={{
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                color: "white",
                cursor: "pointer",
                fontSize: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ✕
            </button>
          </div>

          {/* Feature Grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
              marginBottom: "1.5rem",
            }}
          >
            <button
              onClick={() => {
                setShowQuantumComputer(true);
                setShowHolographicUI(false);
              }}
              style={{
                padding: "15px",
                background:
                  "linear-gradient(135deg, rgba(0, 255, 255, 0.2), rgba(255, 0, 255, 0.2))",
                border: "1px solid rgba(0, 255, 255, 0.5)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 20px rgba(0, 255, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⚛️</div>
              <div style={{ fontWeight: "bold" }}>Quantum Computer</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                8-qubit simulator
              </div>
            </button>

            <button
              onClick={() => {
                setShowAIAnalytics(true);
                setShowHolographicUI(false);
              }}
              style={{
                padding: "15px",
                background:
                  "linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(0, 255, 0, 0.2))",
                border: "1px solid rgba(255, 0, 255, 0.5)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 20px rgba(255, 0, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🤖</div>
              <div style={{ fontWeight: "bold" }}>AI Analytics</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Real-time insights
              </div>
            </button>

            <button
              onClick={() => {
                setShowBlockchain(true);
                setShowHolographicUI(false);
              }}
              style={{
                padding: "15px",
                background:
                  "linear-gradient(135deg, rgba(0, 255, 0, 0.2), rgba(255, 255, 0, 0.2))",
                border: "1px solid rgba(0, 255, 0, 0.5)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 20px rgba(0, 255, 0, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>⛓️</div>
              <div style={{ fontWeight: "bold" }}>Blockchain</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Space ledger
              </div>
            </button>

            <button
              onClick={() => {
                setArMode(true);
                setShowHolographicUI(false);
              }}
              style={{
                padding: "15px",
                background:
                  "linear-gradient(135deg, rgba(0, 210, 255, 0.2), rgba(58, 123, 213, 0.2))",
                border: "1px solid rgba(0, 210, 255, 0.5)",
                borderRadius: "12px",
                color: "white",
                cursor: "pointer",
                transition: "all 0.3s ease",
                textAlign: "center",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 20px rgba(0, 210, 255, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🥽</div>
              <div style={{ fontWeight: "bold" }}>AR Mode</div>
              <div style={{ fontSize: "0.8rem", opacity: 0.8 }}>
                Augmented reality
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div
            style={{
              display: "flex",
              gap: "0.8rem",
              justifyContent: "center",
              marginTop: "1rem",
            }}
          >
            <button
              onClick={() => {
                setVrMode(true);
                setShowHolographicUI(false);
              }}
              style={{
                padding: "12px 18px",
                background:
                  "linear-gradient(135deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.2))",
                border: "1px solid rgba(102, 126, 234, 0.5)",
                borderRadius: "10px",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                fontWeight: "600",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 0 15px rgba(102, 126, 234, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            >
              🥽 Launch VR
            </button>
            <button
              onClick={() => setGestureMode(!gestureMode)}
              style={{
                padding: "12px 18px",
                background: gestureMode
                  ? "linear-gradient(135deg, rgba(16, 172, 132, 0.3), rgba(0, 210, 211, 0.3))"
                  : "rgba(255, 255, 255, 0.1)",
                border: gestureMode
                  ? "2px solid rgba(16, 172, 132, 0.6)"
                  : "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "10px",
                color: "white",
                cursor: "pointer",
                fontSize: "0.9rem",
                transition: "all 0.3s ease",
                fontWeight: "600",
                boxShadow: gestureMode
                  ? "0 0 15px rgba(16, 172, 132, 0.4)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.05)";
                if (!gestureMode) {
                  e.target.style.background = "rgba(255, 255, 255, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                if (!gestureMode) {
                  e.target.style.background = "rgba(255, 255, 255, 0.1)";
                }
              }}
            >
              👋 {gestureMode ? "Gestures ON" : "Enable Gestures"}
            </button>
          </div>
        </div>
      </HolographicOverlay>

      {/* Epic Sun Animation */}
      <SunApproachAnimation
        isActive={showSunAnimation}
        onComplete={() => {
          setShowSunAnimation(false);
          // Animation complete - no annoying popup needed
        }}
      />

      <div
        className="solar-system-container"
        style={{ position: "relative", width: "100vw", height: "100vh" }}
      >
        {/* Professional Control Panel - Only show after welcome screen */}
        {/* Floating Planet Control Panel - Only show after welcome screen */}
        {!showWelcome && (
          <div
            ref={panelRef}
            onMouseDown={handleMouseDown}
            style={{
              position: "fixed",
              left: isDragging ? undefined : `${panelPosition.x}px`,
              top: isDragging ? undefined : `${panelPosition.y}px`,
              zIndex: 1000,
              width: isCollapsed ? "80px" : "380px",
              height: isCollapsed ? "80px" : "auto",
              borderRadius: "50px",
              overflow: "hidden",
              cursor: isDragging ? "grabbing" : "grab",
              transition: isDragging
                ? "none"
                : isCollapsed
                ? "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)" // Smoother collapse
                : "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)", // Smoother expansion
              transform: isDragging ? "scale(1.02)" : "scale(1)",
              filter: isDragging
                ? "brightness(1.1) saturate(1.1)"
                : "brightness(1)",
              willChange: isDragging ? "transform, filter" : "auto",
              boxShadow: isDragging
                ? "0 12px 40px rgba(0, 0, 0, 0.6), 0 0 60px rgba(59, 130, 246, 0.3)"
                : "0 8px 32px rgba(0, 0, 0, 0.4)",
              // Smooth fade-in animation after welcome screen
              animation: "fadeInFromSpace 1.2s ease-out forwards",
            }}
          >
            {/* Planet Core Background */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: `
              radial-gradient(circle at 30% 30%,
                rgba(59, 130, 246, 0.8) 0%,
                rgba(147, 51, 234, 0.6) 30%,
                rgba(15, 23, 42, 0.95) 70%,
                rgba(0, 0, 0, 0.9) 100%
              ),
              conic-gradient(from 0deg at 50% 50%,
                rgba(59, 130, 246, 0.3) 0deg,
                rgba(147, 51, 234, 0.3) 120deg,
                rgba(16, 185, 129, 0.3) 240deg,
                rgba(59, 130, 246, 0.3) 360deg
              )
            `,
                animation: "planetRotation 20s linear infinite",
              }}
            />

            {/* Planet Atmosphere Glow */}
            <div
              style={{
                position: "absolute",
                inset: "-10px",
                background: `
              radial-gradient(circle,
                rgba(59, 130, 246, 0.4) 0%,
                rgba(147, 51, 234, 0.2) 40%,
                transparent 70%
              )
            `,
                borderRadius: "50px",
                filter: "blur(15px)",
                animation: "atmosphereGlow 4s ease-in-out infinite alternate",
              }}
            />

            {/* Planet Surface Details */}
            <div
              style={{
                position: "absolute",
                inset: "5px",
                borderRadius: "45px",
                background: `
              radial-gradient(circle at 60% 40%, rgba(255, 255, 255, 0.1) 0%, transparent 30%),
              radial-gradient(circle at 20% 70%, rgba(16, 185, 129, 0.2) 0%, transparent 25%),
              radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.15) 0%, transparent 20%)
            `,
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            />

            {/* Drag Handle & Collapse Button */}
            <div
              className="drag-handle"
              style={{
                position: "absolute",
                top: isCollapsed ? "50%" : "15px",
                left: isCollapsed ? "50%" : "50%",
                transform: isCollapsed
                  ? "translate(-50%, -50%)"
                  : "translateX(-50%)",
                zIndex: 10,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "grab",
              }}
            >
              {/* Planet Core Icon */}
              <div
                style={{
                  width: isCollapsed ? "50px" : "30px",
                  height: isCollapsed ? "50px" : "30px",
                  borderRadius: "50%",
                  background: `
                radial-gradient(circle at 30% 30%,
                  rgba(255, 255, 255, 0.9) 0%,
                  rgba(59, 130, 246, 0.8) 40%,
                  rgba(147, 51, 234, 0.6) 100%
                )
              `,
                  boxShadow: `
                0 0 20px rgba(59, 130, 246, 0.6),
                inset 0 2px 4px rgba(255, 255, 255, 0.3)
              `,
                  animation: "planetPulse 3s ease-in-out infinite",
                  transition: "all 0.3s ease",
                }}
              />

              {!isCollapsed && (
                <span
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontSize: "12px",
                    fontFamily: '"Orbitron", "Arial", sans-serif',
                    fontWeight: "600",
                    letterSpacing: "1px",
                    textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
                  }}
                >
                  NAVIGATION
                </span>
              )}
            </div>

            {/* Collapse/Expand Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                position: "absolute",
                top: isCollapsed ? "10px" : "15px",
                right: isCollapsed ? "10px" : "15px",
                width: "25px",
                height: "25px",
                borderRadius: "50%",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                background: `
              radial-gradient(circle,
                rgba(59, 130, 246, 0.8) 0%,
                rgba(147, 51, 234, 0.6) 100%
              )
            `,
                color: "white",
                fontSize: "12px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
                transition: "all 0.3s ease",
                zIndex: 10,
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.15)";
                e.target.style.boxShadow = "0 6px 20px rgba(59, 130, 246, 0.6)";
                e.target.style.filter = "brightness(1.2)";
                e.target.style.transition =
                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
                e.target.style.filter = "brightness(1)";
                e.target.style.transition =
                  "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)";
              }}
            >
              {isCollapsed ? "+" : "−"}
            </button>

            {/* Panel Content - Only visible when expanded */}
            {!isCollapsed && (
              <div
                style={{
                  position: "relative",
                  padding: "60px 20px 20px 20px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                  zIndex: 5,
                }}
              >
                {/* User Profile Section */}
                {user && (
                  <div
                    style={{
                      padding: "1rem",
                      background: `
                    linear-gradient(135deg,
                      rgba(16, 185, 129, 0.1) 0%,
                      rgba(6, 182, 212, 0.1) 100%
                    )
                  `,
                      border: "1px solid rgba(16, 185, 129, 0.3)",
                      borderRadius: "15px",
                      marginBottom: "1rem",
                      textAlign: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "1.5rem",
                        marginBottom: "0.5rem",
                        filter: "drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))",
                      }}
                    >
                      👨‍🚀
                    </div>
                    <div
                      style={{
                        color: "white",
                        fontSize: "0.9rem",
                        fontWeight: "600",
                        fontFamily: '"Orbitron", "Arial", sans-serif',
                        marginBottom: "0.25rem",
                      }}
                    >
                      {user.username}
                    </div>
                    <div
                      style={{
                        color: "rgba(255, 255, 255, 0.7)",
                        fontSize: "0.75rem",
                        fontFamily: '"Space Mono", monospace',
                        marginBottom: "0.75rem",
                      }}
                    >
                      Space Explorer
                    </div>
                    <button
                      onClick={() => {
                        showInfo("Ending mission and returning to base...", {
                          title: "🚀 Mission Complete",
                          duration: 2000,
                        });
                        setTimeout(() => {
                          setUser(null);
                          setIsAuthenticated(false);
                          setShowAuth(true);
                          setShowWelcome(false);
                          setFocusedPlanet(null);
                          setSearchMessage("");
                        }, 1500);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        background: "rgba(239, 68, 68, 0.2)",
                        border: "1px solid rgba(239, 68, 68, 0.4)",
                        borderRadius: "8px",
                        color: "rgba(239, 68, 68, 0.9)",
                        fontSize: "0.75rem",
                        fontFamily: '"Space Mono", monospace',
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        width: "100%",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "rgba(239, 68, 68, 0.3)";
                        e.target.style.color = "#ef4444";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "rgba(239, 68, 68, 0.2)";
                        e.target.style.color = "rgba(239, 68, 68, 0.9)";
                      }}
                    >
                      🚪 End Mission
                    </button>
                  </div>
                )}

                {/* Professional Reset View Button */}
                <button
                  onClick={() => {
                    // Clean reset view without annoying popup
                    if (controlsRef.current) {
                      // Clear any focused planet first
                      setFocusedPlanet(null);
                      setSearchMessage("");
                      focusRef.current = null;

                      // Kill any existing animations
                      gsap.killTweensOf(controlsRef.current.object.position);
                      gsap.killTweensOf(controlsRef.current.target);

                      // Reset to proper default solar system view
                      gsap.to(controlsRef.current.object.position, {
                        x: 0,
                        y: 25,
                        z: 50,
                        duration: 1.8,
                        ease: "power3.out",
                        onUpdate: () => {
                          controlsRef.current.update();
                        },
                      });

                      gsap.to(controlsRef.current.target, {
                        x: 0,
                        y: 8, // Match the default OrbitControls target
                        z: 0,
                        duration: 1.8,
                        ease: "power3.out",
                        onUpdate: () => {
                          controlsRef.current.update();
                        },
                        onComplete: () => {
                          // Ensure controls are properly reset
                          controlsRef.current.enabled = true;
                          controlsRef.current.enableDamping = true;
                          controlsRef.current.dampingFactor = 0.008;
                          controlsRef.current.isAnimating = false;
                        },
                      });
                    }
                  }}
                  className="professional-button smooth-hover smooth-transform"
                  style={{
                    padding: "12px 18px",
                    background: `
                  linear-gradient(135deg,
                    rgba(59, 130, 246, 0.9) 0%,
                    rgba(147, 51, 234, 0.8) 100%
                  )
                `,
                    border: "1px solid rgba(59, 130, 246, 0.4)",
                    borderRadius: "15px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "13px",
                    color: "#ffffff",
                    fontFamily: '"Orbitron", "Arial", sans-serif',
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    boxShadow: `
                  0 6px 20px rgba(59, 130, 246, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  0 0 25px rgba(59, 130, 246, 0.2)
                `,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    backdropFilter: "blur(10px)",
                    width: "100%",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = `
                  linear-gradient(135deg,
                    rgba(59, 130, 246, 1) 0%,
                    rgba(147, 51, 234, 1) 100%
                  )
                `;
                    e.target.style.boxShadow = `
                  0 8px 30px rgba(59, 130, 246, 0.6),
                  inset 0 1px 0 rgba(255, 255, 255, 0.4),
                  0 0 40px rgba(59, 130, 246, 0.5)
                `;
                    e.target.style.transform = "translateY(-3px) scale(1.02)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = `
                  linear-gradient(135deg,
                    rgba(59, 130, 246, 0.9) 0%,
                    rgba(147, 51, 234, 0.8) 100%
                  )
                `;
                    e.target.style.boxShadow = `
                  0 6px 20px rgba(59, 130, 246, 0.4),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3),
                  0 0 25px rgba(59, 130, 246, 0.2)
                `;
                    e.target.style.transform = "translateY(0) scale(1)";
                  }}
                >
                  ⭐ Reset View
                </button>

                {/* Search Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch(searchInput);
                  }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div style={{ position: "relative" }}>
                    <input
                      id="search"
                      type="text"
                      value={searchInput}
                      onChange={(e) => {
                        setSearchInput(e.target.value);
                        // Clear any existing search message when typing
                        if (searchMessage) {
                          setSearchMessage("");
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSearch(searchInput);
                        } else if (e.key === "/" && e.ctrlKey) {
                          e.preventDefault();
                          setShowAdvancedSearch(true);
                        }
                      }}
                      placeholder="🌌 Search celestial bodies... (Press Enter to search)"
                      className="professional-search"
                      aria-label="Search for planets, sun, or celestial bodies"
                      aria-describedby="search-help"
                      role="searchbox"
                      autoComplete="off"
                      style={{
                        padding: "12px 16px 12px 40px",
                        background: `
                      linear-gradient(135deg,
                        rgba(15, 23, 42, 0.9) 0%,
                        rgba(30, 41, 59, 0.7) 100%
                      )
                    `,
                        border: "1px solid rgba(148, 163, 184, 0.4)",
                        borderRadius: "15px",
                        fontSize: "13px",
                        width: "100%",
                        color: "#e2e8f0",
                        fontFamily: '"Space Mono", monospace',
                        letterSpacing: "0.5px",
                        boxShadow: `
                      inset 0 2px 8px rgba(0, 0, 0, 0.4),
                      0 0 20px rgba(59, 130, 246, 0.2)
                    `,
                        outline: "none",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        backdropFilter: "blur(10px)",
                      }}
                      onFocus={(e) => {
                        e.target.style.background = `
                      linear-gradient(135deg,
                        rgba(15, 23, 42, 0.95) 0%,
                        rgba(30, 41, 59, 0.85) 100%
                      )
                    `;
                        e.target.style.borderColor = "rgba(59, 130, 246, 0.7)";
                        e.target.style.boxShadow = `
                      inset 0 2px 8px rgba(0, 0, 0, 0.4),
                      0 0 30px rgba(59, 130, 246, 0.4),
                      0 0 60px rgba(147, 51, 234, 0.2)
                    `;
                        // Focus styling only - no annoying popup
                      }}
                      onBlur={(e) => {
                        e.target.style.background = `
                      linear-gradient(135deg,
                        rgba(15, 23, 42, 0.9) 0%,
                        rgba(30, 41, 59, 0.7) 100%
                      )
                    `;
                        e.target.style.borderColor = "rgba(148, 163, 184, 0.4)";
                        e.target.style.boxShadow = `
                      inset 0 2px 8px rgba(0, 0, 0, 0.4),
                      0 0 20px rgba(59, 130, 246, 0.2)
                    `;
                      }}
                    />
                    {/* Search Icon */}
                    <div
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "16px",
                        color: "rgba(148, 163, 184, 0.8)",
                        pointerEvents: "none",
                      }}
                    >
                      🔍
                    </div>

                    {/* Search Help Text */}
                    <div
                      id="search-help"
                      style={{
                        fontSize: "0.8rem",
                        color: "rgba(148, 163, 184, 0.7)",
                        marginTop: "4px",
                        fontFamily: '"Space Mono", monospace',
                      }}
                    >
                      Press{" "}
                      <kbd
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontSize: "0.7rem",
                        }}
                      >
                        Ctrl+K
                      </kbd>{" "}
                      for advanced search,{" "}
                      <kbd
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          padding: "2px 4px",
                          borderRadius: "3px",
                          fontSize: "0.7rem",
                        }}
                      >
                        F1
                      </kbd>{" "}
                      for help
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSearch(searchInput)}
                    className="professional-button smooth-hover"
                    style={{
                      padding: "12px 18px",
                      background: `
                    linear-gradient(135deg,
                      rgba(16, 185, 129, 0.9) 0%,
                      rgba(6, 182, 212, 0.8) 100%
                    )
                  `,
                      border: "1px solid rgba(16, 185, 129, 0.4)",
                      borderRadius: "15px",
                      cursor: "pointer",
                      fontWeight: "700",
                      fontSize: "12px",
                      color: "#ffffff",
                      fontFamily: '"Orbitron", "Arial", sans-serif',
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      boxShadow: `
                    0 6px 20px rgba(16, 185, 129, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    0 0 25px rgba(16, 185, 129, 0.2)
                  `,
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = `
                    linear-gradient(135deg,
                      rgba(16, 185, 129, 1) 0%,
                      rgba(6, 182, 212, 1) 100%
                    )
                  `;
                      e.target.style.boxShadow = `
                    0 8px 30px rgba(16, 185, 129, 0.6),
                    inset 0 1px 0 rgba(255, 255, 255, 0.4),
                    0 0 40px rgba(16, 185, 129, 0.5)
                  `;
                      e.target.style.transform = "translateY(-3px) scale(1.02)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = `
                    linear-gradient(135deg,
                      rgba(16, 185, 129, 0.9) 0%,
                      rgba(6, 182, 212, 0.8) 100%
                    )
                  `;
                      e.target.style.boxShadow = `
                    0 6px 20px rgba(16, 185, 129, 0.4),
                    inset 0 1px 0 rgba(255, 255, 255, 0.3),
                    0 0 25px rgba(16, 185, 129, 0.2)
                  `;
                      e.target.style.transform = "translateY(0) scale(1)";
                    }}
                  >
                    🚀 Navigate
                  </button>
                </form>

                {/* Search Message */}
                {searchMessage && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: searchMessage.includes("not found")
                        ? `
                      linear-gradient(135deg,
                        rgba(239, 68, 68, 0.9) 0%,
                        rgba(220, 38, 127, 0.8) 100%
                      )
                    `
                        : `
                      linear-gradient(135deg,
                        rgba(16, 185, 129, 0.9) 0%,
                        rgba(6, 182, 212, 0.8) 100%
                      )
                    `,
                      color: "#ffffff",
                      borderRadius: "15px",
                      fontSize: "11px",
                      wordWrap: "break-word",
                      fontFamily: '"Space Mono", monospace',
                      letterSpacing: "0.3px",
                      border: searchMessage.includes("not found")
                        ? "1px solid rgba(239, 68, 68, 0.4)"
                        : "1px solid rgba(16, 185, 129, 0.4)",
                      boxShadow: searchMessage.includes("not found")
                        ? `
                      0 6px 20px rgba(239, 68, 68, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      0 0 25px rgba(239, 68, 68, 0.3)
                    `
                        : `
                      0 6px 20px rgba(16, 185, 129, 0.4),
                      inset 0 1px 0 rgba(255, 255, 255, 0.3),
                      0 0 25px rgba(16, 185, 129, 0.3)
                    `,
                      animation:
                        "cosmicPulse 2s ease-in-out infinite alternate",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    {searchMessage.includes("not found") ? "❌ " : "✨ "}
                    {searchMessage}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Clean Control Panel */}
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            zIndex: 1002,
          }}
        >
          {/* Main Menu Button */}
          <button
            onClick={() => setShowHolographicUI(true)}
            aria-label="Open control center"
            style={{
              padding: "12px 16px",
              background:
                "linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9))",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "12px",
              color: "white",
              fontSize: "0.9rem",
              cursor: "pointer",
              transition: "all 0.3s ease",
              fontFamily: '"Space Mono", monospace',
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontWeight: "600",
              backdropFilter: "blur(10px)",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px) scale(1.05)";
              e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.3)";
            }}
          >
            🚀 Control Center
          </button>

          {/* Quick Access Row */}
          <div
            style={{
              display: "flex",
              gap: "6px",
            }}
          >
            <button
              onClick={() => setShowHelp(true)}
              aria-label="Show help"
              style={{
                padding: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ❓
            </button>

            <button
              onClick={() => setShowAdvancedSearch(true)}
              aria-label="Search"
              style={{
                padding: "8px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                color: "white",
                fontSize: "0.8rem",
                cursor: "pointer",
                transition: "all 0.3s ease",
                backdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.1)";
                e.target.style.transform = "scale(1)";
              }}
            >
              🔍
            </button>

            <HighContrastToggle />
          </div>
        </div>

        <Canvas
          id="main-content"
          camera={{ position: [0, 25, 50], fov: 60 }}
          shadows
          gl={{
            antialias: true,
            shadowMap: { enabled: true, type: THREE.PCFSoftShadowMap },
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 0.8,
            powerPreference: "high-performance", // Smooth performance
            alpha: false, // Better performance
            stencil: false, // Better performance
            depth: true,
          }}
          dpr={[1, 2]} // Responsive pixel ratio for smooth performance
        >
          {/* Realistic Solar System Lighting */}
          <ambientLight intensity={0.2} color="#ffffff" />

          {/* Main Sun Light - Natural solar illumination */}
          <pointLight
            position={[0, 8, 0]}
            intensity={8}
            color="#ffdd88"
            distance={150}
            decay={1.8}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
            shadow-camera-near={0.1}
            shadow-camera-far={150}
          />

          {/* Fill lights for texture visibility */}
          <directionalLight
            position={[20, 23, 10]}
            intensity={1.5}
            color="#ffffff"
          />
          <directionalLight
            position={[-20, 18, -10]}
            intensity={1.0}
            color="#ffeecc"
          />
          {/* Stunning Milky Way Background */}
          <MilkyWayBackground />
          <Sun
            ref={sunRef}
            onClick={(meshRef) => handleClick(meshRef, "Sun")}
          />
          {planets.map((p) => (
            <Planet
              key={p.name}
              data={p}
              onClick={handleClick}
              onRefReady={(name, ref) => {
                planetRefs.current[name] = ref;
              }}
            />
          ))}
          <OrbitControls
            ref={controlsRef}
            enableZoom
            enableDamping
            dampingFactor={0.008} // Ultra-smooth damping for buttery feel
            enablePan
            panSpeed={0.25} // Ultra-smooth panning
            rotateSpeed={0.2} // Ultra-smooth rotation
            zoomSpeed={0.35} // Ultra-smooth zoom
            minDistance={1}
            maxDistance={100}
            screenSpacePanning={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            enableRotate={true}
            autoRotate={false}
            autoRotateSpeed={0}
            target={[0, 8, 0]} // Default target at solar system center
          />
          <CameraRig focusRef={focusRef} controlsRef={controlsRef} />
          {/* Post-processing Effects */}
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              height={300}
              opacity={1}
              blendFunction={BlendFunction.ADD}
            />
            <ToneMapping
              mode={ToneMappingMode.ACES_FILMIC}
              resolution={256}
              whitePoint={4.0}
              middleGrey={0.6}
              minLuminance={0.01}
              averageLuminance={1.0}
              adaptationRate={1.0}
            />
            <ChromaticAberration
              offset={[0.0005, 0.0012]}
              radialModulation={false}
              modulationOffset={0.15}
            />
            <Vignette
              offset={0.15}
              darkness={0.5}
              eskil={false}
              blendFunction={BlendFunction.NORMAL}
            />
          </EffectComposer>
        </Canvas>

        {/* More about Earth Button - Only visible when Earth is focused */}
        {focusedPlanet === "Earth" && (
          <button
            onClick={handleMoreAboutEarth}
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              padding: "15px 25px",
              background: `
              linear-gradient(135deg,
                rgba(34, 197, 94, 0.9) 0%,
                rgba(59, 130, 246, 0.8) 100%
              )
            `,
              border: "1px solid rgba(34, 197, 94, 0.4)",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              color: "#ffffff",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: `
              0 8px 25px rgba(34, 197, 94, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 30px rgba(34, 197, 94, 0.3)
            `,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
            onMouseEnter={(e) => {
              e.target.style.background = `
              linear-gradient(135deg,
                rgba(34, 197, 94, 1) 0%,
                rgba(59, 130, 246, 1) 100%
              )
            `;
              e.target.style.boxShadow = `
              0 12px 35px rgba(34, 197, 94, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.4),
              0 0 50px rgba(34, 197, 94, 0.6)
            `;
              e.target.style.transform = "translateY(-3px) scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = `
              linear-gradient(135deg,
                rgba(34, 197, 94, 0.9) 0%,
                rgba(59, 130, 246, 0.8) 100%
              )
            `;
              e.target.style.boxShadow = `
              0 8px 25px rgba(34, 197, 94, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.3),
              0 0 30px rgba(34, 197, 94, 0.3)
            `;
              e.target.style.transform = "translateY(0) scale(1)";
            }}
          >
            🌍 More about Earth
          </button>
        )}

        {/* More about Mercury Button */}
        {focusedPlanet === "Mercury" && (
          <button
            onClick={mercuryHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ☿️ More about Mercury
          </button>
        )}

        {/* More about Venus Button */}
        {focusedPlanet === "Venus" && (
          <button
            onClick={venusHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♀️ More about Venus
          </button>
        )}

        {/* More about Mars Button */}
        {focusedPlanet === "Mars" && (
          <button
            onClick={marsHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♂️ More about Mars
          </button>
        )}

        {/* More about Jupiter Button */}
        {focusedPlanet === "Jupiter" && (
          <button
            onClick={jupiterHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♃ More about Jupiter
          </button>
        )}

        {/* More about Saturn Button */}
        {focusedPlanet === "Saturn" && (
          <button
            onClick={saturnHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♄ More about Saturn
          </button>
        )}

        {/* More about Uranus Button */}
        {focusedPlanet === "Uranus" && (
          <button
            onClick={uranusHandlers.handleMoreAbout}
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
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ⛢ More about Uranus
          </button>
        )}

        {/* More about Neptune Button */}
        {focusedPlanet === "Neptune" && (
          <button
            onClick={neptuneHandlers.handleMoreAbout}
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              padding: "15px 25px",
              background: `
                linear-gradient(135deg,
                  rgba(75, 112, 221, 0.9) 0%,
                  rgba(25, 25, 112, 0.8) 100%
                )
              `,
              border: "1px solid rgba(75, 112, 221, 0.4)",
              borderRadius: "20px",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              color: "#ffffff",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: `
                0 8px 25px rgba(75, 112, 221, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3),
                0 0 30px rgba(75, 112, 221, 0.3)
              `,
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              backdropFilter: "blur(10px)",
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♆ More about Neptune
          </button>
        )}

        {/* More about Pluto Button */}
        {focusedPlanet === "Pluto" && (
          <button
            onClick={plutoHandlers.handleMoreAbout}
            style={{
              position: "absolute",
              bottom: "30px",
              right: "30px",
              padding: "15px 25px",
              background: `
                linear-gradient(135deg,
                  rgba(140, 120, 83, 0.9) 0%,
                  rgba(101, 67, 33, 0.8) 100%
                )
              `,
              border: "1px solid rgba(140, 120, 83, 0.4)",
              borderRadius: "20px",
              cursor: "pointer",
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
              animation: "stellarPulse 2s ease-in-out infinite alternate",
              zIndex: 1001,
            }}
          >
            ♇ More about Pluto
          </button>
        )}
      </div>
    </ErrorBoundary>
  );
}
