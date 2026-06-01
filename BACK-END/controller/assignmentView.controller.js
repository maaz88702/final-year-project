const express = require("express");
const AssignmentGrade = require("../models/AssignmentGrade.model");
const AssignmentSubmitted = require("../models/AssignmentSubmitted.model");

// GET assignment record view payload


const getAssignmentRecordView =async (req, res) => {
  try {
    const { gradeId } = req.params;

    // 1. Fetch the grade details and populate student/assignment details
    const gradeRecord = await AssignmentGrade.findById(gradeId)
      .populate("studentId", "studentName rollNo")
      .populate({
        path: "assignmentId",
        select: "title totalMarks courseId",
        populate: {
          path: "courseId",
          select: "courseTitle"
        }
      });

    if (!gradeRecord) {
      return res.status(404).json({ message: "Assignment grade record not found" });
    }

    // Extract raw IDs safely regardless of whether they are populated objects or ObjectIds
    const targetAssignmentId = gradeRecord.assignmentId?._id || gradeRecord.assignmentId;
    const targetStudentId = gradeRecord.studentId?._id || gradeRecord.studentId;

    // 2. Fetch the specific file submitted by this student for this assignment
    const submissionRecord = await AssignmentSubmitted.findOne({
      assignmentId: targetAssignmentId,
      studentId: targetStudentId
    });

    // 3. Return everything structured neatly for your frontend
    return res.status(200).json({
      grade: gradeRecord,
      submission: submissionRecord // Contains the file path string
    });

  } catch (error) {
    console.error("Error aggregating assignment record view:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}

module.exports = {
  getAssignmentRecordView
};