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
import NotificationSettings from "./components/NotificationSetting/NotificationSetting";
import StudentGrades from "./pages/StudentGrades/StudentGrades";
import Grades from "./pages/Grades/Grades";
import StudentAssignments from "./pages/StudentAssignments/StudentAssignments";
import AuthLanding from "./pages/AuthLanding/AuthLanding";
import AssignmentSubmitAdd from "./AssignmentSubmitAddId/AssignmentSubmitAddId";
import AttendanceView from "./pages/AttendenceView/AttendenceView";
import AttendanceViewByCourse from "./pages/AttendenceViewByCourse/AttendenceViewByCourse";
import AssignmentGradeById from "./pages/AssignmentGradeById/AssignmentGradeById";
import CourseAdd from "./pages/CourseAdd/CourseAdd";
import CourseView from "./pages/CourseView/CourseView";
import CourseUpdate from "./pages/CourseUpdate/CourseUpdate";
import CourseSingleView from "./pages/SingleCourseView/SingleCourseView";
import SemesterAdd from "./pages/SemesterAdd/SemesterAdd";
import SemesterView from "./pages/SemesterView/SemesterView";
import SemesterUpdate from "./pages/SemesterUpdate/SemesterUpdate";
import SemesterSingleView from "./pages/SemesterSingleView/SemesterSingleView";
import AssignmentRecord from "./pages/AssignmentRecord/AssignmentRecord";
import AssignmentRecordView from "./pages/AssignmentRecordView/AssignmentRecordView";
import TeacherAssignmentList from "./pages/TeacherAssignmentList/TeacherAssignmentList";
import ViewAssignment from "./pages/ViewAssignment/ViewAssignment";
import EditAssignment from "./pages/EditAssignment/EditAssignment";
import AssignmentGradeUpdate from "./pages/AssignmentGradeUpdate/AssignmentGradeUpdate";
import AttendanceDetailsView from "./pages/AttendanceDetailsView/AttendanceDetailsView";
const NotFound = () => <h1>404 - Page Not Found</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ✅ PUBLIC ROUTE */}
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/teacher/signup" element={<TeacherSignUp />} />
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/student/signup" element={<SignUp_student />} />
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/" element={<AuthLanding />} />

        {/* ✅ PROTECTED ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" />} />
          <Route path="studentlist" element={<StudentList />} />
          <Route path="teacherslist" element={<TeacherList />} />
          <Route path="teachers/edit/:id" element={<TeacherEdit />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="notice" element={<NoticeBoardAdmin />} />
          <Route path="student/edit/:id" element={<StudentEdit />} />
          <Route path="courseadd" element={<CourseAdd />} />
          <Route path="courseupdate/:id" element={<CourseUpdate />} />
          <Route path="courseview" element={<CourseView />} />
          <Route path="courseview/:id" element={<CourseSingleView />} />
          <Route path="semesteradd" element={<SemesterAdd />} />
          <Route path="semesterview" element={<SemesterView />} />
          <Route path="semesterview/:id" element={<SemesterSingleView />} />
          <Route path="semesterupdate/:id" element={<SemesterUpdate />} />
        </Route>

        {/* STUDENT ROUTE */}
        <Route path="/student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="assignmentsubmit" element={<AssignmentSubmit />} />
          <Route path="noticeboard" element={<NoticeBoard />} />
          <Route path="NotificationSettings" element={<NotificationSettings />} />
          <Route path="grades" element={<Grades />} />
          <Route path="assignments" element={<StudentAssignments />} />
          <Route path="AssignmentSubmitAdd/:id" element={<AssignmentSubmitAdd />} />
        </Route>

        {/* TEACHER ROUTE */}
        <Route path="/teacher" element={<TeacherLayout />}>
          <Route path="addassignment" element={<AddAssignment />} />
          <Route path="studentgrades" element={<StudentGrades />} />
          <Route path="AssignmentSubmittedList" element={<AssignmentSubmittedList />} />
          <Route path="add-grade" element={<AddAssignmentGrade />} />
          <Route path="dashboard" element={<TeacherDashboard />} />
          <Route path="attendance" element={<AttendanceMark />} />
          <Route path="attendanceview" element={<AttendanceView />} />
          {/* <Route path="attendanceview/:courseId" element={<AttendanceViewByCourse />} /> */}
          <Route path="attendanceview/:id" element={<AttendanceDetailsView />} />
          <Route path="AssignmentGradeBySubmissionId/:submissionId" element={<AssignmentGradeById />} />
          <Route path="assignmentrecord" element={<AssignmentRecord />} />
          <Route path="assignment-record-view/:id" element={<AssignmentRecordView />} />
          <Route path="teacherassignmentlist" element={<TeacherAssignmentList />} />
          <Route path="view-assignment/:id" element={<ViewAssignment />} />
          <Route path="edit-assignment/:_id" element={<EditAssignment />} />
          <Route path="update-grade/:gradeId" element={<AssignmentGradeUpdate />} />
        </Route>

        {/* CATCH-ALL ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
