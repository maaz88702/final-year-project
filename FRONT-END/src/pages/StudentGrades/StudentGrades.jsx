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
} from "@mui/material";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const StudentGrades = () => {
  const baseURL = "http://localhost:3000";

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

        console.log("All Grades:", res.data);
        console.log("Teacher ID:", teacherId);

        // ✅ FILTER GRADES BELONGING TO THIS TEACHER
        const myGrades = res.data.filter((g) => {
          const assignmentTeacherId =
            g.assignmentId?.teacherId?._id ||
            g.assignmentId?.teacherId;

          return (
            String(assignmentTeacherId) ===
            String(teacherId)
          );
        });

        console.log("Filtered Grades:", myGrades);

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
      <Typography
        variant="h5"
        fontWeight="bold"
        sx={{ mt: 4, mb: 2 }}
      >
        Students Grades
      </Typography>

      {grades.length === 0 ? (
        <Paper sx={{ p: 3 }}>
          <Typography>No grades found</Typography>
        </Paper>
      ) : (
        grades.map((grade) => (
          <Paper
            key={grade._id}
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 3,
            }}
          >
            {/* ================= HEADER ================= */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">
                {grade.assignmentId?.title ||
                  "Assignment"}
              </Typography>

              <Chip
                label={`Marks: ${grade.obtainmarks}`}
                color="primary"
              />
            </Stack>

            {/* ================= STUDENT INFO ================= */}
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Student:{" "}
              {grade.studentId?.studentName ||
                "Unknown"}{" "}
              ({grade.studentId?.rollNo || "N/A"})
            </Typography>

            {/* ================= COURSE ================= */}
            <Typography
              variant="body2"
              color="text.secondary"
            >
              Course:{" "}
              {grade.assignmentId?.courseId
                ?.courseTitle || "N/A"}
            </Typography>

            <Divider sx={{ my: 2 }} />

            {/* ================= BREAKDOWN ================= */}
            <Typography fontWeight="bold" mb={1}>
              Breakdown:
            </Typography>

            {grade.details &&
              grade.details.map((d, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    py: 0.5,
                  }}
                >
                  <Typography>
                    {d.question}
                  </Typography>

                  <Typography fontWeight="bold">
                    {d.marks}
                  </Typography>
                </Box>
              ))}
          </Paper>
        ))
      )}
    </Container>
  );
};

export default StudentGrades;