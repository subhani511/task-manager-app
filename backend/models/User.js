import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // hashed
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// virtual to easily populate a user's tasks when needed
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id",
  foreignField: "user",
});

export default mongoose.model("User", userSchema);
