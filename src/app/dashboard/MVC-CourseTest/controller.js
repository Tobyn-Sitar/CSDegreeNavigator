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
    const v = new view();
    const placed = [];

    v.renderSemesters();

    const grouped = {
      csc: enriched.filter(c => c.type === 'csc'),
      mat: enriched.filter(c => c.type === 'mat'),
      csc400: enriched.filter(c => c.type === 'csc400'),
    };

    v.renderCourseSources(grouped);

    v.enableDropZones((courseId, semesterNum) => {
      const course = m.getCourseById(courseId);
      if (!course) return;

      const prereqViolated = course.prerequisites.some(pr => {
        const prereq = placed.find(c => c.id === pr);
        return !prereq || prereq.semester >= semesterNum;
      });

      if (prereqViolated) {
        const msg = document.createElement("div");
        msg.className = "prereq-popup";
        msg.textContent = `❌ ${course.id} cannot be taken before its prerequisite(s).`;

        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
        return;
      }

      placed.push({ ...course, semester: semesterNum });
      v.addCourseToSemester(course, semesterNum);
    });

    // ✅ SAVE BUTTON HANDLER
    const saveButton = document.getElementById("save-button");
    if (saveButton) {
      saveButton.addEventListener("click", async () => {
        const semesters = [];

        for (let i = 1; i <= 15; i++) {
          const col = document.getElementById(`semester-${i}`);
          const selected = Array.from(col.querySelectorAll(".course-box")).map(box =>
            box.textContent.trim()
          );

          if (selected.length > 0) {
            semesters.push({
              term: `Semester ${i}`,
              id: i.toString(),
              selected
            });
          }
        }

        try {
          const res = await fetch("/api/saveCourses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ semesters }) // no email needed
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
    }
  });
