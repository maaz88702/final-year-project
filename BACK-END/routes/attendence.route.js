const router = require("express").Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
} = require("../controller/attendence.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ================= ROUTES =================

// Teacher/Admin
router.post("/add", authMiddleware, markAttendance);
router.get("/", authMiddleware, getAttendance);

// Student
router.get("/student/:studentId", authMiddleware, getStudentAttendance);

module.exports = router;