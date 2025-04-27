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
        title: matches[0]?.courseTitle || course.title || course.id,
        offerings: offerings.length > 0 ? offerings : []
      }
    };    
  });
}

fetchCourses()
  .then(data => {
    const m = new model(data);
    const v = new view('semester-container', 'checkbox-area');
    const placed = [];
    v.placedCourses = placed;

    document.getElementById("add-semester-btn").addEventListener("click", () => {
      const selectedSeason = document.querySelector('#semester-options input[name="semester"]:checked')?.value;
      const selectedYear = document.getElementById("year-started")?.value;
      if (!selectedSeason || !selectedYear) {
        alert("Please select both a semester and a year.");
        return;
      }
    
      const fullSemester = `${selectedSeason} ${selectedYear}`;
      if (v.addedSemesters.includes(fullSemester)) {
        alert("Semester already added.");
        return;
      }
    
      v.addSemesterAtEnd(fullSemester);
      reEnableDropZones();
    });
    
    document.getElementById("remove-semester-btn").addEventListener("click", () => {
      const selectedSeason = document.querySelector('#semester-options input[name="semester"]:checked')?.value;
      const selectedYear = document.getElementById("year-started")?.value;
      if (!selectedSeason || !selectedYear) {
        alert("Please select both a semester and a year to remove.");
        return;
      }
    
      const fullSemester = `${selectedSeason} ${selectedYear}`;
      v.removeSemesterByName(fullSemester);
      reEnableDropZones();
    });

    function reEnableDropZones() {
      v.enableDropZones((courseId, semesterNum) => {
        const course = m.getCourseById(courseId);
        if (!course) return;
        const current = placed.find(c => c.id === courseId);
        if (current) {
          current.semester = semesterNum;
        } else {
          placed.push({ ...course, semester: semesterNum });
        }
        v.renderSemesters(v.addedSemesters.length, placed);
      });
    }

    const grouped = m.getGroupedCourses();


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
        if (!Array.isArray(semesters)) throw new Error("Invalid data format");

        placed.length = 0;
        v.addedSemesters = [];
        v.semestersContainer.innerHTML = "";

        semesters.forEach(sem => {
          const semesterLabel = sem.term;
          v.addSemesterAtEnd(semesterLabel);
          sem.selected.forEach(courseId => {
            const course = m.getCourseById(courseId);
            if (course) {
              placed.push({ ...course, semester: v.addedSemesters.length });
              v.addCourseToSemester(course, v.addedSemesters.length);
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
