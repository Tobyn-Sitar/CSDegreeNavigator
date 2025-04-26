import model from './model.js';
import view from './view.js';

async function fetchCourses() {
  const [coursesRes, extraDataRes] = await Promise.all([
    fetch('/courses.json'),
    fetch('/api/getCourseData')
  ]);

  const courses = await coursesRes.json();
  const courseData = await extraDataRes.json();

  return courses.map(course => {
    let type = 'other';
    if (course.id.startsWith('CSC4')) type = 'csc400';
    else if (course.id.startsWith('CSC')) type = 'csc';
    else if (course.id.startsWith('MAT')) type = 'mat';

    // Filter all offerings for this course
    const matches = courseData.filter(cd => cd.courseNumber === course.id.slice(3));

    // If no matches at all
    if (matches.length === 0) {
      return {
        ...course,
        type,
        defaultSemester: 1,
        tooltipInfo: {
          title: course.id,
          offerings: []
        }
      };
    }

    // map offerings
    const offerings = matches.map(match => {
      const instructorNames = match.instructors?.length
        ? match.instructors.map(i => `${i.instructorFirstName} ${i.instructorLastName}`).join(", ")
        : "TBD";
    
      const firstMeeting = match.meetingTimes?.[0] ?? {};
    
      const days = [
        firstMeeting.meetingMondayIndicator ? "M" : "",
        firstMeeting.meetingTuesdayIndicator ? "T" : "",
        firstMeeting.meetingWednesdayIndicator ? "W" : "",
        firstMeeting.meetingThursdayIndicator ? "R" : "",
        firstMeeting.meetingFridayIndicator ? "F" : "",
        firstMeeting.meetingSaturdayIndicator ? "S" : "",
        firstMeeting.meetingSundayIndicator ? "U" : ""
      ].join("");
    
      function formatTime(military) {
        if (!military) return "TBD";
        const hours = Math.floor(parseInt(military) / 100);
        const minutes = parseInt(military) % 100;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
      }
    
      return {
        term: match.termCode === "202530" ? "Spring 2025" : "Fall 2025",
        instructors: instructorNames,
        startOn: match.startOn ?? "TBD",
        endOn: match.endOn ?? "TBD",
        meetingDays: days || "TBD",
        meetingStartTime: formatTime(firstMeeting.meetingBeginTime),
        meetingEndTime: formatTime(firstMeeting.meetingEndTime)
      };
    });
    
    

    // Remove duplicate offerings (optional improvement)
    const seen = new Set();
    const uniqueOfferings = offerings.filter(offering => {
      const key = `${offering.term}-${offering.instructors}-${offering.startOn}-${offering.endOn}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return {
      ...course,
      type,
      defaultSemester: 1,
      tooltipInfo: {
        title: matches[0]?.courseTitle ?? course.id,
        offerings: uniqueOfferings
      }
    };
  });
}

fetchCourses()
  .then(data => {
    const m = new model(data);
    const v = new view('semester-container', 'checkbox-area');
    const placed = [];

    const seasonOffsets = {
      'Fall': 0,
      'Winter': 1,
      'Spring': 2,
      'Summer': 3,
    };

    function semesterSortKey(label) {
      const [term, yearString] = label.trim().split(' ');
      let year = parseInt(yearString);
      if (term === 'Fall') year += 1;
      return year + seasonOffsets[term] * 0.1;
    }

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
      v.addedSemesters.sort((a, b) => semesterSortKey(a) - semesterSortKey(b));

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

      const col = document.getElementById(`semester-${indexToRemove + 1}`);
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

    document.getElementById("remove-last-semester-btn").addEventListener("click", () => {
      const lastSemester = v.addedSemesters.pop();
      if (!lastSemester) {
        alert("No semesters to remove.");
        return;
      }
      const indexToRemove = v.addedSemesters.length;
      const col = document.getElementById(`semester-${indexToRemove + 1}`);
      if (col) col.remove();

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
          alert(`❌ ${course.id} cannot be moved past prerequisite courses.`);
          return;
        }

        const prereqViolated = course.prerequisites.some(prereqId => {
          const prereq = placed.find(c => c.id === prereqId);
          if (prereq) return prereq.semester >= semesterNum;
          return false;
        });

        if (prereqViolated) {
          alert(`❌ ${course.id} cannot be taken before its prerequisites.`);
          return;
        }

        placed.push({ ...course, semester: semesterNum });
        v.addCourseToSemester(course, semesterNum);
      });
    }

    const grouped = {
      csc: data.filter(c => c.type === 'csc'),
      mat: data.filter(c => c.type === 'mat'),
      csc400: data.filter(c => c.type === 'csc400'),
    };

    v.renderCourseSources(grouped);
    reEnableDropZones();

    document.getElementById("save-btn").addEventListener("click", async () => {
      try {
        const semesters = [];

        v.addedSemesters.forEach((semesterLabel, index) => {
          const col = document.getElementById(`semester-${index + 1}`);
          if (!col) return;

          const selected = Array.from(col.querySelectorAll(".course-box")).map(box =>
            box.textContent.replace("✳️", "").trim()
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

        const res = await fetch("/api/saveCourses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ semesters }),
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

        if (!Array.isArray(semesters)) throw new Error("Invalid data format");

        placed.length = 0;
        v.addedSemesters = [];
        v.semestersContainer.innerHTML = "";

        semesters.forEach((sem, idx) => {
          const semesterLabel = sem.term;

          if (v.addedSemesters.includes(semesterLabel)) return;

          const col = document.createElement("div");
          col.className = "semester-column";
          col.id = `semester-${idx + 1}`;
          col.dataset.semester = idx + 1;
          col.innerHTML = `<h3>${semesterLabel}</h3>`;
          v.semestersContainer.appendChild(col);

          v.addedSemesters.push(semesterLabel);

          sem.selected.forEach(courseId => {
            const course = m.getCourseById(courseId);
            if (course) {
              placed.push({ ...course, semester: idx + 1 });
              v.addCourseToSemester(course, idx + 1);
            }
          });
        });

        reEnableDropZones();

      } catch (err) {
        console.error("Load failed:", err);
        alert("Failed to load saved courses.");
      }
    });

  })
  .catch(err => {
    console.error("Error loading courses:", err);
  });
