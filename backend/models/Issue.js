// models/Issue.js
import mongoose from "mongoose";

const issueSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  subject: { type: String, required: true },
  address: { type: String, required: true },
  date: { type: Date, required: true },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Highest"], // keep Highest if data has it
    default: "Low",
  },
  status: {
    type: String,
    enum: ["Processing", "Completed", "Rejected"], // matches your dataset
    default: "Processing",
  },
  lat: { type: Number, required: false }, // optional
  lng: { type: Number, required: false }, // optional
});

const Issue = mongoose.model("Issue", issueSchema);
export default Issue;
