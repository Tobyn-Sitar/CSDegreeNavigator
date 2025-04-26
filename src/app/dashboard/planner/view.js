import * as d3 from "d3";

export default class View {
  constructor() {
    this.semestersContainer = document.getElementById("semester-container");
    this.sourceContainer = document.getElementById("source-container");
    
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
    this.currentlyHighlightedCourseId = null;
  }

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

  addSemesterByLabel(semesterLabel, placedCourses = []) {
    if (this.addedSemesters.includes(semesterLabel)) return;

    const col = document.createElement("div");
    col.className = "semester-column";
    col.id = `semester-${this.addedSemesters.length + 1}`;
    col.dataset.semester = this.addedSemesters.length + 1;
    col.innerHTML = `<h3>${semesterLabel}</h3>`;

    this.semestersContainer.appendChild(col);
    this.addedSemesters.push(semesterLabel);
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
          const alreadyThere = column.querySelector(`[data-course-id="${courseId}"]`);
          if (!alreadyThere) {
            column.appendChild(droppedEl);
          } else {
            droppedEl.remove();
          }
        }
      });

      list.forEach(course => {
        const div = document.createElement("div");
        div.className = "course-box";
        div.textContent = course.tooltipInfo ? `${course.id} ✳️` : course.id;
        div.title = course.tooltipInfo
  ? (course.tooltipInfo.offerings.length > 0
      ? course.tooltipInfo.offerings.map(offering => `
${offering.term}
Instructor(s): ${offering.instructors}
Start: ${offering.startOn}
End: ${offering.endOn}
Days: ${offering.meetingDays}
Time: ${offering.meetingStartTime} - ${offering.meetingEndTime}
`).join("\n")
      : "No offerings available")
  : "";


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

  addCourseToSemester(course, semesterNum) {
    const col = document.getElementById(`semester-${semesterNum}`);
    if (!col) return;
  
    const existing = col.querySelector(`[data-course-id='${course.id}']`);
    if (existing) return;
  
    const courseCount = col.querySelectorAll(".course-box").length;
    if (courseCount >= 6) {
      const msg = document.createElement("div");
      msg.className = "prereq-popup";
      msg.textContent = `Semester ${semesterNum} already has 6 courses`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);
      return;
    }
  
    const div = document.createElement("div");
    div.className = "course-box";
    div.textContent = course.tooltipInfo ? `${course.id} ✳️` : course.id;
  
    div.title = course.tooltipInfo
  ? (course.tooltipInfo.offerings.length > 0
      ? course.tooltipInfo.offerings.map(offering => `
${offering.term}
Instructor(s): ${offering.instructors}
Start: ${offering.startOn}
End: ${offering.endOn}
Days: ${offering.meetingDays}
Time: ${offering.meetingStartTime} - ${offering.meetingEndTime}
`).join("\n")
      : "No offerings available")
  : "";

  
    div.setAttribute("draggable", true);
    div.dataset.courseId = course.id;
  
    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", course.id);
    });
  
    col.appendChild(div);
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
      let opacity = 1 - depth * 0.3;
      courseEl.style.backgroundColor = `rgba(128, 0, 128, ${opacity})`;
    }

    course.prerequisites.forEach(prereqId => {
      this.highlightPrereqs(prereqId, placedCourses, depth + 1, visited);
    });
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
          .attr("stroke", "#d00")
          .attr("stroke-width", 2);
      });
    });
  }
}
