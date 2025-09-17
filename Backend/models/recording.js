import mongoose from "mongoose";

const recordingSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  video: { type: Buffer, required: true }, // store video as binary
  mimetype: { type: String, default: "video/webm" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Recording", recordingSchema);
