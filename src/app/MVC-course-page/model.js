
export default class model {
    constructor(courseData) {
        this.courses = courseData;
        this.selectedCourses = [];
    }

    getCoursesByType(type) {
        return this.courses.filter(course => course.type === type);
    }

    getCourseById(id) {
        return this.courses.find(course => course.id === id);
    }

    markCourseSelected(courseId) {
        if (!this.selectedCourses.includes(courseId)) {
            this.selectedCourses.push(courseId);
        }
    }

    getSelectedCourses() {
        return this.selectedCourses.map(id => this.getCourseById(id));
    }
}
