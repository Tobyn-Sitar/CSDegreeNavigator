"use client";

import { useEffect } from "react";
import "./styles.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
      <ScrollArea className="w-full max-w-full whitespace-nowrap rounded-md border overflow-x-auto">
          <div id="semester-container" className="semester-container"></div>
          <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div id="semester-options">
          <button id="add-fall-btn">Add Fall Semester</button>
          <button id="add-winter-btn">Add Winter Semester</button>
          <button id="add-spring-btn">Add Spring Semester</button>
          <button id="add-summer-btn">Add Summer Semester</button>
      </div>
      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
      <div id="semester-controls">
        <button id="add-semester-btn" class="add-semester-btn">Add Semester</button>
        <button id="remove-semester-btn" class="remove-semester-btn">Remove Semester</button>
      </div>
      <button id="save-btn" class="save-btn">Save Semester</button>
      <button id="load-btn" class="load-btn">Load Data</button>
      <svg id="line-layer" className="line-layer"></svg>
    </div>
  );
  
}