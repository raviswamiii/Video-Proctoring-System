import logModel from "../models/log.js";

export const getReport = async (req, res) => {
  try {
    const log = await log.findById(req.params.id);
    if (!log) return res.status(404).json({success: false, error: "Report not found" });

    const focusLost = log.events.filter((e) => e.type.includes("Focus")).length;
    const suspiciousEvents = log.events.filter((e) => e.type.includes("Suspicious")).length;

    log.integrityScore = 100 - (focusLost * 5 + suspiciousEvents * 10);

    await log.save();

    res.json({
      candidateName: log.candidateName,
      duration: log.duration,
      focusLost,
      suspiciousEvents,
      integrityScore: log.integrityScore,
    });
  } catch (error) {
    res.status(500).json({success: false, error: error.message });
  }
};
