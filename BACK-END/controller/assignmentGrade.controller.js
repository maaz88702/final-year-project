const AssignmentGrade = require('../models/AssignmentGrade.model')
const assignmentGrade_get = async (req, res) => {
    try {
        const assignmentGradeData = await AssignmentGrade.find().populate('assignmentId studentId');
        res.send(assignmentGradeData)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignment grades",
            error: error.message
        });

    }
}
const assignmentGrade_Id = async (req, res) => {
    try {
        const { assignmentgradeid } = req.params;
        const assignmentGradeById = await AssignmentGrade.findById(assignmentgradeid).populate('assignmentId studentId');
        res.send(assignmentGradeById)
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch assignment grades",
            error: error.message
        });

    }
}


// const AssignmentGrade = require("../models/assignmentGrade.model");

const assignmentGrade_add = async (req, res) => {
  try {
    const { assignmentId, studentId, obtainmarks, details } = req.body;

    // ================= VALIDATION =================
    if (!assignmentId || !studentId || obtainmarks === undefined) {
      return res.status(400).json({
        message: "assignmentId, studentId and obtainmarks are required",
      });
    }

    if (!Array.isArray(details) || details.length === 0) {
      return res.status(400).json({
        message: "details must be a non-empty array",
      });
    }

    // ================= 🚫 DUPLICATE CHECK =================
    const existing = await AssignmentGrade.findOne({
      assignmentId,
      studentId,
    });

    if (existing) {
      return res.status(400).json({
        message: "This student has already been graded for this assignment",
      });
    }

    // ================= SAVE =================
    const newAssignmentGrade = new AssignmentGrade({
      assignmentId,
      studentId,
      obtainmarks,
      details,
    });

    const savedData = await newAssignmentGrade.save();

    await Notification.create({
  userId: studentId,
  userModel: "Student",
  title: "Assignment Graded",
  message: "Your assignment has been graded",
  type: "grade",
});

    res.status(201).json({
      message: "Assignment grade added successfully",
      data: savedData,
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while adding assignment grade",
      error: error.message,
    });
  }
};
const assignmentGrade_delete = async (req, res) => {
  try {
    const { _id } = req.params;   // assuming route: /delete/:_id

    const deletedData = await AssignmentGrade.findByIdAndDelete(_id);

    if (!deletedData) {
      return res.status(404).json({
        message: "AssignmentGrade record not found"
      });
    }

    res.status(200).json({
      message: "Assignment grade deleted successfully",
      data: deletedData
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while deleting assignment grade",
      error: error.message
    });
  }
};



const assignmentGrade_update = async (req, res) => {
  try {
    const { _id } = req.params;
    const { assignmentId, studentId, obtainmarks, details } = req.body;

    // Validate all required fields for PUT
    if (!assignmentId || !studentId || obtainmarks === undefined || !Array.isArray(details)) {
      return res.status(400).json({
        message: "assignmentId, studentId, obtainmarks and details (array) are all required for PUT"
      });
    }

    // Replace the entire document fields (except _id)
    const updatedData = await AssignmentGrade.findByIdAndUpdate(
      _id,
      { assignmentId, studentId, obtainmarks, details },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "AssignmentGrade record not found"
      });
    }

    res.status(200).json({
      message: "Assignment grade updated successfully",
      data: updatedData
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while updating assignment grade",
      error: error.message
    });
  }
};

module.exports = { assignmentGrade_get, assignmentGrade_Id ,assignmentGrade_add,assignmentGrade_delete,assignmentGrade_update}