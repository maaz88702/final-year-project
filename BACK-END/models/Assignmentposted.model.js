const mongoose = require("mongoose");

const rubricSchema = new mongoose.Schema({
  condition: { type: String, required: true },
  marks: { type: Number, required: true }
}, { _id: false });

const assignmentDetailSchema = new mongoose.Schema({
  ques: { type: String, required: true },
  rubrics: [rubricSchema]
}, { _id: false });

const assignmentPostedSchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teacher",
    required: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true
  },
  semesterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Semester",
    required: true
  },
  dueDate: {
    type: String, // You could also use Date type if storing as actual date
    required: true
  },
  totalMarks: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  assignmentDetails: [assignmentDetailSchema]
}, { timestamps: true });

module.exports = mongoose.model("AssignmentPosted", assignmentPostedSchema,"assignmentPosted");
