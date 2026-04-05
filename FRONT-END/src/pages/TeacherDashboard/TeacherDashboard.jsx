import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TeacherNavbar from "../../components/TeacherNavbar/TeacherNavbar";

const TeacherDashboard = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/teacher/login");
    }
  }, [token, navigate]);

  // ================= STATES =================
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [gradedCount, setGradedCount] = useState(0);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, submitRes] = await Promise.all([
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentSubmitted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // filter teacher assignments
        const teacherAssignments = assignRes.data.filter(
          (a) => String(a.teacherId?._id || a.teacherId) === teacherId
        );

        setAssignments(teacherAssignments);

        // submissions related to teacher assignments
        const teacherSubmissions = submitRes.data.filter((s) =>
          teacherAssignments.some(
            (a) =>
              String(a._id) ===
              String(s.assignmentId?._id || s.assignmentId)
          )
        );

        setSubmissions(teacherSubmissions);

        // graded count
        const graded = teacherSubmissions.filter(
          (s) => s.marks && s.marks > 0
        ).length;

        setGradedCount(graded);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      }
    };

    if (token && teacherId) fetchData();
  }, [token, teacherId]);

  // ================= UI =================
  return (
      <>
      <TeacherNavbar />
    <Container maxWidth="lg">
      <Typography variant="h4" sx={{ mt: 4, mb: 3 }} fontWeight="bold">
        Teacher Dashboard
      </Typography>

      {/* KPI CARDS */}
      <Grid container spacing={3}>
        <Grid size={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Assignments</Typography>
            <Typography variant="h4">
              {assignments.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Submissions</Typography>
            <Typography variant="h4">
              {submissions.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">Graded</Typography>
            <Typography variant="h4">
              {gradedCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ACTION BUTTONS */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid>
          <Button
            variant="contained"
            onClick={() => navigate("/teacher/addassignment")}
          >
            Add Assignment
          </Button>
        </Grid>

        <Grid>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => navigate("/teacher/AssignmentSubmittedList")}
          >
            View Submissions
          </Button>
        </Grid>

        <Grid>
          <Button
            variant="outlined"
            onClick={() => navigate("/teacher/add-grade")}
          >
            Grade Assignments
          </Button>
        </Grid>
      </Grid>

      {/* RECENT SUBMISSIONS */}
      <Typography variant="h5" size={{ mt: 5 }}>
        Recent Submissions
      </Typography>

      {submissions.slice(0, 5).map((s) => (
        <Paper key={s._id} sx={{ p: 2, mt: 2 }}>
          <Typography>
            Student: {s.studentId?.studentName || "Unknown"}
          </Typography>

          <Typography>
            Assignment: {s.assignmentId?.title || "N/A"}
          </Typography>

          <Typography>
            Marks: {s.marks || 0}
          </Typography>

          <Button
            size="small"
            sx={{ mt: 1 }}
            onClick={() =>
              navigate("/teacher/add-grade", {
                state: {
                  assignmentId:
                    s.assignmentId?._id || s.assignmentId,
                  studentId:
                    s.studentId?._id || s.studentId,
                },
              })
            }
          >
            Grade
          </Button>
        </Paper>
      ))}
    </Container>
    </>
  );
};

export default TeacherDashboard;