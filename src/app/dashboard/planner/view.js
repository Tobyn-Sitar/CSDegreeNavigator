import * as d3 from "d3";

export default class View {
  constructor() {
    this.semestersContainer = document.getElementById("semester-container");
    this.sourceContainer = document.getElementById("source-container");

    // All semesters available
    this.semesterOptions = [
      'Fall 2019', 'Winter 2019', 'Spring 2020', 'Summer 2020',
      'Fall 2020', 'Winter 2020', 'Spring 2021', 'Summer 2021',
      'Fall 2021', 'Winter 2021', 'Spring 2022', 'Summer 2022',
      'Fall 2022', 'Winter 2022', 'Spring 2023', 'Summer 2023',
      'Fall 2023', 'Winter 2023', 'Spring 2024', 'Summer 2024',
      'Fall 2024', 'Winter 2024', 'Spring 2025', 'Summer 2025',
      'Fall 2025', 'Winter 2025', 'Spring 2026', 'Summer 2026'
    ];

    this.yearStarted = "Fall 2021";
    this.currentIndex = this.semesterOptions.indexOf(this.yearStarted);
    this.addedSemesters = [];

    this.getYearStarted();
  }

  // Get user’s starting year
  async getYearStarted() {
    try {
      const res = await fetch("/api/getYearStarted");
      const data = await res.json();
      if (data.yearStarted && this.semesterOptions.includes(data.yearStarted)) {
        this.yearStarted = data.yearStarted;
        this.currentIndex = this.semesterOptions.indexOf(this.yearStarted);
      }
    } catch (err) {
      console.error("Error getting year started:", err);
    }
  }

  // Add semester column based on season
  addSemesterBySeason(season, placedCourses = []) {
    for (let i = this.currentIndex + 1; i < this.semesterOptions.length; i++) {
      if (this.semesterOptions[i].startsWith(season)) {
        const semesterLabel = this.semesterOptions[i];
        if (this.addedSemesters.includes(semesterLabel)) return;

        const col = document.createElement("div");
        col.className = "semester-column";
        col.id = `semester-${this.addedSemesters.length + 1}`;
        col.dataset.semester = this.addedSemesters.length + 1;
        col.innerHTML = `<h3>${semesterLabel}</h3>`;
        this.semestersContainer.appendChild(col);

        this.addedSemesters.push(semesterLabel);
        this.currentIndex = i;
        break;
      }
    }
  }

  // Redraw all semester columns and refill any saved courses
  renderSemesters(num, placedCourses = []) {
    this.semestersContainer.innerHTML = "";
    for (let i = 1; i <= num; i++) {
      const col = document.createElement("div");
      col.className = "semester-column";
      col.id = `semester-${i}`;
      col.dataset.semester = i;
      col.innerHTML = `<h3>Semester ${i}</h3>`;
      this.semestersContainer.appendChild(col);
    }

    placedCourses.forEach(course => {
      if (course.semester <= num) {
        this.addCourseToSemester(course, course.semester);
      }
    });
  }

  // Show orange highlight on prereqs
  highlightPrereqs(courseId, placedCourses) {
    document.querySelectorAll(".course-box").forEach(el => {
      el.style.backgroundColor = "";
    });

    const course = placedCourses.find(c => c.id === courseId);
    if (!course) return;

    course.prerequisites.forEach(prereqId => {
      const el = document.querySelector(`[data-course-id="${prereqId}"]`);
      if (el) el.style.backgroundColor = "orange";
    });
  }

  // Show draggable course tiles by type (CSC, MAT, etc.)
  renderCourseSources(groupedCourses) {
    this.sourceContainer.innerHTML = "";

    for (const [group, list] of Object.entries(groupedCourses)) {
      const wrapper = document.createElement("div");
      wrapper.className = "source-wrapper";

      const header = document.createElement("h3");
      header.className = "source-title";
      header.textContent = group.toUpperCase();

      const column = document.createElement("div");
      column.className = "source-column";
      column.dataset.type = group;

      list.forEach(course => {
        const div = document.createElement("div");
        div.className = "course-box";
        div.textContent = course.id;
        div.setAttribute("draggable", true);
        div.dataset.courseId = course.id;

        div.addEventListener("dragstart", e => {
          e.dataTransfer.setData("text/plain", course.id);
        });

        div.addEventListener("click", () => {
          const allCourses = Object.values(groupedCourses).flat();
          this.highlightPrereqs(course.id, allCourses);
        });

        column.appendChild(div);
      });

      wrapper.appendChild(header);
      wrapper.appendChild(column);
      this.sourceContainer.appendChild(wrapper);
    }
  }

  // Let semesters accept dragged course boxes
  enableDropZones(onDrop) {
    const cols = document.querySelectorAll(".semester-column");
    cols.forEach(col => {
      col.addEventListener("dragover", e => e.preventDefault());
      col.addEventListener("drop", e => {
        e.preventDefault();
        const courseId = e.dataTransfer.getData("text/plain");
        onDrop(courseId, parseInt(col.dataset.semester));
      });
    });
  }

  // Put a course into a semester (limit to 6 max)
  addCourseToSemester(course, semesterNum) {
    const col = document.getElementById(`semester-${semesterNum}`);
    if (!col) return;

    // Stop if already added
    if (col.querySelector(`[data-course-id="${course.id}"]`)) return;

    // Stop if semester is full
    if (col.querySelectorAll(".course-box").length >= 6) {
      const msg = document.createElement("div");
      msg.className = "prereq-popup";
      msg.textContent = `Semester ${semesterNum} already has 6 courses`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);
      return;
    }

    const div = document.createElement("div");
    div.className = "course-box";
    div.textContent = course.id;
    div.dataset.courseId = course.id;
    div.setAttribute("draggable", true);

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", course.id);
    });

    div.addEventListener("click", () => {
      if (this.placedCourses) {
        this.highlightPrereqs(course.id, this.placedCourses);
      }
    });

    div.addEventListener("dblclick", () => {
      div.remove();
    });

    col.appendChild(div);
  }

  // D3 lines between prereqs and course
  drawD3Lines(placedCourses) {
    const svg = d3.select("#line-layer");
    svg.selectAll("*").remove();

    const getCenter = (el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + rect.height / 2 + window.scrollY
      };
    };

    placedCourses.forEach(course => {
      const targetEl = document.querySelector(`[data-course-id="${course.id}"]`);
      if (!targetEl) return;

      const target = getCenter(targetEl);

      course.prerequisites.forEach(prId => {
        const prereq = placedCourses.find(c => c.id === prId);
        const prereqEl = document.querySelector(`[data-course-id="${prId}"]`);
        if (!prereq || !prereqEl) return;

        const source = getCenter(prereqEl);

        svg.append("line")
          .attr("x1", source.x)
          .attr("y1", source.y)
          .attr("x2", target.x)
          .attr("y2", target.y)
          .attr("stroke", "#888")
          .attr("stroke-width", 2);
      });
    });
  }
}
