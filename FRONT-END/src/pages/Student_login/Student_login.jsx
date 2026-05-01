import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const StudentLogin = () => {
  const navigation = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        p: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: { xs: 3, sm: 4 },
          width: { xs: "100%", sm: 380, md: 420 },
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h4"
          textAlign="center"
          fontWeight="bold"
          mb={3}
          sx={{ fontSize: { xs: "1.8rem", sm: "2rem" } }}
        >
          Student Login
        </Typography>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setError("");
            setMessage("");
            try {
              const res = await axios.post(
                "http://localhost:3000/api/student/login",
                values
              );
              
              localStorage.setItem("jwt", res.data.token)
              toast.success(res.data.message)
              // setMessage(res.data.message);
              // resetForm();
              navigation('/student/dashboard');
              // Optionally save JWT token
              // localStorage.setItem("token", res.data.token);
            } catch (err) {
              toast.error(err.response?.data?.message || "Something went wrong")
              // setError(err.response?.data?.message || "Something went wrong");
            }
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <TextField
                fullWidth
                margin="normal"
                label="Email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Password */}
              <TextField
                fullWidth
                margin="normal"
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Error/Message */}
              {error && (
                <Typography color="error" mt={1} sx={{ fontSize: "0.9rem" }}>
                  {error}
                </Typography>
              )}
              {message && (
                <Typography color="green" mt={1} sx={{ fontSize: "0.9rem" }}>
                  {message}
                </Typography>
              )}

              {/* Submit */}
             <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 2,
    py: 1.3,
    borderRadius: 2,
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    fontWeight: "bold",
    fontSize: { xs: "0.95rem", sm: "1rem" },
  }}
>
  Login
</Button>

<Button
  fullWidth
  variant="outlined"
  sx={{
    mt: 1.5,
    py: 1.2,
    borderRadius: 2,
    fontWeight: "bold",
    borderColor: "#667eea",
    color: "#667eea",
    "&:hover": {
      borderColor: "#764ba2",
      color: "#764ba2",
    },
  }}
  onClick={() => navigation("/student/signup")}
>
  Sign Up
</Button>

            </form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default StudentLogin;
