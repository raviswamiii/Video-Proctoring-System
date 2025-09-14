import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  candidateName: String,
  events: [{ type: String, timestamp: Date }],
  duration: Number,
  integrityScore: Number,
});

const logModel = mongoose.models.log || mongoose.model("log", logSchema);

export default logModel;