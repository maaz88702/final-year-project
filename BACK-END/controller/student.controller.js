const Students = require('../models/Student.model');

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const student_get = async (req, res) => {
  try {
    const studentData = await Students.find().populate({
      path: 'semester',
      select: 'semester courses'
    });
    // const studentData = await Students.find()
    console.log("student route hit")
    console.log(studentData)

    res.send(studentData);
  } catch (error) {
    res.send(error)
  }
}

const student_id = async (req, res) => {
  try {
    const studentId = req.params._id;
    console.log(studentId)
    const student = await Students.findById(studentId).populate({
      path: 'semester',   // ✅ FIELD NAME
      select: 'semester courses'
    });

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    console.log(student)
    res.send(student)

  } catch (error) {
    res.send(error)
  }
}

// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";

const student_add = async (req, res) => {
  try {
    const { studentName, email, rollNo, password, semester } = req.body;

    if (!studentName || !email || !rollNo || !password || !semester) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }


    // Check if student already exists
    const existingStudent = await Students.findOne({
      $or: [{ email }, { rollNo }],
    });

    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: "Student with this email or roll number already exists",
      });
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new student
    const student = await Students.create({
      studentName,
      email,
      rollNo,
      password: hashedPassword,
      semester,
    });


    // Generate JWT token
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      data: student,
      token, // return token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while adding student",
      error: error.message,
    });
  }
};


const student_update = async (req, res) => {
  try {
    const { id } = req.params; // student ID from URL
    const { studentName, email, password, semester } = req.body;

    // Check if student exists
    const student = await Students.findById(id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // If email is being updated, check for duplication
    if (email && email !== student.email) {
      const emailExists = await Students.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another student",
        });
      }
    }

    // Update fields only if provided
    if (studentName) student.studentName = studentName;
    if (email) student.email = email;
    if (semester) student.semester = semester;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      student.password = hashedPassword;
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error while updating student",
      error: error.message,
    });
  }
};



const student_delete = async (req, res) => {
  try {
    const { id } = req.params; // student id from URL

    const student = await Students.findByIdAndDelete(id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while deleting student",
      error: error.message,
    });
  }
};



const student_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check student
    const student = await Students.findOne({ email }).select("+password");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Create JWT (optional but recommended)
    const token = jwt.sign(
      { id: student._id, role: "student" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Remove password from response
    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: studentData,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logging in",
      error: error.message,
    });
  }
};




module.exports = { student_get, student_id, student_add, student_update, student_delete, student_login }