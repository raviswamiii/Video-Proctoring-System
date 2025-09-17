import mongoose from "mongoose";

const logSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});

const reportSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      default: "Anonymous", // can link with user later
    },
    duration: {
      type: Number, // minutes
      required: true,
    },
    suspiciousEvents: {
      type: Number,
      default: 0,
    },
    integrityScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    logs: [logSchema], // array of log objects
  },
  { timestamps: true } // auto adds createdAt & updatedAt
);

const Report = mongoose.model("Report", reportSchema);

export default Report;
