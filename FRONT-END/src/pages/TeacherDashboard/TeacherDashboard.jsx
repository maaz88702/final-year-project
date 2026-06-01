import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const TeacherDashboard = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [gradedCount, setGradedCount] = useState(0);

  const token = localStorage.getItem("jwt");

  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid Token", err);
    }
  }

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/teacher/login");
    }
  }, [token, navigate]);

  // ================= FETCH DASHBOARD =================
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [assignRes, submitRes, gradeRes] = await Promise.all([
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get(`${baseURL}/api/assignmentsubmitted`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          axios.get(`${baseURL}/api/assignmentgrade`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

        // ================= TEACHER ASSIGNMENTS =================

        const teacherAssignments = assignRes.data.filter(
          (assignment) =>
            String(
              assignment.teacherId?._id || assignment.teacherId
            ) === String(teacherId)
        );

        setAssignments(teacherAssignments);

        // ================= TEACHER SUBMISSIONS =================

        const teacherSubmissions = submitRes.data.filter(
          (submission) =>
            teacherAssignments.some(
              (assignment) =>
                String(assignment._id) ===
                String(
                  submission.assignmentId?._id ||
                    submission.assignmentId
                )
            )
        );

        setSubmissions(teacherSubmissions);

        // ================= GRADED COUNT =================

        const teacherGrades = gradeRes.data.filter((grade) =>
          teacherAssignments.some(
            (assignment) =>
              String(assignment._id) ===
              String(
                grade.assignmentId?._id ||
                  grade.assignmentId
              )
          )
        );

        setGradedCount(teacherGrades.length);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    if (token && teacherId) {
      fetchDashboard();
    }
  }, [token, teacherId]);

  // ================= LOADER =================

  if (loading) {
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mt: 4, mb: 4 }}
      >
        Teacher Dashboard
      </Typography>

      {/* KPI CARDS */}

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Assignments
            </Typography>

            <Typography
              variant="h3"
              color="primary"
              fontWeight="bold"
            >
              {assignments.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Submissions
            </Typography>

            <Typography
              variant="h3"
              color="success.main"
              fontWeight="bold"
            >
              {submissions.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6">
              Graded
            </Typography>

            <Typography
              variant="h3"
              color="secondary"
              fontWeight="bold"
            >
              {gradedCount}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* ACTION BUTTONS */}

      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item>
          <Button
            variant="contained"
            onClick={() =>
              navigate("/teacher/addassignment")
            }
          >
            Add Assignment
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            onClick={() =>
              navigate(
                "/teacher/AssignmentSubmittedList"
              )
            }
          >
            View Submissions
          </Button>
        </Grid>

        <Grid item>
          <Button
            variant="outlined"
            onClick={() =>
              navigate("/teacher/add-grade")
            }
          >
            Grade Assignments
          </Button>
        </Grid>
      </Grid>

      {/* RECENT SUBMISSIONS */}

      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mt: 5 }}
      >
        Recent Submissions
      </Typography>

      {submissions.length === 0 ? (
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography>
            No submissions found.
          </Typography>
        </Paper>
      ) : (
        submissions.slice(0, 5).map((submission) => (
          <Paper
            key={submission._id}
            sx={{ p: 2, mt: 2 }}
          >
            <Typography>
              <strong>Student:</strong>{" "}
              {submission.studentId?.studentName ||
                "Unknown"}
            </Typography>

            <Typography>
              <strong>Assignment:</strong>{" "}
              {submission.assignmentId?.title ||
                "N/A"}
            </Typography>

            <Typography>
              <strong>Submitted:</strong>{" "}
              {new Date(
                submission.createdAt
              ).toLocaleDateString()}
            </Typography>

            <Button
              size="small"
              sx={{ mt: 1 }}
              onClick={() =>
                navigate(
                  `/teacher/AssignmentGradeBySubmissionId/${submission._id}`,
                  {
                    state: {
                      assignmentId:
                        submission.assignmentId?._id ||
                        submission.assignmentId,

                      studentId:
                        submission.studentId?._id ||
                        submission.studentId,
                    },
                  }
                )
              }
            >
              View / Grade
            </Button>
          </Paper>
        ))
      )}
    </Container>
  );
};

export default TeacherDashboard;