"use client";

import { useEffect } from "react";
import "./styles.css";

export default function Page() {
  useEffect(() => {
    import("./controller.js");
  }, []);

  return (
    <div className="planner-wrapper">
      <h1>Course Planner</h1>
      <div id="semester-container" className="semester-container"></div>
      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
      <button id="check-compatibility-btn" className="check-btn">Check Compatibility</button>
      <svg id="line-layer" className="line-layer"></svg>
    </div>
  );
}
