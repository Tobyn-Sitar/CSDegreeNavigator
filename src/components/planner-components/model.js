export default class Model {
  constructor(courses) {
    this.courses = courses;
  }

  getGroupedCourses() {
    return {
      csc: this.courses.filter(c => c.id.startsWith("CSC") && !c.id.startsWith("CSC4")),
      mat: this.courses.filter(c => c.id.startsWith("MAT")),
      csc400: this.courses.filter(c => c.id.startsWith("CSC4")),
    };
  }

  getCourseById(id) {
    return this.courses.find(course => course.id === id);
  }
}
