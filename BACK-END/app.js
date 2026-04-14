const express=require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app=express();
require("dotenv").config();
const port=process.env.PORT||3000;
const connection = require("./config/conn.js");
const path = require("path");

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const homeRoute=require('./routes/home.route');
const teacherRoute=require('./routes/teacher.route');
const studentRoute=require('./routes/student.route');
const semesterRoute=require('./routes/semester.route');
const courseRoute=require('./routes/course.route');
const assignmentPostedRoute=require('./routes/assignmentPosted.route');
const assignmentGradeRoute=require('./routes/assignmentGrade.route.js')
const assignmentSubmittedRoute=require('./routes/assignmentSubmitted.route.js')
const noticeRoute=require('./routes/notice.route.js')
const attandenceRoute=require("./routes/attendence.route.js")
const adminRoute=require("./routes/admin.route.js")


app.use('/api',homeRoute)
app.use('/api/teacher',teacherRoute)
app.use('/api/student',studentRoute)
app.use('/api/semester',semesterRoute)
app.use('/api/assignmentPosted',assignmentPostedRoute)
app.use('/api/assignmentgrade',assignmentGradeRoute)
app.use('/api/assignmentsubmitted',assignmentSubmittedRoute)
app.use('/api/course',courseRoute)
app.use('/api/notice',noticeRoute)
app.use('/api/attendance',attandenceRoute)
app.use('/api/admin',adminRoute)

app.listen(port,()=>{
    console.log(`app is listening on ${port}`);
})