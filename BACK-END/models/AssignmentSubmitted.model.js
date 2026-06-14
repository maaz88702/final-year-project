const mongoose = require("mongoose");

const assignmentSubmittedSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignmentPosted",
      required: true
    },
    file: {
      type: String, // Path or URL to the file
      required: true,
      trim: true
    },
    marks: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ["ungraded", "graded"],
      default: "ungraded"
    },
    // 🌟 UPDATED DETECTOR FIELDS
    detectionStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    aiPercentage: {
      type: Number,
      default: 0 // e.g., 45 means 45% AI written
    },
    plagiarismPercentage: {
      type: Number,
      default: 0 // e.g., 12 means 12% matches other sources
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentSubmitted", assignmentSubmittedSchema, "assignmentSubmitted");