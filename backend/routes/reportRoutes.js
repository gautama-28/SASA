const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single report
router.get('/:id', async (req, res) => {
  try {
    const report = await Report.findOne({ id: req.params.id });
    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new report
router.post('/', async (req, res) => {
  const report = new Report(req.body);
  try {
    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
