import model from './model.js';
import view from './view.js';

fetch('/courses.json')
  .then(res => res.json())
  .then(data => {
    const enriched = data.map(c => {
      let type = 'other';
      if (c.id.startsWith('CSC4')) type = 'csc400';
      else if (c.id.startsWith('CSC')) type = 'csc';
      else if (c.id.startsWith('MAT')) type = 'mat';
      return { ...c, type, defaultSemester: 1 };
    });

    const m = new model(enriched);
    const v = new view('semester-container', 'checkbox-area');
    const placed = [];

    v.renderSemesters();

    const grouped = {
      csc: enriched.filter(c => c.type === 'csc'),
      mat: enriched.filter(c => c.type === 'mat'),
      csc400: enriched.filter(c => c.type === 'csc400'),
    };

    v.renderCourseSources(grouped);
    v.enableDropZones((courseId, semesterNum) => {
      const course = m.getCourseById(courseId);
      if (!course) return;

      const prereqViolated = course.prerequisites.some(pr => {
        const prereq = placed.find(c => c.id === pr);
        return !prereq || prereq.semester >= semesterNum;
      });

      if (prereqViolated) {
        const msg = document.createElement("div");
        msg.className = "prereq-popup";
        msg.textContent = `❌ ${course.id} cannot be taken before its prerequisite(s).`;
      
        document.body.appendChild(msg);
        setTimeout(() => msg.remove(), 3000);
        return;
      }
          

      placed.push({ ...course, semester: semesterNum });
      v.addCourseToSemester(course, semesterNum);
    });

    // THIS MAKE THE BUTTON WORK
    document.getElementById("check-compatibility-btn").addEventListener("click", () => {
      v.drawD3Lines(placed); 
    });
  });
