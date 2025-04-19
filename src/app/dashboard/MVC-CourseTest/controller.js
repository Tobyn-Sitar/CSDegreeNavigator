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
    let numOfSemesters = 0;


    function reEnableDropZones() {
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
    }

document.getElementById("add-semester-btn").addEventListener("click", async () => {
  numOfSemesters += 1;
  v.renderSemesters(numOfSemesters, placed); 
  reEnableDropZones();
});

document.getElementById("remove-semester-btn").addEventListener("click", async () => {
  if (numOfSemesters > 0) {
    
    const removedCourses = placed.filter(c => c.semester === numOfSemesters);

 
    for (let i = placed.length - 1; i >= 0; i--) {
      if (placed[i].semester === numOfSemesters) {
        placed.splice(i, 1);
      }
    }

   
    removedCourses.forEach(course => {
      const sourceCol = document.querySelector(`.source-column[data-type='${course.type}']`);
      if (sourceCol) {
        const div = document.createElement("div");
        div.className = "course-box";
        div.textContent = course.id;
        div.dataset.courseId = course.id;
        div.setAttribute("draggable", "true");

        div.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", course.id);
        });

        div.addEventListener("click", () => {
          const allCourses = Object.values(grouped).flat();
          v.highlightPrereqs(course.id, allCourses);
        });

        sourceCol.appendChild(div);
      }
    });

   
    numOfSemesters -= 1;
    v.renderSemesters(numOfSemesters, placed);
    reEnableDropZones();
  }
});



  
    const grouped = {
      csc: enriched.filter(c => c.type === 'csc'),
      mat: enriched.filter(c => c.type === 'mat'),
      csc400: enriched.filter(c => c.type === 'csc400'),
    };

    v.renderCourseSources(grouped);
    reEnableDropZones(); 

    document.getElementById("save-btn").addEventListener("click", async () => {
      const semesters = [];

      for (let i = 1; i <= numOfSemesters; i++) {
        const col = document.getElementById(`semester-${i}`);
        if (!col) continue;

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
    

        semesters.forEach(sem => {
          sem.selected.forEach(courseId => {
            const course = m.getCourseById(courseId);
            if (course) {
              placed.push({ ...course, semester: parseInt(sem.id) });
            }
          });
        });
    
     
        numOfSemesters = Math.max(...placed.map(c => c.semester), 0);
    

        v.renderSemesters(numOfSemesters, placed);
        reEnableDropZones();
    
   
        const loadedCourseIds = new Set();
    
        semesters.forEach(semester => {
          const col = document.getElementById(`semester-${semester.id}`);
          if (!col) return;
    
          const header = col.querySelector("h3");
          col.innerHTML = "";
          if (header) col.appendChild(header);
    
          semester.selected.forEach(courseName => {
            const box = document.createElement("div");
            box.classList.add("course-box");
            box.setAttribute("draggable", "true");
            box.textContent = courseName;
            box.dataset.courseId = courseName;
            col.appendChild(box);
    
            loadedCourseIds.add(courseName);
    
            box.addEventListener("dragstart", e => {
              e.dataTransfer.setData("text/plain", courseName);
            });
    
            box.addEventListener("dblclick", () => {
              const currentParent = box.parentElement;
              const isInSource = currentParent?.classList.contains("source-column");
              if (isInSource) return;
    
              const sourceCol = document.querySelector(`.source-column[data-type='${courseName.slice(0, 3)}']`);
              if (sourceCol) {
                const alreadyThere = sourceCol.querySelector(`[data-course-id='${courseName}']`);
                if (!alreadyThere) {
                  const children = Array.from(sourceCol.querySelectorAll(".course-box"));
                  const insertBefore = children.find(child => child.dataset.courseId > courseName);
                  if (insertBefore) {
                    sourceCol.insertBefore(box, insertBefore);
                  } else {
                    sourceCol.appendChild(box);
                  }
                } else {
                  box.remove();
                }
              }
            });
          });
        });
    
        const sourceContainer = document.getElementById("source-container");
        if (sourceContainer) {
          const allCourseBoxes = sourceContainer.querySelectorAll(".course-box");
          allCourseBoxes.forEach(box => {
            const courseId = box.dataset.courseId?.trim();
            if (loadedCourseIds.has(courseId)) {
              box.remove();
            }
          });
        }
    
      } catch (err) {
        console.error("❌ Load failed:", err);
      }
    });
    
  });
