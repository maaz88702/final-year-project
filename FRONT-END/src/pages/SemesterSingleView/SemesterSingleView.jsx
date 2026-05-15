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
  Card,
  CardContent,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SchoolIcon from "@mui/icons-material/School";

import MenuBookIcon from "@mui/icons-material/MenuBook";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const SemesterSingleView = () => {
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

  const [semesterData, setSemesterData] =
    useState(null);

  const [courses, setCourses] =
    useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData =
      async () => {
        try {
          setLoading(true);

          const [
            semesterRes,
            courseRes,
          ] =
            await Promise.all([
              axios.get(
                `${baseURL}/api/semester/${id}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),

              axios.get(
                `${baseURL}/api/course`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),
            ]);

          const semester =
            semesterRes.data;

          setSemesterData(
            semester
          );

          // FILTER COURSES
          const semesterCourses =
            (
              courseRes.data ||
              []
            ).filter(
              (course) =>
                semester.courses?.includes(
                  course._id
                )
            );

          setCourses(
            semesterCourses
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load semester details"
          );

        } finally {
          setLoading(false);
        }
      };

    if (id) {
      fetchData();
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
  if (!semesterData) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper
          sx={{
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Semester not found
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
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: 4,
            background:
              "linear-gradient(135deg, #1976d2, #42a5f5)",
            color: "white",
          }}
        >
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
                {
                  semesterData.semester
                }
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  opacity: 0.9,
                  mt: 1,
                }}
              >
                Semester Details &
                Assigned Courses
              </Typography>
            </Box>

            <Button
              variant="contained"
              color="inherit"
              startIcon={
                <ArrowBackIcon />
              }
              onClick={() =>
                navigate(
                  "/admin/semesterview"
                )
              }
            >
              Back
            </Button>
          </Stack>
        </Box>

        {/* BODY */}
        <Box sx={{ p: 4 }}>
          {/* INFO CARDS */}
          <Grid
            container
            spacing={3}
          >
            {/* SEMESTER */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Card
                elevation={2}
              >
                <CardContent>
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
                        Semester Name
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {
                          semesterData.semester
                        }
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* TOTAL COURSES */}
            <Grid
              size={{
                xs: 12,
                md: 6,
              }}
            >
              <Card
                elevation={2}
              >
                <CardContent>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <MenuBookIcon
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
                        Total Courses
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {
                          courses.length
                        }
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Divider
            sx={{ my: 4 }}
          />

          {/* COURSES */}
          <Typography
            variant="h5"
            fontWeight="bold"
            gutterBottom
          >
            Assigned Courses
          </Typography>

          {courses.length >
          0 ? (
            <Grid
              container
              spacing={2}
              sx={{ mt: 1 }}
            >
              {courses.map(
                (
                  course
                ) => (
                  <Grid
                    key={
                      course._id
                    }
                    size={{
                      xs: 12,
                      sm: 6,
                      md: 4,
                    }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        height:
                          "100%",
                        transition:
                          "0.3s",

                        "&:hover":
                          {
                            transform:
                              "translateY(-3px)",
                          },
                      }}
                    >
                      <Typography
                        variant="h6"
                        fontWeight="bold"
                      >
                        {
                          course.courseTitle
                        }
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                        }}
                      >
                        Teacher:
                      </Typography>

                      <Chip
                        label={
                          course
                            .teacherId
                            ?.teacherName ||
                          "No Teacher"
                        }
                        color="primary"
                        size="small"
                        sx={{
                          mt: 1,
                        }}
                      />
                    </Paper>
                  </Grid>
                )
              )}
            </Grid>
          ) : (
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign:
                  "center",
                mt: 2,
              }}
            >
              <Typography color="text.secondary">
                No courses assigned
                to this semester
              </Typography>
            </Paper>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default SemesterSingleView;