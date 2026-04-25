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
// IMPORTANT:
// Put fixed routes BEFORE dynamic routes
// =======================================

// =======================================
// MARK ALL AS READ
// =======================================
router.patch(
  "/read-all/:userId",
  authMiddleware,
  markAllAsRead
);

// =======================================
// CLEAR ALL
// =======================================
router.delete(
  "/clear/:userId",
  authMiddleware,
  deleteAllNotifications
);

// =======================================
// MARK SINGLE AS READ
// =======================================
router.patch(
  "/read/:id",
  authMiddleware,
  markAsRead
);

// =======================================
// DELETE SINGLE
// =======================================
router.delete(
  "/:id",
  authMiddleware,
  deleteNotification
);

// =======================================
// GET USER NOTIFICATIONS
// =======================================
router.get(
  "/:userId",
  authMiddleware,
  getNotifications
);

module.exports = router;