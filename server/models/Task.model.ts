import mongoose from "mongoose";

// task schema
const schema: mongoose.Schema = new mongoose.Schema(
  {
    text: {
      type: String,
      requied: true,
    },
    completed: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("task", schema);
