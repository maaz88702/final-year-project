const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentName: String,
    email: { type: String, unique: true },
    rollNo: { type: String, unique: true },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },

    notificationSettings: {
      assignment: {
        type: Boolean,
        default: true,
      },
      notice: {
        type: Boolean,
        default: true,
      },
      attendance: {
        type: Boolean,
        default: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);