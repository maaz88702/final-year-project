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
import { Person, Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  teacherName: Yup.string().required("Teacher name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

const TeacherSignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigate();

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
          width: { xs: "100%", sm: 400, md: 450 },
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
          Teacher Sign Up
        </Typography>

        <Formik
          initialValues={{ teacherName: "", email: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            try {
              const res = await axios.post(
                "http://localhost:3000/api/teacher/add",
                values
              );
              
              console.log("response data :",res.data)
              localStorage.setItem("jwt", res.data.token)
              toast.success(res.data.message);
              // resetForm();
              navigation("/teacher/dashboard");
            } catch (err) {
              toast.error(err.response?.data?.message || "Something went wrong");
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
              {/* Teacher Name */}
              <TextField
                fullWidth
                margin="normal"
                label="Teacher Name"
                name="teacherName"
                value={values.teacherName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.teacherName && Boolean(errors.teacherName)}
                helperText={touched.teacherName && errors.teacherName}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
                    </InputAdornment>
                  ),
                }}
              />

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

              {/* Submit */}
             <Button
  type="submit"
  fullWidth
  variant="contained"
  sx={{
    mt: 3,
    py: 1.3,
    borderRadius: 2,
    background: "linear-gradient(45deg, #667eea, #764ba2)",
    fontWeight: "bold",
    fontSize: { xs: "0.95rem", sm: "1rem" },
  }}
>
  Create Account
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
  onClick={() => navigation("/teacher/login")}
>
  Already have an account? Login
</Button>

            </form>
          )}
        </Formik>
      </Paper>
    </Box>
  );
};

export default TeacherSignUp;
