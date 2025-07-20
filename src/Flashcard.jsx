import React, { useState, useEffect } from "react";
import gsap from "gsap";

// Fun facts database for each planet
const planetFacts = {
  Mercury: [
    "Mercury is the smallest planet in our solar system, only slightly larger than Earth's Moon!",
    "A day on Mercury (sunrise to sunrise) takes 176 Earth days, but a year is only 88 Earth days!",
    "Mercury has extreme temperature swings: 800°F (427°C) during the day and -300°F (-184°C) at night!",
    "Mercury has no atmosphere and no moons, making it one of the most barren worlds in our solar system.",
    "Despite being closest to the Sun, Mercury is not the hottest planet - that title goes to Venus!",
  ],
  Venus: [
    "Venus is the hottest planet in our solar system with surface temperatures of 900°F (462°C)!",
    "Venus rotates backwards compared to most planets - the Sun rises in the west and sets in the east!",
    "A day on Venus is longer than its year! One day = 243 Earth days, one year = 225 Earth days.",
    "Venus has crushing atmospheric pressure 90 times stronger than Earth's - like being 3,000 feet underwater!",
    "Venus is often called Earth's 'evil twin' because it's similar in size but has a hellish environment.",
  ],
  Earth: [
    "Earth is the only known planet with life, hosting over 8.7 million different species!",
    "Earth's magnetic field protects us from deadly solar radiation and cosmic rays from space.",
    "Our planet is 71% water, but 97% of that water is salty and only 3% is fresh water!",
    "Earth's core is as hot as the Sun's surface - about 10,800°F (6,000°C)!",
    "Earth is the densest planet in our solar system, with an average density of 5.5 grams per cubic centimeter.",
  ],
  Mars: [
    "Mars has the largest volcano in the solar system - Olympus Mons is 13.6 miles (22 km) high!",
    "Mars has two tiny moons: Phobos and Deimos, which are probably captured asteroids.",
    "A day on Mars is very similar to Earth - 24 hours and 37 minutes!",
    "Mars has seasons like Earth because it has a similar axial tilt of 25 degrees.",
    "The red color comes from iron oxide (rust) covering much of its surface!",
  ],
  Jupiter: [
    "Jupiter is so massive it could fit all other planets inside it with room to spare!",
    "Jupiter has at least 95 moons, including the four largest: Io, Europa, Ganymede, and Callisto.",
    "The Great Red Spot is a storm larger than Earth that has been raging for over 400 years!",
    "Jupiter acts as a 'cosmic vacuum cleaner,' protecting inner planets from asteroids and comets.",
    "Jupiter has faint rings made of dust particles kicked up by meteorite impacts on its moons!",
  ],
  Saturn: [
    "Saturn is less dense than water - it would float if you had a bathtub big enough!",
    "Saturn's rings are made of billions of ice and rock particles, some as small as dust, others as large as houses!",
    "Saturn has at least 146 moons, including Titan which has lakes of liquid methane!",
    "A day on Saturn is only 10.7 hours, making it the second-fastest spinning planet after Jupiter.",
    "Saturn's hexagonal storm at its north pole is one of the most mysterious features in our solar system!",
  ],
  Uranus: [
    "Uranus rotates on its side with an axial tilt of 98 degrees - it literally rolls around the Sun!",
    "Uranus is the coldest planet in our solar system with temperatures dropping to -371°F (-224°C).",
    "Uranus has 13 known rings that are much darker and narrower than Saturn's rings.",
    "A year on Uranus lasts 84 Earth years, meaning each season lasts about 21 years!",
    "Uranus was the first planet discovered with a telescope by William Herschel in 1781.",
  ],
  Neptune: [
    "Neptune has the strongest winds in the solar system, reaching speeds of 1,200 mph (2,000 km/h)!",
    "Neptune is so far from the Sun that it takes 165 Earth years to complete one orbit!",
    "Neptune's largest moon, Triton, orbits backwards and is probably a captured Kuiper Belt object.",
    "Neptune is the densest of the gas giants and has a rocky core about the size of Earth.",
    "Neptune was discovered through mathematical predictions before it was actually seen through a telescope!",
  ],
  Pluto: [
    "Pluto has five known moons, with Charon being so large that Pluto-Charon is almost a double planet system!",
    "A day on Pluto lasts 6.4 Earth days, and a year lasts 248 Earth years!",
    "Pluto's surface is covered in nitrogen ice, methane, and carbon monoxide.",
    "Pluto is smaller than Earth's Moon and seven other moons in our solar system!",
    "Pluto was reclassified as a 'dwarf planet' in 2006, but it's still beloved by space enthusiasts!",
  ],
};

