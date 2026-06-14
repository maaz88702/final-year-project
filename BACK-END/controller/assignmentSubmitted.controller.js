const AssignmentPosted = require('../models/Assignmentposted.model');
const AssignmentSubmitted = require('../models/AssignmentSubmitted.model');
const { updateSubmissionIntegrity } = require("../services/integrityService");


const assignmentSubmitted_get = async (req, res) => {
  try {
    // Included 'semester' in the student projection string 
    // so the frontend can read it if needed!
    const assignmentSubmittedData = await AssignmentSubmitted.find()
      .populate("studentId", "studentName rollNo semester")
      .populate("assignmentId", "title semesterId").sort({ createdAt: -1 });
      
    res.status(200).send(assignmentSubmittedData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch submitted assignments",
      error: error.message
    });
  }
};

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

const assignmentSubmitted_add = async (req, res) => {
  try {
    const { assignmentId } = req.body;
    const studentId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        message: "File is required",
      });
    }

    const filePath = req.file.path.replace(/\\/g, "/");

    // Create the document, setting the scanning trackers to pending initially
    const data = new AssignmentSubmitted({
      assignmentId,
      studentId,
      file: filePath,
      status: "ungraded",
      detectionStatus: "pending"
    });

    const savedSubmission = await data.save();

    // 🌟 TRIGGER AUTOMATED PLAGIARISM & AI SCANNERS 🌟
    // Generating dynamic mock scores to test database writes across fields
    const mockAiScore = Math.floor(Math.random() * 100);       // Testing values 0 - 100%
    const mockPlagScore = Math.floor(Math.random() * 40);      // Testing values 0 - 40%

    // Fire the external service worker to perform the update asynchronously
    await updateSubmissionIntegrity(savedSubmission._id, mockAiScore, mockPlagScore);

    res.status(201).json({
      message: "Assignment submitted successfully and integrity check initiated",
      data: savedSubmission,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to submit assignment",
      error: error.message,
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

module.exports = { 
  assignmentSubmitted_get, 
  assignmentSubmitted_id, 
  assignmentSubmitted_add, 
  assignmentSubmitted_update, 
  assignmentSubmitted_delete 
};