const Semester = require('../models/Semester.model');
const semester_get = async (req, res) => {
  try {
    const semesterData = await Semester.find();
    res.status(200).json(semesterData);
  } catch (error) {
    res.status(500).json({ message: "Error fetching semesters", error: error.message });
  }
};

const semester_id = async (req, res) => {
  try {
    const semesterId = req.params.semesterid;

    if (!semesterId) {
      return res.status(400).json({ message: "Semester ID is required" });
    }

    const semesterById = await Semester.findById(semesterId);

    if (!semesterById) {
      return res.status(404).json({ message: "Semester not found" });
    }

    res.status(200).json(semesterById);

  } catch (error) {
    res.status(500).json({ message: "Error fetching semester", error: error.message });
  }
};


const semester_add = async (req, res) => {
  try {
    const { semester, courses } = req.body;

    // Basic validation
    if (!semester) {
      return res.status(400).json({
        success: false,
        message: "Semester name is required",
      });
    }

    // Create new semester
    const newSemester = await Semester.create({
      semester,
      courses: courses || [], // optional, default empty array
    });

    res.status(201).json({
      success: true,
      message: "Semester added successfully",
      data: newSemester,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding semester",
      error: error.message,
    });
  }
};

const semester_delete = async (req, res) => {
  try {
    const id = req.params._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Semester ID is required",
      });
    }

    const deletedSemester = await Semester.findByIdAndDelete(id);

    if (!deletedSemester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Semester deleted successfully",
      data: deletedSemester,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting semester",
      error: error.message,
    });
  }
};


const semester_update = async (req, res) => {
  try {
    const id = req.params._id;
    const { semester, courses } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Semester ID is required",
      });
    }

    // Find and update the semester
    const updatedSemester = await Semester.findByIdAndUpdate(
      id,
      {
        ...(semester && { semester }), // only update if provided
        ...(courses && { courses }),   // only update if provided
      },
      { new: true } // return the updated document
    );

    if (!updatedSemester) {
      return res.status(404).json({
        success: false,
        message: "Semester not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Semester updated successfully",
      data: updatedSemester,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating semester",
      error: error.message,
    });
  }
};


module.exports = { semester_get, semester_id ,semester_add,semester_delete,semester_update};