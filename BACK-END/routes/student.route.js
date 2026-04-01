const { student_get,student_id, student_add, student_update, student_delete, student_login} = require("../controller/student.controller");

const router=require("express").Router();
router.get("/",student_get)
router.get("/:_id",student_id)
router.post("/add",student_add)
router.post("/login",student_login)
router.put("/update/:id", student_update);
router.delete("/delete/:id", student_delete);


module.exports=router;