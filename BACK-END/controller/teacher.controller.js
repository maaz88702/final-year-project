const Teacher = require('../models/Teacher.model');
const AssignmentPosted=require('../models/Assignmentposted.model')

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const teacher_get = async (req, res) => {
    try {
        const teacherData = await Teacher.find();
        console.log("teacher route hit")

        res.send(teacherData);
    } catch (error) {
        res.send(error)
    }
}

const teacher_id = async (req, res) => {
    try {
        
    const teacherId = req.params._id;
    const teacher = await Teacher.findById(teacherId)
    console.log(teacher)
    res.send(teacher)
    
    } catch (error) {
        res.send(error)
    }
}

const addAssignment = async (req, res) => {
  try {
    const {
      semesterId,
      dueDate,
      totalMarks,
      title,
      assignmentDetails,
      _teacherId,
      courseId
    } = req.body;

    // Basic validation
    if (
      !_teacherId ||
      !courseId ||
      !semesterId ||
      !dueDate ||
      totalMarks === undefined ||
      !title ||
      !assignmentDetails
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Date validation
    const parsedDate = new Date(dueDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid due date format" });
    }

    const newAssignment = new AssignmentPosted({
      teacherId: _teacherId,
      courseId,
      semesterId,
      dueDate: parsedDate,
      totalMarks,
      title,
      assignmentDetails
    });

    const savedAssignment = await newAssignment.save();

    res.status(201).json({
      message: "Assignment posted successfully",
      data: savedAssignment
    });

  } catch (error) {
    console.error("Add Assignment Error:", error);
    res.status(500).json({
      message: "Error while posting assignment",
      error: error.message
    });
  }
};


const deleteAssignment = async (req, res) => {
  try {
    const { assignmentId } = req.params;

    if (!assignmentId) {
      return res.status(400).json({ message: "Assignment ID is required" });
    }

    const deletedAssignment = await AssignmentPosted.findByIdAndDelete(assignmentId);

    if (!deletedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.status(200).json({
      message: "Assignment deleted successfully",
      data: deletedAssignment
    });

  } catch (error) {
    res.status(500).json({
      message: "Error while deleting assignment",
      error: error.message
    });
  }
};


const teacher_add = async (req, res) => {
  try {
    const { teacherName, email, password } = req.body;
    console.log(res.body)

    // Basic validation
    if (!teacherName || !email || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if teacher already exists
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(409).send({
        success: false,
        message: "Teacher with this email already exists"
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is salt rounds

    // Create new teacher
    const newTeacher = await Teacher.create({
      teacherName,
      email,
      password: hashedPassword
    });

    console.log("new teacher is ",newTeacher)
      // Generate JWT token
    const signuptoken = jwt.sign(
      { id: newTeacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "100d" }
    );
console.log(signuptoken)
    res.status(201).send({
      success: true,
      message: "Teacher added successfully",
      token:signuptoken,
      data: newTeacher,
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error adding teacher",
      error: error.message
    });
  }
};




const teacher_delete = async (req, res) => {
  try {
    const id = req.params._id;

    const deletedTeacher = await Teacher.findByIdAndDelete(id);

    if (!deletedTeacher) {
      return res.status(404).send({
        success: false,
        message: "Teacher not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Teacher deleted successfully",
      data: deletedTeacher
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting teacher",
      error: error.message
    });
  }
};



const teacher_login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find teacher by email
    const teacher = await Teacher.findOne({ email }).select("+password");
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: teacher._id, role: "teacher" },
      process.env.JWT_SECRET,
      { expiresIn: "100d" }
    );

    // Remove password before sending response
    const teacherData = teacher.toObject();
    delete teacherData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: teacherData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while logging in",
      error: error.message,
    });
  }
};



const teacher_update = async (req, res) => {
  try {
    const { id } = req.params; // teacher ID from URL
    const { teacherName, email, password } = req.body;

    // Find teacher by ID
    const teacher = await Teacher.findById(id);
    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found",
      });
    }

    // Check if email is being updated and ensure uniqueness
    if (email && email !== teacher.email) {
      const emailExists = await Teacher.findOne({ email });
      if (emailExists) {
        return res.status(409).json({
          success: false,
          message: "Email already in use by another teacher",
        });
      }
    }

    // Update fields only if provided
    if (teacherName) teacher.teacherName = teacherName;
    if (email) teacher.email = email;

    // Hash password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      teacher.password = hashedPassword;
    }

    await teacher.save();

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully",
      data: teacher,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error updating teacher",
      error: error.message,
    });
  }
};



module.exports = { teacher_get, teacher_id ,addAssignment,deleteAssignment,teacher_add,teacher_delete,teacher_login,teacher_update}