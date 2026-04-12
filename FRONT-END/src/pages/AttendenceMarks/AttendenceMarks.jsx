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

const AttendanceMark = () => {
  const baseURL = "http://localhost:3000";

  // ================= JWT =================
  const token = localStorage.getItem("jwt");

  // ================= STATES =================
  const [semesters, setSemesters] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");

  const [filteredStudents, setFilteredStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [semRes, courseRes, studentRes] = await Promise.all([
          axios.get(`${baseURL}/api/semester`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/course`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSemesters(semRes.data);
        setCourses(courseRes.data);
        console.log("courses", courseRes.data);
        setStudents(studentRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      }
    };

    if (token) fetchData();
  }, [token]);

  // ================= FILTER STUDENTS =================
  useEffect(() => {
    if (!selectedSemester) {
      setFilteredStudents([]);
      return;
    }

    const filtered = students.filter(
      (s) =>
        String(s.semester?._id || s.semester) === selectedSemester
    );

    setFilteredStudents(filtered);
    setAttendance({});
  }, [selectedSemester, students]);

  // ================= HANDLE STATUS =================
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ================= CALCULATE =================
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
    if (!selectedSemester || !selectedCourse) {
      toast.error("Select semester and course");
      return;
    }

    try {
      const payload = {
        semesterId: selectedSemester,
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

        {/* Filters */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {/* Semester */}
          <Grid size={6}>
            <TextField
              select
              label="Select Semester"
              fullWidth
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              {semesters.map((sem) => (
                <MenuItem key={sem._id} value={sem._id}>
                  {sem.semester}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Course */}
          <Grid size={6}>
            <TextField
              select
              label="Select Course"
              fullWidth
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
            >
              {courses.map((c) => (
                <MenuItem key={c._id} value={c._id}>
                  {c.courseName}
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