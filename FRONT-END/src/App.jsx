import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

// Dummy components (replace later with your real pages)
import AdminLayout from "./layouts/AdminLayout";
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
import AdminLogin from "./pages/Adminlogin/AdminLogin";
import StudentLayout from "./layouts/StudentLayout";
import TeacherLayout from "./layouts/TeacherLayout";
const NotFound = () => <h1>404 - Page Not Found</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTE */}
        <Route path="/" element={<Home />} />
        <Route path="/noticeboard" element={<NoticeBoard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/teacher/signup" element={<TeacherSignUp />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/student/signup" element={<SignUp_student />} />
        <Route path="/student/login" element={<StudentLogin />} />

        {/* ✅ PROTECTED ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="studentlist" element={<StudentList />} />
          <Route path="teacherslist" element={<TeacherList />} />
          <Route path="teachers/edit/:id" element={<TeacherEdit />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="notice" element={<NoticeBoardAdmin />} />
          <Route path="student/edit/:id" element={<StudentEdit />} />
        </Route>

        {/* STUDENT ROUTE */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="assignmentsubmit" element={<AssignmentSubmit />} />
          <Route path="dashboard" element={<StudentDashboard />} />
        </Route>

        {/* TEACHER ROUTE */}
        <Route path="/teacher" element={<TeacherLayout />}>
        {/* fixing teacherlayout and geting semester id from course table and showing in add assignment page */}
          <Route path="addassignment" element={<AddAssignment />} />
          <Route path="AssignmentSubmittedList" element={<AssignmentSubmittedList />} />
          <Route path="add-grade" element={<AddAssignmentGrade />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<AttendanceMark />} />
          {/* <Route path="/update-grade/:id" element={<UpdateGrade />} /> */}
        </Route>

        {/* CATCH-ALL ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
