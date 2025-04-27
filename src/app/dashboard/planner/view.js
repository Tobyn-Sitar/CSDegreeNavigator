import * as d3 from "d3";

export default class View {
  constructor() {
    this.semestersContainer = document.getElementById("semester-container");
    this.sourceContainer = document.getElementById("source-container");
    this.addedSemesters = []; 
    this.currentlyHighlightedCourseId = null;
  }

  renderCourseBox(course) {
    const div = document.createElement("div");
    div.className = "course-box";
    div.textContent = course.id;
    div.dataset.courseId = course.id;
    div.setAttribute("draggable", true);

    if (course.tooltipInfo) {
      div.title = `${course.tooltipInfo.title}\n` +
        (course.tooltipInfo.offerings.length > 0
          ? course.tooltipInfo.offerings.map(offering => `
${offering.term}
Campus: ${offering.campus}
Instructor(s): ${offering.instructors}
Days: ${offering.meetingDays}
Time: ${offering.meetingStartTime} - ${offering.meetingEndTime}`).join("\n")
          : "No offerings available");
    }

    div.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", course.id);
    });

    div.addEventListener("click", () => {
      const allCourses = Object.values(window.allCourses || []);
      if (this.highlightPrereqs && allCourses.length > 0) {
        this.highlightPrereqs(course.id, allCourses);
      }
    });

    return div;
  }

  renderSemesters(semesterLabels = [], placedCourses = []) {
    this.semestersContainer.innerHTML = "";

    semesterLabels.forEach((semesterLabel) => {
      const col = document.createElement("div");
      col.className = "semester-column";
      col.dataset.label = semesterLabel;
      col.innerHTML = `<h3>${semesterLabel}</h3>`;
      this.semestersContainer.appendChild(col);
    });

    placedCourses.forEach(course => {
      const semesterCol = [...this.semestersContainer.querySelectorAll('.semester-column')]
        .find(col => col.querySelector("h3")?.textContent === course.semesterLabel);
      if (semesterCol) {
        this.addCourseToSemester(course, semesterCol);
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
          const alreadyThere = column.querySelector(`[data-course-id="${courseId}"]`);
          if (!alreadyThere) {
            column.appendChild(droppedEl);
          } else {
            droppedEl.remove();
          }
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

  addCourseToSemester(course, semesterCol) {
    if (!semesterCol) return;

    const existing = semesterCol.querySelector(`[data-course-id='${course.id}']`);
    if (existing) return;

    const courseBox = this.renderCourseBox(course);
    semesterCol.appendChild(courseBox);
  }

  enableDropZones(onDrop) {
    const cols = document.querySelectorAll(".semester-column");
    cols.forEach(col => {
      col.addEventListener("dragover", e => e.preventDefault());
      col.addEventListener("drop", e => {
        e.preventDefault();
        const semesterLabel = col.querySelector("h3")?.textContent;
        const courseId = e.dataTransfer.getData("text/plain");
        if (semesterLabel) {
          onDrop(courseId, semesterLabel);
        }
      });
    });
  }

  highlightPrereqs(courseId, placedCourses) {
    document.querySelectorAll(".course-box").forEach(el => {
      el.style.backgroundColor = "";
    });

    if (this.currentlyHighlightedCourseId === courseId) {
      this.currentlyHighlightedCourseId = null;
      return;
    }

    this.currentlyHighlightedCourseId = courseId;

    const highlightRecursive = (id, depth = 0) => {
      const course = placedCourses.find(c => c.id === id);
      if (!course) return;

      const courseEl = document.querySelector(`[data-course-id='${course.id}']`);
      if (!courseEl) return;

      if (depth === 0) {
        courseEl.style.backgroundColor = "rgba(75, 0, 130, 0.8)";
      } else {
        courseEl.style.backgroundColor = `rgba(128, 0, 128, ${0.4 / depth})`;
      }

      course.prerequisites.forEach(prereqId => {
        highlightRecursive(prereqId, depth + 1);
      });
    };

    highlightRecursive(courseId);
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
