import express from "express";
import Issue from "../models/Issue.js";

const router = express.Router();

// ✅ GET all issues
router.get("/", async (req, res) => {
  try {
    const issues = await Issue.find();
    // Map MongoDB fields to expected frontend format
    const rows = issues.map(issue => ({
      id: issue.id,
      subject: issue.subject,
      address: issue.address,
      date: issue.date,
      priority: issue.priority,
      status: issue.status,
      report: issue.report || null // if you have a report field
    }));

    res.json({
      labels: {
        id: "ID",
        subject: "Subject",
        address: "ADDRESS",
        date: "DATE",
        priority: "PRIORITY",
        status: "STATUS",
        report: "REPORT",
      },
      rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;