import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

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
  MenuItem,
  Button,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";

import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download"; 
import AssessmentIcon from "@mui/icons-material/Assessment"; 
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AttendanceView = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  // ================= STATES =================
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [semesterFilter, setSemesterFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");

  // ================= FETCH ATTENDANCE =================
  // ================= FETCH ATTENDANCE =================
  // ================= FETCH ATTENDANCE =================
 // ================= FETCH ATTENDANCE =================
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${baseURL}/api/attendance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const decodedToken = jwtDecode(token);
        const loggedInTeacherId = decodedToken?.id || decodedToken?._id;

        if (loggedInTeacherId && Array.isArray(res.data)) {
          
          // Check if the backend is providing a valid teacher identifier path
          const hasTeacherField = res.data.length > 0 && 
            (res.data[0].teacherId || res.data[0].teacher || res.data[0].courseId?.teacherId);

          if (hasTeacherField) {
            // Apply strict matching filter when field data exists
            const teacherSpecificRecords = res.data.filter((item) => {
              const recordTeacherField = item.teacherId || item.teacher || item.courseId?.teacherId;
              const recordTeacherId = recordTeacherField?._id || recordTeacherField;
              return String(recordTeacherId) === String(loggedInTeacherId);
            });
            setAttendanceData(teacherSpecificRecords);
          } else {
            // Fallback safety layer: displays returned records if backend omitted teacher property keys
            console.warn("Backend documents lack a teacher relationship path reference. Defaulting to show full response array.");
            setAttendanceData(res.data);
          }

        } else {
          setAttendanceData([]);
          toast.error("User identity verification expired. Please re-login.");
        }
      } catch (error) {
        console.error("Fetch attendance application context error:", error);
        toast.error("Failed to load attendance");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchAttendance();
    } else {
      toast.error("Access Denied: Token missing.");
    }
  }, [token]);

  // ================= UNIQUE COURSES =================
  const uniqueCourses = useMemo(() => {
    const map = new Map();
    attendanceData.forEach((item) => {
      if (item.courseId?._id) {
        map.set(item.courseId._id, item.courseId?.courseTitle);
      }
    });
    return Array.from(map.entries());
  }, [attendanceData]);

  // ================= UNIQUE SEMESTERS =================
  const uniqueSemesters = useMemo(() => {
    const semesters = attendanceData.map((item) => item.semesterId?.semester);
    return [...new Set(semesters.filter(Boolean))];
  }, [attendanceData]);

  // ================= FILTER DATA =================
  const filteredData = attendanceData.filter((item) => {
    const course = item.courseId?.courseTitle || "";
    const semester = item.semesterId?.semester || "";

    const searchMatch =
      course.toLowerCase().includes(search.toLowerCase()) ||
      semester.toLowerCase().includes(search.toLowerCase());

    const semesterMatch = semesterFilter ? semester === semesterFilter : true;
    const courseMatch = courseFilter
      ? String(item.courseId?._id) === String(courseFilter)
      : true;

    return searchMatch && semesterMatch && courseMatch;
  });

  // ================= STATS (OVERALL SUMMARIES) =================
  const totalRecords = filteredData.length;

  const totalStudents = filteredData.reduce(
    (acc, item) => acc + (item.attendance?.length || 0),
    0
  );

  const totalPresent = filteredData.reduce(
    (acc, item) =>
      acc + (item.attendance?.filter((a) => a.status === "present").length || 0),
    0
  );

  const totalLeave = filteredData.reduce(
    (acc, item) =>
      acc + (item.attendance?.filter((a) => a.status === "leave").length || 0),
    0
  );

  const totalAbsent = filteredData.reduce(
    (acc, item) =>
      acc + (item.attendance?.filter((a) => a.status === "absent").length || 0),
    0
  );

  const globalPercentage = useMemo(() => {
    if (totalStudents === 0) return 0;
    return Math.round(((totalPresent + totalLeave) / totalStudents) * 100);
  }, [totalStudents, totalPresent, totalLeave]);

  // ================= CSV DOWNLOAD LOGIC =================
  const handleDownloadCSV = (record) => {
    try {
      const courseTitle = record.courseId?.courseTitle || "Course";
      const semesterName = record.semesterId?.semester || "Semester";
      const recordDate = new Date(record.date).toLocaleDateString().replace(/\//g, "-");

      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += `Course Name,${courseTitle.replace(/,/g, " ")}\n`;
      csvContent += `Semester,${semesterName.replace(/,/g, " ")}\n`;
      csvContent += `Session Date,${new Date(record.date).toLocaleDateString()}\n\n`;
      csvContent += "Serial No,Student Name,Roll Number,Attendance Status\n";

      if (record.attendance && record.attendance.length > 0) {
        record.attendance.forEach((studentRow, idx) => {
          const sName = studentRow.studentId?.studentName || "N/A";
          const sRoll = studentRow.studentId?.rollNo || "N/A";
          const sStatus = studentRow.status || "N/A";

          const cleanedName = sName.replace(/,/g, " ");
          const cleanedRoll = sRoll.replace(/,/g, " ");
          const cleanedStatus = sStatus.toUpperCase();

          csvContent += `${idx + 1},${cleanedName},${cleanedRoll},${cleanedStatus}\n`;
        });
      } else {
        csvContent += ",No attendance data matched for this course sheet\n";
      }

      const encodedUri = encodeURI(csvContent);
      const tempLink = document.createElement("a");
      tempLink.setAttribute("href", encodedUri);
      
      const filename = `${courseTitle.replace(/\s+/g, "_")}_${semesterName.replace(/\s+/g, "_")}_Attendance_${recordDate}.csv`;
      tempLink.setAttribute("download", filename);
      
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      toast.success("CSV Downloaded successfully");
    } catch (err) {
      console.error("CSV compilation crash context: ", err);
      toast.error("Failed to generate CSV");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 4 }}>
        {/* HEADER */}
        <Typography variant="h4" fontWeight="bold">
          Attendance Dashboard
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Manage and review course attendance records
        </Typography>

        {/* STATS */}
        <Grid container spacing={2} sx={{ mt: 3 }}>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">Total Records</Typography>
              <Typography variant="h5" fontWeight="bold">{totalRecords}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">Present</Typography>
              <Typography variant="h5" fontWeight="bold" color="green">{totalPresent}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">Leave</Typography>
              <Typography variant="h5" fontWeight="bold" color="warning.main">{totalLeave}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3 }}>
              <Typography variant="body2" color="text.secondary">Absent</Typography>
              <Typography variant="h5" fontWeight="bold" color="error">{totalAbsent}</Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.4 }}>
            <Paper elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: "primary.light", color: "primary.contrastText" }}>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>Avg Attendance (P+L)</Typography>
              <Typography variant="h5" fontWeight="bold">{globalPercentage}%</Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* COURSE ANALYTICS SHORTCUT BUTTONS BOX */}
        {uniqueCourses.length > 0 && (
          <Box sx={{ mt: 4, p: 2, bgcolor: "grey.50", borderRadius: 3, border: "1px dashed", borderColor: "grey.300" }}>
            <Typography variant="subtitle2" fontWeight="bold" color="text.secondary" sx={{ mb: 1.5 }}>
              Course Analytics Summaries:
            </Typography>
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
              {uniqueCourses.map((course) => (
                <Button
                  key={course[0]}
                  variant="outlined"
                  color="primary"
                  size="small"
                  startIcon={<AssessmentIcon />}
                  onClick={() => navigate(`/teacher/course-attendance/${course[0]}`)}
                  sx={{ borderRadius: 2, bgcolor: "white", textTransform: "none", fontWeight: 600 }}
                >
                  {course[1]}
                </Button>
              ))}
            </Stack>
          </Box>
        )}

        {/* FILTERS */}
        <Grid container spacing={2} sx={{ mt: 3, mb: 3 }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              fullWidth
              label="Search"
              placeholder="Search course or semester"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Filter Semester"
              value={semesterFilter}
              onChange={(e) => setSemesterFilter(e.target.value)}
            >
              <MenuItem value="">All Semesters</MenuItem>
              {uniqueSemesters.map((semester, index) => (
                <MenuItem key={index} value={semester}>
                  {semester}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              select
              fullWidth
              label="Filter Course"
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
            >
              <MenuItem value="">All Courses</MenuItem>
              {uniqueCourses.map((course, index) => (
                <MenuItem key={index} value={course[0]}>
                  {course[1]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* TABLE */}
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>#</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
                <TableCell><strong>Course</strong></TableCell>
                <TableCell><strong>Semester</strong></TableCell>
                <TableCell><strong>Total</strong></TableCell>
                <TableCell><strong>Present</strong></TableCell>
                <TableCell><strong>Leave</strong></TableCell>
                <TableCell><strong>Absent</strong></TableCell>
                <TableCell><strong>Attendance % (P+L)</strong></TableCell>
                <TableCell align="center"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const total = item.attendance?.length || 0;
                  const present = item.attendance?.filter((a) => a.status === "present").length || 0;
                  const leave = item.attendance?.filter((a) => a.status === "leave").length || 0;
                  const absent = item.attendance?.filter((a) => a.status === "absent").length || 0;
                  const rowPercentage = total > 0 ? Math.round(((present + leave) / total) * 100) : 0;

                  return (
                    <TableRow key={item._id} hover>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar>{item.courseId?.courseTitle?.charAt(0)}</Avatar>
                          <Typography fontWeight="600">{item.courseId?.courseTitle}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={item.semesterId?.semester} color="primary" size="small" />
                      </TableCell>
                      <TableCell>{total}</TableCell>
                      <TableCell><Chip label={present} color="success" size="small" /></TableCell>
                      <TableCell><Chip label={leave} color="warning" size="small" /></TableCell>
                      <TableCell><Chip label={absent} color="error" size="small" /></TableCell>
                      <TableCell>
                        <Typography fontWeight="bold" color={rowPercentage >= 75 ? "success.main" : "error.main"}>
                          {rowPercentage}%
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="View Session Sheet Details">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() => navigate(`/teacher/attendanceview/${item._id}`)}
                            >
                              View
                            </Button>
                          </Tooltip>

                          <Tooltip title="Download CSV Report">
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() => handleDownloadCSV(item)}
                            >
                              CSV
                            </Button>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={10} align="center">No attendance records found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default AttendanceView;