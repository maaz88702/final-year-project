import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const StudentEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [semesters, setSemesters] = useState([]);

  const [form, setForm] = useState({
    studentName: "",
    email: "",
    password: "",
    semester: "",
  });

  // Fetch student by ID
  const fetchStudent = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/student/${id}`);
      const student = res.data;

      setForm({
        studentName: student.studentName || "",
        email: student.email || "",
        password: "",
        semester: student.semester?._id || student.semester || "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch student data");
    }
  };

  // Fetch all semesters
  const fetchSemesters = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/semester`);
      setSemesters(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch semesters");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchStudent(), fetchSemesters()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${baseURL}/api/student/update/${id}`, form);
      toast.success("Student updated successfully");
      navigate("/"); // change to your student list route
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <Paper
      elevation={3}
      style={{ maxWidth: 500, margin: "40px auto", padding: "20px" }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Edit Student
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Student Name"
          name="studentName"
          value={form.studentName}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Password (leave blank to keep old)"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Semester Dropdown */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Select Semester</InputLabel>
          <Select
            name="semester"
            value={form.semester}
            label="Select Semester"
            onChange={handleChange}
          >
            {Array.isArray(semesters) &&
              semesters.length > 0 &&
              semesters.map((sem) => (
                <MenuItem key={sem._id} value={sem._id}>
                  {sem.semester}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Update Student
        </Button>
      </form>
    </Paper>
  );
};

export default StudentEdit;
