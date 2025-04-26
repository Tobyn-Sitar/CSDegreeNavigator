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
              match.termCode === "202520" ? "Summer 2025" :
              match.termCode === "202530" ? "Fall 2025" :
              match.termCode === "202540" ? "Winter 2025" :
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

    function semesterSortKey(label) {
      const [term, yearString] = label.trim().split(' ');
      let year = parseInt(yearString);

      const termOffsets = {
        'Fall': 0.0,
        'Winter': 0.3,
        'Spring': 0.4,
        'Summer': 0.5,
      };

      if (term === 'Winter') {
        year += 1; // Winter is early next year
      }

      if (term === 'Fall') {
        year += 1; // Fall shifts year ahead
      }

      return year + (termOffsets[term] || 0);
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

      v.renderSemesters(v.addedSemesters, placed);
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

      const index = v.addedSemesters.indexOf(semesterLabel);
      if (index === -1) {
        alert("Semester not found.");
        return;
      }

      v.addedSemesters.splice(index, 1);
      v.renderSemesters(v.addedSemesters, placed);
      reEnableDropZones();
    });

    document.getElementById("remove-last-semester-btn").addEventListener("click", () => {
      v.addedSemesters.pop();
      v.renderSemesters(v.addedSemesters, placed);
      reEnableDropZones();
    });

    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterLabel) => {
        const course = m.getCourseById(courseId);
        if (!course) return;

        const current = placed.find(c => c.id === courseId);
        if (current) {
          current.semesterLabel = semesterLabel;
        } else {
          placed.push({ ...course, semesterLabel });
        }
        v.renderSemesters(v.addedSemesters, placed);
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
      const semesters = [];

      v.addedSemesters.forEach((semesterLabel) => {
        const col = [...v.semestersContainer.querySelectorAll(".semester-column")]
          .find(col => col.querySelector('h3')?.textContent === semesterLabel);

        if (!col) return;

        const selected = Array.from(col.querySelectorAll(".course-box")).map(box =>
          box.textContent.trim()
        );

        if (selected.length > 0) {
          semesters.push({
            term: semesterLabel,
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
        v.addedSemesters = semesters.map(s => s.term);
        v.renderSemesters(v.addedSemesters);

        semesters.forEach((sem) => {
          sem.selected.forEach(courseId => {
            const course = m.getCourseById(courseId);
            if (course) {
              placed.push({ ...course, semesterLabel: sem.term });
            }
          });
        });

        v.renderSemesters(v.addedSemesters, placed);
        reEnableDropZones();
      } catch (err) {
        console.error("❌ Load failed:", err);
      }
    });

  })
  .catch(err => {
    console.error("Error loading courses:", err);
  });
