const router = require("express").Router();
const {
    getNotifications,
    markAsRead,
} = require("../controller/notification.controller" );

router.get("/:userId", getNotifications);
router.patch("/read/:id", markAsRead);

module.exports = router;