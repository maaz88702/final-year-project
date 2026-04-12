const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    courseTitle: {
      type: String,
      required: true,
      trim: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);