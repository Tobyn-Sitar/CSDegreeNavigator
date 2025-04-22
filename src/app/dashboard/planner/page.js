"use client";

import { useEffect } from "react";
import "./styles.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

export default function Page() {
  useEffect(() => {
    import("./controller.js");

    const checkboxes = document.querySelectorAll('#semester-options input[type="checkbox"]');

// Enforce only one checkbox at a time
checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      checkboxes.forEach((other) => {
        if (other !== checkbox) other.checked = false;
      });
    }
  });
});

  }, []);

  return (
    <div className="planner-wrapper">
      {/* Full-width Top Toolbar */}
      <header className="top-toolbar">
        <div className="toolbar-left">CS Degree Planner</div>
        <div className="toolbar-right">
          <a href="/dashboard" className="home-icon" title="Back to Dashboard">🏠</a>
          <button id="save-btn" className="save-btn">Save</button>
          <button id="load-btn" className="load-btn">Load</button>
        </div>
      </header>

      {/* Main Planner */}
      <ScrollArea className="w-full max-w-full whitespace-nowrap rounded-md border overflow-x-auto">
        <div id="semester-container" className="semester-container"></div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Semester Options */}
<div id="semester-options" className="semester-options-box">
  <div className="semester-checkboxes">
    <label><input type="checkbox" name="semester" value="Fall" /> Fall</label>
    <label><input type="checkbox" name="semester" value="Winter" /> Winter</label>
    <label><input type="checkbox" name="semester" value="Spring" /> Spring</label>
    <label><input type="checkbox" name="semester" value="Summer" /> Summer</label>
  </div>

  <div className="semester-buttons">
    <button id="add-semester-btn">Add Semester</button>
    <button id="remove-semester-btn" className="remove-semester-btn">Remove Last Semester</button>
  </div>

  {/* Year Started Dropdown */}
  <div className="year-started">
    <label htmlFor="year-started">Year Started:</label>
    <select id="year-started" name="yearStarted">
      <option value="2019">2019</option>
      <option value="2020">2020</option>
      <option value="2021">2021</option>
      <option value="2022">2022</option>
      <option value="2023">2023</option>
      <option value="2024">2024</option>
      <option value="2025">2025</option>
    </select>
  </div>
</div>



      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
    </div>
  );
}