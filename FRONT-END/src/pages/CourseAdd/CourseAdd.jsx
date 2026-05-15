import React, { useEffect, useState } from "react";

import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";

import axios from "axios";

import { toast } from "react-toastify";

const CourseAdd = () => {
  const baseURL = "http://localhost:3000";

  const token = localStorage.getItem("jwt");

  // ================= STATES =================
  const [loading, setLoading] = useState(false);

  const [teachers, setTeachers] = useState([]);

  const [semesters, setSemesters] = useState([]);

  const [courseTitle, setCourseTitle] = useState("");

  const [teacherId, setTeacherId] = useState("");

  const [semesterId, setSemesterId] = useState("");

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [teacherRes, semesterRes] =
          await Promise.all([
            axios.get(
              `${baseURL}/api/teacher`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),

            axios.get(
              `${baseURL}/api/semester`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        setTeachers(teacherRes.data || []);

        setSemesters(semesterRes.data || []);

      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load teachers and semesters"
        );

      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [token]);

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDATION
    if (
      !courseTitle ||
      !teacherId ||
      !semesterId
    ) {
      toast.error(
        "All fields are required"
      );

      return;
    }

    try {
      setLoading(true);

      const payload = {
        courseTitle,
        teacherId,
        semesterId,
      };

      const res = await axios.post(
        `${baseURL}/api/course/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data?.message ||
          "Course added successfully"
      );

      // RESET
      setCourseTitle("");
      setTeacherId("");
      setSemesterId("");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message ||
          "Failed to add course"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (loading && teachers.length === 0) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box
      sx={{
        p: 3,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 700,
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
          Add New Course
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Create a new course and assign
          it to a teacher and semester.
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* FORM */}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>

            {/* COURSE TITLE */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Course Title"
                placeholder="Enter course title"
                value={courseTitle}
                onChange={(e) =>
                  setCourseTitle(
                    e.target.value
                  )
                }
              />
            </Grid>

            {/* TEACHER */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Select Teacher"
                value={teacherId}
                onChange={(e) =>
                  setTeacherId(
                    e.target.value
                  )
                }
              >
                {teachers.length > 0 ? (
                  teachers.map((teacher) => (
                    <MenuItem
                      key={teacher._id}
                      value={teacher._id}
                    >
                      {teacher.teacherName}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    No teachers found
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* SEMESTER */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                fullWidth
                label="Select Semester"
                value={semesterId}
                onChange={(e) =>
                  setSemesterId(
                    e.target.value
                  )
                }
              >
                {semesters.length > 0 ? (
                  semesters.map((semester) => (
                    <MenuItem
                      key={semester._id}
                      value={semester._id}
                    >
                      Semester{" "}
                      {semester.semester}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    No semesters found
                  </MenuItem>
                )}
              </TextField>
            </Grid>

            {/* BUTTON */}
            <Grid size={{ xs: 12 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  height: 50,
                  mt: 1,
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "Adding Course..."
                  : "Add Course"}
              </Button>
            </Grid>

          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CourseAdd;