import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const TeacherEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const baseURL = "http://localhost:3000";

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    teacherName: "",
    email: "",
    password: "",
  });

  // Fetch single teacher by ID
  const fetchTeacher = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/teacher/${id}`);
      const teacher = res.data;

      setForm({
        teacherName: teacher.teacherName || "",
        email: teacher.email || "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch teacher data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeacher();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${baseURL}/api/teacher/update/${id}`, form);
      toast.success("Teacher updated successfully");
      navigate("/");
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
      style={{ maxWidth: 450, margin: "40px auto", padding: "20px" }}
    >
      <Typography variant="h5" align="center" gutterBottom>
        Edit Teacher
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          label="Teacher Name"
          name="teacherName"
          value={form.teacherName}
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

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: "20px" }}
        >
          Update Teacher
        </Button>
      </form>
    </Paper>
  );
};

export default TeacherEdit;
