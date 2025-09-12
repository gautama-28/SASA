const mongoose = require('mongoose');
const Report = require('./models/Report');
require('dotenv').config();
const issues = require('./data/issues.json');
const details = require('./data/reportDetails.json');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const seedReports = async () => {
  try {
    await Report.deleteMany({}); // Clear existing
    const reports = issues.rows.map(row => {
      const extra = details.reports.find(d => d.id === row.id) || {};
      return { ...row, ...extra };
    });
    await Report.insertMany(reports);
    console.log('Database seeded');
    mongoose.disconnect();
  } catch (err) {
    console.log(err);
  }
};

seedReports();
