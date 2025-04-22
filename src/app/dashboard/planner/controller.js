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

    document.getElementById("add-semester-btn").addEventListener("click", () => {
      const checkboxes = document.querySelectorAll('#semester-options input[name="semester"]:checked');
    
      checkboxes.forEach((checkbox) => {
        const season = checkbox.value;
        v.addSemesterBySeason(season);
      });
    
      reEnableDropZones();
    });




    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterNum) => {
        const course = m.getCourseById(courseId);
        if (!course) return;
      
        // Get the current semester of the course, if it has been placed
        const currentSemester = placed.find(c => c.id === courseId)?.semester;
      
        // **Allow moving to the original semester (if course was already moved back)**
        if (currentSemester === semesterNum) {
          placed.push({ ...course, semester: semesterNum });
          v.addCourseToSemester(course, semesterNum);
          return;
        }
      
        // **Prevent placing a course in the same semester or a later semester if it's already in a later one**
        if (currentSemester && currentSemester <= semesterNum) {
          const msg = document.createElement("div");
          msg.className = "prereq-popup";
          msg.textContent = `❌ ${course.id} cannot be moved past the courses it serves as a prerequisite for.`;
      
          document.body.appendChild(msg);
          setTimeout(() => msg.remove(), 3000);
          return;
        }
      
        // Check if prerequisites are violated
        const prereqViolated = course.prerequisites.some(pr => {
          const prereq = placed.find(c => c.id === pr);
          return !prereq || prereq.semester >= semesterNum;
        });
      
        if (prereqViolated) {
          // Gather all prerequisites that should not be overlapped with the current course
          const conflictingPrereqs = course.prerequisites.map(prId => {
            const prereq = placed.find(c => c.id === prId);
            return prereq ? prereq.id : null;
          }).filter(id => id !== null); // Filter out null values (in case a prereq is not yet placed)
    
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

    document.getElementById("remove-semester-btn").addEventListener("click", () => {
      const lastSemester = v.addedSemesters[v.addedSemesters.length - 1];
      if (!lastSemester) {
        alert("No semesters to remove.");
        return;
      }

      const indexToRemove = v.addedSemesters.length - 1;
      const col = document.querySelector(`.semester-column[data-semester="${indexToRemove + 1}"]`);
      if (col) col.remove();

      for (let i = placed.length - 1; i >= 0; i--) {
        if (placed[i].semester === indexToRemove + 1) {
          placed.splice(i, 1);
        }
      }

      v.addedSemesters.pop();

      const lastAdded = v.addedSemesters[v.addedSemesters.length - 1];
      if (lastAdded) {
        v.currentIndex = v.semesterOptions.indexOf(lastAdded);
      } else {
        v.currentIndex = v.semesterOptions.indexOf(v.yearStarted); // Reset if none left
      }

      const columns = v.semestersContainer.querySelectorAll(".semester-column");
      columns.forEach((col, idx) => {
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
        const header = col.querySelector("h3");
        if (header) header.textContent = v.addedSemesters[idx];
      });

      reEnableDropZones();
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