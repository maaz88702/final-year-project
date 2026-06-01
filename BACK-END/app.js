const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// ================= DB CONNECTION =================
require("./config/conn.js");

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
    console.log("Joined Room:", userId);
  });
  socket.on("disconnect", () => {
    console.log("User Disconnected");
  });
});

// ================= GLOBAL MIDDLEWARES =================
app.use(morgan("dev"));

// Simplified CORS setup (replaces the manual header block)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE","PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
// app.options("*", cors());

// Body Parsers (FIX: Removed duplicate bodyParser.json() to prevent stream errors)
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// ================= SERVING STATIC FILES =================
// Fixed positioning: Static files are served with specific headers for PDF/Office viewing
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
      res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");

      // Auto-set Content-Type based on extension
      const ext = path.extname(filePath).toLowerCase();
      const mimeTypes = {
        ".pdf": "application/pdf",
        ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ".doc": "application/msword",
        ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ".xls": "application/vnd.ms-excel",
        ".pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        ".ppt": "application/vnd.ms-powerpoint",
      };
      if (mimeTypes[ext]) {
        res.setHeader("Content-Type", mimeTypes[ext]);
      }
    },
  })
);

// ================= ROUTES IMPORT =================
const homeRoute = require("./routes/home.route");
const teacherRoute = require("./routes/teacher.route");
const studentRoute = require("./routes/student.route");
const semesterRoute = require("./routes/semester.route");
const courseRoute = require("./routes/course.route");
const assignmentPostedRoute = require("./routes/assignmentPosted.route");
const assignmentGradeRoute = require("./routes/assignmentGrade.route.js");
const assignmentSubmittedRoute = require("./routes/assignmentSubmitted.route.js");
const noticeRoute = require("./routes/notice.route.js");
const attendanceRoute = require("./routes/attendence.route.js");
const adminRoute = require("./routes/admin.route.js");
const notificationRoute = require("./routes/notification.route.js");
const notificationSettingRoute = require("./routes/notificationSetting.route.js");
const assignmentViewRoute = require("./routes/assignmentView.route.js");

// ================= API ROUTES MAPPING =================
app.use("/api", homeRoute);
app.use("/api/teacher", teacherRoute);
app.use("/api/student", studentRoute);
app.use("/api/semester", semesterRoute);
app.use("/api/course", courseRoute);
app.use("/api/assignmentPosted", assignmentPostedRoute);
app.use("/api/assignmentgrade", assignmentGradeRoute);
app.use("/api/assignmentsubmitted", assignmentSubmittedRoute);
app.use("/api/notice", noticeRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/admin", adminRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/notification-settings", notificationSettingRoute);
app.use("/api/assignment-record-view", assignmentViewRoute);

// ================= START SERVER =================
// Use server.listen (not app.listen) so Socket.io works
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});