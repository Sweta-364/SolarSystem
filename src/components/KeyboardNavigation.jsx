import { useEffect, useCallback, useState } from "react";

// Keyboard Navigation Hook
export function useKeyboardNavigation({
  onPlanetSelect,
  onSunSelect,
  onEscape,
  onSearch,
  onTogglePanel,
  planets = [],
  isEnabled = true,
}) {
  const [currentPlanetIndex, setCurrentPlanetIndex] = useState(0);
  const [showHelp, setShowHelp] = useState(false);

  const handleKeyPress = useCallback(
    (event) => {
      if (!isEnabled) return;

      // Don't trigger shortcuts when user is typing in input fields
      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.contentEditable === "true" ||
          activeElement.isContentEditable);

      const key = event.key.toLowerCase();
      const isCtrl = event.ctrlKey || event.metaKey;
      const isShift = event.shiftKey;

      // Allow Ctrl+K and Escape even when typing
      if (isTyping && !(isCtrl && key === "k") && key !== "escape") {
        return;
      }

      // Prevent default for our handled keys
      const handledKeys = [
        "arrowleft",
        "arrowright",
        "arrowup",
        "arrowdown",
        "enter",
        "space",
        "escape",
        "tab",
        "f1",
        "/",
        "?",
      ];

      if (
        handledKeys.includes(key) ||
        (isCtrl && ["k", "p", "h"].includes(key))
      ) {
        event.preventDefault();
      }

      switch (key) {
        // Planet Navigation
        case "arrowright":
        case "d":
          setCurrentPlanetIndex((prev) => (prev + 1) % planets.length);
          break;

        case "arrowleft":
        case "a":
          setCurrentPlanetIndex(
            (prev) => (prev - 1 + planets.length) % planets.length
          );
          break;

        // Select Current Planet
        case "enter":
        case " ": // Space
          if (planets[currentPlanetIndex]) {
            onPlanetSelect?.(planets[currentPlanetIndex]);
          }
          break;

        // Sun Selection
        case "s":
          if (!isCtrl) {
            onSunSelect?.();
          }
          break;

        // Quick Planet Selection (1-9)
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
          const planetIndex = parseInt(key) - 1;
          if (planetIndex < planets.length) {
            setCurrentPlanetIndex(planetIndex);
            onPlanetSelect?.(planets[planetIndex]);
          }
          break;

        // Search
        case "/":
        case "f":
          if (!isCtrl) {
            onSearch?.();
          }
          break;

        // Escape / Back
        case "escape":
          onEscape?.();
          setShowHelp(false);
          break;

        // Toggle Control Panel
        case "p":
          if (isCtrl) {
            onTogglePanel?.();
          }
          break;

        // Search (Ctrl+K)
        case "k":
          if (isCtrl) {
            onSearch?.();
          }
          break;

        // Help
        case "f1":
        case "?":
          if (!isShift) {
            setShowHelp((prev) => !prev);
          }
          break;

        // Help (Ctrl+H)
        case "h":
          if (isCtrl) {
            setShowHelp((prev) => !prev);
          }
          break;

        default:
          break;
      }
    },
    [
      isEnabled,
      currentPlanetIndex,
      planets,
      onPlanetSelect,
      onSunSelect,
      onEscape,
      onSearch,
      onTogglePanel,
    ]
  );

  useEffect(() => {
    if (isEnabled) {
      document.addEventListener("keydown", handleKeyPress);
      return () => document.removeEventListener("keydown", handleKeyPress);
    }
  }, [handleKeyPress, isEnabled]);

  return {
    currentPlanetIndex,
    setCurrentPlanetIndex,
    showHelp,
    setShowHelp,
  };
}

// Keyboard Help Modal
export function KeyboardHelpModal({ isVisible, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const shortcuts = [
    {
      category: "Navigation",
      items: [
        { keys: ["←", "→", "A", "D"], description: "Navigate between planets" },
        { keys: ["Enter", "Space"], description: "Select current planet" },
        { keys: ["1-9"], description: "Quick select planet by number" },
        { keys: ["S"], description: "Focus on Sun" },
      ],
    },
    {
      category: "Search & Controls",
      items: [
        { keys: ["/", "F"], description: "Open search" },
        { keys: ["Ctrl", "K"], description: "Quick search" },
        { keys: ["Ctrl", "P"], description: "Toggle control panel" },
        { keys: ["Escape"], description: "Go back / Close modals" },
      ],
    },
    {
      category: "Help",
      items: [
        { keys: ["F1", "?"], description: "Show/hide this help" },
        { keys: ["Ctrl", "H"], description: "Toggle help" },
      ],
    },
  ];

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
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          background:
            "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "20px",
          padding: "2rem",
          maxWidth: "600px",
          width: "90%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
          color: "white",
          fontFamily: '"Space Mono", monospace',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            paddingBottom: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "700",
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontFamily: '"Orbitron", sans-serif',
              margin: 0,
            }}
          >
            ⌨️ Keyboard Shortcuts
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "5px",
              borderRadius: "5px",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "white";
              e.target.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(255, 255, 255, 0.7)";
              e.target.style.background = "none";
            }}
          >
            ✕
          </button>
        </div>

        {/* Shortcuts */}
        {shortcuts.map((category, categoryIndex) => (
          <div key={categoryIndex} style={{ marginBottom: "2rem" }}>
            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#667eea",
                marginBottom: "1rem",
                fontFamily: '"Orbitron", sans-serif',
              }}
            >
              {category.category}
            </h3>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.8rem",
              }}
            >
              {category.items.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem 0",
                  }}
                >
                  <div
                    style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}
                  >
                    {item.keys.map((key, keyIndex) => (
                      <kbd
                        key={keyIndex}
                        style={{
                          background: "rgba(255, 255, 255, 0.1)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          borderRadius: "4px",
                          padding: "0.2rem 0.5rem",
                          fontSize: "0.8rem",
                          fontWeight: "600",
                          color: "#ffffff",
                          minWidth: "24px",
                          textAlign: "center",
                          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                        }}
                      >
                        {key}
                      </kbd>
                    ))}
                  </div>

                  <span
                    style={{
                      fontSize: "0.9rem",
                      opacity: 0.9,
                      textAlign: "right",
                      flex: 1,
                      marginLeft: "1rem",
                    }}
                  >
                    {item.description}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer */}
        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            textAlign: "center",
            fontSize: "0.8rem",
            opacity: 0.7,
          }}
        >
          Press{" "}
          <kbd
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "0.2rem 0.4rem",
              borderRadius: "3px",
              fontSize: "0.7rem",
            }}
          >
            Esc
          </kbd>{" "}
          to close this help
        </div>
      </div>
    </div>
  );
}
