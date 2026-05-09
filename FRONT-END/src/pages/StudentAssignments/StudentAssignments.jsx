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

const StudentAssignments = () => {
  const baseURL = "http://localhost:3000";

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentSemester, setStudentSemester] = useState("");

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

  // ================= FETCH STUDENT + ASSIGNMENTS =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ 1. Get student from DB
        const studentRes = await axios.get(
          `${baseURL}/api/student/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const semesterId =
          studentRes.data.semester?._id ||
          studentRes.data.semester;

        console.log("Student Semester:", semesterId);

        setStudentSemester(semesterId);

        // ✅ 2. Get assignments
        const assignRes = await axios.get(
          `${baseURL}/api/assignmentPosted`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("All Assignments:", assignRes.data);

        // ✅ 3. Filter by semester
        const myAssignments = assignRes.data.filter(
          (a) =>
            String(a.semesterId?._id || a.semesterId) ===
            String(semesterId)
        );

        console.log("Filtered Assignments:", myAssignments);

        setAssignments(myAssignments);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token && studentId) {
      fetchData();
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
        My Assignments
      </Typography>

      {assignments.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No assignments found</Typography>
        </Paper>
      ) : (
        assignments.map((assignment) => (
          <Paper
            key={assignment._id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
            }}
          >
            {/* Header */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                {assignment.title}
              </Typography>

              <Chip
                label={`Total: ${assignment.totalMarks}`}
                color="primary"
              />
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {assignment.courseId?.courseTitle || ""}
            </Typography>

            <Typography
              variant="body2"
              color="error"
              sx={{ mt: 0.5 }}
            >
              Due: {assignment.dueDate}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* Questions */}
            {assignment.assignmentDetails.map((q, qIndex) => (
              <Accordion key={qIndex}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>
                    Q{qIndex + 1}: {q.ques}
                  </Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <Typography fontWeight="bold" mb={1}>
                    Rubrics:
                  </Typography>

                  {q.rubrics.map((r, rIndex) => (
                    <Box
                      key={rIndex}
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        py: 0.5,
                      }}
                    >
                      <Typography>
                        {r.condition}
                      </Typography>

                      <Typography fontWeight="bold">
                        {r.marks}
                      </Typography>
                    </Box>
                  ))}
                </AccordionDetails>
              </Accordion>
            ))}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StudentAssignments;