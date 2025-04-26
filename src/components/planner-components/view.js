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

    //this.yearStarted = "Fall 2021";
    //this.currentIndex = this.semesterOptions.indexOf(this.yearStarted);
    this.addedSemesters = []; 
    this.currentlyHighlightedCourseId = null;


    //this.getYearStarted();
  }

  insertSemesterAt(label, position) {
    const col = document.createElement("div");
    col.className = "semester-column";
    col.id = `semester-${position + 1}`;
    col.dataset.semester = position + 1;
    col.innerHTML = `<h3>${label}</h3>`;
  
    // Insert before correct column
    const referenceCol = this.semestersContainer.children[position];
    this.semestersContainer.insertBefore(col, referenceCol);
    this.addedSemesters.splice(position, 0, label);
  
    // Reindex columns
    this.reindexSemesters();
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
  
  reindexSemesters() {
    const columns = this.semestersContainer.querySelectorAll(".semester-column");
    columns.forEach((col, idx) => {
      col.id = `semester-${idx + 1}`;
      col.dataset.semester = idx + 1;
      const header = col.querySelector("h3");
      if (header) header.textContent = this.addedSemesters[idx];
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
  
    
    const courseCount = col.querySelectorAll(".course-box").length;
  
   
    if (courseCount >= 6) {
      const msg = document.createElement("div");
      msg.className = "prereq-popup";
      msg.textContent = `Semester ${semesterNum} already has 6 courses`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 2500);
      return; 
    }
  

    const currentEl = document.querySelector(`[data-course-id='${course.id}']`);
    if (currentEl) {
      const isInSource = currentEl.parentElement?.classList.contains("source-column");
      if (isInSource) {
        currentEl.classList.add("grayed-out");
      } else {
        currentEl.remove();
      }
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
      const currentParent = div.parentElement;
      const isInSource = currentParent?.classList.contains("source-column");
      if (isInSource) return;
  
      const sourceCol = this.sourceContainer.querySelector(`.source-column[data-type='${course.type}']`);
      if (sourceCol) {
        const sourceCopy = sourceCol.querySelector(`[data-course-id='${course.id}']`);
        if (sourceCopy) {
          sourceCopy.classList.remove("grayed-out"); 
        }
  
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