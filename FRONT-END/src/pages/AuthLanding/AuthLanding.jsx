import React from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import { useNavigate } from "react-router-dom";

const AuthLanding = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={5}>
          <Typography
            variant="h4"
            fontWeight="bold"
            color="white"
          >
            Student-Teacher Online Interaction
          </Typography>

          <Typography
            variant="body1"
            color="white"
            sx={{ opacity: 0.8, mt: 1 }}
          >
            Choose how you want to continue
          </Typography>
        </Box>

        {/* Cards */}
        <Grid container spacing={3}>
          {/* Teacher Login */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 10,
                },
              }}
            >
              <SchoolIcon sx={{ fontSize: 50, color: "#667eea" }} />

              <Typography
                variant="h6"
                fontWeight="bold"
                mt={2}
              >
                Teacher Login
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                Manage assignments, grades & students
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3, height: 45 }}
                onClick={() => navigate("/teacher/login")}
              >
                Login as Teacher
              </Button>
            </Paper>
          </Grid>

          {/* Student Login */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper
              elevation={6}
              sx={{
                p: 4,
                textAlign: "center",
                borderRadius: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 10,
                },
              }}
            >
              <PersonIcon sx={{ fontSize: 50, color: "#764ba2" }} />

              <Typography
                variant="h6"
                fontWeight="bold"
                mt={2}
              >
                Student Login
              </Typography>

              <Typography variant="body2" color="text.secondary" mt={1}>
                View assignments, submit work & check grades
              </Typography>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 3,
                  height: 45,
                  backgroundColor: "#764ba2",
                }}
                onClick={() => navigate("/student/login")}
              >
                Login as Student
              </Button>
            </Paper>
          </Grid>


        </Grid>
      </Container>
    </Box>
  );
};

export default AuthLanding;