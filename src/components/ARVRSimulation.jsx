import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// AR Mode Simulator
export function ARModeSimulator({ isActive, onToggle }) {
  const [isSupported, setIsSupported] = useState(false);
  const videoRef = useRef();
  const overlayRef = useRef();

  useEffect(() => {
    // Check for camera support
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (isActive && isSupported) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => stopCamera();
  }, [isActive, isSupported]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.log("Camera access denied or not available");
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {isActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999,
            background: "#000",
          }}
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* AR Overlay */}
          <div
            ref={overlayRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
          >
            {/* AR UI Elements */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "#00ff00",
                fontFamily: '"Space Mono", monospace',
                fontSize: "14px",
                textShadow: "0 0 10px currentColor",
              }}
            >
              AR MODE ACTIVE
            </div>

            {/* Enhanced Close Button - Highest z-index to be above everything */}
            <button
              onClick={() => {
                console.log("AR Close button clicked!");
                onToggle();
              }}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(0, 0, 0, 0.9)",
                border: "4px solid #00ff00",
                borderRadius: "50%",
                width: "70px",
                height: "70px",
                color: "#00ff00",
                cursor: "pointer",
                fontSize: "1.8rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                pointerEvents: "auto",
                backdropFilter: "blur(20px)",
                transition: "all 0.3s ease",
                boxShadow:
                  "0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(0, 255, 0, 0.2), 0 0 50px rgba(0, 255, 0, 0.4)",
                animation: "arButtonPulse 2s ease-in-out infinite",
                zIndex: 99999,
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(0, 255, 0, 0.3)";
                e.target.style.transform = "scale(1.2)";
                e.target.style.boxShadow =
                  "0 0 30px rgba(0, 255, 0, 0.8), inset 0 0 30px rgba(0, 255, 0, 0.2)";
                e.target.style.animation = "none";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(0, 0, 0, 0.8)";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow =
                  "0 0 20px rgba(0, 255, 0, 0.5), inset 0 0 20px rgba(0, 255, 0, 0.1)";
                e.target.style.animation =
                  "arButtonPulse 2s ease-in-out infinite";
              }}
            >
              ✕
            </button>

            {/* Exit AR Text - Moved to center bottom for better visibility */}
            <div
              style={{
                position: "absolute",
                bottom: "100px",
                left: "50%",
                transform: "translateX(-50%)",
                color: "#00ff00",
                fontFamily: '"Space Mono", monospace',
                fontSize: "16px",
                fontWeight: "bold",
                textShadow: "0 0 15px currentColor, 0 0 30px currentColor",
                textAlign: "center",
                pointerEvents: "none",
                animation: "arTextFade 2s ease-in-out infinite",
                background: "rgba(0, 0, 0, 0.8)",
                padding: "12px 24px",
                borderRadius: "25px",
                border: "2px solid #00ff00",
                backdropFilter: "blur(15px)",
                boxShadow: "0 0 25px rgba(0, 255, 0, 0.5)",
                zIndex: 99998,
              }}
            >
              ↗️ TAP BUTTON TO EXIT AR ↗️
            </div>

            {/* Arrow pointing to close button */}
            <div
              style={{
                position: "absolute",
                top: "95px",
                right: "95px",
                color: "#00ff00",
                fontSize: "28px",
                pointerEvents: "none",
                animation: "arArrowBounce 1.5s ease-in-out infinite",
                textShadow: "0 0 15px currentColor, 0 0 30px currentColor",
                zIndex: 99998,
              }}
            >
              ↗️
            </div>

            {/* Scanning Grid */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "200px",
                height: "200px",
                border: "2px solid #00ff00",
                borderRadius: "10px",
                animation: "arScan 2s ease-in-out infinite",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  right: "10px",
                  bottom: "10px",
                  border: "1px solid rgba(0, 255, 0, 0.5)",
                  borderRadius: "5px",
                }}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes arScan {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5);
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 255, 0, 0.8);
            transform: translate(-50%, -50%) scale(1.1);
          }
        }

        @keyframes arButtonPulse {
          0%,
          100% {
            box-shadow: 0 0 20px rgba(0, 255, 0, 0.5),
              inset 0 0 20px rgba(0, 255, 0, 0.1);
            border-color: #00ff00;
          }
          50% {
            box-shadow: 0 0 30px rgba(0, 255, 0, 0.8),
              inset 0 0 30px rgba(0, 255, 0, 0.2);
            border-color: #00ffaa;
          }
        }

        @keyframes arTextFade {
          0%,
          100% {
            opacity: 0.8;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateX(-50%) scale(1.05);
          }
        }

        @keyframes arArrowBounce {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
            opacity: 0.7;
          }
          50% {
            transform: translate(-5px, -5px) scale(1.2);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}

