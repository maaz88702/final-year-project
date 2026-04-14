const jwt = require("jsonwebtoken");

// ================= ADMIN LOGIN =================
const adminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;

    // ✅ Validate input
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: "Name and password are required",
      });
    }

    // ✅ Compare with ENV
    if (
      name !== process.env.ADMIN_NAME ||
      password !== process.env.ADMIN_PASSWORD
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials",
      });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      {
        id: "admin", // static id
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "10d" }
    );

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in admin login",
      error: error.message,
    });
  }
};

module.exports = { adminLogin };