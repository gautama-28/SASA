import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

// GET all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find();
    const rows = reports.map(report => ({
      id: report.id,
      title: report.title || report.subject,
      description: report.description,
      priority: report.priority,
      status: report.status,
      address: report.address,
      date: report.date,
      lat: report.lat,
      lng: report.lng,
      assistantEngineer: report.assistantEngineer,
      juniorEngineer: report.juniorEngineer,
      createdAt: report.createdAt
    }));

    res.json({
      labels: {
        id: "ID",
        title: "Title",
        description: "Description",
        priority: "Priority",
        status: "Status",
        address: "Address",
        date: "Date",
        lat: "Latitude",
        lng: "Longitude",
        assistantEngineer: "Assistant Engineer",
        juniorEngineer: "Junior Engineer",
        createdAt: "Created At"
      },
      rows
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;