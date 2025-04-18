// models/users.js

import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    // Modified "taken" to use array of structured entries
    taken: {
      type: [
        {
          term: String,
          id: String,
          selected: [String]
        }
      ],
      default: []
    },
    timeRestrictions: {
      type: [
        {
          day: String,
          startTime: String,
          endTime: String
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

const User = models.User || mongoose.model("User", userSchema);
export default User;