// VR Mode Simulator
export function VRModeSimulator({ isActive, onToggle }) {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ("xr" in navigator) {
      navigator.xr.isSessionSupported("immersive-vr").then((supported) => {
        setIsSupported(supported);
      });
    }
  }, []);

  const enterVR = async () => {
    if (navigator.xr) {
      try {
        const session = await navigator.xr.requestSession("immersive-vr");
        onToggle(true);
        // VR session logic would go here
      } catch (error) {
        console.log("VR not available, showing simulation");
        onToggle(true);
      }
    } else {
      onToggle(true);
    }
  };

  return (
    <>
      {isActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background:
              "radial-gradient(circle, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* VR Simulation Overlay */}
          <div
            style={{
              position: "relative",
              width: "80%",
              height: "80%",
              border: "3px solid rgba(102, 126, 234, 0.5)",
              borderRadius: "20px",
              overflow: "hidden",
              background: "rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* VR Grid */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `
                linear-gradient(rgba(102, 126, 234, 0.2) 1px, transparent 1px),
                linear-gradient(90deg, rgba(102, 126, 234, 0.2) 1px, transparent 1px)
              `,
                backgroundSize: "50px 50px",
                animation: "vrGrid 10s linear infinite",
              }}
            />

            {/* VR UI */}
            <div
              style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                color: "#667eea",
                fontFamily: '"Space Mono", monospace',
                fontSize: "16px",
                textShadow: "0 0 10px currentColor",
              }}
            >
              VR SIMULATION MODE
            </div>

            {/* Close Button */}
            <button
              onClick={() => onToggle(false)}
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "rgba(255, 255, 255, 0.2)",
                border: "2px solid #667eea",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                color: "#667eea",
                cursor: "pointer",
                fontSize: "1.2rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                backdropFilter: "blur(10px)",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(102, 126, 234, 0.2)";
                e.target.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "scale(1)";
              }}
            >
              ✕
            </button>

            {/* Virtual Solar System Preview */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                color: "white",
                textAlign: "center",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              <div
                style={{
                  fontSize: "2rem",
                  marginBottom: "1rem",
                  animation: "vrPulse 2s ease-in-out infinite",
                }}
              >
                🌌
              </div>
              <h2
                style={{
                  fontSize: "1.5rem",
                  marginBottom: "0.5rem",
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Virtual Solar System
              </h2>
              <p
                style={{
                  fontSize: "1rem",
                  opacity: 0.8,
                  fontFamily: '"Space Mono", monospace',
                }}
              >
                Immersive 3D Experience
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes vrGrid {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(50px, 50px);
          }
        }

        @keyframes vrPulse {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
        }
      `}</style>
    </>
  );
}

// Gesture Control Simulator
export function GestureControl({ onGesture, isActive = false }) {
  const [gesture, setGesture] = useState("");
  const gestureRef = useRef();

  useEffect(() => {
    if (isActive) {
      const handleMouseMove = (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        // Simple gesture detection
        if (x < 0.2 && y > 0.4 && y < 0.6) {
          setGesture("👈 Swipe Left");
          onGesture?.("left");
        } else if (x > 0.8 && y > 0.4 && y < 0.6) {
          setGesture("👉 Swipe Right");
          onGesture?.("right");
        } else if (y < 0.2 && x > 0.4 && x < 0.6) {
          setGesture("👆 Swipe Up");
          onGesture?.("up");
        } else if (y > 0.8 && x > 0.4 && x < 0.6) {
          setGesture("👇 Swipe Down");
          onGesture?.("down");
        } else {
          setGesture("");
        }
      };

      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isActive, onGesture]);

  return (
    <>
      {isActive && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(0, 0, 0, 0.9)",
            color: "white",
            padding: "15px 25px 15px 25px",
            borderRadius: "15px",
            fontFamily: '"Space Mono", monospace',
            fontSize: "1rem",
            zIndex: 1004,
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(16, 172, 132, 0.5)",
            boxShadow: "0 0 20px rgba(16, 172, 132, 0.3)",
            display: "flex",
            alignItems: "center",
            gap: "15px",
          }}
        >
          <div style={{ flex: 1 }}>
            {gesture || "👋 Move cursor to edges for gestures"}
          </div>
          <button
            onClick={() => onGesture && onGesture("disable")}
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(16, 172, 132, 0.5)",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              color: "#10ac84",
              cursor: "pointer",
              fontSize: "0.9rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.3s ease",
              fontWeight: "bold",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(16, 172, 132, 0.2)";
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
      )}

      {isActive && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
            zIndex: 1003,
          }}
        >
          {/* Gesture zones */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: "40%",
              width: "20%",
              height: "20%",
              border: "2px dashed rgba(16, 172, 132, 0.5)",
              borderRadius: "10px",
            }}
          />
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "40%",
              width: "20%",
              height: "20%",
              border: "2px dashed rgba(16, 172, 132, 0.5)",
              borderRadius: "10px",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "40%",
              width: "20%",
              height: "20%",
              border: "2px dashed rgba(16, 172, 132, 0.5)",
              borderRadius: "10px",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: "40%",
              width: "20%",
              height: "20%",
              border: "2px dashed rgba(16, 172, 132, 0.5)",
              borderRadius: "10px",
            }}
          />
        </div>
      )}
    </>
  );
}
