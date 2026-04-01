const express=require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const app=express();
require("dotenv").config();
const port=process.env.PORT||3000;
const connection = require("./config/conn.js");

app.use(cors());

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


app.use('/api',homeRoute)
app.use('/api/teacher',teacherRoute)
app.use('/api/student',studentRoute)
app.use('/api/semester',semesterRoute)
app.use('/api/assignmentPosted',assignmentPostedRoute)
app.use('/api/assignmentgrade',assignmentGradeRoute)
app.use('/api/assignmentsubmitted',assignmentSubmittedRoute)
app.use('/api/course',courseRoute)
// app.use('/api/teacher/assignment',homeRoute)
// app.use('/api/student/assignment',homeRoute)

app.listen(port,()=>{
    console.log(`app is listening on ${port}`);
})