const router = require("express").Router();

const {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  attendenceByIdView,
} = require("../controller/attendence.controller");

const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/roleMiddleware");

// ================= TEACHER / ADMIN =================

// ✅ Only teacher/admin can mark attendance
router.post(
  "/add",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  markAttendance
);

// ✅ Only teacher/admin can view all
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  getAttendance
);

// ================= STUDENT =================

// ✅ Student can only see their own
router.get(
  "/student/:studentId",
  authMiddleware,
  roleMiddleware(["student"]),
  getStudentAttendance
);

router.get("/:id",  attendenceByIdView);

module.exports = router;