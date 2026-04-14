const Attendance = require("../models/Attendance.model");

// ================= ADD ATTENDANCE =================
const markAttendance = async (req, res) => {
  try {
    const { semesterId, courseId, date, attendance } = req.body;

    // ✅ Validation
    if (!semesterId || !courseId || !date || !attendance) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // ✅ Normalize date (remove time)
    const selectedDate = new Date(date);
    selectedDate.setHours(0, 0, 0, 0);

    // ✅ Prevent duplicate (controller level)
    const existing = await Attendance.findOne({
      semesterId,
      courseId,
      date: selectedDate,
    });

    if (existing) {
      return res.status(400).json({
        message: "Attendance already marked for this course today",
      });
    }

    // ================= CALCULATE SUMMARY =================
    const totalStudents = attendance.length;

    const present = attendance.filter(
      (a) => a.status === "present"
    ).length;

    const absent = attendance.filter(
      (a) => a.status === "absent"
    ).length;

    const leave = attendance.filter(
      (a) => a.status === "leave"
    ).length;

    const percentage =
      totalStudents > 0 ? (present / totalStudents) * 100 : 0;

    // ================= SAVE =================
    const newAttendance = new Attendance({
      semesterId,
      courseId,
      date: selectedDate,
      attendance,
      summary: {
        totalStudents,
        present,
        absent,
        leave,
        percentage,
      },
    });

    const saved = await newAttendance.save();

    res.status(201).json({
      message: "Attendance saved successfully",
      data: saved,
    });

  } catch (error) {
    // ✅ MongoDB duplicate protection
    if (error.code === 11000) {
      return res.status(400).json({
        message: "Attendance already exists for this course today",
      });
    }

    res.status(500).json({
      message: "Error saving attendance",
      error: error.message,
    });
  }
};

// ================= GET ALL =================
const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("attendance.studentId", "studentName rollNo")
      .populate("courseId", "courseTitle")
      .populate("semesterId", "semester")
      .sort({ date: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET STUDENT =================
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // 🔐 Logged-in user
    const loggedInUserId = req.user.id;

    // ❌ Prevent accessing other students
    if (studentId !== loggedInUserId) {
      return res.status(403).json({
        message: "Unauthorized access",
      });
    }

    const data = await Attendance.find({
      "attendance.studentId": studentId,
    })
      .populate("courseId", "courseTitle")
      .populate("semesterId", "semester")
      .sort({ date: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
};