import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    taken: { type: Object, default: {} }, // Survey-collected completed courses
    timeRestrictions: { type: Array, default: [] }, // [{ day: "Monday", startTime: "1:00 PM", endTime: "3:00 PM" }]
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;