export default function Flashcard({ planet, isVisible, onClose }) {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const facts = planetFacts[planet] || [
    "No facts available for this celestial body.",
  ];

  useEffect(() => {
    if (isVisible) {
      // Animate flashcard entrance
      gsap.fromTo(
        ".flashcard-container",
        {
          opacity: 0,
          scale: 0.8,
          rotationY: -90,
        },
        {
          opacity: 1,
          scale: 1,
          rotationY: 0,
          duration: 0.6,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [isVisible]);

  const nextFact = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.to(".fact-text", {
      opacity: 0,
      x: -30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentFactIndex((prev) => (prev + 1) % facts.length);
        gsap.fromTo(
          ".fact-text",
          { opacity: 0, x: 30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  };

  const prevFact = () => {
    if (isAnimating) return;
    setIsAnimating(true);

    gsap.to(".fact-text", {
      opacity: 0,
      x: 30,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        setCurrentFactIndex((prev) => (prev - 1 + facts.length) % facts.length);
        gsap.fromTo(
          ".fact-text",
          { opacity: 0, x: -30 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => setIsAnimating(false),
          }
        );
      },
    });
  };

  const handleClose = () => {
    gsap.to(".flashcard-container", {
      opacity: 0,
      scale: 0.8,
      rotationY: 90,
      duration: 0.4,
      ease: "power2.in",
      onComplete: onClose,
    });
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(10px)",
      }}
      onClick={handleClose}
    >
      <div
        className="flashcard-container"
        style={{
          width: "90%",
          maxWidth: "600px",
          background: `
            linear-gradient(135deg,
              rgba(15, 23, 42, 0.95) 0%,
              rgba(30, 41, 59, 0.95) 25%,
              rgba(51, 65, 85, 0.95) 50%,
              rgba(30, 41, 59, 0.95) 75%,
              rgba(15, 23, 42, 0.95) 100%
            )
          `,
          border: "2px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "25px",
          padding: "40px",
          boxShadow: `
            0 25px 50px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(59, 130, 246, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
          position: "relative",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cosmic background effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(147, 51, 234, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)
            `,
            borderRadius: "25px",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              color: "#ffffff",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "10px",
              textShadow: "0 0 20px rgba(59, 130, 246, 0.5)",
            }}
          >
            {planet} Facts
          </h2>
          <div
            style={{
              width: "100px",
              height: "3px",
              background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
              margin: "0 auto",
              borderRadius: "2px",
            }}
          />
        </div>

        {/* Fact content */}
        <div
          className="fact-text"
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "#e2e8f0",
            fontFamily: '"Inter", "Arial", sans-serif',
            textAlign: "center",
            marginBottom: "30px",
            minHeight: "120px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "15px",
            border: "1px solid rgba(59, 130, 246, 0.2)",
          }}
        >
          {facts[currentFactIndex]}
        </div>

        {/* Navigation and controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Previous button */}
          <button
            onClick={prevFact}
            disabled={isAnimating}
            style={{
              padding: "12px 20px",
              background:
                "linear-gradient(135deg, rgba(147, 51, 234, 0.8), rgba(79, 70, 229, 0.8))",
              border: "1px solid rgba(147, 51, 234, 0.4)",
              borderRadius: "15px",
              cursor: isAnimating ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "14px",
              color: "#ffffff",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(147, 51, 234, 0.3)",
              transition: "all 0.3s ease",
              opacity: isAnimating ? 0.5 : 1,
            }}
          >
            ← Previous
          </button>

          {/* Fact counter */}
          <div
            style={{
              color: "#94a3b8",
              fontSize: "14px",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "1px",
            }}
          >
            {currentFactIndex + 1} / {facts.length}
          </div>

          {/* Next button */}
          <button
            onClick={nextFact}
            disabled={isAnimating}
            style={{
              padding: "12px 20px",
              background:
                "linear-gradient(135deg, rgba(59, 130, 246, 0.8), rgba(16, 185, 129, 0.8))",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "15px",
              cursor: isAnimating ? "not-allowed" : "pointer",
              fontWeight: "600",
              fontSize: "14px",
              color: "#ffffff",
              fontFamily: '"Orbitron", "Arial", sans-serif',
              letterSpacing: "1px",
              textTransform: "uppercase",
              boxShadow: "0 6px 20px rgba(59, 130, 246, 0.3)",
              transition: "all 0.3s ease",
              opacity: isAnimating ? 0.5 : 1,
            }}
          >
            Next →
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "40px",
            height: "40px",
            background: "rgba(239, 68, 68, 0.8)",
            border: "1px solid rgba(239, 68, 68, 0.4)",
            borderRadius: "50%",
            cursor: "pointer",
            color: "#ffffff",
            fontSize: "18px",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 15px rgba(239, 68, 68, 0.3)",
            transition: "all 0.3s ease",
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
}
