const Course = require('../models/Course.model')
const course_get = async (req, res) => {
    try {
        const courseData = await Course.find().populate({ path: 'teacher', select: 'teacherName' });
        // console.log(courseData)
     res.status(200).json(courseData);

    } catch (error) {
        res.send(error)
    }
}

const course_id = async (req, res) => {
    try {
        const { _id } = req.params;
        const courseById = await Course.findById(_id).populate('teacher')
         if (!courseById) {
           return res.status(404).json({ message: 'Course not found' });

        }
        res.send(courseById)
    } catch (error) {
        res.send(error)
    }
}


const course_add = async (req, res) => {
  try {
    const { courseTitle, teacher } = req.body;

    // Basic validation
    if (!courseTitle || !teacher) {
      return res.status(400).json({
        success: false,
        message: "Both courseTitle and teacher ID are required",
      });
    }

    // Create new course
    const newCourse = await Course.create({
      courseTitle,
      teacher,
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


const course_update = async (req, res) => {
  try {
    const id = req.params._id;
    const { courseTitle, teacher } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    // Prepare update object
    const updateData = {};
    if (courseTitle) updateData.courseTitle = courseTitle;
    if (teacher) updateData.teacher = teacher;

    // Find and update course
    const updatedCourse = await Course.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // return the updated document
    );

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
console.clear()


module.exports = { course_get, course_id,course_add,course_update ,course_delete}