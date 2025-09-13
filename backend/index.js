import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Get directory path for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// MongoDB connection (optional - we'll serve JSON files directly for hackathon speed)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// ===== API ENDPOINTS =====

// GET /api/issues - Returns issues data
app.get("/api/issues", (req, res) => {
  try {
    const issuesPath = path.join(__dirname, "data", "issues.json");
    const issuesData = JSON.parse(fs.readFileSync(issuesPath, "utf8"));
    res.json(issuesData);
  } catch (error) {
    console.error("Error reading issues.json:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// GET /api/reports - Returns combined issues + report details
app.get("/api/reports", (req, res) => {
  try {
    const issuesPath = path.join(__dirname, "data", "issues.json");
    const reportsPath = path.join(__dirname, "data", "reportDetails.json");
    
    const issuesData = JSON.parse(fs.readFileSync(issuesPath, "utf8"));
    const reportsData = JSON.parse(fs.readFileSync(reportsPath, "utf8"));
    
    // Combine issues with report details
    const combinedRows = issuesData.rows.map(issue => {
      const reportDetail = reportsData.reports.find(r => r.id === issue.id);
      return {
        ...issue,
        description: reportDetail?.description || "No description available",
        assistantEngineer: reportDetail?.assistantEngineer || "Not assigned",
        juniorEngineer: reportDetail?.juniorEngineer || "Not assigned"
      };
    });

    res.json({
      labels: {
        id: "ID",
        subject: "Subject", 
        address: "Address",
        date: "Date",
        priority: "Priority",
        status: "Status",
        description: "Description",
        assistantEngineer: "Assistant Engineer",
        juniorEngineer: "Junior Engineer"
      },
      rows: combinedRows,
      reports: combinedRows // For backward compatibility
    });
  } catch (error) {
    console.error("Error reading report files:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Health check
app.get("/", (req, res) => res.send("NagarSeva Backend is running! 🚀"));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Issues API: http://localhost:${PORT}/api/issues`);
  console.log(`📋 Reports API: http://localhost:${PORT}/api/reports`);
});
