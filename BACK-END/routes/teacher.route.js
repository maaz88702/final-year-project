const { teacher_get, teacher_id ,addAssignment, deleteAssignment, teacher_add, teacher_delete, teacher_login, teacher_update} = require("../controller/teacher.controller");

const router=require("express").Router();
router.get("/",teacher_get)
router.get("/:_id",teacher_id)
router.post("/add",teacher_add)
router.post("/login",teacher_login)
router.delete("/delete/:_id",teacher_delete)
router.put("/update/:id",teacher_update)
// adding new teacher
router.post("/assignment/add",addAssignment)
// router.post("/assignment/add/:_teacherId/:courseId",addAssignment)
router.get("/assignment/delete/:assignmentId",deleteAssignment)

module.exports=router;