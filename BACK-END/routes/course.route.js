const router = require("express").Router();
const {
    course_get,
    course_id,
    course_add,
    course_update,
    course_delete,
    course_by_teacher,
} = require("../controller/course.controller");

const authMiddleware = require("../middleware/auth.middleware");

// ================= PUBLIC / AUTH =================
router.get("/", authMiddleware, course_get);
router.get("/:_id", authMiddleware, course_id);

// ================= TEACHER =================
router.post("/add", authMiddleware, course_add);
router.put("/update/:_id", authMiddleware, course_update);
router.delete("/delete/:_id", authMiddleware, course_delete);
router.get("/teacher/my", authMiddleware, course_by_teacher);

module.exports = router;