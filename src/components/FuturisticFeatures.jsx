import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// AI Voice Assistant Component
export function AIVoiceAssistant({ onCommand, isListening, setIsListening }) {
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        setTranscript(transcript);
        
        if (event.results[current].isFinal) {
          onCommand?.(transcript);
          setTranscript('');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onCommand, setIsListening]);

  const startListening = () => {
    if (recognitionRef.current && isSupported) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  if (!isSupported) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      right: '30px',
      zIndex: 1003
    }}>
      <button
        onClick={isListening ? stopListening : startListening}
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: isListening 
            ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
            : 'linear-gradient(135deg, #667eea, #764ba2)',
          border: 'none',
          color: 'white',
          fontSize: '1.5rem',
          cursor: 'pointer',
          boxShadow: isListening 
            ? '0 0 30px rgba(255, 107, 107, 0.6), 0 0 60px rgba(255, 107, 107, 0.4)'
            : '0 8px 25px rgba(102, 126, 234, 0.4)',
          transition: 'all 0.3s ease',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
        }}
      >
        {isListening ? '🎤' : '🤖'}
      </button>
      
      {transcript && (
        <div style={{
          position: 'absolute',
          bottom: '70px',
          right: '0',
          background: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          padding: '10px 15px',
          borderRadius: '10px',
          fontSize: '0.9rem',
          maxWidth: '200px',
          fontFamily: '"Space Mono", monospace'
        }}>
          "{transcript}"
        </div>
      )}
    </div>
  );
}

// Holographic UI Overlay
export function HolographicOverlay({ children, isActive }) {
  const overlayRef = useRef();

  useEffect(() => {
    if (overlayRef.current && isActive) {
      gsap.fromTo(overlayRef.current, 
        { opacity: 0, scale: 0.8, rotationY: -15 },
        { opacity: 1, scale: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.7)" }
      );
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: `
          linear-gradient(135deg, 
            rgba(0, 255, 255, 0.1) 0%, 
            rgba(255, 0, 255, 0.1) 50%, 
            rgba(0, 255, 0, 0.1) 100%
          )
        `,
        border: '2px solid rgba(0, 255, 255, 0.5)',
        borderRadius: '20px',
        padding: '30px',
        backdropFilter: 'blur(20px)',
        boxShadow: `
          0 0 50px rgba(0, 255, 255, 0.3),
          inset 0 0 50px rgba(255, 255, 255, 0.1)
        `,
        zIndex: 10001,
        animation: 'holographicGlow 3s ease-in-out infinite alternate'
      }}
    >
      {children}
      
      <style jsx>{`
        @keyframes holographicGlow {
          0% { 
            box-shadow: 
              0 0 50px rgba(0, 255, 255, 0.3),
              inset 0 0 50px rgba(255, 255, 255, 0.1);
          }
          100% { 
            box-shadow: 
              0 0 80px rgba(255, 0, 255, 0.4),
              inset 0 0 80px rgba(0, 255, 255, 0.2);
          }
        }
      `}</style>
    </div>
  );
}

// Neural Network Visualization
export function NeuralNetworkBG() {
  const canvasRef = useRef();
  const animationRef = useRef();
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create nodes
    const nodeCount = 50;
    nodesRef.current = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      radius: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      nodesRef.current.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(102, 126, 234, ${node.opacity})`;
        ctx.fill();
      });

      // Draw connections
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.slice(i + 1).forEach(otherNode => {
          const distance = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
          );
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(otherNode.x, otherNode.y);
            ctx.strokeStyle = `rgba(102, 126, 234, ${0.3 * (1 - distance / 100)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.3
      }}
    />
  );
}

// Quantum Particle Effects
export function QuantumParticles() {
  const containerRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particleCount = 30;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '2px';
      particle.style.height = '2px';
      particle.style.background = `hsl(${Math.random() * 360}, 70%, 60%)`;
      particle.style.borderRadius = '50%';
      particle.style.boxShadow = `0 0 10px currentColor`;
      particle.style.pointerEvents = 'none';
      
      container.appendChild(particle);
      particles.push(particle);

      // Animate particle
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });

      gsap.to(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        duration: Math.random() * 10 + 5,
        repeat: -1,
        yoyo: true,
        ease: "none"
      });

      gsap.to(particle, {
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 3 + 1,
        repeat: -1,
        yoyo: true
      });
    }

    return () => {
      particles.forEach(particle => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      });
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0
      }}
    />
  );
}

// Futuristic Data Stream
export function DataStream() {
  const [streams, setStreams] = useState([]);

  useEffect(() => {
    const createStream = () => {
      const id = Math.random().toString(36).substr(2, 9);
      const newStream = {
        id,
        x: Math.random() * window.innerWidth,
        data: Array.from({ length: 20 }, () => 
          Math.random().toString(36).substr(2, 1).toUpperCase()
        )
      };

      setStreams(prev => [...prev, newStream]);

      setTimeout(() => {
        setStreams(prev => prev.filter(stream => stream.id !== id));
      }, 5000);
    };

    const interval = setInterval(createStream, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: 1,
      overflow: 'hidden'
    }}>
      {streams.map(stream => (
        <div
          key={stream.id}
          style={{
            position: 'absolute',
            left: `${stream.x}px`,
            top: '-100px',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            animation: 'dataStreamFall 5s linear forwards'
          }}
        >
          {stream.data.map((char, index) => (
            <span
              key={index}
              style={{
                color: `hsl(${120 + index * 10}, 70%, 60%)`,
                fontSize: '12px',
                fontFamily: '"Space Mono", monospace',
                textShadow: '0 0 10px currentColor',
                opacity: 1 - (index * 0.05)
              }}
            >
              {char}
            </span>
          ))}
        </div>
      ))}
      
      <style jsx>{`
        @keyframes dataStreamFall {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(calc(100vh + 200px)); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
