const mongoose = require("mongoose");

// ================= SUB RUBRIC =================
const subRubricSchema = new mongoose.Schema(
  {
    level: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// ================= RUBRIC =================
const rubricSchema = new mongoose.Schema(
  {
    condition: {
      type: String,
      required: true,
    },

    marks: {
      type: Number,
      required: true,
    },

    subRubrics: [subRubricSchema],
  },
  { _id: false }
);

// ================= QUESTION =================
const assignmentDetailSchema = new mongoose.Schema(
  {
    ques: {
      type: String,
      required: true,
    },

    rubrics: [rubricSchema],
  },
  { _id: false }
);

// ================= ASSIGNMENT =================
const assignmentPostedSchema =
  new mongoose.Schema(
    {
      teacherId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true,
      },

      courseId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      },

      semesterId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true,
      },

      dueDate: {
        type: String,
        required: true,
      },

      totalMarks: {
        type: Number,
        required: true,
      },

      title: {
        type: String,
        required: true,
        trim: true,
      },

      assignmentDetails: [
        assignmentDetailSchema,
      ],
    },
    { timestamps: true }
  );

module.exports = mongoose.model(
  "AssignmentPosted",
  assignmentPostedSchema,
  "assignmentPosted"
);