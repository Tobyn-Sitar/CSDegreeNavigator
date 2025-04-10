"use client";

import { useEffect } from "react";
import "./styles.css";

export default function MVCCoursePage() {
  useEffect(() => {
    import("./controller.js");
  }, []);

  return (
    <div>
      <h1>Course Planner</h1>
      <div id="semester-container" className="semester-container"></div>
      <hr />
      <h2>Available Courses</h2>
      <div id="checkbox-area" className="checkbox-area"></div>
    </div>
  );
  
}
