import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Box,
  Stack,
  Avatar,
  Divider,
} from "@mui/material";
import {
  Assignment as AssignmentIcon,
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Visibility as ViewIcon,
  Grading as GradeIcon,
  ChevronRight as ChevronRightIcon,
} from "@mui/icons-material";
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
            String(assignment.teacherId?._id || assignment.teacherId) ===
            String(teacherId)
        );
        setAssignments(teacherAssignments);

        // ================= TEACHER SUBMISSIONS =================
        const teacherSubmissions = submitRes.data.filter((submission) =>
          teacherAssignments.some(
            (assignment) =>
              String(assignment._id) ===
              String(submission.assignmentId?._id || submission.assignmentId)
          )
        );
        setSubmissions(teacherSubmissions);

        // ================= GRADED COUNT =================
        const teacherGrades = gradeRes.data.filter((grade) =>
          teacherAssignments.some(
            (assignment) =>
              String(assignment._id) ===
              String(grade.assignmentId?._id || grade.assignmentId)
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
        <CircularProgress thickness={4} size={50} />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* HEADER SECTION */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="800" color="text.primary">
          Teacher Dashboard
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mt: 0.5 }}>
          Welcome back! Here is an overview of your active assignments and student tracking.
        </Typography>
      </Box>

      {/* KPI CARDS */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                Assignments
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "primary.main" }}>
                {assignments.length}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "primary.lighter", color: "primary.main", width: 56, height: 56 }}>
              <AssignmentIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                Submissions
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "success.main" }}>
                {submissions.length}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "success.lighter", color: "success.main", width: 56, height: 56 }}>
              <UploadIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transition: "transform 0.2s",
              "&:hover": { transform: "translateY(-4px)" },
            }}
          >
            <Box>
              <Typography variant="subtitle2" color="text.secondary" fontWeight="600">
                Graded
              </Typography>
              <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: "secondary.main" }}>
                {gradedCount}
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: "secondary.lighter", color: "secondary.main", width: 56, height: 56 }}>
              <CheckCircleIcon fontSize="large" />
            </Avatar>
          </Paper>
        </Grid>
      </Grid>

      {/* QUICK ACTIONS */}
      <Box sx={{ mb: 5 }}>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          Quick Actions
        </Typography>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={() => navigate("/teacher/addassignment")}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "600", textTransform: "none" }}
            >
              Add Assignment
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              size="large"
              startIcon={<ViewIcon />}
              onClick={() => navigate("/teacher/AssignmentSubmittedList")}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "600", textTransform: "none" }}
            >
              View Submissions
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GradeIcon />}
              onClick={() => navigate("/teacher/add-grade")}
              sx={{ py: 1.5, borderRadius: 2, fontWeight: "600", textTransform: "none", borderWidth: 2, "&:hover": { borderWidth: 2 } }}
            >
              Grade Assignments
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* RECENT SUBMISSIONS AREA */}
      <Box>
        <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
          Recent Submissions
        </Typography>

        {submissions.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed", borderColor: "divider" }}>
            <Typography color="text.secondary" variant="body1">
              No submissions records found.
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {submissions.slice(0, 5).map((submission) => (
              <Paper
                key={submission._id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  "&:hover": { bgcolor: "action.hover" },
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: "primary.main", fontWeight: "bold" }}>
                    {submission.studentId?.studentName?.charAt(0) || "?"}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="600">
                      {submission.studentId?.studentName || "Unknown Student"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Assignment: <Box component="span" fontWeight="500" color="text.primary">{submission.assignmentId?.title || "N/A"}</Box>
                    </Typography>
                  </Box>
                </Stack>

                <Stack 
                  direction={{ xs: "row", sm: "row" }} 
                  alignItems="center" 
                  justifyContent="space-between" 
                  sx={{ width: { xs: "100%", sm: "auto" }, gap: 3 }}
                >
                  <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                    <Typography variant="caption" color="text.secondary" display="block">
                      Date Submitted
                    </Typography>
                    <Typography variant="body2" fontWeight="500">
                      {new Date(submission.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      })}
                    </Typography>
                  </Box>
                  
                  <Button
                    variant="text"
                    color="primary"
                    endIcon={<ChevronRightIcon />}
                    fontWeight="600"
                    onClick={() =>
                      navigate(
                        `/teacher/AssignmentGradeBySubmissionId/${submission._id}`,
                        {
                          state: {
                            assignmentId: submission.assignmentId?._id || submission.assignmentId,
                            studentId: submission.studentId?._id || submission.studentId,
                          },
                        }
                      )
                    }
                  >
                    Grade
                  </Button>
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>
    </Container>
  );
};

export default TeacherDashboard;