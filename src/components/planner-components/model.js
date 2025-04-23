export default class Model {
  constructor(courses) {
    this.courses = courses;
  }

  getGroupedCourses() {
    return {
      csc: this.courses.filter(c => c.requirement === "core"), // Core courses
      mat: this.courses.filter(c => c.requirement === "math"), // Math courses
      csc400: this.courses.filter(c => c.requirement === "elective"), // Elective courses
      science: this.courses.filter(c => c.requirement === "science"), // Science courses
      communication: this.courses.filter(c => c.requirement === "communication"), // Communication courses
      fye: this.courses.filter(c => c.requirement === "FYE") // First Year Experience (FYE) courses
    };
  }
  
  

  getCourseById(id) {
    return this.courses.find(course => course.id === id);
  }
}
