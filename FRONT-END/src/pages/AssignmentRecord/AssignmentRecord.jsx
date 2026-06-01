import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Chip,
  IconButton,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AssignmentRecord = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);

  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [studentRecords, setStudentRecords] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [studentRes, assignmentRes, gradeRes] =
          await Promise.all([
            axios.get(`${baseURL}/api/student`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            axios.get(`${baseURL}/api/assignmentPosted`, {
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

        setStudents(studentRes.data);
        setAssignments(assignmentRes.data);
        setGrades(gradeRes.data);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load records");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // ================= FILTER RECORDS =================
  useEffect(() => {
    if (!selectedStudent) {
      setStudentRecords([]);
      return;
    }

    const filteredGrades = grades.filter(
      (g) =>
        String(g.studentId?._id || g.studentId) ===
        String(selectedStudent)
    );

    const records = filteredGrades.map((grade) => {
      const assignment = assignments.find(
        (a) =>
          String(a._id) ===
          String(grade.assignmentId?._id || grade.assignmentId)
      );

      return {
        _id: grade._id,
        title: assignment?.title || "N/A",
        totalMarks: assignment?.totalMarks || 0,
        obtainedMarks: grade.obtainmarks || 0,
        course:
          assignment?.courseId?.courseTitle || "N/A",
        createdAt: grade.createdAt,
        details: grade.details || [],
      };
    });

    setStudentRecords(records);

  }, [selectedStudent, grades, assignments]);

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>

      {/* ================= TITLE ================= */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        Assignment Record
      </Typography>

      {/* ================= FILTER ================= */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{xs:12, md:6}} >
            <TextField
              select
              fullWidth
              label="Select Student"
              value={selectedStudent}
              onChange={(e) =>
                setSelectedStudent(e.target.value)
              }
            >
              {students.map((student) => (
                <MenuItem
                  key={student._id}
                  value={student._id}
                >
                  {student.studentName} ({student.rollNo})
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= TABLE ================= */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#1976d2",
              }}
            >
              <TableCell sx={{ color: "white" }}>#</TableCell>
              <TableCell sx={{ color: "white" }}>Assignment</TableCell>
              <TableCell sx={{ color: "white" }}>Course</TableCell>
              <TableCell sx={{ color: "white" }}>Total Marks</TableCell>
              <TableCell sx={{ color: "white" }}>Obtained Marks</TableCell>
              <TableCell sx={{ color: "white" }}>Percentage</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {studentRecords.length > 0 ? (
              studentRecords.map((record, index) => {

                const percentage =
                  record.totalMarks > 0
                    ? (
                        (record.obtainedMarks /
                          record.totalMarks) *
                        100
                      ).toFixed(1)
                    : 0;

                return (
                  <TableRow key={record._id} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{record.title}</TableCell>
                    <TableCell>{record.course}</TableCell>
                    <TableCell>
                      <Chip
                        label={record.totalMarks}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={record.obtainedMarks}
                        color="success"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${percentage}%`}
                        color={percentage >= 50 ? "success" : "error"}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Detailed Record">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/teacher/assignment-record-view/${record._id}`)}
                          sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  No assignment record found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default AssignmentRecord;