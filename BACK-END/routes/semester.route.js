const { semester_get, semester_id, semester_update, semester_delete, semester_add } = require("../controller/semester.controller");
const router = require("express").Router();

router.get("/", semester_get)
router.get("/:semesterid",semester_id)
router.post("/add",semester_add)
router.get("/delete/:_id",semester_delete)
router.put("/update/:_id",semester_update) 

module.exports = router;