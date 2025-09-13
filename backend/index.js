import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import reportRoutes from "./routes/reportRoutes.js";
import issuesRoutes from "./routes/issues.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ----- MongoDB connection -----
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// ----- Routes -----
app.use("/api/reports", reportRoutes);
app.use("/api/issues", issuesRoutes);

app.get("/", (req, res) => res.send("Backend is running!"));

// ----- Start server -----
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
