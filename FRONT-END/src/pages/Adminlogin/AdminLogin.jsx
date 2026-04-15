import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.password) {
      return toast.error("All fields are required");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${baseURL}/api/admin/login`,
        formData
      );

      // ✅ Save token
      localStorage.setItem("jwt", res.data.token);

      toast.success("Login successful");

      // ✅ Redirect
      navigate("/admin/dashboard");

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 10, borderRadius: 3, boxShadow: 3 }}>
        
        <Typography
          variant="h5"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          Admin Login
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          
          <TextField
            label="Admin Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            value={formData.password}
            onChange={handleChange}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, height: 45 }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>

        </Box>
      </Paper>
    </Container>
  );
};

export default AdminLogin;