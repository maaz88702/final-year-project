const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

/* DB Connection */
require("./config/conn.js");

/* Create HTTP Server */
const server = http.createServer(app);

/* Socket.io */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

/* Global use in controllers */
global.io = io;

/* Socket Events */
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

/* Middlewares */
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/* Routes */
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

/* APIs */
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

/* Start Server */
server.listen(port, () => {
  console.log(`Server running on ${port}`);
});