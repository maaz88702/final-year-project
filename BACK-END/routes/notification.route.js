const router = require("express").Router();

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
} = require("../controller/notification.controller");

const authMiddleware = require("../middleware/auth.middleware");

// =======================================
// GET STUDENT NOTIFICATIONS
// =======================================
router.get("/:userId", authMiddleware, getNotifications);

// =======================================
// MARK SINGLE AS READ
// =======================================
router.patch("/read/:id", authMiddleware, markAsRead);

// =======================================
// MARK ALL AS READ
// =======================================
router.patch("/read-all/:userId", authMiddleware, markAllAsRead);

// =======================================
// DELETE SINGLE
// =======================================
router.delete("/:id", authMiddleware, deleteNotification);

// =======================================
// DELETE ALL
// =======================================
router.delete("/clear/:userId", authMiddleware, deleteAllNotifications);

module.exports = router;