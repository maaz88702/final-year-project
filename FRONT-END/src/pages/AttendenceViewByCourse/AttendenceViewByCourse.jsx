import React, { useEffect, useMemo, useState } from "react";
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
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DownloadIcon from "@mui/icons-material/Download"; // 🌟 Imported for Export action
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const AttendanceViewByCourse = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const { courseId } = useParams();
  const navigate = useNavigate();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [courseTitle, setCourseTitle] = useState("");
  const [search, setSearch] = useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);

        const res = await axios.get(`${baseURL}/api/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const filtered = res.data.filter(
          (item) => String(item.courseId?._id || item.courseId) === String(courseId)
        );

        setAttendanceData(filtered);

        if (filtered.length > 0) {
          setCourseTitle(filtered[0].courseId?.courseTitle || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchAttendance();
    }
  }, [courseId, token]);

  // ================= SUMMARY =================
  const summary = useMemo(() => {
    const map = new Map();

    attendanceData.forEach((record) => {
      record.attendance?.forEach((att) => {
        const id = att.studentId?._id;
        if (!id) return;

        if (!map.has(id)) {
          map.set(id, {
            studentName: att.studentId?.studentName,
            rollNo: att.studentId?.rollNo,
            present: 0,
            absent: 0,
            leave: 0,
            total: 0,
          });
        }

        const student = map.get(id);
        student.total += 1;

        if (att.status === "present") {
          student.present += 1;
        } else if (att.status === "leave") {
          student.leave += 1;
        } else {
          student.absent += 1;
        }
      });
    });

    return Array.from(map.values());
  }, [attendanceData]);

  // ================= FILTERED =================
  const filteredStudents = summary.filter((student) => {
    const query = search.toLowerCase();
    return (
      student.studentName?.toLowerCase().includes(query) ||
      student.rollNo?.toLowerCase().includes(query)
    );
  });

  // ================= CSV DOWNLOAD FUNCTION =================
  const handleDownloadCSV = () => {
    if (summary.length === 0) {
      toast.info("No data available to export");
      return;
    }

    // Define CSV Headers
    const headers = ["Student Name", "Roll No", "Present", "Absent", "Leave", "Total Sessions", "Percentage (%)", "Status"];

    // Format Rows using the same analytical logic as the table
    const rows = summary.map((student) => {
      const activeSessions = student.total - student.leave;
      const percentage = activeSessions > 0 ? ((student.present / activeSessions) * 100).toFixed(1) : "0.0";
      
      let status = "Low";
      if (parseFloat(percentage) >= 75) status = "Good";
      else if (parseFloat(percentage) >= 50) status = "Average";

      return [
        `"${student.studentName || ""}"`, // Wrap in quotes to avoid breaking on names containing commas
        `"${student.rollNo || ""}"`,
        student.present,
        student.absent,
        student.leave,
        student.total,
        `${percentage}%`,
        status
      ];
    });

    // Combine headers and rows with newlines
    const csvContent = [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    // Build downloadable file blob
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    
    // Create clean file name based on course title
    const formattedTitle = courseTitle ? courseTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "course";
    link.setAttribute("href", url);
    link.setAttribute("download", `${formattedTitle}_attendance_report.csv`);
    
    // Trigger download mechanism
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box sx={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ borderRadius: 4, overflow: "hidden" }}>
        {/* HEADER */}
        <Box sx={{ p: 3, bgcolor: "primary.main", color: "white" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={2}>
            {/* BACK BUTTON TO MAIN DASHBOARD */}
            <Button
              startIcon={<ArrowBackIcon />}
              variant="text"
              onClick={() => navigate(-1)}
              sx={{ color: "white", textTransform: "none", backgroundColor: "rgba(255,255,255,0.1)", "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" } }}
            >
              Back to Attendance Dashboard
            </Button>

            {/* 🌟 DOWNLOAD CSV BUTTON */}
            <Button
              variant="contained"
              color="secondary"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadCSV}
              sx={{ textTransform: "none", fontWeight: "bold" }}
            >
              Export CSV
            </Button>
          </Stack>

          <Typography variant="h4" fontWeight="bold" sx={{ mt: 2 }}>
            Course Attendance
          </Typography>

          <Typography variant="h6" sx={{ mt: 1 }}>
            {courseTitle || "No Active Sessions Found"}
          </Typography>

          <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
            Student attendance analytics and performance
          </Typography>
        </Box>

        {/* STATS */}
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">Total Students</Typography>
              <Typography variant="h4" fontWeight="bold">{filteredStudents.length}</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">Attendance Sessions</Typography>
              <Typography variant="h4" fontWeight="bold">{attendanceData.length}</Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 3 }}>
              <Typography color="text.secondary">Course</Typography>
              <Typography variant="h6" fontWeight="bold" noWrap>{courseTitle || "N/A"}</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <Box sx={{ px: 3, pb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search by student name or roll number"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <Divider />

        {/* TABLE */}
        <TableContainer sx={{ maxHeight: "75vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell><strong>Student</strong></TableCell>
                <TableCell align="center"><strong>Roll No</strong></TableCell>
                <TableCell align="center"><strong>Present</strong></TableCell>
                <TableCell align="center"><strong>Absent</strong></TableCell>
                <TableCell align="center"><strong>Leave</strong></TableCell>
                <TableCell align="center"><strong>Total</strong></TableCell>
                <TableCell align="center"><strong>Percentage</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student, index) => {
                  const activeSessions = student.total - student.leave;
                  const percentage = activeSessions > 0 ? ((student.present / activeSessions) * 100).toFixed(1) : "0.0";

                  return (
                    <TableRow key={index} hover>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar>{student.studentName?.charAt(0)}</Avatar>
                          <Typography fontWeight="600">{student.studentName}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">{student.rollNo}</TableCell>
                      <TableCell align="center"><Chip label={student.present} color="success" size="small" /></TableCell>
                      <TableCell align="center"><Chip label={student.absent} color="error" size="small" /></TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={student.leave} 
                          color="warning" 
                          size="small" 
                          sx={{ bgcolor: "warning.light", color: "warning.dark", fontWeight: "bold" }}
                        />
                      </TableCell>
                      <TableCell align="center"><Typography fontWeight="bold">{student.total}</Typography></TableCell>
                      <TableCell align="center">
                        <Typography fontWeight="bold" color={parseFloat(percentage) >= 75 ? "green" : "error"}>
                          {percentage}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {parseFloat(percentage) >= 75 ? (
                          <Chip label="Good" color="success" />
                        ) : parseFloat(percentage) >= 50 ? (
                          <Chip label="Average" color="warning" />
                        ) : (
                          <Chip label="Low" color="error" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">No students found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AttendanceViewByCourse;