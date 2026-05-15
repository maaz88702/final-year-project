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
  Chip,
  IconButton,
  Tooltip,
  TextField,
  Stack,
  Button,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";

import VisibilityIcon from "@mui/icons-material/Visibility";

import EditIcon from "@mui/icons-material/Edit";

import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useNavigate,
} from "react-router-dom";

const SemesterView = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [semesters, setSemesters] =
    useState([]);

  const [courses, setCourses] =
    useState([]);

  const [search, setSearch] =
    useState("");

  // ================= FETCH =================
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
                `${baseURL}/api/semester`,
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

          setSemesters(
            semesterRes.data ||
              []
          );

          setCourses(
            courseRes.data ||
              []
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load semesters"
          );

        } finally {
          setLoading(false);
        }
      };

    fetchData();
  }, [token]);

  // ================= DELETE =================
  const handleDelete =
    async (id) => {
      const confirmDelete =
        window.confirm(
          "Are you sure you want to delete this semester?"
        );

      if (
        !confirmDelete
      )
        return;

      try {
        await axios.delete(
          `${baseURL}/api/semester/delete/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Semester deleted successfully"
        );

        setSemesters(
          (prev) =>
            prev.filter(
              (
                semester
              ) =>
                semester._id !==
                id
            )
        );

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Delete failed"
        );
      }
    };

  // ================= FILTER =================
  const filteredSemesters =
    semesters.filter(
      (semester) =>
        semester.semester
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  // ================= GET COURSE TITLE =================
  const getCourseTitles =
    (
      courseIds = []
    ) => {
      return courses.filter(
        (course) =>
          courseIds.includes(
            course._id
          )
      );
    };

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
            xs: "stretch",
            md: "center",
          }}
          spacing={2}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Semester Management
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              View and manage all
              semesters
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
            onClick={() =>
              navigate(
                "/admin/semesteradd"
              )
            }
          >
            Add Semester
          </Button>
        </Stack>

        {/* SEARCH */}
        <TextField
          fullWidth
          label="Search Semester"
          sx={{ mt: 3, mb: 3 }}
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

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
                    Semester
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Courses
                  </strong>
                </TableCell>

                <TableCell
                  align="center"
                >
                  <strong>
                    Total Courses
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
              {filteredSemesters.length >
              0 ? (
                filteredSemesters.map(
                  (
                    semester
                  ) => {
                    const semesterCourses =
                      getCourseTitles(
                        semester.courses
                      );

                    return (
                      <TableRow
                        key={
                          semester._id
                        }
                        hover
                      >
                        {/* SEMESTER */}
                        <TableCell>
                          <Typography fontWeight="bold">
                            {
                              semester.semester
                            }
                          </Typography>
                        </TableCell>

                        {/* COURSES */}
                        <TableCell>
                          <Box
                            sx={{
                              display:
                                "flex",
                              flexWrap:
                                "wrap",
                              gap: 1,
                              maxWidth:
                                500,
                            }}
                          >
                            {semesterCourses.length >
                            0 ? (
                              semesterCourses.map(
                                (
                                  course
                                ) => (
                                  <Chip
                                    key={
                                      course._id
                                    }
                                    label={
                                      course.courseTitle
                                    }
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                  />
                                )
                              )
                            ) : (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                No
                                courses
                              </Typography>
                            )}
                          </Box>
                        </TableCell>

                        {/* COUNT */}
                        <TableCell align="center">
                          <Chip
                            label={
                              semesterCourses.length
                            }
                            color="success"
                          />
                        </TableCell>

                        {/* ACTIONS */}
                        <TableCell align="center">
                          {/* VIEW */}
                          <Tooltip title="View">
                            <IconButton
                              color="info"
                              onClick={() =>
                                navigate(
                                  `/admin/semesterview/${semester._id}`
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
                                  `/admin/semesterupdate/${semester._id}`
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
                                  semester._id
                                )
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    align="center"
                  >
                    No semesters found
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

export default SemesterView;