import mongoose, { Schema, models } from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  user: { type: String, default: "Anonymous" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Feedback = models.Feedback || mongoose.model('Feedback', feedbackSchema, 'feedback');
export default Feedback;
