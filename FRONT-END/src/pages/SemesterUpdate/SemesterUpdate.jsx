import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Stack,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import SaveIcon from "@mui/icons-material/Save";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

const SemesterUpdate = () => {
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
    useState(false);

  const [fetchLoading, setFetchLoading] =
    useState(true);

  const [coursesLoading, setCoursesLoading] =
    useState(false);

  const [semester, setSemester] =
    useState("");

  const [courses, setCourses] =
    useState([]);

  const [selectedCourses, setSelectedCourses] =
    useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData =
      async () => {
        try {
          setFetchLoading(true);

          setCoursesLoading(true);

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

          const semesterData =
            semesterRes.data;

          setSemester(
            semesterData.semester ||
              ""
          );

          setSelectedCourses(
            semesterData.courses ||
              []
          );

          setCourses(
            courseRes.data ||
              []
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load semester"
          );

        } finally {
          setFetchLoading(false);

          setCoursesLoading(false);
        }
      };

    if (id) {
      fetchData();
    }
  }, [id, token]);

  // ================= UPDATE =================
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!semester.trim()) {
        toast.error(
          "Semester name is required"
        );

        return;
      }

      try {
        setLoading(true);

        const payload = {
          semester,
          courses:
            selectedCourses,
        };

        const res =
          await axios.put(
            `${baseURL}/api/semester/update/${id}`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        toast.success(
          res.data?.message ||
            "Semester updated successfully"
        );

        navigate(
          "/admin/semesterview"
        );

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Update failed"
        );

      } finally {
        setLoading(false);
      }
    };

  // ================= LOADING =================
  if (fetchLoading) {
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
          p: 4,
          maxWidth: 700,
          mx: "auto",
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
              Update Semester
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Modify semester
              details and assigned
              courses
            </Typography>
          </Box>

          <Button
            variant="outlined"
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

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          <Grid
            container
            spacing={3}
            sx={{ mt: 1 }}
          >
            {/* SEMESTER NAME */}
            <Grid size={12}>
              <TextField
                fullWidth
                label="Semester Name"
                placeholder="e.g. Semester 1"
                value={semester}
                onChange={(e) =>
                  setSemester(
                    e.target.value
                  )
                }
              />
            </Grid>

            {/* COURSES */}
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Select Courses"
                disabled={
                  coursesLoading
                }
                SelectProps={{
                  multiple: true,

                  value:
                    selectedCourses,

                  onChange: (
                    e
                  ) =>
                    setSelectedCourses(
                      e.target
                        .value
                    ),

                  input: (
                    <OutlinedInput label="Select Courses" />
                  ),

                  renderValue: (
                    selected
                  ) =>
                    courses
                      .filter(
                        (
                          course
                        ) =>
                          selected.includes(
                            course._id
                          )
                      )
                      .map(
                        (
                          course
                        ) =>
                          course.courseTitle
                      )
                      .join(
                        ", "
                      ),
                }}
              >
                {courses.map(
                  (
                    course
                  ) => (
                    <MenuItem
                      key={
                        course._id
                      }
                      value={
                        course._id
                      }
                    >
                      <Checkbox
                        checked={selectedCourses.includes(
                          course._id
                        )}
                      />

                      <ListItemText
                        primary={
                          course.courseTitle
                        }
                        secondary={`Semester: ${course.semesterId?.semester || "N/A"}`}
                      />
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/* BUTTON */}
            <Grid size={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={
                  loading
                }
                startIcon={
                  !loading && (
                    <SaveIcon />
                  )
                }
                sx={{
                  height: 50,
                  mt: 2,
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={24}
                    color="inherit"
                  />
                ) : (
                  "Update Semester"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SemesterUpdate;