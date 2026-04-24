const Student = require("../models/Student.model");

// GET SETTINGS
const getSettings = async (req, res) => {
  try {
    const studentId = req.user.id;

    const student = await Student.findById(studentId).select(
      "notificationSettings"
    );

    res.json(student.notificationSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE SETTINGS
const updateSettings = async (req, res) => {
  try {
    const studentId = req.user.id;

    const { assignment, notice, attendance } = req.body;

    const updated = await Student.findByIdAndUpdate(
      studentId,
      {
        notificationSettings: {
          assignment,
          notice,
          attendance,
        },
      },
      { new: true }
    ).select("notificationSettings");

    res.json({
      message: "Settings updated",
      data: updated.notificationSettings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings,
};