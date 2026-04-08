const Notice = require("../models/Notice.model");

// ================= GET ALL =================
const getNotices = async (req, res) => {
  try {
    const today = new Date();

    const data = await Notice.find({
      expiryDate: { $gte: today } // ✅ only active notices
    }).sort({ createdAt: -1 });

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ADD =================
const addNotice = async (req, res) => {
  try {
    const { title, message, expiryDate } = req.body;

    if (!title || !message || !expiryDate) {
      return res.status(400).json({
        message: "Title, message, and expiry date are required",
      });
    }

    if (new Date(expiryDate) < new Date()) {
      return res.status(400).json({
        message: "Expiry date must be in the future",
      });
    }

    const newNotice = new Notice({
      title,
      message,
      expiryDate,
    });

    const saved = await newNotice.save();
    res.status(201).json(saved);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= DELETE =================
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    await Notice.findByIdAndDelete(id);

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = { getNotices, addNotice, deleteNotice };