import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Button,
  Divider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AttendanceMark = () => {
  const baseURL = "http://localhost:3000";

  // ================= JWT =================
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

  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [attendance, setAttendance] = useState({});

  // ================= FETCH TEACHER COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/course/teacher/my`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setCourses(res.data);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load courses");
      }
    };

    if (token) fetchCourses();
  }, [token]);

  // ================= FETCH STUDENTS BASED ON COURSE =================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        if (!selectedCourse) return;

        const course = courses.find(
          (c) => c._id === selectedCourse
        );

        if (!course) return;

        const semesterId =
          course.semesterId?._id || course.semesterId;

        const res = await axios.get(`${baseURL}/api/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const filtered = res.data.filter(
          (s) =>
            String(s.semester?._id || s.semester) ===
            String(semesterId)
        );

        setStudents(res.data);
        setFilteredStudents(filtered);
        setAttendance({});

      } catch (error) {
        console.error(error);
        toast.error("Failed to load students");
      }
    };

    fetchStudents();
  }, [selectedCourse, courses, token]);

  // ================= HANDLE STATUS =================
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ================= CALCULATE % =================
  const calculatePercentage = () => {
    const total = filteredStudents.length;
    if (total === 0) return 0;

    const present = Object.values(attendance).filter(
      (s) => s === "present"
    ).length;

    return ((present / total) * 100).toFixed(2);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    if (!selectedCourse) {
      toast.error("Select course");
      return;
    }

    if (filteredStudents.length === 0) {
      toast.error("No students found");
      return;
    }

    try {
      const course = courses.find(
        (c) => c._id === selectedCourse
      );

      const payload = {
        semesterId: course.semesterId,
        courseId: selectedCourse,
        date: new Date(),

        attendance: filteredStudents.map((s) => ({
          studentId: s._id,
          status: attendance[s._id] || "absent",
        })),
      };

      await axios.post(
        `${baseURL}/api/attendance/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Attendance saved successfully");
      setAttendance({});

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to save attendance"
      );
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Subject-wise Attendance
        </Typography>

        {/* Course Dropdown */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid size={12}>
            <TextField
              select
              label="Select Course"
              fullWidth
              value={selectedCourse}
              onChange={(e) =>
                setSelectedCourse(e.target.value)
              }
            >
              {courses.length === 0 && (
                <MenuItem disabled>No courses</MenuItem>
              )}

              {courses.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.courseTitle}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Students */}
        {filteredStudents.map((s) => (
          <Paper key={s._id} sx={{ p: 2, mb: 2 }}>
            <Grid container alignItems="center">

              {/* Name */}
              <Grid size={4}>
                <Typography>
                  {s.studentName} ({s.rollNo})
                </Typography>
              </Grid>

              {/* Present */}
              <Grid size={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attendance[s._id] === "present"}
                      onChange={() =>
                        handleStatusChange(s._id, "present")
                      }
                    />
                  }
                  label="Present"
                />
              </Grid>

              {/* Absent */}
              <Grid size={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attendance[s._id] === "absent"}
                      onChange={() =>
                        handleStatusChange(s._id, "absent")
                      }
                    />
                  }
                  label="Absent"
                />
              </Grid>

              {/* Leave */}
              <Grid size={2}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={attendance[s._id] === "leave"}
                      onChange={() =>
                        handleStatusChange(s._id, "leave")
                      }
                    />
                  }
                  label="Leave"
                />
              </Grid>

            </Grid>
          </Paper>
        ))}

        {/* Percentage */}
        <Typography fontWeight="bold" sx={{ mt: 2 }}>
          Attendance Percentage: {calculatePercentage()}%
        </Typography>

        {/* Submit */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleSubmit}
        >
          Save Attendance
        </Button>
      </Paper>
    </Container>
  );
};

export default AttendanceMark;