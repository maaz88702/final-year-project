const { course_get, course_id, course_add, course_update, course_delete } = require('../controller/course.controller');

const router=require('express').Router();
router.get('/',course_get)
router.get('/:_id',course_id)
router.post('/add',course_add)
router.put('/update/:_id',course_update)
router.delete('/delete/:_id',course_delete)
module.exports=router;
// jhjhjh