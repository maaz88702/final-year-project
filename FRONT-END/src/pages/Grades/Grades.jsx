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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Grades = () => {
  const baseURL = "http://localhost:3000";

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= TOKEN =================
  const token = localStorage.getItem("jwt");

  let studentId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      studentId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ================= FETCH =================
  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/assignmentGrade`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // ✅ Filter only this student's grades
        const myGrades = res.data.filter(
          (g) =>
            String(g.studentId?._id || g.studentId) ===
            String(studentId)
        );

        setGrades(myGrades);
      } catch (error) {
        console.error("Error fetching grades:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && studentId) {
      fetchGrades();
    }
  }, [token, studentId]);

  // ================= UI =================
  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mt: 4, mb: 2 }}
      >
        My Assignment Grades
      </Typography>

      {grades.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No grades found</Typography>
        </Paper>
      ) : (
        grades.map((grade) => {
          const assignment = grade.assignmentId;

          return (
            <Paper
              key={grade._id}
              sx={{
                p: 3,
                mb: 3,
                borderRadius: 3,
              }}
            >
              {/* Assignment Info */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">
                  {assignment?.title || "Assignment"}
                </Typography>

                <Chip
                  label={`Marks: ${grade.obtainmarks} / ${assignment?.totalMarks}`}
                  color="primary"
                />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {assignment?.courseId?.courseTitle || ""}
              </Typography>

              <Divider sx={{ my: 2 }} />

              {/* Questions + Rubrics */}
              {assignment?.assignmentDetails.map((q, qIndex) => {
                const graded = grade.details.find(
                  (d) => d.question === q.ques
                );

                return (
                  <Accordion key={qIndex}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <Typography>
                          Q{qIndex + 1}: {q.ques}
                        </Typography>

                        <Typography fontWeight="bold">
                          {graded?.marks || 0} /{" "}
                          {q.rubrics.reduce(
                            (sum, r) => sum + r.marks,
                            0
                          )}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {q.rubrics.map((r, rIndex) => {
                        const isSelected =
                          graded?.marks >= r.marks;

                        return (
                          <Box
                            key={rIndex}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              py: 0.5,
                              color: isSelected
                                ? "green"
                                : "text.primary",
                            }}
                          >
                            <Typography>
                              {r.condition}
                            </Typography>

                            <Typography>
                              {r.marks}
                            </Typography>
                          </Box>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Paper>
          );
        })
      )}
    </Container>
  );
};

export default Grades;