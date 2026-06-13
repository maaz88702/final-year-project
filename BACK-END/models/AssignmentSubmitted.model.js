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
      type: String,
      required: true,
      trim: true
    },
   status: {
      type: String,
      enum: ["ungraded", "graded"],
      default: "ungraded"
    },
    marks: {
      type: Number,
      default: 0
      // marks will be initialy 0 and updated later by teacher
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("AssignmentSubmitted", assignmentSubmittedSchema,"assignmentSubmitted");
