import express from "express";
import multer from "multer";
import Recording from "../models/recording.js";

const recordingRouter = express.Router();
const storage = multer.memoryStorage(); // store in memory before saving to MongoDB
const upload = multer({ storage });

// 📤 Save recording
recordingRouter.post("/upload", upload.single("video"), async (req, res) => {
  try {
    const newRecording = new Recording({
      filename: req.file.originalname,
      video: req.file.buffer,
      mimetype: req.file.mimetype,
    });

    await newRecording.save();
    res.json({ message: "Recording saved successfully", id: newRecording._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save recording" });
  }
});

// 📥 Fetch all recordings
recordingRouter.get("/recording", async (req, res) => {
  try {
    const recordings = await Recording.find().sort({ createdAt: -1 });
    res.json(recordings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recordings" });
  }
});

// 📥 Fetch single recording by ID
recordingRouter.get("/recording/:id", async (req, res) => {
  try {
    const recording = await Recording.findById(req.params.id);
    if (!recording) return res.status(404).json({ error: "Not found" });

    res.set("Content-Type", recording.mimetype);
    res.send(recording.video);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recording" });
  }
});

export default recordingRouter;
