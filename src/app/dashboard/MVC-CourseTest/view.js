import * as d3 from "d3";

export default class View {
  constructor() {
    this.semestersContainer = document.getElementById("semester-container");
    this.sourceContainer = document.getElementById("source-container");
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
  

  
  


  highlightPrereqs(courseId, placedCourses) {

    document.querySelectorAll(".course-box").forEach(el => {
      el.style.backgroundColor = "";
    });

    const course = placedCourses.find(c => c.id === courseId);
    if (!course) return;
  
    course.prerequisites.forEach(prereqId => {
      const prereqEl = document.querySelector(`[data-course-id='${prereqId}']`);
      if (prereqEl) {
        prereqEl.style.backgroundColor = "orange";
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
            const children = Array.from(column.querySelectorAll(".course-box"));
            const insertBefore = children.find(child => child.dataset.courseId > courseId);
            if (insertBefore) {
              column.insertBefore(droppedEl, insertBefore);
            } else {
              column.appendChild(droppedEl);
            }
          } else {
            droppedEl.remove();
          }
        }
      });

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
    const existing = col.querySelector(`[data-course-id='${course.id}']`);
    if (existing) return;

    const currentEl = document.querySelector(`[data-course-id='${course.id}']`);
    if (currentEl) currentEl.remove();

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
      const currentParent = div.parentElement;
      const isInSource = currentParent?.classList.contains("source-column");
      if (isInSource) return;

      const sourceCol = this.sourceContainer.querySelector(`.source-column[data-type='${course.type}']`);
      if (sourceCol) {
        const alreadyThere = sourceCol.querySelector(`[data-course-id='${course.id}']`);
        if (!alreadyThere) {
          const children = Array.from(sourceCol.querySelectorAll(".course-box"));
          const insertBefore = children.find(child => child.dataset.courseId > course.id);
          if (insertBefore) {
            sourceCol.insertBefore(div, insertBefore);
          } else {
            sourceCol.appendChild(div);
          }
        } else {
          div.remove();
        }
      }
    });

    col.appendChild(div);
  }

  drawLines(placedCourses) {
    const existingLines = document.querySelectorAll(".connector-line");
    existingLines.forEach(line => line.remove());

    placedCourses.forEach(course => {
      const targetBox = document.querySelector(`[data-course-id='${course.id}']`)?.getBoundingClientRect();
      if (!targetBox) return;

      course.prerequisites.forEach(prereqId => {
        const prereq = placedCourses.find(c => c.id === prereqId);
        const prereqBox = document.querySelector(`[data-course-id='${prereqId}']`)?.getBoundingClientRect();
        if (!prereq || !prereqBox) return;

        const line = document.createElement("div");
        line.className = "connector-line";
        line.style.position = "absolute";
        line.style.background = "red";
        line.style.width = "2px";
        line.style.height = `${Math.abs(targetBox.top - prereqBox.bottom)}px`;
        line.style.left = `${prereqBox.left + prereqBox.width / 2}px`;
        line.style.top = `${Math.min(prereqBox.bottom, targetBox.top)}px`;
        document.body.appendChild(line);
      });
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
        if (!prereq) return;

        const prereqEl = document.querySelector(`[data-course-id='${prId}']`);
        if (!prereqEl) return;

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
  drawD3Lines(placedCourses) {
    const svg = d3.select("#line-layer");
    svg.selectAll("*").remove(); // Clear previous lines
  
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
  
      course.prerequisites.forEach(prereqId => {
        const prereq = placedCourses.find(c => c.id === prereqId);
        const prereqEl = document.querySelector(`[data-course-id='${prereqId}']`);
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
