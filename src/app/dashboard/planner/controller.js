import model from './model.js';
import view from './view.js';

fetch('/courses.json')
  .then(res => res.json())
  .then(data => {
    const enriched = data.map(c => {
      let type = 'other';
      if (c.id.startsWith('CSC4')) type = 'csc400';
      else if (c.id.startsWith('CSC')) type = 'csc';
      else if (c.id.startsWith('MAT')) type = 'mat';
      return { ...c, type, defaultSemester: 1 };
    });

    const m = new model(enriched);
    const v = new view('semester-container', 'checkbox-area');
    const placed = [];

    const semesterOrder = ['Fall', 'Winter', 'Spring', 'Summer'];
    function semesterSortKey(label) {
      const [term, year] = label.split(' ');
      return [parseInt(year), semesterOrder.indexOf(term)];
    }

    // ✅ Add Semester with Ordered Insert
    document.getElementById("add-semester-btn").addEventListener("click", () => {
      const year = document.getElementById("select-year").value;
      const checked = document.querySelector('#semester-options input[name="semester"]:checked');

      if (!checked) {
        alert("Please select a semester (Fall, Winter, Spring, Summer).");
        return;
      }

      const season = checked.value;
      const semesterLabel = `${season} ${year}`;

      if (v.addedSemesters.includes(semesterLabel)) {
        alert("Semester already exists.");
        return;
      }

      v.addedSemesters.push(semesterLabel);
      v.addedSemesters.sort((a, b) => {
        const [ay, at] = a.split(" ");
        const [by, bt] = b.split(" ");
        return semesterSortKey(a).toString().localeCompare(semesterSortKey(b).toString());
      });

      // Re-render all semesters in correct order
      v.semestersContainer.innerHTML = "";
      v.addedSemesters.forEach((label, idx) => {
        const col = document.createElement("div");
        col.className = "semester-column";
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
        col.innerHTML = `<h3>${label}</h3>`;
        v.semestersContainer.appendChild(col);
      });

      reEnableDropZones();
    });

    // ✅ Remove Specific Semester
    document.getElementById("remove-semester-btn").addEventListener("click", () => {
      const year = document.getElementById("select-year").value;
      const checked = document.querySelector('#semester-options input[name="semester"]:checked');

      if (!checked) {
        alert("Please select a semester to remove.");
        return;
      }

      const season = checked.value;
      const semesterLabel = `${season} ${year}`;

      const indexToRemove = v.addedSemesters.indexOf(semesterLabel);
      if (indexToRemove === -1) {
        alert("Semester not found.");
        return;
      }

      const col = document.querySelector(`.semester-column[data-semester="${indexToRemove + 1}"]`);
      if (col) col.remove();

      v.addedSemesters.splice(indexToRemove, 1);

      const columns = v.semestersContainer.querySelectorAll(".semester-column");
      columns.forEach((col, idx) => {
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
        const header = col.querySelector("h3");
        if (header) header.textContent = v.addedSemesters[idx];
      });

      reEnableDropZones();
    });

    // ✅ Remove Last Added Semester
    document.getElementById("remove-last-semester-btn").addEventListener("click", () => {
      const lastSemester = v.addedSemesters[v.addedSemesters.length - 1];
      if (!lastSemester) {
        alert("No semesters to remove.");
        return;
      }

      const indexToRemove = v.addedSemesters.length - 1;
      const col = document.querySelector(`.semester-column[data-semester="${indexToRemove + 1}"]`);
      if (col) col.remove();

      v.addedSemesters.pop();

      const columns = v.semestersContainer.querySelectorAll(".semester-column");
      columns.forEach((col, idx) => {
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
        const header = col.querySelector("h3");
        if (header) header.textContent = v.addedSemesters[idx];
      });

      reEnableDropZones();
    });

    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterNum) => {
        const course = m.getCourseById(courseId);
        if (!course) return;

        const currentSemester = placed.find(c => c.id === courseId)?.semester;

        if (currentSemester === semesterNum) {
          placed.push({ ...course, semester: semesterNum });
          v.addCourseToSemester(course, semesterNum);
          return;
        }

        if (currentSemester && currentSemester <= semesterNum) {
          const msg = document.createElement("div");
          msg.className = "prereq-popup";
          msg.textContent = `❌ ${course.id} cannot be moved past the courses it serves as a prerequisite for.`;
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 3000);
          return;
        }

        const prereqViolated = course.prerequisites.some(pr => {
          const prereq = placed.find(c => c.id === pr);
          return !prereq || prereq.semester >= semesterNum;
        });

        if (prereqViolated) {
          const conflictingPrereqs = course.prerequisites.map(prId => {
            const prereq = placed.find(c => c.id === prId);
            return prereq ? prereq.id : null;
          }).filter(id => id !== null);

          const msg = document.createElement("div");
          msg.className = "prereq-popup";
          msg.textContent = `❌ ${course.id} cannot be taken before its prerequisite(s): ${conflictingPrereqs.join(', ')}.`;
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 3000);
          return;
        }

        placed.push({ ...course, semester: semesterNum });
        v.addCourseToSemester(course, semesterNum);
      });
    }

    const grouped = {
      csc: enriched.filter(c => c.type === 'csc'),
      mat: enriched.filter(c => c.type === 'mat'),
      csc400: enriched.filter(c => c.type === 'csc400'),
    };

    v.renderCourseSources(grouped);
    reEnableDropZones();

    // ✅ Save
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

    // ✅ Load
    document.getElementById("load-btn").addEventListener("click", async () => {
      try {
        const res = await fetch("/api/getCourses");
        const semesters = await res.json();

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
      } catch (err) {
        console.error("❌ Load failed:", err);
      }
    });
  })
  .catch(err => {
    console.error("Error loading courses:", err);
  });
