import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Divider,
  Stack,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Edit, Search, Assignment, Person } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const StudentGrades = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🌟 NEW STATE FOR FILTERS
  const [studentFilter, setStudentFilter] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("");

  // ================= TOKEN =================
  const token = localStorage.getItem("jwt");
  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token parsing error:", err);
    }
  }

  // ================= FETCH =================
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/assignmentGrade`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ FILTER GRADES BELONGING TO THIS TEACHER
        const myGrades = res.data.filter((g) => {
          const assignmentTeacherId =
            g.assignmentId?.teacherId?._id || g.assignmentId?.teacherId;

          return String(assignmentTeacherId) === String(teacherId);
        });

        setGrades(myGrades);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && teacherId) {
      fetchGrades();
    }
  }, [token, teacherId]);

  // ================= HELPER: GROUP DETAILS BY QUESTION =================
  const groupDetailsByQuestion = (details) => {
    if (!details || !Array.isArray(details)) return [];
    
    const groups = {};
    details.forEach((item) => {
      const qText = item.question || "Criteria Item";
      if (!groups[qText]) {
        groups[qText] = {
          questionText: qText,
          rubricsList: []
        };
      }
      groups[qText].rubricsList.push({
        rubric: item.rubric,
        level: item.level,
        marks: item.marks || 0
      });
    });
    
    return Object.values(groups);
  };

  // ================= 🌟 DYNAMIC FILTER LOGIC =================
  const filteredGrades = grades.filter((grade) => {
    const studentName = grade.studentId?.studentName || "";
    const assignmentTitle = grade.assignmentId?.title || "";

    const matchesStudent = studentName
      .toLowerCase()
      .includes(studentFilter.toLowerCase());

    const matchesAssignment = assignmentTitle
      .toLowerCase()
      .includes(assignmentFilter.toLowerCase());

    return matchesStudent && matchesAssignment;
  });

  // ================= LOADING =================
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Typography variant="h5" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
        Students Grades
      </Typography>

      {/* ================= 🌟 FILTER CONTROL DASHBOARD ================= */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 4, 
          borderRadius: 3, 
          border: "1px solid", 
          borderColor: "divider",
          bgcolor: "background.neutral" 
        }}
      >
        <Typography variant="subtitle2" fontWeight="700" color="text.secondary" sx={{ mb: 1.5 }}>
          Filter Evaluation Records
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField
            fullWidth
            size="small"
            label="Search Student"
            placeholder="Type student name..."
            value={studentFilter}
            onChange={(e) => setStudentFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            size="small"
            label="Search Assignment"
            placeholder="Type assignment title..."
            value={assignmentFilter}
            onChange={(e) => setAssignmentFilter(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Assignment fontSize="small" color="action" />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Paper>

      {/* ================= LIST ITEMS ================= */}
      {filteredGrades.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px dashed", borderColor: "divider" }}>
          <Typography color="text.secondary">
            No grading profiles match your search filters.
          </Typography>
        </Paper>
      ) : (
        filteredGrades.map((grade) => {
          const maxPossibleAssignmentMarks = grade.assignmentId?.totalMarks || 0;
          const groupedQuestions = groupDetailsByQuestion(grade.details);

          return (
            <Paper
              key={grade._id}
              elevation={0}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                border: "1px solid",
                borderColor: "divider",
                transition: "box-shadow 0.2s",
                "&:hover": { boxShadow: 3 }
              }}
            >
              {/* ================= HEADER ================= */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" fontWeight="bold">
                  {grade.assignmentId?.title || "Assignment Title"}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`Score: ${grade.obtainmarks || 0} / ${maxPossibleAssignmentMarks}`}
                    color="primary"
                    sx={{ fontWeight: "bold" }}
                  />

                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Edit />}
                    onClick={() => navigate(`/teacher/update-grade/${grade._id}`)}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Edit Grade
                  </Button>
                </Stack>
              </Stack>

              {/* ================= STUDENT INFO ================= */}
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Student: <strong>{grade.studentId?.studentName || "Unknown"}</strong> ({grade.studentId?.rollNo || "N/A"})
              </Typography>

              {/* ================= COURSE ================= */}
              <Typography variant="body2" color="text.secondary">
                Course: {grade.assignmentId?.courseId?.courseTitle || "N/A"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* ================= BREAKDOWN ================= */}
              <Typography fontWeight="bold" mb={1} variant="body2">
                Evaluation Criteria Breakdown:
              </Typography>

              {groupedQuestions.length > 0 ? (
                groupedQuestions.map((qGroup, qIndex) => (
                  <Box
                    key={qIndex}
                    sx={{
                      mb: 2,
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                      border: "1px solid",
                      borderColor: "divider"
                    }}
                  >
                    <Typography variant="body2" fontWeight="bold" color="primary.dark">
                      Q{qIndex + 1}: {qGroup.questionText}
                    </Typography>

                    <Box sx={{ pl: 2, mt: 0.5 }}>
                      {qGroup.rubricsList.map((rItem, rIndex) => (
                        <Box
                          key={rIndex}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 0.5,
                            borderBottom: rIndex !== qGroup.rubricsList.length - 1 ? "1px dotted" : "none",
                            borderColor: "divider"
                          }}
                        >
                          <Box>
                            <Typography variant="caption" color="text.primary" display="block">
                              • <strong>Criteria:</strong> {rItem.rubric || "No condition description"}
                            </Typography>
                            {rItem.level && (
                              <Typography variant="caption" color="text.secondary" sx={{ pl: 2 }}>
                                Selected Tier Achievement: <em>{rItem.level}</em>
                              </Typography>
                            )}
                          </Box>

                          <Typography variant="body2" fontWeight="bold" color="text.primary" sx={{ pl: 2 }}>
                            {rItem.marks} pts
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                  No breakdown data items registered for this evaluation score card.
                </Typography>
              )}
            </Paper>
          );
        })
      )}
    </Container>
  );
};

export default StudentGrades;