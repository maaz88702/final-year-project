const Notification = require(
  "../models/notification.model"
);

// =======================================
// GET USER NOTIFICATIONS
// =======================================
const getNotifications = async (
  req,
  res
) => {
  try {
    const { userId } = req.params;

    const notifications =
      await Notification.find({
        userId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json(
      notifications
    );
  } catch (error) {
    console.error(
      "Notification Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// =======================================
// MARK SINGLE AS READ
// =======================================
const markAsRead = async (
  req,
  res
) => {
  try {
    const updated =
      await Notification.findByIdAndUpdate(
        req.params.id,
        { read: true },
        { new: true }
      );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =======================================
// MARK ALL AS READ
// =======================================
const markAllAsRead =
  async (req, res) => {
    try {
      await Notification.updateMany(
        {
          userId:
            req.params.userId,
          read: false,
        },
        {
          read: true,
        }
      );

      res.status(200).json({
        success: true,
        message:
          "All marked as read",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// =======================================
// DELETE SINGLE
// =======================================
const deleteNotification =
  async (req, res) => {
    try {
      const deleted =
        await Notification.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message:
            "Notification not found",
        });
      }

      res.status(200).json({
        success: true,
        message:
          "Notification deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

// =======================================
// DELETE ALL USER NOTIFICATIONS
// =======================================
const deleteAllNotifications =
  async (req, res) => {
    try {
      await Notification.deleteMany(
        {
          userId:
            req.params.userId,
        }
      );

      res.status(200).json({
        success: true,
        message:
          "All notifications deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};