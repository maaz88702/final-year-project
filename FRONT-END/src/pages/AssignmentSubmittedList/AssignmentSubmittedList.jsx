import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  IconButton,
  Box,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material";

import {
  Delete,
  Download,
  Grade,
} from "@mui/icons-material";

import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AssignmentSubmittedList = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  // ================= TEACHER ID =================
  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch submissions, posted assignments, and grades to cross-reference
      const [submissionRes, assignmentRes, gradeRes] = await Promise.all([
        axios.get(`${baseURL}/api/assignmentSubmitted`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/assignmentPosted`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/assignmentgrade`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      // 1. Get assignments belonging to this teacher
      const teacherAssignments = assignmentRes.data.filter(
        (assignment) =>
          String(assignment.teacherId?._id || assignment.teacherId) === String(teacherId)
      );
      setAssignments(teacherAssignments);

      const teacherAssignmentIds = teacherAssignments.map((a) => String(a._id));

      // 2. Identify submission IDs that have already been graded
      // Checks both populated items and raw string properties safely
      const gradedSubmissionIds = gradeRes.data.map((grade) => 
        String(grade.submissionId?._id || grade.submissionId || "")
      );

      // 3. Filter submissions: Must belong to teacher AND must NOT be graded yet
      const ungradedTeacherSubmissions = submissionRes.data.filter((submission) => {
        const belongsToTeacher = teacherAssignmentIds.includes(
          String(submission.assignmentId?._id || submission.assignmentId)
        );
        const isAlreadyGraded = gradedSubmissionIds.includes(String(submission._id));

        return belongsToTeacher && !isAlreadyGraded;
      });

      setData(ungradedTeacherSubmissions);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && teacherId) {
      fetchData();
    }
  }, []);

  // ================= FILTERED DATA =================
  const filteredData = useMemo(() => {
    if (!selectedAssignment) {
      return data;
    }

    return data.filter(
      (item) =>
        String(item.assignmentId?._id || item.assignmentId) === selectedAssignment
    );
  }, [data, selectedAssignment]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this submission?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${baseURL}/api/assignmentSubmitted/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Deleted successfully");
      setData((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file found");
      return;
    }
    const fileURL = `${baseURL}/${filePath}`;
    window.open(fileURL, "_blank");
  };

  // ================= LOADING STATE =================
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight="bold">
            Pending Submissions
          </Typography>

          <Chip
            label={`${filteredData.length} Ungraded`}
            color="warning"
          />
        </Box>

        {/* FILTER */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item size={{ xs: 12 }}>
            <TextField
              select
              fullWidth
              label="Filter by Assignment"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              <MenuItem value="">All Assignments</MenuItem>
              {assignments.map((assignment) => (
                <MenuItem key={assignment._id} value={assignment._id}>
                  {assignment.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* EMPTY STATE */}
        {filteredData.length === 0 && (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Typography variant="h6" color="textSecondary">
              All submissions are graded! No pending assignments found.
            </Typography>
          </Paper>
        )}

        {/* SUBMISSIONS LIST */}
        {filteredData.map((item) => (
          <Paper
            key={item._id}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography mb={1}>
              <strong>Student:</strong> {item.studentId?.studentName} —{" "}
              <strong>{item.studentId?.rollNo}</strong>
            </Typography>

            <Typography mb={1}>
              <strong>Assignment:</strong> {item.assignmentId?.title}
            </Typography>

            <Typography mb={1}>
              <strong>Submitted:</strong>{" "}
              {new Date(item.createdAt).toLocaleString()}
            </Typography>

            {/* ACTIONS */}
            <Box display="flex" gap={1} mt={2}>
              {/* DOWNLOAD */}
              <Tooltip title="Download Submission">
                <IconButton
                  color="primary"
                  onClick={() => handleDownload(item.file)}
                >
                  <Download />
                </IconButton>
              </Tooltip>

              {/* GRADE ASSIGNMENT */}
              <Tooltip title="Grade Assignment">
                <IconButton
                  color="success"
                  onClick={() => navigate(`/teacher/AssignmentGradeBySubmissionId/${item._id}`)}
                  sx={{ '&:hover': { backgroundColor: 'rgba(46, 125, 50, 0.08)' } }}
                >
                  <Grade />
                </IconButton>
              </Tooltip>

              {/* DELETE */}
              <Tooltip title="Delete Submission">
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  <Delete />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default AssignmentSubmittedList;