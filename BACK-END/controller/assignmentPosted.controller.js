const AssignmentPosted = require('../models/Assignmentposted.model');

const assignmentPosted_get = async (req, res) => {
  try {

    console.log("assignment route hit")
    const assignmentPostedData = await AssignmentPosted.find().populate("teacherId", "_id teacherName").populate("courseId", "_id courseTitle").populate("semesterId", "_id semester");
    res.send(assignmentPostedData)

  } catch (error) {
    res.send(error)
  }
}

const assignmentPostedById = async (req, res) => {
  try {
    const id = req.params._id;
    const assignmentPosted_id = await AssignmentPosted.findById(id);
    res.send(assignmentPosted_id);

  } catch (error) {
    res.send(error)
  }
}
// workkkkkkkkkkkkkkkkkkkkkkkkkkkkk

// Add Assignment
const assignmentPosted_add = async (req, res) => {
  try {
    // Get teacher ID from JWT middleware
    const teacherId = req.user?.id;
    if (!teacherId) {
      return res.status(401).json({ message: "Unauthorized: No teacher ID found" });
    }

    const { courseId, semesterId, dueDate, title, assignmentDetails } = req.body;

    // Basic validation
    if (!courseId || !semesterId || !dueDate || !title || !assignmentDetails || assignmentDetails.length === 0) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Calculate total marks from rubrics
    let totalMarks = 0;
    assignmentDetails.forEach(detail => {
      detail.rubrics.forEach(rubric => {
        totalMarks += Number(rubric.marks || 0);
      });
    });

    console.log(teacherId,courseId,semesterId);
    const newAssignment = new AssignmentPosted({
      teacherId,
      courseId,
      semesterId,
      dueDate,
      title,
      assignmentDetails,
      totalMarks
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      success: true,
      message: "Assignment posted successfully",
      data: savedAssignment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error posting assignment", error: error.message });
  }
};



// workiddddddddddddd


const assignmentPosted_delete = async (req, res) => {
  try {
    const id = req.params._id;

    const deletedAssignment = await AssignmentPosted.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).send({
        success: false,
        message: "Assignment not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Assignment deleted successfully",
      data: deletedAssignment
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting assignment",
      error: error.message
    });
  }
};
module.exports = { assignmentPosted_get, assignmentPostedById, assignmentPosted_add, assignmentPosted_delete };  