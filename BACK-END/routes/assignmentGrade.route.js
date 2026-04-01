const { assignmentGrade_get, assignmentGrade_Id, assignmentGrade_add, assignmentGrade_delete, assignmentGrade_update } = require('../controller/assignmentGrade.controller');

const router=require('express').Router();
router.get('/',assignmentGrade_get);
router.get('/:assignmentgradeid',assignmentGrade_Id);
router.post('/add',assignmentGrade_add);
router.delete("/delete/:_id", assignmentGrade_delete);
router.put("/update/:_id", assignmentGrade_update);
module.exports=router;