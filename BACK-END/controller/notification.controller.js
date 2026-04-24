const AssignmentPosted = require("../models/Assignmentposted.model");
const Student = require("../models/Student.model");

// =======================================
// GET STUDENT NOTIFICATIONS
// No Notification Model Needed
// =======================================
const getNotifications = async (req, res) => {
  try {
    const { userId } = req.params;

    // get student
    const student = await Student.findById(userId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // find assignments of student's semester
    const assignments = await AssignmentPosted.find({
      semesterId: student.semester,
    })
      .populate("courseId", "courseTitle")
      .populate("teacherId", "teacherName")
      .sort({ createdAt: -1 });

    // convert into notification format
    const notifications = assignments.map((item) => ({
      _id: item._id,
      type: "assignment",
      message: `New Assignment "${item.title}" added for ${item.courseId?.courseTitle}`,
      teacher: item.teacherId?.teacherName,
      createdAt: item.createdAt,
      read: false,
    }));

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Notification Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

// =======================================
// OPTIONAL EMPTY METHODS
// =======================================
const markAsRead = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend local read state only",
  });
};

const markAllAsRead = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend local read state only",
  });
};

const deleteNotification = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend local delete only",
  });
};

const deleteAllNotifications = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Frontend local delete only",
  });
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications,
};