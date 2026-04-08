const router = require("express").Router();
const {
  getNotices,
  addNotice,
  deleteNotice,
} = require("../controller/notice.controller");

// 🔓 Public (students + teachers can see)
router.get("/", getNotices);

// 🔒 Admin only
router.post("/add", addNotice);
router.delete("/delete/:id", deleteNotice);

module.exports = router;