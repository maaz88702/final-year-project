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
// Backend Controller: attendanceController.js
// controllers/attendanceController.js
// const Attendance = require("../models/Attendance");
const Course = require("../models/Course.model");

const getAttendance = async (req, res) => {
  try {
    // 1. Extract the logged-in teacher's ID from your JWT auth middleware
    const loggedInTeacherId = req.user.id; 

    console.log(`=== FETCHING ATTENDANCE FOR TEACHER: ${loggedInTeacherId} ===`);

    // 2. Find all courses assigned to this specific teacher
    const teacherCourses = await Course.find({ teacherId: loggedInTeacherId }).select("_id");
    
    // Extract just the IDs into a flat array: [ObjectId('...'), ObjectId('...')]
    const courseIds = teacherCourses.map(course => course._id);

    // 3. Find only the attendance sheets that match those course IDs
    const records = await Attendance.find({ courseId: { $in: courseIds } })
      .populate("semesterId")
      .populate({
        path: "courseId",
        select: "courseTitle teacherId semesterId" // explicit fields to return
      })
      .populate("attendance.studentId");

    console.log(`Successfully retrieved ${records.length} attendance sheets.`);

    // 4. Send the targeted records back to your React frontend
    res.status(200).json(records);

  } catch (error) {
    console.error("Error inside getAttendance controller:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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

const attendenceByIdView=async (req, res) => {
  try {
    console.log("Fetching attendance record with ID:", req.params.id);
    const record = await Attendance.findById(req.params.id)
      .populate("semesterId", "semester") // Grabs semester name
      .populate("courseId", "courseTitle") // Grabs course title
      .populate({
        path: "attendance.studentId", // 🌟 Deeply populates the nested array
        select: "studentName rollNo", // Only fetches necessary fields
      });
console.log("Fetched attendance record:", record);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.json(record);
  } catch (error) {
    console.error("Error fetching single attendance record:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
}

module.exports = {
  markAttendance,
  getAttendance,
  getStudentAttendance,
  attendenceByIdView
};