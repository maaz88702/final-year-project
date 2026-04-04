const AssignmentPosted = require('../models/Assignmentposted.model');
const AssignmentSubmitted = require('../models/AssignmentSubmitted.model');


const assignmentSubmitted_get = async (req, res) => {
  try {
    const assignmentSubmittedData = await AssignmentSubmitted.find()
      .populate("studentId", "studentName rollNo")
      .populate("assignmentId", "title");
    res.send(assignmentSubmittedData)
  } catch (error) {
    res.status(500).json({
      message: "Failed",
      error: error.message
    });
  }
}

const assignmentSubmitted_id = async (req, res) => {
  try {
    const { assignmentSubmittedId } = req.params;
    const assignmentSubmittedById = await AssignmentSubmitted.findById(assignmentSubmittedId).populate("studentId assignmentId")
    res.send(assignmentSubmittedById)
  } catch (error) {
    res.status(500).json({
      message: "Failed",
      error: error.message
    });
  }
}


// const AssignmentSubmitted = require('../models/AssignmentSubmitted.model');
// const AssignmentPosted = require('../models/AssignmentPosted.model');

const assignmentSubmitted_add = async (req, res) => {
  try {
    const { studentId, assignmentId } = req.body;
    const file = req.file?.filename; // ✅ from multer

    // ✅ 1. Validation first
    if (!studentId || !assignmentId || !file) {
      return res.status(400).json({
        message: "studentId, assignmentId, and file are required"
      });
    }

    // ✅ 2. Prevent duplicate
    const existingSubmission = await AssignmentSubmitted.findOne({
      studentId,
      assignmentId
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: "You already submitted this assignment"
      });
    }

    // ✅ 3. Check assignment
    const assignment = await AssignmentPosted.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({
        message: "Assignment not found"
      });
    }

    // ✅ 4. Deadline check
    if (new Date() > new Date(assignment.dueDate)) {
      return res.status(400).json({
        message: "Deadline passed. Cannot submit."
      });
    }

    // ✅ 5. Save
    const newSubmission = new AssignmentSubmitted({
      studentId,
      assignmentId,
      file
    });

    const savedData = await newSubmission.save();

    res.status(201).json({
      message: "Assignment submitted successfully",
      data: savedData
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while submitting assignment",
      error: error.message
    });
  }
};

const assignmentSubmitted_update = async (req, res) => {
  try {
    const { _id } = req.params;   // document id
    const { marks } = req.body;  // only marks will be updated

    if (marks === undefined) {
      return res.status(400).json({
        message: "Marks field is required for update"
      });
    }

    const updatedData = await AssignmentSubmitted.findByIdAndUpdate(
      _id,
      { marks },
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "Assignment submission not found"
      });
    }

    res.status(200).json({
      message: "Marks updated successfully",
      data: updatedData
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while updating marks",
      error: error.message
    });
  }
};



const assignmentSubmitted_delete = async (req, res) => {
  try {
    const { _id } = req.params;   // assuming route: /delete/:_id

    const deletedData = await AssignmentSubmitted.findByIdAndDelete(_id);

    if (!deletedData) {
      return res.status(404).json({
        message: "AssignmentSubmitted record not found"
      });
    }

    res.status(200).json({
      message: "Assignment submission deleted successfully",
      data: deletedData
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while deleting assignment submission",
      error: error.message
    });
  }
};



module.exports = { assignmentSubmitted_get, assignmentSubmitted_id, assignmentSubmitted_add, assignmentSubmitted_update, assignmentSubmitted_delete }