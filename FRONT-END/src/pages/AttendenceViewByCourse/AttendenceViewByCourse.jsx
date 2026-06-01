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
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import axios from "axios";

import { toast } from "react-toastify";

import { useParams } from "react-router-dom";

const AttendanceViewByCourse = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const { courseId } =
    useParams();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [attendanceData, setAttendanceData] =
    useState([]);

  const [courseTitle, setCourseTitle] =
    useState("");

  const [search, setSearch] =
    useState("");

  // ================= FETCH =================
  useEffect(() => {
    const fetchAttendance =
      async () => {
        try {
          setLoading(true);

          const res =
            await axios.get(
              `${baseURL}/api/attendance`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          // FILTER COURSE
          const filtered =
            res.data.filter(
              (item) =>
                String(
                  item.courseId
                    ?._id ||
                    item.courseId
                ) ===
                String(courseId)
            );

          setAttendanceData(
            filtered
          );

          if (
            filtered.length > 0
          ) {
            setCourseTitle(
              filtered[0]
                .courseId
                ?.courseTitle || ""
            );
          }

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load attendance"
          );
        } finally {
          setLoading(false);
        }
      };

    if (courseId) {
      fetchAttendance();
    }
  }, [courseId, token]);

  // ================= SUMMARY =================
  const summary =
    useMemo(() => {
      const map =
        new Map();

      attendanceData.forEach(
        (record) => {
          record.attendance?.forEach(
            (att) => {
              const id =
                att.studentId
                  ?._id;

              if (!id) return;

              if (
                !map.has(id)
              ) {
                map.set(id, {
                  studentName:
                    att
                      .studentId
                      ?.studentName,
                  rollNo:
                    att
                      .studentId
                      ?.rollNo,
                  present: 0,
                  absent: 0,
                  total: 0,
                });
              }

              const student =
                map.get(id);

              student.total += 1;

              if (
                att.status ===
                "present"
              ) {
                student.present += 1;
              } else {
                student.absent += 1;
              }
            }
          );
        }
      );

      return Array.from(
        map.values()
      );
    }, [attendanceData]);

  // ================= FILTERED =================
  const filteredStudents =
    summary.filter(
      (student) => {
        const query =
          search.toLowerCase();

        return (
          student.studentName
            ?.toLowerCase()
            .includes(
              query
            ) ||
          student.rollNo
            ?.toLowerCase()
            .includes(
              query
            )
        );
      }
    );

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            p: 3,
            bgcolor:
              "primary.main",
            color: "white",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Course Attendance
          </Typography>

          <Typography
            variant="h6"
            sx={{ mt: 1 }}
          >
            {courseTitle}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              opacity: 0.9,
              mt: 1,
            }}
          >
            Student attendance
            analytics and
            performance
          </Typography>
        </Box>

        {/* STATS */}
        <Grid
          container
          spacing={2}
          sx={{ p: 3 }}
        >
          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                Total Students
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {
                  filteredStudents.length
                }
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                Attendance Sessions
              </Typography>

              <Typography
                variant="h4"
                fontWeight="bold"
              >
                {
                  attendanceData.length
                }
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 4,
            }}
          >
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">
                Course
              </Typography>

              <Typography
                variant="h6"
                fontWeight="bold"
              >
                {courseTitle}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <Box
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <TextField
            fullWidth
            placeholder="Search by student name or roll number"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            InputProps={{
              startAdornment:
                (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
            }}
          />
        </Box>

        <Divider />

        {/* TABLE */}
        <TableContainer
          sx={{
            maxHeight:
              "75vh",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>
                    Student
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Roll No
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Present
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Absent
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Total
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Percentage
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Status
                  </strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.length >
              0 ? (
                filteredStudents.map(
                  (
                    student,
                    index
                  ) => {
                    const percentage =
                      (
                        (student.present /
                          student.total) *
                        100
                      ).toFixed(
                        1
                      );

                    return (
                      <TableRow
                        key={
                          index
                        }
                        hover
                      >
                        {/* STUDENT */}
                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                          >
                            <Avatar>
                              {student.studentName?.charAt(
                                0
                              )}
                            </Avatar>

                            <Typography fontWeight="600">
                              {
                                student.studentName
                              }
                            </Typography>
                          </Stack>
                        </TableCell>

                        {/* ROLL */}
                        <TableCell align="center">
                          {
                            student.rollNo
                          }
                        </TableCell>

                        {/* PRESENT */}
                        <TableCell align="center">
                          <Chip
                            label={
                              student.present
                            }
                            color="success"
                            size="small"
                          />
                        </TableCell>

                        {/* ABSENT */}
                        <TableCell align="center">
                          <Chip
                            label={
                              student.absent
                            }
                            color="error"
                            size="small"
                          />
                        </TableCell>

                        {/* TOTAL */}
                        <TableCell align="center">
                          <Typography fontWeight="bold">
                            {
                              student.total
                            }
                          </Typography>
                        </TableCell>

                        {/* PERCENTAGE */}
                        <TableCell align="center">
                          <Typography
                            fontWeight="bold"
                            color={
                              percentage >=
                              75
                                ? "green"
                                : "error"
                            }
                          >
                            {
                              percentage
                            }
                            %
                          </Typography>
                        </TableCell>

                        {/* STATUS */}
                        <TableCell>
                          {percentage >=
                          75 ? (
                            <Chip
                              label="Good"
                              color="success"
                            />
                          ) : percentage >=
                            50 ? (
                            <Chip
                              label="Average"
                              color="warning"
                            />
                          ) : (
                            <Chip
                              label="Low"
                              color="error"
                            />
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No students found
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

export default AttendanceViewByCourse;