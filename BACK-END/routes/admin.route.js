const router = require("express").Router();
const { adminLogin } = require("../controller/admin.controller.js");

// ================= ADMIN LOGIN =================
router.post("/login", adminLogin);

module.exports = router;