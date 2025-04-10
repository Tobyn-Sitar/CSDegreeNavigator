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

        v.renderSemesters();

        const grouped = {
            csc: enriched.filter(c => c.type === 'csc'),
            mat: enriched.filter(c => c.type === 'mat'),
            csc400: enriched.filter(c => c.type === 'csc400'),
        };

        v.renderCourseGroups(grouped, course => {
            m.markCourseSelected(course.id);
            v.addCourseToSemester(course);
        });

        v.enableDragAndDrop();
    });
