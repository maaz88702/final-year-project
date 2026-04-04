// models/Notification.model.js

const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "userModel", // dynamic (Student / Teacher)
    },
    userModel: {
      type: String,
      required: true,
      enum: ["Student", "Teacher"],
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: ["assignment", "submission", "grade"],
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    link: String, // optional (navigate URL)

  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);