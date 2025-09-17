import express from "express";
import Report from "../models/report.js";

const router = express.Router();

// Save report (from Interview.jsx Stop button)
router.post("/report", async (req, res) => {
  try {
    const { duration, suspiciousEvents, integrityScore, logs, candidateName } =
      req.body;

    const report = new Report({
      candidateName,
      duration,
      suspiciousEvents,
      integrityScore,
      logs,
    });

    await report.save();

    res.json({ success: true, report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to save report" });
  }
});

// Fetch latest report
router.get("/report", async (req, res) => {
  try {
    const report = await Report.findOne().sort({ createdAt: -1 }); // latest
    if (!report) {
      return res.json({ success: false, message: "No report found" });
    }
    res.json({ success: true, ...report._doc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error fetching report" });
  }
});

export default router;
