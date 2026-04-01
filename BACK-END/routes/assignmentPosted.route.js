const router=require('express').Router();
const { assignmentPosted_get, assignmentPostedById, assignmentPosted_add, assignmentPosted_delete } = require('../controller/assignmentPosted.controller');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/',assignmentPosted_get)
router.get('/:_id',assignmentPostedById)
router.post('/add',authMiddleware,assignmentPosted_add)
router.delete('/delete/:_id',assignmentPosted_delete)
// no need for update teacher will directly delete and add new assignment if needed
module.exports=router;