import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  Chip,
  Grid,
  Stack,
  Alert,
} from "@mui/material";

import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ViewAssignment = () => {
  const { id } = useParams();

  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState(null);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${baseURL}/api/assignmentPosted/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setAssignment(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load assignment");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignment();
  }, [id, token]);

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

  if (!assignment) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Assignment not found
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          {assignment.title}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
        >
          Assignment Details
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* BASIC INFO */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Due Date
              </Typography>

              <Typography fontWeight="bold">
                {assignment.dueDate}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Marks
              </Typography>

              <Typography fontWeight="bold">
                {assignment.totalMarks}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              variant="outlined"
              sx={{ p: 2 }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Questions
              </Typography>

              <Typography fontWeight="bold">
                {assignment.assignmentDetails?.length || 0}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* QUESTIONS */}
        <Typography
          variant="h5"
          fontWeight="bold"
          gutterBottom
        >
          Questions & Rubrics
        </Typography>

        <Stack spacing={3}>
          {assignment.assignmentDetails?.map(
            (question, qIndex) => (
              <Paper
                key={qIndex}
                variant="outlined"
                sx={{
                  p: 3,
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                >
                  Question {qIndex + 1}
                </Typography>

                <Typography
                  sx={{ mt: 1 }}
                >
                  {question.ques}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  gutterBottom
                >
                  Rubrics
                </Typography>

                <Stack spacing={2}>
                  {question.rubrics?.map(
                    (
                      rubric,
                      rubricIndex
                    ) => (
                      <Paper
                        key={
                          rubricIndex
                        }
                        sx={{
                          p: 2,
                          bgcolor:
                            "#f8f9fa",
                        }}
                      >
                        <Typography
                          fontWeight="bold"
                        >
                          {
                            rubric.condition
                          }
                        </Typography>

                        <Box
                          sx={{
                            mt: 1,
                            display:
                              "flex",
                            flexWrap:
                              "wrap",
                            gap: 1,
                          }}
                        >
                          {rubric.subRubrics?.map(
                            (
                              level,
                              levelIndex
                            ) => (
                              <Chip
                                key={
                                  levelIndex
                                }
                                label={`${level.level} (${level.marks})`}
                                color="primary"
                                variant="outlined"
                              />
                            )
                          )}
                        </Box>
                      </Paper>
                    )
                  )}
                </Stack>
              </Paper>
            )
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default ViewAssignment;