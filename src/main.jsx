import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

function Main() {
  // Enhanced welcome screen is now integrated directly into App.jsx
  // with Hyperspeed effect as the first phase of the welcome sequence
  return <App />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>
);
