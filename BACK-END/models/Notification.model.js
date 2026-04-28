const mongoose = require("mongoose");

const notificationSchema =
  new mongoose.Schema(
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },

      title: {
        type: String,
        default: "Notification",
      },

      type: {
        type: String,
        enum: [
          "assignment",
          "notice",
          "attendance",
          "general",
        ],
        default: "assignment",
      },

      message: {
        type: String,
        required: true,
      },

      read: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  );

module.exports =
  mongoose.models.Notification ||
  mongoose.model(
    "Notification",
    notificationSchema
  );