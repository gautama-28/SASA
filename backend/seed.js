import mongoose from "mongoose";
import dotenv from "dotenv";
import Issue from "./models/Issue.js";
import fs from "fs";

dotenv.config();

// Load JSON files
const issues = JSON.parse(fs.readFileSync("./data/issues.json", "utf-8"));
const details = JSON.parse(fs.readFileSync("./data/reportDetails.json", "utf-8"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const seedIssues = async () => {
  try {
    await Issue.deleteMany({}); // Clear old issues

    // Merge issues + details with defaults
    const merged = issues.rows.map((row) => {
      const extra = details.reports.find((d) => d.id === row.id) || {};

      return {
        id: row.id,
        subject: row.subject || extra.subject || "Untitled",
        address: row.address || extra.address || "Not provided",
        date: row.date ? new Date(row.date) : new Date(),
        priority: row.priority || extra.priority || "Low",
        status: row.status || extra.status || "Processing",
        lat: row.lat || extra.lat || null,
        lng: row.lng || extra.lng || null,
      };
    });

    await Issue.insertMany(merged);
    console.log("✅ Database seeded with issues");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding issues:", err);
    mongoose.disconnect();
  }
};

seedIssues();
