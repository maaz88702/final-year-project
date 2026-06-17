import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TextField,
  Grid,
  Button,
  Stack,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RunningWithErrorsIcon from "@mui/icons-material/RunningWithErrors";
import axios from "axios";
import { toast } from "react-toastify";

const AttendanceDetailsView = () => {
  const { id } = useParams(); // Retrieves the Attendance Record ID from URL
  console.log("Attendance Record ID from URL:", id);
  const navigate = useNavigate();
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  // ================= STATES =================
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [search, setSearch] = useState("");

  // ================= FETCH SPECIFIC RECORD =================
  useEffect(() => {
    const fetchRecordDetails = async () => {
      try {
        setLoading(true);
        // Replace with your exact single-record backend endpoint
        const res = await axios.get(`${baseURL}/api/attendance/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecord(res.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load session attendance details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecordDetails();
  }, [id, token]);

  // ================= FILTER STUDENT ROSTER =================
  const filteredRoster = useMemo(() => {
    if (!record?.attendance) return [];
    return record.attendance.filter((item) => {
      const name = item.studentId?.studentName || "";
      const rollNo = item.studentId?.rollNo || "";
      const status = item.status || "";

      return (
        name.toLowerCase().includes(search.toLowerCase()) ||
        rollNo.toLowerCase().includes(search.toLowerCase()) ||
        status.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [record, search]);

  // ================= SUMMARY COUNTS =================
  const stats = useMemo(() => {
    if (!record?.attendance) return { present: 0, absent: 0, leave: 0, total: 0, ratio: 0 };
    const total = record.attendance.length;
    const present = record.attendance.filter((a) => a.status === "present").length;
    const leave = record.attendance.filter((a) => a.status === "leave").length;
    const absent = record.attendance.filter((a) => a.status === "absent").length;
    const ratio = total > 0 ? Math.round(((present + leave) / total) * 100) : 0;

    return { total, present, leave, absent, ratio };
  }, [record]);

  // ================= STATUS CHIP RENDERER =================
  const getStatusChip = (status) => {
    switch (status) {
      case "present":
        return <Chip icon={<CheckCircleIcon />} label="Present" color="success" variant="light" size="small" />;
      case "leave":
        return <Chip icon={<RunningWithErrorsIcon />} label="Leave" color="warning" variant="light" size="small" />;
      case "absent":
        return <Chip icon={<CancelIcon />} label="Absent" color="error" variant="light" size="small" />;
      default:
        return <Chip label={status || "Unknown"} size="small" />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="error">No record data found.</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        
        {/* HEADER SECTION */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <IconButton onClick={() => navigate(-1)} color="primary">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" fontWeight="bold">
              {record.courseId?.courseTitle || "Course Attendance"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Semester: {record.semesterId?.semester || "N/A"} | Date: {new Date(record.date).toLocaleDateString()}
            </Typography>
          </Box>
        </Stack>

        {/* METRICS CARDS */}
        <Grid container spacing={2} sx={{ mb: 4, mt: 1 }}>
          <Grid size={{xs: 12, sm: 6, md: 2.4}}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: "grey.50" }}>
              <Typography variant="body2" color="text.secondary">Total Class strength</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.total}</Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2.4}}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: "success.light", color: "success.contrastText" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Present</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.present}</Typography>
            </Paper>
          </Grid>
          <Grid size={{xs: 12, sm: 6, md: 2.4}}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: "warning.light", color: "warning.contrastText" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Leave</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.leave}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: "error.light", color: "error.contrastText" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Absent</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.absent}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={2.4}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3, bgcolor: "primary.main", color: "primary.contrastText" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Session Attendance %</Typography>
              <Typography variant="h5" fontWeight="bold">{stats.ratio}%</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* INNER FILTER */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Search Student"
            placeholder="Search by student name, roll number, or status..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Box>

        {/* ROSTER TABLE */}
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "grey.100" }}>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Roll Number</strong></TableCell>
                <TableCell><strong>Student Name</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoster.length > 0 ? (
                filteredRoster.map((row, index) => (
                  <TableRow key={row._id || index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      {row.studentId?.rollNo || "N/A"}
                    </TableCell>
                    <TableCell>
                      {row.studentId?.studentName || "N/A"}
                    </TableCell>
                    <TableCell>
                      {getStatusChip(row.status)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    No matching student records found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

      </Paper>
    </Box>
  );
};

export default AttendanceDetailsView;