import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack,
  Chip,
  TextField,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import VisibilityIcon from "@mui/icons-material/Visibility";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useNavigate,
} from "react-router-dom";

const CourseView = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

    console.log("Courses:", courses); // Debugging log
  // ================= FETCH COURSES =================
  const fetchCourses =
    async () => {
      try {
        setLoading(true);

        const res =
          await axios.get(
            `${baseURL}/api/course`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setCourses(
          res.data || []
        );

      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load courses"
        );

      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCourses();
  }, []);

  // ================= DELETE =================
  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this course?"
        );

      if (!confirmDelete)
        return;

      try {
        await axios.delete(
          `${baseURL}/api/course/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Course deleted successfully"
        );

        setCourses((prev) =>
          prev.filter(
            (course) =>
              course._id !== id
          )
        );

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to delete course"
        );
      }
    };

  // ================= FILTER =================
  const filteredCourses =
    courses.filter((course) => {
      const title =
        course.courseTitle?.toLowerCase() ||
        "";

      const teacher =
        course.teacherId
          ?.teacherName?.toLowerCase() ||
        "";

      const semester =
        course.semesterId?.semester
          ?.toString()
          ?.toLowerCase() || "";

      const searchText =
        search.toLowerCase();

      return (
        title.includes(
          searchText
        ) ||
        teacher.includes(
          searchText
        ) ||
        semester.includes(
          searchText
        )
      );
    });

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

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
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
          sx={{ mb: 3 }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Courses
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage all courses,
              assigned teachers and
              semesters
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() =>
              navigate(
                "/admin/courseadd"
              )
            }
          >
            Add Course
          </Button>
        </Stack>

        {/* SEARCH */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Grid
            size={{ xs: 12 }}
          >
            <TextField
              fullWidth
              label="Search by course, teacher or semester"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </Grid>
        </Grid>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          variant="outlined"
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>
                    #
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Course Title
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Teacher
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Semester
                  </strong>
                </TableCell>

                <TableCell
                  align="center"
                >
                  <strong>
                    Actions
                  </strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCourses.length >
              0 ? (
                filteredCourses.map(
                  (
                    course,
                    index
                  ) => (
                    <TableRow
                      key={
                        course._id
                      }
                      hover
                    >
                      {/* INDEX */}
                      <TableCell>
                        {index + 1}
                      </TableCell>

                      {/* COURSE */}
                      <TableCell>
                        <Typography fontWeight="600">
                          {
                            course.courseTitle
                          }
                        </Typography>
                      </TableCell>

                      {/* TEACHER */}
                      <TableCell>
                        {
                          course
                            .teacherId
                            ?.teacherName
                        }
                      </TableCell>

                      {/* SEMESTER */}
                      <TableCell>
                        <Chip
                          label={`Semester ${course.semesterId?.semester}`}
                          color="primary"
                          size="small"
                        />
                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell align="center">
                        <Stack
                          direction="row"
                          spacing={1}
                          justifyContent="center"
                        >
                          {/* VIEW */}
                          <Tooltip title="View">
                            <IconButton
                              color="info"
                              onClick={() =>
                                navigate(
                                  `/admin/courseview/${course._id}`
                                )
                              }
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>

                          {/* EDIT */}
                          <Tooltip title="Edit">
                            <IconButton
                              color="primary"
                              onClick={() =>
                                navigate(
                                  `/admin/courseupdate/${course._id}`
                                )
                              }
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>

                          {/* DELETE */}
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              onClick={() =>
                                handleDelete(
                                  course._id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  )
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    align="center"
                  >
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default CourseView;