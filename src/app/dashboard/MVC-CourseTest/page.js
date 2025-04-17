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
      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
      <svg id="line-layer" className="line-layer"></svg>
    </div>
  );
  
}
