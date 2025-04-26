"use client";

import { useEffect } from "react";
import "./styles.css";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
  

      {/* Main Planner */}
      <ScrollArea className="w-full max-w-full whitespace-nowrap rounded-md border overflow-x-auto">
        <div id="semester-container" className="semester-container"></div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Semester Options */}
      <div className="semester-options-wrapper">
  <div id="semester-options" className="semester-options-box">
    <div className="semester-checkboxes">
      <label><input type="checkbox" name="semester" value="Fall" /> Fall</label>
      <label><input type="checkbox" name="semester" value="Winter" /> Winter</label>
      <label><input type="checkbox" name="semester" value="Spring" /> Spring</label>
      <label><input type="checkbox" name="semester" value="Summer" /> Summer</label>
    </div>

    <div className="semester-buttons">
      <button id="add-semester-btn">Add Semester</button>
      <button id="remove-semester-btn" className="remove-semester-btn">Remove Semester</button>
    </div>

    {/* Year Started Dropdown */}
    <div className="year-started">
      <label htmlFor="year-started">Year Selected:</label>
      <select id="year-started" name="yearStarted">
        <option value="2018">2018</option>
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

  <div className="save-load-box">
    <button id="save-btn" className="save-btn">Save</button>
    <button id="load-btn" className="load-btn">Load</button>
  </div>
</div>

<div className="relative">
  <svg id="line-layer" className="line-layer absolute top-0 left-0 w-full h-full pointer-events-none"></svg>
  
  <ScrollArea className="rounded-md border overflow-y-auto">
    <div id="source-container" className="w-260 source-area px-4 py-2 whitespace-nowrap"></div>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>
</div>


    </div>
  );
}
