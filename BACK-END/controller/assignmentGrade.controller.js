const AssignmentGrade = require("../models/AssignmentGrade.model");
const Notification = require("../models/Notification.model");

// ==========================================
// GET ALL GRADES
// ==========================================
const assignmentGrade_get = async (req, res) => {
  try {
    const assignmentGradeData =
      await AssignmentGrade.find()
        .populate({
          path: "assignmentId",
          populate: [
            {
              path: "teacherId",
              select:
                "_id teacherName",
            },
            {
              path: "courseId",
              select:
                "_id courseTitle",
            },
          ],
        })
        .populate(
          "studentId",
          "_id studentName rollNo email"
        );

    console.log(
      "assignmentGradeData",
      assignmentGradeData
    );

    res.status(200).json(
      assignmentGradeData
    );
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch assignment grades",
      error: error.message,
    });
  }
};

// ==========================================
// GET SINGLE GRADE
// ==========================================
const assignmentGrade_Id =
  async (req, res) => {
    try {
      const {
        assignmentgradeid,
      } = req.params;

      const assignmentGradeById =
        await AssignmentGrade.findById(
          assignmentgradeid
        )
          .populate({
            path: "assignmentId",
            populate: [
              {
                path: "teacherId",
                select:
                  "_id teacherName",
              },
              {
                path: "courseId",
                select:
                  "_id courseTitle",
              },
            ],
          })
          .populate(
            "studentId",
            "_id studentName rollNo email"
          );

      if (
        !assignmentGradeById
      ) {
        return res
          .status(404)
          .json({
            message:
              "Assignment grade not found",
          });
      }

      res.status(200).json(
        assignmentGradeById
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch assignment grade",
        error: error.message,
      });
    }
  };

// ==========================================
// ADD GRADE
// ==========================================
const assignmentGrade_add = async (
  req,
  res
) => {
  try {
    const {
      assignmentId,
      studentId,
      obtainmarks,
      details,
    } = req.body;

    console.log(
      "GRADE BODY:",
      req.body
    );

    // ================= VALIDATION =================
    if (
      !assignmentId ||
      !studentId ||
      obtainmarks === undefined
    ) {
      return res.status(400).json({
        message:
          "assignmentId, studentId and obtainmarks are required",
      });
    }

    if (
      !Array.isArray(details) ||
      details.length === 0
    ) {
      return res.status(400).json({
        message:
          "details must be a non-empty array",
      });
    }

    // ================= DUPLICATE CHECK =================
    const existing =
      await AssignmentGrade.findOne({
        assignmentId,
        studentId,
      });

    if (existing) {
      return res.status(400).json({
        message:
          "This student has already been graded for this assignment",
      });
    }

    // ================= FORMAT DETAILS =================
    const formattedDetails =
      details.map((d) => ({
        question: d.question,
        rubric: d.rubric,
        level: d.level,
        marks: Number(d.marks),
      }));

    // ================= SAVE =================
    const newGrade =
      new AssignmentGrade({
        assignmentId,
        studentId,
        obtainmarks,
        details: formattedDetails,
      });

    const savedData =
      await newGrade.save();

    // ================= NOTIFICATION =================
    await Notification.create({
      userId: studentId,
      userModel: "Student",
      title: "Assignment Graded",
      message:
        "Your assignment has been graded",
      type: "grade",
    });

    res.status(201).json({
      message:
        "Assignment grade added successfully",
      data: savedData,
    });
  } catch (error) {
    console.error(
      "GRADE ERROR:",
      error
    );

    res.status(500).json({
      message:
        "Error while adding assignment grade",
      error: error.message,
    });
  }
};

// ==========================================
// DELETE GRADE
// ==========================================
const assignmentGrade_delete =
  async (req, res) => {
    try {
      const { _id } =
        req.params;

      const deletedData =
        await AssignmentGrade.findByIdAndDelete(
          _id
        );

      if (!deletedData) {
        return res
          .status(404)
          .json({
            message:
              "Assignment grade record not found",
          });
      }

      res.status(200).json({
        message:
          "Assignment grade deleted successfully",
        data: deletedData,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error while deleting assignment grade",
        error: error.message,
      });
    }
  };

// ==========================================
// UPDATE GRADE
// ==========================================
const assignmentGrade_update =
  async (req, res) => {
    try {
      const { _id } =
        req.params;

      const {
        assignmentId,
        studentId,
        obtainmarks,
        details,
      } = req.body;

      // ================= VALIDATION =================
      if (
        !assignmentId ||
        !studentId ||
        obtainmarks ===
          undefined ||
        !Array.isArray(
          details
        )
      ) {
        return res
          .status(400)
          .json({
            message:
              "assignmentId, studentId, obtainmarks and details are required",
          });
      }

      // ================= FORMAT DETAILS =================
      const formattedDetails =
        details.map((d) => ({
          question:
            d.question,

          rubricCondition:
            d.rubricCondition,

          fullMarks:
            Number(
              d.fullMarks
            ) || 0,

          obtainedMarks:
            Number(
              d.obtainedMarks
            ) || 0,

          selectedLevel:
            d.selectedLevel ||
            "",

          subRubrics:
            Array.isArray(
              d.subRubrics
            )
              ? d.subRubrics.map(
                  (sr) => ({
                    level:
                      sr.level,
                    marks:
                      Number(
                        sr.marks
                      ) || 0,
                  })
                )
              : [],
        }));

      // ================= UPDATE =================
      const updatedData =
        await AssignmentGrade.findByIdAndUpdate(
          _id,
          {
            assignmentId,
            studentId,
            obtainmarks:
              Number(
                obtainmarks
              ),
            details:
              formattedDetails,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedData) {
        return res
          .status(404)
          .json({
            message:
              "Assignment grade record not found",
          });
      }

      res.status(200).json({
        message:
          "Assignment grade updated successfully",
        data: updatedData,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Error while updating assignment grade",
        error: error.message,
      });
    }
  };

module.exports = {
  assignmentGrade_get,
  assignmentGrade_Id,
  assignmentGrade_add,
  assignmentGrade_delete,
  assignmentGrade_update,
};