const { assignmentSubmitted_get, assignmentSubmitted_id, assignmentSubmitted_add, assignmentSubmitted_update, assignmentSubmitted_delete } = require('../controller/assignmentSubmitted.controller');

const router=require('express').Router();

router.get('/',assignmentSubmitted_get)
router.get('/:assignmentSubmittedId',assignmentSubmitted_id)
router.post('/add',assignmentSubmitted_add)
router.patch('/update/:_id',assignmentSubmitted_update)
router.delete('/delete/:_id',assignmentSubmitted_delete)
module.exports=router;