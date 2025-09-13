// models/Report.js
import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String }, // You can map 'subject' from issues.json to 'title' here
  description: { type: String, required: true },
  priority: { type: String, enum: ["Low", "Medium", "High", "Highest"], default: "Low" },
  status: { type: String, enum: ["Open", "Processing", "In Progress", "Resolved", "Completed", "Rejected"], default: "Open" },
  address: { type: String },
  date: { type: Date },
  lat: { type: Number },
  lng: { type: Number },
  assistantEngineer: { type: String },
  juniorEngineer: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model("Report", reportSchema);
export default Report;