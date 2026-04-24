const router = require("express").Router();

const {
  getSettings,
  updateSettings,
} = require("../controller/notificationSetting.controller");

const authMiddleware = require("../middleware/auth.middleware");

router.get("/", authMiddleware, getSettings);
router.put("/", authMiddleware, updateSettings);

module.exports = router;