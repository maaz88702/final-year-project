import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from "@mui/material";
import { Person, Email, Lock, School, Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  studentName: Yup.string().required("Student name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  rollNo: Yup.string()
    .matches(
      /^[0-9]+[a-z]-[a-z]{2}-[0-9]{2}$/i,
      "Roll number must be like 6b-cs-20"
    )
    .required("Roll number is required"),

  password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  semester: Yup.string().required("Semester is required"),
});


const SignUp_student = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [semesters, setSemesters] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    const fetchSemesters = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/semester");
        // console.log(res)
        setSemesters(res.data); // Save fetched semesters
      } catch (err) {
        console.error("Failed to fetch semesters", err);
      }
    };
    fetchSemesters();
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 380,
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" textAlign="center" fontWeight="bold" mb={2}>
          Student Sign Up
        </Typography>

        <Formik
          initialValues={{
            studentName: "",
            email: "",
            rollNo: "",
            password: "",
            semester: "",
          }}

          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setError("");
            setMessage("");
            try {
              console.log(values)
              const res = await axios.post(
                "http://localhost:3000/api/student/add",
                values
              );
              // console.log(res);
              // console.log("hello world")
              localStorage.setItem("jwt", res.data.token)
              // setMessage(res.data.message);
              toast.success(res.data.message);
              navigation("/");
            } catch (err) {
              toast.error(err.response?.data?.message || "Something went wrong");
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
              {/* Student Name */}
              <TextField
                fullWidth
                margin="normal"
                label="Student Name"
                name="studentName"
                value={values.studentName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.studentName && Boolean(errors.studentName)}
                helperText={touched.studentName && errors.studentName}
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
              {/* rollNo */}
              <TextField
                fullWidth
                margin="normal"
                label="Roll Number"
                name="rollNo"
                value={values.rollNo}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.rollNo && Boolean(errors.rollNo)}
                helperText={touched.rollNo && errors.rollNo}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person />
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
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Semester Dropdown */}
              <FormControl
                fullWidth
                margin="normal"
                error={touched.semester && Boolean(errors.semester)}
              >
                <InputLabel>Select Semester</InputLabel>
                <Select
                  name="semester"
                  value={values.semester}
                  label="Select Semester"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  startAdornment={
                    <InputAdornment position="start">
                      <School />
                    </InputAdornment>
                  }
                >
                  {/* <MenuItem value="">
                    <em>None</em>
                  </MenuItem> */}
                  {Array.isArray(semesters) && semesters.length > 0 &&
                    semesters.map((sem) => (
                      <MenuItem key={sem._id} value={sem._id}>
                        {sem.semester}
                      </MenuItem>
                    ))}

                </Select>
                
                <FormHelperText>
                  {touched.semester && errors.semester}
                </FormHelperText>
              </FormControl>

              {/* Messages */}
              {error && (
                <Typography color="error" mt={1}>
                  {error}
                </Typography>
              )}

              {message && (
                <Typography color="green" mt={1}>
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
                  py: 1.2,
                  borderRadius: 2,
                  background: "linear-gradient(45deg, #667eea, #764ba2)",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Create Account
              </Button>

              <Button
                fullWidth
                variant="outlined"
                sx={{
                  mt: 1.5,
                  py: 1.1,
                  borderRadius: 2,
                  fontWeight: "bold",
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#764ba2",
                    color: "#764ba2",
                  },
                }}
                onClick={() => navigation("/student/login")}
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

export default SignUp_student;
