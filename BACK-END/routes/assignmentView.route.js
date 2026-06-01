
const router = require("express").Router();
const { getAssignmentRecordView } = require("../controller/assignmentView.controller");


router.get("/:gradeId", getAssignmentRecordView);

module.exports = router;