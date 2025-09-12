// backend/routes/reports.js
const express = require("express");
const router = express.Router();

// Sample data (replace with database query if needed)
const reports = [
  {
    id: "R001",
    subject: "Street light not working",
    address: "MG Road, City",
    date: "2025-09-10T10:30:00Z",
    priority: "High",
    status: "Processing",
    assistantEngineer: "John Doe",
    juniorEngineer: "Jane Smith",
    description: "Street light near MG Road not working since 3 days",
  },
  {
    id: "R002",
    subject: "Pothole on Main Street",
    address: "Main Street, City",
    date: "2025-09-08T09:15:00Z",
    priority: "Medium",
    status: "Completed",
    assistantEngineer: "Alice",
    juniorEngineer: "Bob",
    description: "Large pothole on Main Street repaired",
  },
];

router.get("/", (req, res) => {
  res.json({ reports }); // send data in JSON format
});

module.exports = router;
