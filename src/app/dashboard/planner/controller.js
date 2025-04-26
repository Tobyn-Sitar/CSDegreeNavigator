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

    const matches = courseData.filter(cd => cd.courseNumber === course.id.slice(3));
    if (!matches.length) {
      return { ...course, type, defaultSemester: 1 };
    }

    const offerings = matches.map(match => {
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
        term: match.termCode === "202510" ? "Spring 2025" :
              match.termCode === "202530" ? "Fall 2025" :
              "Unknown",
        instructors: match.instructors?.map(i => `${i.instructorFirstName} ${i.instructorLastName}`).join(", ") ?? "TBD",
        campus: match.campus ?? "TBD",
        meetingDays: days || "TBD",
        meetingStartTime: formatTime(firstMeeting.meetingBeginTime),
        meetingEndTime: formatTime(firstMeeting.meetingEndTime)
      };
    });

    return {
      ...course,
      type,
      defaultSemester: 1,
      tooltipInfo: {
        title: matches[0].courseTitle,
        offerings
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

    // ✅ Add Semester
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

      const col = document.createElement("div");
      col.className = "semester-column";
      col.innerHTML = `<h3>${semesterLabel}</h3>`;
      col.dataset.semester = v.addedSemesters.length;
      col.id = `semester-${v.addedSemesters.length}`;

      // Insert sorted
      let inserted = false;
      const allCols = Array.from(v.semestersContainer.querySelectorAll('.semester-column'));
      for (let existing of allCols) {
        const label = existing.querySelector('h3')?.textContent;
        if (semesterSortKey(semesterLabel) < semesterSortKey(label)) {
          v.semestersContainer.insertBefore(col, existing);
          inserted = true;
          break;
        }
      }
      if (!inserted) {
        v.semestersContainer.appendChild(col);
      }

      reEnableDropZones();
    });

    // ✅ Remove Semester
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

      const columns = [...v.semestersContainer.querySelectorAll(".semester-column")];
      for (const col of columns) {
        const h3 = col.querySelector("h3");
        if (h3 && h3.textContent === semesterLabel) {
          col.remove();
          break;
        }
      }

      v.addedSemesters.splice(indexToRemove, 1);

      // Fix semester IDs after removal
      const updatedCols = [...v.semestersContainer.querySelectorAll(".semester-column")];
      updatedCols.forEach((col, idx) => {
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
      });

      reEnableDropZones();
    });

    // ✅ Remove Last Semester
    document.getElementById("remove-last-semester-btn").addEventListener("click", () => {
      if (v.addedSemesters.length === 0) {
        alert("No semesters to remove.");
        return;
      }

      const lastSemester = v.addedSemesters.pop();
      const columns = [...v.semestersContainer.querySelectorAll(".semester-column")];
      for (const col of columns) {
        const h3 = col.querySelector("h3");
        if (h3 && h3.textContent === lastSemester) {
          col.remove();
          break;
        }
      }

      const updatedCols = [...v.semestersContainer.querySelectorAll(".semester-column")];
      updatedCols.forEach((col, idx) => {
        col.id = `semester-${idx + 1}`;
        col.dataset.semester = idx + 1;
      });

      reEnableDropZones();
    });

    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterNum) => {
        const course = m.getCourseById(courseId);
        if (!course) return;

        const existing = document.querySelector(`[data-course-id="${courseId}"]`);
        if (existing) {
          const parent = existing.closest(".semester-column");
          if (parent) {
            existing.remove();
          }
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

    // ✅ Save
    document.getElementById("save-btn").addEventListener("click", async () => {
      try {
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

    // ✅ Load
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
        console.error("❌ Load failed:", err);
      }
    });

  })
  .catch(err => {
    console.error("Error loading courses:", err);
  });
