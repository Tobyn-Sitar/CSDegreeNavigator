import model from './model.js';
import view from './view.js';

fetch('/courses.json')
  .then(res => res.json())
  .then(data => {
    const enriched = data.map(c => {
      let type = 'other'; // Default type is 'other'
      
      // Set type based on the course requirement
      if (c.requirement === 'core') type = 'csc'; // Core courses
      else if (c.requirement === 'math') type = 'mat'; // Math courses
      else if (c.requirement === 'elective') type = 'csc400'; // Elective courses
      else if (c.requirement === 'science') type = 'science'; // Science courses
      else if (c.requirement === 'communication') type = 'communication'; // Communication courses
      else if (c.requirement === 'FYE') type = 'fye'; // FYE (First Year Experience) courses
      
      // Return the enriched course object with updated type and defaultSemester
      return { ...c, type, defaultSemester: c.defaultSemester ?? 1 };
    });
    

    const m = new model(enriched);
    const v = new view('semester-container', 'checkbox-area');
    const placed = [];
    v.placedCourses = placed;
    let numOfSemesters = 0;

    document.getElementById("add-semester-btn").addEventListener("click", () => {
      const selectedSeason = document.querySelector('#semester-options input[name="semester"]:checked')?.value;
      const selectedYear = document.getElementById("year-started")?.value;
    
      if (!selectedSeason || !selectedYear) {
        alert("Please select both a semester and a year.");
        return;
      }
    
      const fullSemester = `${selectedSeason} ${selectedYear}`;
    
      if (!v.semesterOptions.includes(fullSemester)) {
        alert("Invalid semester selection.");
        return;
      }
    
      if (v.addedSemesters.includes(fullSemester)) {
        alert(`${fullSemester} is already added.`);
        return;
      }
    
      // Find correct insert position to maintain order
      const insertIndex = v.semesterOptions.indexOf(fullSemester);
      let added = false;
    
      for (let i = 0; i < v.addedSemesters.length; i++) {
        const currentIndex = v.semesterOptions.indexOf(v.addedSemesters[i]);
        if (insertIndex < currentIndex) {
          v.insertSemesterAt(fullSemester, i);
          added = true;
          break;
        }
      }
    
      if (!added) {
        v.addSemesterAtEnd(fullSemester);
      }
    
      reEnableDropZones();
    });

    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterNum) => {
        const course = m.getCourseById(courseId);
        if (!course) return;
    
        const currentPlacement = placed.find(c => c.id === courseId);
        const currentSemester = currentPlacement?.semester;
    
        // Find dependent courses (i.e., where this course is a prereq)
        const dependents = placed.filter(c => c.prerequisites.includes(courseId));
        const earliestDependentSemester = dependents.length > 0
          ? Math.min(...dependents.map(c => c.semester))
          : Infinity;
    
        // 🚫 Cannot move course past any course that depends on it
        if (semesterNum >= earliestDependentSemester) {
          const msg = document.createElement("div");
          msg.className = "prereq-popup";
          msg.textContent = `❌ ${course.id} cannot be placed after course(s) that require it as a prerequisite.`;
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 3000);
          return;
        }
    
        // ✅ For placing a new course, check that all prerequisites are met
        const prereqViolated = course.prerequisites.some(prId => {
          const prereq = placed.find(c => c.id === prId);
          return !prereq || prereq.semester >= semesterNum;
        });
    
        if (prereqViolated) {
          const missing = course.prerequisites.filter(prId => {
            const prereq = placed.find(c => c.id === prId);
            return !prereq || prereq.semester >= semesterNum;
          });
    
          const msg = document.createElement("div");
          msg.className = "prereq-popup";
          msg.textContent = `❌ ${course.id} cannot be placed before its prerequisite(s): ${missing.join(", ")}`;
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 3000);
          return;
        }
    
        // Update placement
        if (currentPlacement) {
          currentPlacement.semester = semesterNum;
        } else {
          placed.push({ ...course, semester: semesterNum });
        }
    
        v.addCourseToSemester(course, semesterNum);
      });
    }
    

    document.getElementById("remove-semester-btn").addEventListener("click", () => {
      const selectedSeason = document.querySelector('#semester-options input[name="semester"]:checked')?.value;
      const selectedYear = document.getElementById("year-started")?.value;
    
      if (!selectedSeason || !selectedYear) {
        alert("Please select both a semester and a year to remove.");
        return;
      }
    
      const fullSemester = `${selectedSeason} ${selectedYear}`;
      const index = v.addedSemesters.indexOf(fullSemester);
      if (index === -1) {
        alert(`${fullSemester} is not currently added.`);
        return;
      }
    
      // Remove the column
      const col = document.querySelector(`.semester-column[data-semester="${index + 1}"]`);
      if (col) col.remove();
    
      // Remove associated courses
      for (let i = placed.length - 1; i >= 0; i--) {
        if (placed[i].semester === index + 1) {
          const course = placed[i];
          const sourceCol = v.sourceContainer.querySelector(`.source-column[data-type="${course.type}"]`);
          if (sourceCol) {
            const existing = sourceCol.querySelector(`[data-course-id='${course.id}']`);
            if (!existing) {
              const div = document.createElement("div");
              div.className = "course-box";
              div.textContent = course.id;
              div.dataset.courseId = course.id;
              div.setAttribute("draggable", true);
              div.addEventListener("dragstart", e => e.dataTransfer.setData("text/plain", course.id));
              div.addEventListener("click", () => v.highlightPrereqs(course.id, placed));
              sourceCol.appendChild(div);
            } else {
              existing.classList.remove("grayed-out");
            }
          }
          placed.splice(i, 1);
        }
      }
    
      // Update state and reindex
      v.addedSemesters.splice(index, 1);
      v.reindexSemesters();

      // 🔁 Update all placed course semester numbers after the removed semester
for (let i = 0; i < placed.length; i++) {
  if (placed[i].semester > index + 1) {
    placed[i].semester -= 1;
  }
}

    
      reEnableDropZones();
    });

    const grouped = {
      csc: enriched.filter(c => c.type === 'csc'), // Core courses
      mat: enriched.filter(c => c.type === 'mat'), // Math courses
      csc400: enriched.filter(c => c.type === 'csc400'), // Elective courses
      science: enriched.filter(c => c.type === 'science'), // Science courses
      communication: enriched.filter(c => c.type === 'communication'), // Communication courses
      fye: enriched.filter(c => c.type === 'fye'), // First Year Experience (FYE) courses
    };
    

    v.renderCourseSources(grouped);
    reEnableDropZones();

    document.getElementById("save-btn").addEventListener("click", async () => {
      const semesters = [];

      v.addedSemesters.forEach((semesterLabel, index) => {
        const col = document.getElementById(`semester-${index + 1}`);
        if (!col) return;

        const selected = Array.from(col.querySelectorAll(".course-box")).map(box =>
          box.textContent.trim()
        );

        if (selected.length > 0) {
          semesters.push({
            term: semesterLabel,
            id: (index + 1).toString(),
            selected
          });
        }
      });

      console.log("Sending payload:", JSON.stringify({ semesters }, null, 2));

      if (semesters.length === 0) {
        alert("⚠️ No courses selected!");
        return;
      }

      try {
        const res = await fetch("/api/saveCourses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ semesters })
        });

        const result = await res.json();

        if (result.success) {
          alert("✅ Courses saved successfully!");
        } else {
          alert("⚠️ Save failed: " + (result.error || "Unknown error"));
        }
      } catch (err) {
        console.error("Save failed:", err);
        alert("❌ An error occurred while saving.");
      }
    });

    document.getElementById("load-btn").addEventListener("click", async () => {
      try {
        const res = await fetch("/api/getCourses");
        const semesters = await res.json();

        console.log("📦 Loaded semesters from server:", semesters);

        if (!Array.isArray(semesters)) throw new Error("Invalid data format");

        placed.length = 0;
        v.addedSemesters = [];
        v.semestersContainer.innerHTML = "";

        semesters.forEach(sem => {
          const semesterLabel = sem.term;

          if (v.addedSemesters.includes(semesterLabel)) return;

          const col = document.createElement("div");
          col.className = "semester-column";
          col.id = `semester-${v.addedSemesters.length + 1}`;
          col.dataset.semester = v.addedSemesters.length + 1;
          col.innerHTML = `<h3>${semesterLabel}</h3>`;
          v.semestersContainer.appendChild(col);

          sem.selected.forEach(courseId => {
            const course = m.getCourseById(courseId);
            if (course) {
              placed.push({ ...course, semester: parseInt(sem.id) });
              v.addCourseToSemester(course, v.addedSemesters.length + 1);
            }
          });

          v.addedSemesters.push(semesterLabel);
        });

        reEnableDropZones();
        v.currentIndex = v.semesterOptions.indexOf(semesters[semesters.length - 1].term);

      } catch (err) {
        console.error("❌ Load failed:", err);
      }
    });
  })
  .catch(err => {
    console.error("Error loading courses:", err);
  });