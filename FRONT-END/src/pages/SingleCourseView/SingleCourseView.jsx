import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Chip,
  Divider,
  Button,
  Stack,
} from "@mui/material";

import SchoolIcon from "@mui/icons-material/School";

import PersonIcon from "@mui/icons-material/Person";

import ClassIcon from "@mui/icons-material/Class";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const CourseSingleView = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  const { id } =
    useParams();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(true);

  const [course, setCourse] =
    useState(null);

  // ================= FETCH COURSE =================
  useEffect(() => {
    const fetchCourse =
      async () => {
        try {
          setLoading(true);

          const res =
            await axios.get(
              `${baseURL}/api/course/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setCourse(
            res.data
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load course"
          );

        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchCourse();
    }
  }, [id, token]);

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= NO DATA =================
  if (!course) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6">
            Course not found
          </Typography>
        </Paper>
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
        }}
      >
        {/* HEADER */}
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            md: "center",
          }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Course Details
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Complete information
              about the selected
              course
            </Typography>
          </Box>

          <Stack
            direction="row"
            spacing={2}
          >
            {/* BACK */}
            <Button
              variant="outlined"
              startIcon={
                <ArrowBackIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/courseview"
                )
              }
            >
              Back
            </Button>

            {/* EDIT */}
            <Button
              variant="contained"
              startIcon={
                <EditIcon />
              }
              onClick={() =>
                navigate(
                  `/admin/courseupdate/${course._id}`
                )
              }
            >
              Edit
            </Button>
          </Stack>
        </Stack>

        <Divider sx={{ my: 4 }} />

        {/* DETAILS */}
        <Grid
          container
          spacing={3}
        >
          {/* COURSE TITLE */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <SchoolIcon
                  color="primary"
                  sx={{
                    fontSize: 40,
                  }}
                />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Course Title
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {
                      course.courseTitle
                    }
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* TEACHER */}
          <Grid
            size={{
              xs: 12,
              md: 6,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
                height: "100%",
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <PersonIcon
                  color="success"
                  sx={{
                    fontSize: 40,
                  }}
                />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Assigned Teacher
                  </Typography>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {
                      course
                        .teacherId
                        ?.teacherName
                    }
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* SEMESTER */}
          <Grid
            size={{
              xs: 12,
            }}
          >
            <Paper
              variant="outlined"
              sx={{
                p: 3,
                borderRadius: 3,
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
              >
                <ClassIcon
                  color="warning"
                  sx={{
                    fontSize: 40,
                  }}
                />

                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Semester
                  </Typography>

                  <Chip
                    label={`Semester ${course.semesterId?.semester}`}
                    color="primary"
                    sx={{
                      mt: 1,
                      fontWeight:
                        "bold",
                    }}
                  />
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CourseSingleView;