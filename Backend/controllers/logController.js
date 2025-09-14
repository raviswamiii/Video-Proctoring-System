import logModel from "../models/log.js";

export const saveLogs = async (req, res) => {
  try {
    const { candidateName, events, duration } = req.body;

    const log = new logModel({
      candidateName,
      events,
      duration,
      integrityScore: 100
    });

    await log.save();
    res.status(201).json({success: true, log});
  } catch (error) {
    res.status(500).json({success: false, error: error.message });
  }
};


