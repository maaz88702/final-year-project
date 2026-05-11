const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

require("dotenv").config();

const app = express();

const port =
  process.env.PORT || 3000;

// ================= DB CONNECTION =================
require("./config/conn.js");

// ================= HTTP SERVER =================
const server =
  http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin:
      "http://localhost:5173",

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    credentials: true,
  },
});

// ================= GLOBAL SOCKET =================
global.io = io;

// ================= SOCKET EVENTS =================
io.on("connection", (socket) => {
  console.log(
    "User Connected:",
    socket.id
  );

  socket.on(
    "joinRoom",
    (userId) => {
      socket.join(userId);

      console.log(
        "Joined Room:",
        userId
      );
    }
  );

  socket.on(
    "disconnect",
    () => {
      console.log(
        "User Disconnected"
      );
    }
  );
});

// ================= GLOBAL HEADERS =================
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    "http://localhost:5173"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "*"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );

  res.header(
    "Cross-Origin-Resource-Policy",
    "cross-origin"
  );

  next();
});

// ================= CORS =================
app.use(
  cors({
    origin:
      "http://localhost:5173",

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "OPTIONS",
    ],
  })
);

// ================= MIDDLEWARES =================
app.use(express.json());

app.use(
  bodyParser.json()
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(morgan("dev"));

// ================= STATIC UPLOADS =================
app.use(
  "/uploads",
  express.static(
    path.join(
      __dirname,
      "uploads"
    ),
    {
      setHeaders: (
        res,
        filePath
      ) => {
        // CORS
        res.setHeader(
          "Access-Control-Allow-Origin",
          "http://localhost:5173"
        );

        res.setHeader(
          "Access-Control-Allow-Methods",
          "GET, OPTIONS"
        );

        res.setHeader(
          "Access-Control-Allow-Headers",
          "*"
        );

        // REQUIRED FOR PDF / DOC VIEWERS
        res.setHeader(
          "Cross-Origin-Resource-Policy",
          "cross-origin"
        );

        res.setHeader(
          "Cross-Origin-Embedder-Policy",
          "unsafe-none"
        );

        // FILE TYPES
        if (
          filePath.endsWith(
            ".pdf"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/pdf"
          );
        }

        if (
          filePath.endsWith(
            ".docx"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          );
        }

        if (
          filePath.endsWith(
            ".doc"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/msword"
          );
        }

        if (
          filePath.endsWith(
            ".xlsx"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          );
        }

        if (
          filePath.endsWith(
            ".xls"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/vnd.ms-excel"
          );
        }

        if (
          filePath.endsWith(
            ".pptx"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation"
          );
        }

        if (
          filePath.endsWith(
            ".ppt"
          )
        ) {
          res.setHeader(
            "Content-Type",
            "application/vnd.ms-powerpoint"
          );
        }
      },
    }
  )
);

// ================= ROUTES =================
const homeRoute = require(
  "./routes/home.route"
);

const teacherRoute = require(
  "./routes/teacher.route"
);

const studentRoute = require(
  "./routes/student.route"
);

const semesterRoute = require(
  "./routes/semester.route"
);

const courseRoute = require(
  "./routes/course.route"
);

const assignmentPostedRoute = require(
  "./routes/assignmentPosted.route"
);

const assignmentGradeRoute = require(
  "./routes/assignmentGrade.route.js"
);

const assignmentSubmittedRoute = require(
  "./routes/assignmentSubmitted.route.js"
);

const noticeRoute = require(
  "./routes/notice.route.js"
);

const attendanceRoute = require(
  "./routes/attendence.route.js"
);

const adminRoute = require(
  "./routes/admin.route.js"
);

const notificationRoute = require(
  "./routes/notification.route.js"
);

const notificationSettingRoute = require(
  "./routes/notificationSetting.route.js"
);

// ================= API ROUTES =================
app.use("/api", homeRoute);

app.use(
  "/api/teacher",
  teacherRoute
);

app.use(
  "/api/student",
  studentRoute
);

app.use(
  "/api/semester",
  semesterRoute
);

app.use(
  "/api/course",
  courseRoute
);

app.use(
  "/api/assignmentPosted",
  assignmentPostedRoute
);

app.use(
  "/api/assignmentgrade",
  assignmentGradeRoute
);

app.use(
  "/api/assignmentsubmitted",
  assignmentSubmittedRoute
);

app.use(
  "/api/notice",
  noticeRoute
);

app.use(
  "/api/attendance",
  attendanceRoute
);

app.use(
  "/api/admin",
  adminRoute
);

app.use(
  "/api/notification",
  notificationRoute
);

app.use(
  "/api/notification-settings",
  notificationSettingRoute
);

// ================= START SERVER =================
server.listen(port, () => {
  console.log(
    `Server running on ${port}`
  );
});