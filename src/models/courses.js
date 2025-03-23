import mongoose, { Schema, models } from 'mongoose';

const courseSchema = new mongoose.Schema({
  courseNumber: { type: String, required: true },
  courseTitle: { type: String, required: true },
  actualEnrollment: { type: Number, required: true },
  instructors: [
    {
      instructorFirstName: { type: String, required: true },
      instructorLastName: { type: String, required: true },
    },
  ],
  startOn: { type: String, required: true },
  endOn: { type: String, required: true },
});


const Course = models.Course || mongoose.model('Course', courseSchema, 'course_data');
export default Course;
