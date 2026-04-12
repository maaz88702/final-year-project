const Attendance = require("../models/Attendence.model");

// ================= ADD ATTENDANCE =================
const markAttendance = async (req, res) => {
  try {
    const { semesterId, courseId, date, attendance } = req.body;

    if (!semesterId || !courseId || !date || !attendance) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // 🚫 prevent duplicate (same subject + date)
    const existing = await Attendance.findOne({
      semesterId,
      courseId,
      date: new Date(date),
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
      date,
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

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET ALL =================
const getAttendance = async (req, res) => {
  try {
    const data = await Attendance.find()
      .populate("attendance.studentId", "studentName rollNo")
      .populate("courseId", "courseName")
      .populate("semesterId", "semester")
      .sort({ date: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET STUDENT ATTENDANCE =================
const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({
      "attendance.studentId": studentId,
    })
      .populate("courseId", "courseName")
      .sort({ date: -1 });

    // extract only that student's attendance
    const result = records.map((record) => {
      const studentRecord = record.attendance.find(
        (a) => String(a.studentId) === studentId
      );

      return {
        course: record.courseId,
        date: record.date,
        status: studentRecord?.status,
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
};