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
} from "@mui/material";

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const SemesterAdd = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [courseLoading, setCourseLoading] =
    useState(false);

  const [semester, setSemester] =
    useState("");

  const [courses, setCourses] =
    useState([]);

  const [selectedCourses, setSelectedCourses] =
    useState([]);

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses =
      async () => {
        try {
          setCourseLoading(true);

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
          setCourseLoading(false);
        }
      };

    fetchCourses();
  }, [token]);

  // ================= SUBMIT =================
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
          await axios.post(
            `${baseURL}/api/semester/add`,
            payload,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        toast.success(
          res.data?.message ||
            "Semester added successfully"
        );

        // RESET
        setSemester("");

        setSelectedCourses(
          []
        );

        // OPTIONAL NAVIGATION
        navigate(
          "/admin/semesterview"
        );

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to add semester"
        );

      } finally {
        setLoading(false);
      }
    };

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
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Add Semester
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 4 }}
        >
          Create a new semester
          and assign courses
        </Typography>

        {/* FORM */}
        <form
          onSubmit={
            handleSubmit
          }
        >
          <Grid
            container
            spacing={3}
          >
            {/* SEMESTER */}
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
                    <OutlinedInput label="Courses" />
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
                label="Select Courses"
                disabled={
                  courseLoading
                }
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
                  "Add Semester"
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default SemesterAdd;