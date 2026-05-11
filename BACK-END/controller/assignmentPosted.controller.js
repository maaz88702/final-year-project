const mongoose = require("mongoose");

const AssignmentPosted = require(
  "../models/Assignmentposted.model"
);

const Notification = require(
  "../models/Notification.model"
);

const Student = require(
  "../models/Student.model"
);

// ======================================================
// GET ALL ASSIGNMENTS
// ======================================================
const assignmentPosted_get =
  async (req, res) => {
    try {
      console.log(
        "✅ assignmentPosted_get route hit"
      );

      const assignmentPostedData =
        await AssignmentPosted.find()
          .populate(
            "teacherId",
            "_id teacherName"
          )
          .populate(
            "courseId",
            "_id courseTitle"
          )
          .populate(
            "semesterId",
            "_id semester"
          );

      res.send(
        assignmentPostedData
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Error fetching assignments",
        error: error.message,
      });
    }
  };

// ======================================================
// GET ASSIGNMENT BY ID
// ======================================================
const assignmentPostedById =
  async (req, res) => {
    try {
      const id = req.params._id;

      const assignmentPosted_id =
        await AssignmentPosted.findById(
          id
        );

      res.send(
        assignmentPosted_id
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        message:
          "Error fetching assignment",
        error: error.message,
      });
    }
  };

// ======================================================
// ADD ASSIGNMENT
// ======================================================
const assignmentPosted_add =
  async (req, res) => {
    try {
      console.log(
        "=============================="
      );

      console.log(
        "✅ assignmentPosted_add route hit"
      );

      // ======================================================
      // TEACHER AUTH
      // ======================================================
      const teacherId =
        req.user?.id;

      console.log(
        "✅ Teacher ID:",
        teacherId
      );

      if (!teacherId) {
        return res
          .status(401)
          .json({
            success: false,
            message:
              "Unauthorized",
          });
      }

      // ======================================================
      // REQUEST BODY
      // ======================================================
      const {
        courseId,
        semesterId,
        dueDate,
        title,
        assignmentDetails,
      } = req.body;

      console.log(
        "✅ Request Body:",
        req.body
      );

      // ======================================================
      // FIX SEMESTER ID
      // ======================================================
      const finalSemesterId =
        typeof semesterId ===
        "object"
          ? semesterId._id
          : semesterId;

      console.log(
        "✅ Final Semester ID:",
        finalSemesterId
      );

      // ======================================================
      // VALIDATION
      // ======================================================
      if (
        !courseId ||
        !finalSemesterId ||
        !dueDate ||
        !title ||
        !assignmentDetails ||
        assignmentDetails.length ===
          0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              "All fields are required",
          });
      }

      // ======================================================
      // CALCULATE TOTAL MARKS
      // ======================================================
      let totalMarks = 0;

      assignmentDetails.forEach(
        (question) => {
          question.rubrics.forEach(
            (rubric) => {
              totalMarks +=
                Number(
                  rubric.marks || 0
                );
            }
          );
        }
      );

      console.log(
        "✅ Total Marks:",
        totalMarks
      );

      // ======================================================
      // SAVE ASSIGNMENT
      // ======================================================
      const savedAssignment =
        await AssignmentPosted.create(
          {
            teacherId,
            courseId,
            semesterId:
              finalSemesterId,
            dueDate,
            title,
            assignmentDetails,
            totalMarks,
          }
        );

      console.log(
        "✅ Assignment Saved:",
        savedAssignment._id
      );

      // ======================================================
      // FIND STUDENTS
      // ======================================================
      const students =
        await Student.find({
          semester:
            finalSemesterId,
        });

      console.log(
        "✅ Students Found:",
        students.length
      );

      console.log(
        "✅ Students:",
        students
      );

      // ======================================================
      // CREATE NOTIFICATIONS
      // ======================================================
      if (students.length > 0) {
        const notifications =
          students.map(
            (student) => ({
              userId:
                student._id,

              title:
                "New Assignment",

              message: `New Assignment Added: ${title}`,

              type:
                "assignment",

              read: false,
            })
          );

        console.log(
          "✅ Notifications to Save:",
          notifications
        );

        const savedNotifications =
          await Notification.insertMany(
            notifications
          );

        console.log(
          "✅ Notifications Saved:",
          savedNotifications.length
        );

        // ======================================================
        // SOCKET.IO
        // ======================================================
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

        console.log(
          "✅ Socket Notifications Sent"
        );
      } else {
        console.log(
          "⚠ No students found for this semester"
        );
      }

      // ======================================================
      // RESPONSE
      // ======================================================
      res.status(201).json({
        success: true,
        message:
          "Assignment posted successfully",
        data: savedAssignment,
      });
    } catch (error) {
      console.error(
        "❌ Assignment Post Error:",
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

// ======================================================
// DELETE ASSIGNMENT
// ======================================================
const assignmentPosted_delete =
  async (req, res) => {
    try {
      const id = req.params._id;

      const deletedAssignment =
        await AssignmentPosted.findByIdAndDelete(
          id
        );

      if (
        !deletedAssignment
      ) {
        return res
          .status(404)
          .send({
            success: false,
            message:
              "Assignment not found",
          });
      }

      res.status(200).send({
        success: true,
        message:
          "Assignment deleted successfully",
        data: deletedAssignment,
      });
    } catch (error) {
      console.error(error);

      res.status(500).send({
        success: false,
        message:
          "Error deleting assignment",
        error: error.message,
      });
    }
  };

module.exports = {
  assignmentPosted_get,
  assignmentPostedById,
  assignmentPosted_add,
  assignmentPosted_delete,
};