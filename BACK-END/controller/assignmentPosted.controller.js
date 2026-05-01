const { models, default: mongoose } = require('mongoose');
const AssignmentPosted = require('../models/Assignmentposted.model');
const Notification = require("../models/Notification.model");
const Student = require("../models/Student.model");

const assignmentPosted_get = async (req, res) => {
  try {

    console.log("assignment route hit")
    const assignmentPostedData = await AssignmentPosted.find().populate("teacherId", "_id teacherName").populate("courseId", "_id courseTitle").populate("semesterId", "_id semester");
    res.send(assignmentPostedData)

  } catch (error) {
    res.send(error)
  }
}

const assignmentPostedById = async (req, res) => {
  try {
    const id = req.params._id;
    const assignmentPosted_id = await AssignmentPosted.findById(id);
    res.send(assignmentPosted_id);

  } catch (error) {
    res.send(error)
  }
}
// workkkkkkkkkkkkkkkkkkkkkkkkkkkkk

// Add Assignment
const assignmentPosted_add = async (req, res) => {
  try {
    // ================= Teacher Auth =================
    const teacherId = req.user?.id;
    // console.log(`teacher id is ${teacherId}`)
    if (!teacherId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================= Request Body =================
    const {
      courseId,
      semesterId,
      dueDate,
      title,
      assignmentDetails,
    } = req.body;

    if (
      !courseId ||
      !semesterId ||
      !dueDate ||
      !title ||
      !assignmentDetails?.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required",
      });
    }
    // console.log(`course id is ${courseId}`)
    // console.log(`semester id is`,semesterId)
    // console.log(`title is ${title}`)
    // console.log(courseId,
    //   semesterId,
    //   dueDate,
    //   title,
    //   assignmentDetails)
    // ================= Calculate Total Marks =================
    let totalMarks = 0;
    // console.log("assignment details are",assignmentDetails)
    assignmentDetails.forEach(
      (question) => {
        question.rubrics.forEach(
          (rubric) => {
            totalMarks += Number(
              rubric.marks || 0
            );
          }
        );
      }
    );

    // ================= Save Assignment =================
    const savedAssignment =
      await AssignmentPosted.create({
        teacherId,
        courseId,
        semesterId,
        dueDate,
        title,
        assignmentDetails,
        totalMarks,
      });
    // not working here 
    // cannot fetch semester id
    // console.log("assignmentsaved with", savedAssignment)
    // console.log(`semester id is fetching : ${semesterId}`)
    // console.log("type of semesterid",typeof semesterId)
    // const semesterObjId=new mongoose.Types.ObjectId(semesterId)
    // console.log("semester obj id",semesterObjId)
    // console.log("type of semesterid",typeof semesterObjId)
    // ================= Find Students =================
    const students = await Student.find({
      // email: "test@gmail.com"
      // semester: "6953a1206022d3b1f34bfeeb"
      semester: semesterId
      // semester: semesterObjId
      // semester: new mongoose.Types.ObjectId(semesterId)
      // semester: new mongoose.Types.ObjectId("6953a1206022d3b1f34bfeeb")
    }
    );
    // console.log("students are ", students)
    // const students = await Student.find(
    //   {
    //     semester: semesterId,
    //   },
    //   "_id"
    // );
    // cannot show students here
    // console.log('getting all student of same semester', students)
    // ================= If Students Exist =================
    // even not running this code
    if (students.length > 0) {
      // Prepare notifications
      // console.log("student length iṡ greater than 0")
      const notifications =
        students.map((student) => ({
          userId: student._id,
          userModel: "Student",
          title: "New Assignment",
          message: `New Assignment Added: ${title}`,
          type: "assignment",
          read: false,
        }));
      // console.log(`notifications from mapping ${notifications}`)
      // Save all notifications in DB
      const savedNotifications =
        await Notification.insertMany(
          notifications
        );
      //   console.log(`saved notification ${savedNotifications}`)
      // console.log("Students:", students);
      // console.log("Students Count:", students.length);
      // console.log("SemesterId:", semesterId);
      // console.log(
      //   "Saved Notifications:",
      //   savedNotifications
      // );
      // ================= Real-time Emit =================
      savedNotifications.forEach(
        (notification) => {
          global.io
            .to(
              notification.userId.toString()
            )
            .emit(
              "newNotification",
              notification
            );
        }
      );
    }

    // ================= Response =================
    res.status(201).json({
      success: true,
      message:
        "Assignment posted successfully",
      data: savedAssignment,
    });
  } catch (error) {
    console.error(
      "Assignment Post Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Error posting assignment",
      error: error.message,
    });
  }
};

// workiddddddddddddd


const assignmentPosted_delete = async (req, res) => {
  try {
    const id = req.params._id;

    const deletedAssignment = await AssignmentPosted.findByIdAndDelete(id);

    if (!deletedAssignment) {
      return res.status(404).send({
        success: false,
        message: "Assignment not found"
      });
    }

    res.status(200).send({
      success: true,
      message: "Assignment deleted successfully",
      data: deletedAssignment
    });

  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting assignment",
      error: error.message
    });
  }
};
module.exports = { assignmentPosted_get, assignmentPostedById, assignmentPosted_add, assignmentPosted_delete };  