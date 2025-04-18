"use client";

import { useEffect } from "react";
import "./styles.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page() {
  useEffect(() => {
    import("./controller.js");
  }, []);

  return (
    <div className="planner-wrapper">
      {/* Top Toolbar */}
      <header className="top-toolbar">
        <div className="toolbar-left">CS Degree Planner</div>
        <div className="toolbar-right">
          <a href="/dashboard" className="home-icon" title="Back to Dashboard">
            🏠
          </a>
        </div>
      </header>

      {/* Semester Columns */}
      <ScrollArea className="w-full max-w-full whitespace-nowrap rounded-md border overflow-x-auto">
        <div id="semester-container" className="semester-container"></div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Course Pool */}
      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>

      {/* Save Button */}
      <button
        id="save-button"
        style={{
          margin: "16px",
          padding: "10px 20px",
          background: "#0074D9",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Courses
      </button>
    </div>
  );
}
