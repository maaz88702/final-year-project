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
} from "@mui/material";
import { Edit } from "@mui/icons-material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const StudentGrades = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

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
  // This removes duplicate question titles and nests their rubrics cleanly under them!
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

      {grades.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No grades found</Typography>
        </Paper>
      ) : (
        grades.map((grade) => {
          const maxPossibleAssignmentMarks = grade.assignmentId?.totalMarks || 0;
          // ✅ Process the flat details into grouped questions with sub-rubrics
          const groupedQuestions = groupDetailsByQuestion(grade.details);

          return (
            <Paper
              key={grade._id}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
                boxShadow: 2,
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
                Student: {grade.studentId?.studentName || "Unknown"} ({grade.studentId?.rollNo || "N/A"})
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
                      bgcolor: "#fefefe",
                      border: "1px solid #f0f0f0"
                    }}
                  >
                    {/* Unique Question Title */}
                    <Typography variant="body2" fontWeight="bold" color="primary.dark">
                      Q{qIndex + 1}: {qGroup.questionText}
                    </Typography>

                    {/* Nested Rubrics applied to this specific question */}
                    <Box sx={{ pl: 2, mt: 0.5 }}>
                      {qGroup.rubricsList.map((rItem, rIndex) => (
                        <Box
                          key={rIndex}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            py: 0.5,
                            borderBottom: rIndex !== qGroup.rubricsList.length - 1 ? "1px dotted #e0e0e0" : "none"
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