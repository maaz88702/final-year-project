const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    semesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    attendance: [
      {
        studentId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        status: {
          type: String,
          enum: ["present", "absent", "leave"],
          default: "absent",
        },
      },
    ],

    summary: {
      totalStudents: Number,
      present: Number,
      absent: Number,
      leave: Number,
      percentage: Number,
    },
  },
  { timestamps: true }
);

// ✅ UNIQUE constraint (VERY IMPORTANT)
attendanceSchema.index(
  { semesterId: 1, courseId: 1, date: 1 },
  { unique: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);