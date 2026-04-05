import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar/AdminNavbar";

const AdminDashboard = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  // ================= STATE =================
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    assignments: 0,
    submissions: 0,
  });

  const [recentSubmissions, setRecentSubmissions] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, teacherRes, assignRes, subRes] =
          await Promise.all([
            axios.get(`${baseURL}/api/student`),
            axios.get(`${baseURL}/api/teacher`),
            axios.get(`${baseURL}/api/assignmentPosted`),
            axios.get(`${baseURL}/api/assignmentSubmitted`),
          ]);

        setStats({
          students: studentRes.data.length,
          teachers: teacherRes.data.length,
          assignments: assignRes.data.length,
          submissions: subRes.data.length,
        });

        // latest 5 submissions
        const sorted = subRes.data
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);

        setRecentSubmissions(sorted);

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  // ================= CARD =================
  const StatCard = ({ title, value }) => (
    <Paper
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography variant="h4" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );

  // ================= UI =================
  return (
    <>
    <AdminNavbar/>
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Admin Dashboard
      </Typography>

      {/* 📊 STATS */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Students" value={stats.students} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Teachers" value={stats.teachers} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Assignments" value={stats.assignments} />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Submissions" value={stats.submissions} />
        </Grid>
      </Grid>

      {/* 🚀 QUICK ACTIONS */}
      <Box mt={4}>
        <Typography variant="h6" mb={2}>
          Quick Actions
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="contained"
            onClick={() => navigate("/admin/students")}
          >
            Manage Students
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/admin/teachers")}
          >
            Manage Teachers
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/admin/assignments")}
          >
            View Assignments
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate("/admin/submissions")}
          >
            View Submissions
          </Button>
        </Box>
      </Box>

      {/* 📥 RECENT SUBMISSIONS */}
      <Box mt={5}>
        <Typography variant="h6" mb={2}>
          Recent Submissions
        </Typography>

        {recentSubmissions.length === 0 ? (
          <Typography>No submissions found</Typography>
        ) : (
          recentSubmissions.map((sub) => (
            <Paper key={sub._id} sx={{ p: 2, mb: 2 }}>
              <Typography fontWeight="bold">
                {sub.assignmentId?.title || "Assignment"}
              </Typography>

              <Typography>
                Student: {sub.studentId?.rollNo || "N/A"}
              </Typography>

              <Typography variant="caption" color="gray">
                {new Date(sub.createdAt).toLocaleString()}
              </Typography>
            </Paper>
          ))
        )}
      </Box>
    </Container>
    </>
  );
};

export default AdminDashboard;