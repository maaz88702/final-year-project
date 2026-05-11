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

const assignmentSubmitted_add =
  async (req, res) => {
    try {
      const {
        assignmentId,
      } = req.body;

      const studentId =
        req.user.id;

      if (!req.file) {
        return res
          .status(400)
          .json({
            message:
              "File is required",
          });
      }

      const filePath =
        req.file.path.replace(
          /\\/g,
          "/"
        );

      const data =
        new AssignmentSubmitted({
          assignmentId,
          studentId,
          file: filePath,
        });

      await data.save();

      res.status(201).json({
        message:
          "Assignment submitted successfully",
        data,
      });

    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to submit assignment",
        error:
          error.message,
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