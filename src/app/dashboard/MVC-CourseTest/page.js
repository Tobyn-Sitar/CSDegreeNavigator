"use client";

import { useEffect } from "react";
import "./styles.css";

export default function Page() {
  useEffect(() => {
    import("./controller.js");
  }, []);

  return (
    <div className="planner-wrapper">
      {/* Full-width Top Toolbar */}
      <header className="top-toolbar">
        <div className="toolbar-left">CS Degree Planner</div>
        <div className="toolbar-right">
          <a href="/dashboard" className="home-icon" title="Back to Dashboard">🏠</a>
        </div>
      </header>
  
      {/* Main Planner */}
      <div id="semester-container" className="semester-container"></div>
      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
      <svg id="line-layer" className="line-layer"></svg>
    </div>
  );
  
}
