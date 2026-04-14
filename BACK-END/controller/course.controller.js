const Course = require("../models/Course.model");

// ================= GET ALL =================
const course_get = async (req, res) => {
  try {
    const courseData = await Course.find()
      .populate({ path: "teacherId", select: "teacherName" })
      .populate({ path: "semesterId", select: "semester" });

    res.status(200).json(courseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ================= GET BY ID =================
const course_id = async (req, res) => {
  try {
    const { _id } = req.params;

    const courseById = await Course.findById(_id)
      .populate("teacherId", "teacherName")
      .populate("semesterId", "semester");

    if (!courseById) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(courseById);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= ADD =================
const course_add = async (req, res) => {
  try {
    const { courseTitle, teacherId, semesterId } = req.body;

    // ✅ Validation
    if (!courseTitle || !teacherId || !semesterId) {
      return res.status(400).json({
        success: false,
        message: "courseTitle, teacherId and semesterId are required",
      });
    }

    // ✅ Optional: prevent duplicate course in same semester
    const existing = await Course.findOne({
      courseTitle,
      semesterId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Course already exists in this semester",
      });
    }

    const newCourse = await Course.create({
      courseTitle,
      teacherId,
      semesterId,
    });

    res.status(201).json({
      success: true,
      message: "Course added successfully",
      data: newCourse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding course",
      error: error.message,
    });
  }
};

// ================= UPDATE =================
const course_update = async (req, res) => {
  try {
    const id = req.params._id;
    const { courseTitle, teacherId, semesterId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const updateData = {};
    if (courseTitle) updateData.courseTitle = courseTitle;
    if (teacherId) updateData.teacherId = teacherId;
    if (semesterId) updateData.semesterId = semesterId;

    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )
      .populate("teacherId", "teacherName")
      .populate("semesterId", "semester");

    if (!updatedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating course",
      error: error.message,
    });
  }
};

// ================= DELETE =================
const course_delete = async (req, res) => {
  try {
    const id = req.params._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const deletedCourse = await Course.findByIdAndDelete(id);

    if (!deletedCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: deletedCourse,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting course",
      error: error.message,
    });
  }
};


const course_by_teacher = async (req, res) => {
  try {
    const teacherId = req.user.id; // from middleware

    const courses = await Course.find({ teacherId })
      .populate("semesterId", "semester");
    
console.log("Courses" , courses);
    res.status(200).json(courses);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  course_get,
  course_id,
  course_add,
  course_update,
  course_delete,
  course_by_teacher,
};