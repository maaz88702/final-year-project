import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Dummy components (replace later with your real pages)
import Home from './pages/Home/Home';
import SignUp_student from "./pages/Signup_student/Signup_student";
import StudentLogin from "./pages/Student_login/Student_login";
import TeacherSignUp from "./pages/Teacher_signup/Teacher_signup";
import TeacherLogin from "./pages/Teacher_login/Teacher_login";
import StudentList from "./pages/StudentList/StudentList";
import StudentEdit from "./pages/StudentEdit/StudentEdit";
import TeacherList from "./pages/TeacherList/TeacherList";
import TeacherEdit from "./pages/TeacherEdit/TeacherEdit";
import AddAssignment from "./pages/AddAssignment/AddAssignment";
import AddAssignmentGrade from "./pages/AssignmentGradeAdd/AssignmentGradeAdd";
import AssignmentSubmit from "./pages/AssignmentSubmit/AssignmentSubmit";
import AssignmentSubmittedList from "./pages/AssignmentSubmittedList/AssignmentSubmittedList";
import TeacherDashboard from "./pages/TeacherDashboard/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import NoticeBoardAdmin from "./pages/NoticeBoardAdmin/NoticeBoardAdmin";
import NoticeBoard from "./pages/NoticeBoard/NoticeBoard";
import AttendanceMark from "./pages/AttendenceMarks/AttendenceMarks";
const NotFound = () => <h1>404 - Page Not Found</h1>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/student/signup" element={<SignUp_student />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/admin/studentlist" element={<StudentList />} />
        <Route path="/student/edit/:id" element={<StudentEdit />} />
      
        <Route path="/student/assignmentsubmit" element={<AssignmentSubmit />} />

        <Route path="/teacher/signup" element={<TeacherSignUp />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/admin/teacherslist" element={<TeacherList />} />
        <Route path="/admin/teachers/edit/:id" element={<TeacherEdit />} />
        <Route path="/teacher/addassignment" element={<AddAssignment />} />
        <Route path="/teacher/AssignmentSubmittedList" element={<AssignmentSubmittedList />} />
         <Route path="/teacher/add-grade" element={<AddAssignmentGrade />} /> 
         <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> 
         <Route path="/student/dashboard" element={<StudentDashboard />} /> 
         <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
         <Route path="/admin/notice" element={<NoticeBoardAdmin />} /> 
         <Route path="/noticeboard" element={<NoticeBoard />} /> 
         <Route path="/teacher/attendance" element={<AttendanceMark />} /> 
        {/* <Route path="/update-grade/:id" element={<UpdateGrade />} />  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
