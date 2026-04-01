const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
  {
    semester: {
      type: String,
      required: true,
      trim: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Semester", semesterSchema);
