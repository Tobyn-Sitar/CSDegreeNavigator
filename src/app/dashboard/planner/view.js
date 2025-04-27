import * as d3 from "d3";

export default class View {
  constructor() {
    this.semestersContainer = document.getElementById("semester-container");
    this.sourceContainer = document.getElementById("source-container");

    this.semesterOptions = [
      'Fall 2018', 'Winter 2018', 'Spring 2019', 'Summer 2019',
      'Fall 2019', 'Winter 2019', 'Spring 2020', 'Summer 2020',
      'Fall 2020', 'Winter 2020', 'Spring 2021', 'Summer 2021',
      'Fall 2021', 'Winter 2021', 'Spring 2022', 'Summer 2022',
      'Fall 2022', 'Winter 2022', 'Spring 2023', 'Summer 2023',
      'Fall 2023', 'Winter 2023', 'Spring 2024', 'Summer 2024',
      'Fall 2024', 'Winter 2024', 'Spring 2025', 'Summer 2025',
      'Fall 2025', 'Winter 2025', 'Spring 2026', 'Summer 2026'
    ];

    this.addedSemesters = [];
    this.currentlyHighlightedCourseId = null;
  }

  highlightPrereqs(courseId, placedCourses, depth = 0, visited = new Set()) {
    if (depth === 0) {
      if (this.currentlyHighlightedCourseId === courseId) {
        this.currentlyHighlightedCourseId = null;
        document.querySelectorAll(".course-box").forEach(el => {
          el.style.backgroundColor = "";
        });
        return;
      } else {
        this.currentlyHighlightedCourseId = courseId;
        document.querySelectorAll(".course-box").forEach(el => {
          el.style.backgroundColor = "";
        });
      }
    }

    if (visited.has(courseId)) return;
    visited.add(courseId);

    const course = placedCourses.find(c => c.id === courseId);
    if (!course) return;

    const courseEl = document.querySelector(`[data-course-id='${course.id}']`);
    if (courseEl) {
      let opacity;
      if (depth === 0) opacity = 1;
      else if (depth === 1) opacity = 0.6;
      else if (depth === 2) opacity = 0.3;
      else opacity = 0.15;

      courseEl.style.backgroundColor = `rgba(128, 0, 128, ${opacity})`;
    }

    course.prerequisites.forEach(prereqId => {
      this.highlightPrereqs(prereqId, placedCourses, depth + 1, visited);
    });
  }

  
  addSemesterAtEnd(label) {
    const col = document.createElement("div");
    col.className = "semester-column";
    col.id = `semester-${this.addedSemesters.length + 1}`;
    col.dataset.semester = this.addedSemesters.length + 1;
    col.innerHTML = `<h3>${label}</h3>`;

    this.semestersContainer.appendChild(col);
    this.addedSemesters.push(label);

    this.reindexSemesters();
  }

  removeLastSemester() {
    if (this.addedSemesters.length === 0) return;

    this.addedSemesters.pop();
    const lastCol = this.semestersContainer.lastElementChild;
    if (lastCol) lastCol.remove();

    this.reindexSemesters();
  }

  removeSemesterByName(label) {
    const index = this.addedSemesters.indexOf(label);
    if (index === -1) return;

    const col = document.getElementById(`semester-${index + 1}`);
    if (col) col.remove();

    this.addedSemesters.splice(index, 1);
    this.reindexSemesters();
  }

  reindexSemesters() {
    const columns = this.semestersContainer.querySelectorAll(".semester-column");
    columns.forEach((col, idx) => {
      col.id = `semester-${idx + 1}`;
      col.dataset.semester = idx + 1;
      const header = col.querySelector("h3");
      if (header) header.textContent = this.addedSemesters[idx] || `Semester ${idx + 1}`;
    });
  }

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

  renderCourseSources(groupedCourses) {
    this.sourceContainer.innerHTML = "";

    window.allCourses = Object.values(groupedCourses).flat();

    for (const [group, list] of Object.entries(groupedCourses)) {
      const wrapper = document.createElement("div");
      wrapper.className = "source-wrapper";

      const header = document.createElement("h3");
      header.className = "source-title";
      header.textContent = group.toUpperCase();

      const column = document.createElement("div");
      column.className = "source-column";
      column.dataset.type = group;

      column.addEventListener("dragover", e => e.preventDefault());
      column.addEventListener("drop", e => {
        e.preventDefault();
        const courseId = e.dataTransfer.getData("text/plain");
        const droppedEl = document.querySelector(`[data-course-id="${courseId}"]`);
        if (droppedEl) {
          column.appendChild(droppedEl);
        }
      });

      list.forEach(course => {
        const courseBox = this.renderCourseBox(course);
        column.appendChild(courseBox);
      });

      wrapper.appendChild(header);
      wrapper.appendChild(column);
      this.sourceContainer.appendChild(wrapper);
    }
  }

  renderCourseBox(course) {
    const div = document.createElement("div");
    div.className = "course-box";
    div.textContent = course.id;
    div.dataset.courseId = course.id;
    div.setAttribute("draggable", true);

    if (course.tooltipInfo) {
      const springFallOfferings = course.tooltipInfo.offerings.filter(offering =>
        offering.term === "Spring 2025" || offering.term === "Fall 2025"
      );
    
      if (springFallOfferings.length > 0) {
        div.title = `${course.tooltipInfo.title}\n` +
          springFallOfferings.map(offering => 
            `\n${offering.term}\nCampus: ${offering.campus}\nInstructor(s): ${offering.instructors}\nDays: ${offering.meetingDays}\nTime: ${offering.meetingStartTime} - ${offering.meetingEndTime}`
          ).join("\n");
      } else {
        div.title = `${course.tooltipInfo.title}\nNo Spring 2025 or Fall 2025 offering available.`;
      }
    }
    

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", course.id);
    });

    div.addEventListener("click", (e) => {
      if (this.placedCourses && this.placedCourses.length > 0) {
        this.highlightPrereqs(course.id, this.placedCourses);
      }
    });

    return div;
  }

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

  addCourseToSemester(course, semesterNum) {
    const col = document.getElementById(`semester-${semesterNum}`);
    if (!col) return;

    const existing = col.querySelector(`[data-course-id='${course.id}']`);
    if (existing) return;

    const courseBox = this.renderCourseBox(course);
    col.appendChild(courseBox);
  }

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
      const targetEl = document.querySelector(`[data-course-id='${course.id}']`);
      if (!targetEl) return;

      const target = getCenter(targetEl);

      course.prerequisites.forEach(prId => {
        const prereq = placedCourses.find(c => c.id === prId);
        const prereqEl = document.querySelector(`[data-course-id='${prId}']`);
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
