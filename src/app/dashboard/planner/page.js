"use client";

import { useEffect } from "react";
import "./styles.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export default function Page() {
  useEffect(() => {
    import("./controller.js");

    const checkboxes = document.querySelectorAll('#semester-options input[type="checkbox"]');
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

        <div className="semester-selectors">
          <label>Year:
            <select id="select-year">
              {Array.from({ length: 10 }, (_, i) => 2018 + i).map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="semester-buttons">
          <button id="add-semester-btn">Add Semester</button>
          <button id="remove-semester-btn" className="remove-semester-btn">Remove Semester</button>
        </div>

        <div className="semester-buttons">
        </div>
      </div>

      <svg id="line-layer" className="line-layer"></svg>
      <div id="source-container" className="source-area"></div>
    </div>
  );
}
