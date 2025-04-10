export default class view {
    constructor(containerId, checkboxAreaId) {
        this.container = document.getElementById(containerId);
        this.checkboxArea = document.getElementById(checkboxAreaId);
    }

    renderSemesters(num = 7) {
        for (let i = 1; i <= num; i++) {
            const col = document.createElement('div');
            col.className = 'semester-column';
            col.id = `semester-${i}`;
            col.innerHTML = `<h3>Semester ${i}</h3>`;
            this.container.appendChild(col);
        }
    }

    renderCourseCheckboxes(courses, onCheckCallback) {
        this.checkboxArea.innerHTML = '';
        courses.forEach(course => {
            const label = document.createElement('label');
            label.innerHTML = `
                <input type="checkbox" value="${course.id}" />
                ${course.id} - ${course.name}
            `;
            label.querySelector('input').addEventListener('change', e => {
                if (e.target.checked) {
                    if (!document.querySelector(`[data-course-id="${course.id}"]`)) {
                        onCheckCallback(course);
                    }
                } else {
                    const existing = document.querySelector(`[data-course-id="${course.id}"]`);
                    if (existing) existing.remove();
                }
            });
            this.checkboxArea.appendChild(label);
        });
    }

    renderCourseGroups(groupedCourses, onCheckCallback) {
        this.checkboxArea.innerHTML = ''; // Clear old

        for (const [groupName, courseList] of Object.entries(groupedCourses)) {
            const section = document.createElement('div');
            section.className = 'course-group';

            const header = document.createElement('h3');
            header.textContent = groupName.toUpperCase();
            section.appendChild(header);

            courseList.forEach(course => {
                const label = document.createElement('label');
                label.innerHTML = `
                    <input type="checkbox" value="${course.id}" />
                    ${course.id} - ${course.name}
                `;
                const checkbox = label.querySelector('input');
                checkbox.addEventListener('change', e => {
                    if (e.target.checked) {
                        if (!document.querySelector(`[data-course-id="${course.id}"]`)) {
                            onCheckCallback(course);
                        }
                    } else {
                        const existing = document.querySelector(`[data-course-id="${course.id}"]`);
                        if (existing) existing.remove();
                    }
                });
                section.appendChild(label);
            });

            this.checkboxArea.appendChild(section);
        }
    }

    addCourseToSemester(course, semesterNum = null) {
        const div = document.createElement('div');
        div.className = 'course-box';
        div.textContent = `${course.id}`;
        div.setAttribute('draggable', true);
        div.dataset.courseId = course.id;
    
        // Drag-and-drop setup
        div.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', course.id);
        });
    
        // Double-click to remove tile + uncheck its checkbox
        div.addEventListener('dblclick', () => {
            div.remove(); // Remove the visual tile
            const checkbox = document.querySelector(`input[type="checkbox"][value="${course.id}"]`);
            if (checkbox) checkbox.checked = false; // Uncheck the corresponding box
        });
    
        if (!semesterNum) semesterNum = course.defaultSemester || 1;
        const semCol = document.getElementById(`semester-${semesterNum}`);
        semCol.appendChild(div);
    }
    

    enableDragAndDrop() {
        const semesterCols = document.querySelectorAll('.semester-column');

        semesterCols.forEach(col => {
            col.addEventListener('dragover', e => {
                e.preventDefault();
                col.style.backgroundColor = '#e6f7ff'; // Optional highlight
            });

            col.addEventListener('dragleave', () => {
                col.style.backgroundColor = ''; // Reset highlight
            });

            col.addEventListener('drop', e => {
                e.preventDefault();
                const courseId = e.dataTransfer.getData('text/plain');
                const courseBox = document.querySelector(`[data-course-id="${courseId}"]`);
                if (courseBox && col !== courseBox.parentElement) {
                    col.appendChild(courseBox);
                }
                col.style.backgroundColor = '';
            });
        });
    }
}
