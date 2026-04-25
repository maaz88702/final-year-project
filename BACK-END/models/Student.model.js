const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    rollNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      minlength: 6,
      select: false,
    },

    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
      required: true,
    },

    // Useful for Socket.io connection tracking
    socketId: {
      type: String,
      default: null,
    },

    // Track online/offline user
    isOnline: {
      type: Boolean,
      default: false,
    },

    // Last time user connected/disconnected
    lastSeen: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);