export default class Model {
  constructor(courses) {
    this.courses = courses;
  }

  getGroupedCourses() {
    return {
      csc: this.courses.filter(c => c.id.startsWith("CSC") && !c.id.startsWith("CSC4")),
      math: this.courses.filter(c => c.id.startsWith("MAT") || c.id.startsWith("STA")),
      csc400: this.courses.filter(c => c.id.startsWith("CSC4")),
      fye: this.courses.filter(c => c.id.startsWith("FYE")),
      communication: this.courses.filter(c => c.id.startsWith("SPK") || c.id.startsWith("ENG")),
      science: this.courses.filter(c => c.id.startsWith("PHY") || c.id.startsWith("ESS") || c.id.startsWith("BIO") || c.id.startsWith("CRL") || c.id.startsWith("CHE"))
    };
  }

  getCourseById(id) {
    return this.courses.find(course => course.id === id);
  }
}
