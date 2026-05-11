const mongoose = require("mongoose");

const gradeDetailSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
    },

    rubric: {
      type: String,
      required: true,
    },

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

const assignmentGradesSchema =
  new mongoose.Schema(
    {
      assignmentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "AssignmentPosted",
        required: true,
      },

      studentId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },

      obtainmarks: {
        type: Number,
        required: true,
      },

      details: [gradeDetailSchema],
    },
    { timestamps: true }
  );

module.exports = mongoose.model(
  "AssignmentGrade",
  assignmentGradesSchema,
  "assignmentGrades"
);