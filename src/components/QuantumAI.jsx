import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

// Quantum Computing Visualization
export function QuantumComputer({ isActive, onToggle }) {
  const [qubits, setQubits] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const containerRef = useRef();

  useEffect(() => {
    // Initialize qubits
    const initialQubits = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      state: Math.random() > 0.5 ? "|1⟩" : "|0⟩",
      superposition: Math.random(),
      entangled: Math.random() > 0.7,
      phase: Math.random() * 360,
    }));
    setQubits(initialQubits);
  }, []);

  const runQuantumSimulation = () => {
    setIsProcessing(true);

    // Simulate quantum computation
    const interval = setInterval(() => {
      setQubits((prev) =>
        prev.map((qubit) => ({
          ...qubit,
          state: Math.random() > 0.5 ? "|1⟩" : "|0⟩",
          superposition: Math.random(),
          phase: (qubit.phase + Math.random() * 30) % 360,
        }))
      );
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
    }, 3000);
  };

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "550px",
        maxWidth: "90vw",
        maxHeight: "80vh",
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%)",
        border: "2px solid rgba(0, 255, 255, 0.3)",
        borderRadius: "20px",
        padding: "25px",
        backdropFilter: "blur(20px)",
        zIndex: 10002,
        color: "white",
        fontFamily: '"Space Mono", monospace',
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
        overflow: "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "15px",
        }}
      >
        <h2
          style={{
            fontSize: "1.6rem",
            margin: 0,
            background: "linear-gradient(45deg, #00ffff, #ff00ff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          ⚛️ Quantum Computer
        </h2>
        <button
          onClick={onToggle}
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

      <div
        ref={containerRef}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {qubits.map((qubit) => (
          <div
            key={qubit.id}
            style={{
              background: `linear-gradient(${qubit.phase}deg, 
                rgba(0, 255, 255, ${qubit.superposition}) 0%, 
                rgba(255, 0, 255, ${1 - qubit.superposition}) 100%
              )`,
              border: qubit.entangled
                ? "2px solid #ffff00"
                : "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "10px",
              padding: "10px",
              textAlign: "center",
              animation: isProcessing ? "quantumFlicker 0.1s infinite" : "none",
              boxShadow: qubit.entangled
                ? "0 0 15px rgba(255, 255, 0, 0.5)"
                : "none",
            }}
          >
            <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>Q{qubit.id}</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>
              {qubit.state}
            </div>
            <div style={{ fontSize: "0.7rem", opacity: 0.6 }}>
              {(qubit.superposition * 100).toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          onClick={runQuantumSimulation}
          disabled={isProcessing}
          style={{
            padding: "10px 20px",
            background: isProcessing
              ? "rgba(100, 100, 100, 0.5)"
              : "linear-gradient(135deg, #00ffff, #ff00ff)",
            border: "none",
            borderRadius: "10px",
            color: "white",
            fontWeight: "bold",
            cursor: isProcessing ? "not-allowed" : "pointer",
            fontFamily: '"Space Mono", monospace',
          }}
        >
          {isProcessing ? "⚡ Processing..." : "🚀 Run Simulation"}
        </button>

        <div style={{ fontSize: "0.8rem", opacity: 0.7 }}>
          Entangled: {qubits.filter((q) => q.entangled).length}/8
        </div>
      </div>

      <style jsx>{`
        @keyframes quantumFlicker {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}

// AI Analytics Dashboard
export function AIAnalytics({ isActive, onToggle, planetData }) {
  const [metrics, setMetrics] = useState({
    userEngagement: 0,
    explorationScore: 0,
    learningProgress: 0,
    interactionRate: 0,
  });
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    if (isActive) {
      // Simulate AI analytics
      const interval = setInterval(() => {
        setMetrics({
          userEngagement: Math.random() * 100,
          explorationScore: Math.random() * 100,
          learningProgress: Math.random() * 100,
          interactionRate: Math.random() * 100,
        });

        setPredictions([
          {
            text: "User likely to explore Jupiter next",
            confidence: Math.random() * 100,
          },
          {
            text: "High interest in planetary rings",
            confidence: Math.random() * 100,
          },
          {
            text: "Learning pattern: Visual learner",
            confidence: Math.random() * 100,
          },
        ]);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "30px",
        transform: "translateY(-50%)",
        width: "320px",
        maxHeight: "80vh",
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(40, 20, 60, 0.95) 100%)",
        border: "2px solid rgba(255, 0, 255, 0.3)",
        borderRadius: "20px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        zIndex: 10002,
        color: "white",
        fontFamily: '"Space Mono", monospace',
        overflow: "auto",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "15px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            margin: 0,
            background: "linear-gradient(45deg, #ff00ff, #00ffff)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          🤖 AI Analytics
        </h2>
        <button
          onClick={onToggle}
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

      {/* Real-time Metrics */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{ fontSize: "1rem", marginBottom: "10px", color: "#ff00ff" }}
        >
          📊 Real-time Metrics
        </h3>
        {Object.entries(metrics).map(([key, value]) => (
          <div key={key} style={{ marginBottom: "10px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.8rem",
                marginBottom: "3px",
              }}
            >
              <span>{key.replace(/([A-Z])/g, " $1").toLowerCase()}</span>
              <span>{value.toFixed(1)}%</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "6px",
                background: "rgba(255, 255, 255, 0.1)",
                borderRadius: "3px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${value}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, 
                  hsl(${value * 1.2}, 70%, 50%) 0%, 
                  hsl(${value * 1.2 + 60}, 70%, 60%) 100%
                )`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* AI Predictions */}
      <div style={{ marginBottom: "20px" }}>
        <h3
          style={{ fontSize: "1rem", marginBottom: "10px", color: "#00ffff" }}
        >
          🔮 AI Predictions
        </h3>
        {predictions.map((prediction, index) => (
          <div
            key={index}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "8px",
              fontSize: "0.8rem",
            }}
          >
            <div style={{ marginBottom: "5px" }}>{prediction.text}</div>
            <div
              style={{
                fontSize: "0.7rem",
                color: `hsl(${prediction.confidence * 1.2}, 70%, 60%)`,
              }}
            >
              Confidence: {prediction.confidence.toFixed(1)}%
            </div>
          </div>
        ))}
      </div>

      {/* Neural Network Visualization */}
      <div>
        <h3
          style={{ fontSize: "1rem", marginBottom: "10px", color: "#ffff00" }}
        >
          🧠 Neural Activity
        </h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            gap: "5px",
          }}
        >
          {Array.from({ length: 18 }, (_, i) => (
            <div
              key={i}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: `hsl(${Math.random() * 360}, 70%, 60%)`,
                animation: `neuronPulse ${
                  1 + Math.random() * 2
                }s ease-in-out infinite`,
                opacity: 0.3 + Math.random() * 0.7,
              }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes neuronPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Blockchain Space Ledger
export function BlockchainLedger({ isActive, onToggle, transactions = [] }) {
  const [blocks, setBlocks] = useState([]);
  const [mining, setMining] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Initialize blockchain
      const genesisBlock = {
        id: 0,
        hash: "0x000000...",
        previousHash: "0x000000...",
        timestamp: Date.now(),
        data: "Genesis Block - Solar System Initialized",
        nonce: 0,
      };
      setBlocks([genesisBlock]);
    }
  }, [isActive]);

  const mineNewBlock = () => {
    setMining(true);

    setTimeout(() => {
      const newBlock = {
        id: blocks.length,
        hash: `0x${Math.random().toString(16).substr(2, 8)}...`,
        previousHash: blocks[blocks.length - 1]?.hash || "0x000000...",
        timestamp: Date.now(),
        data: `Planet exploration data - Block ${blocks.length}`,
        nonce: Math.floor(Math.random() * 1000000),
      };

      setBlocks((prev) => [...prev, newBlock]);
      setMining(false);
    }, 2000);
  };

  if (!isActive) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "380px",
        maxHeight: "70vh",
        background:
          "linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 40, 20, 0.95) 100%)",
        border: "2px solid rgba(0, 255, 0, 0.3)",
        borderRadius: "20px",
        padding: "20px",
        backdropFilter: "blur(20px)",
        zIndex: 10002,
        color: "white",
        fontFamily: '"Space Mono", monospace',
        overflow: "auto",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: "15px",
        }}
      >
        <h2
          style={{
            fontSize: "1.4rem",
            margin: 0,
            background: "linear-gradient(45deg, #00ff00, #ffff00)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontFamily: '"Orbitron", sans-serif',
          }}
        >
          ⛓️ Space Ledger
        </h2>
        <button
          onClick={onToggle}
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

      <div style={{ marginBottom: "15px" }}>
        <button
          onClick={mineNewBlock}
          disabled={mining}
          style={{
            padding: "8px 16px",
            background: mining
              ? "rgba(100, 100, 100, 0.5)"
              : "linear-gradient(135deg, #00ff00, #ffff00)",
            border: "none",
            borderRadius: "8px",
            color: mining ? "white" : "black",
            fontWeight: "bold",
            cursor: mining ? "not-allowed" : "pointer",
            fontSize: "0.8rem",
          }}
        >
          {mining ? "⛏️ Mining..." : "⛏️ Mine Block"}
        </button>
      </div>

      <div style={{ maxHeight: "180px", overflow: "auto" }}>
        {blocks.map((block) => (
          <div
            key={block.id}
            style={{
              background: "rgba(0, 255, 0, 0.1)",
              border: "1px solid rgba(0, 255, 0, 0.3)",
              borderRadius: "8px",
              padding: "10px",
              marginBottom: "8px",
              fontSize: "0.7rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
              }}
            >
              <span style={{ color: "#00ff00" }}>Block #{block.id}</span>
              <span style={{ color: "#ffff00" }}>Nonce: {block.nonce}</span>
            </div>
            <div style={{ marginBottom: "3px", opacity: 0.8 }}>
              Hash: {block.hash}
            </div>
            <div style={{ opacity: 0.6 }}>{block.data}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
