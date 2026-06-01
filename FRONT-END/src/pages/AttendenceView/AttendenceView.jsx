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

import axios from "axios";

import { toast } from "react-toastify";

import { useNavigate } from "react-router-dom";

const AttendanceView = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [attendanceData, setAttendanceData] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [semesterFilter, setSemesterFilter] =
    useState("");

  const [courseFilter, setCourseFilter] =
    useState("");

  // ================= FETCH ATTENDANCE =================
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

          setAttendanceData(
            res.data
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load attendance"
          );
        } finally {
          setLoading(false);
        }
      };

    fetchAttendance();
  }, [token]);

  // ================= UNIQUE COURSES =================
  const uniqueCourses =
    useMemo(() => {
      const map =
        new Map();

      attendanceData.forEach(
        (item) => {
          if (
            item.courseId?._id
          ) {
            map.set(
              item.courseId._id,
              item.courseId
                ?.courseTitle
            );
          }
        }
      );

      return Array.from(
        map.entries()
      );
    }, [attendanceData]);

  // ================= UNIQUE SEMESTERS =================
  const uniqueSemesters =
    useMemo(() => {
      const semesters =
        attendanceData.map(
          (item) =>
            item.semesterId
              ?.semester
        );

      return [
        ...new Set(
          semesters.filter(
            Boolean
          )
        ),
      ];
    }, [attendanceData]);

  // ================= FILTER DATA =================
  const filteredData =
    attendanceData.filter(
      (item) => {
        const course =
          item.courseId
            ?.courseTitle || "";

        const semester =
          item.semesterId
            ?.semester || "";

        const searchMatch =
          course
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          semester
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const semesterMatch =
          semesterFilter
            ? semester ===
              semesterFilter
            : true;

        const courseMatch =
          courseFilter
            ? String(
                item
                  .courseId
                  ?._id
              ) ===
              String(
                courseFilter
              )
            : true;

        return (
          searchMatch &&
          semesterMatch &&
          courseMatch
        );
      }
    );

  // ================= STATS =================
  const totalRecords =
    filteredData.length;

  const totalStudents =
    filteredData.reduce(
      (acc, item) =>
        acc +
        (item.attendance
          ?.length || 0),
      0
    );

  const totalPresent =
    filteredData.reduce(
      (acc, item) =>
        acc +
        (item.attendance?.filter(
          (a) =>
            a.status ===
            "present"
        ).length || 0),
      0
    );

  const totalAbsent =
    filteredData.reduce(
      (acc, item) =>
        acc +
        (item.attendance?.filter(
          (a) =>
            a.status ===
            "absent"
        ).length || 0),
      0
    );

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          height: "100vh",
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
        sx={{
          p: 3,
          borderRadius: 4,
        }}
      >
        {/* HEADER */}
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Attendance Dashboard
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Manage and review
          course attendance
          records
        </Typography>

        {/* STATS */}
        <Grid
          container
          spacing={2}
          sx={{ mt: 3 }}
        >
          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Records
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                {totalRecords}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Students
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
              >
                {totalStudents}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Present
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="green"
              >
                {totalPresent}
              </Typography>
            </Paper>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 3,
            }}
          >
            <Paper
              elevation={2}
              sx={{
                p: 2,
                borderRadius: 3,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Absent
              </Typography>

              <Typography
                variant="h5"
                fontWeight="bold"
                color="error"
              >
                {totalAbsent}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* FILTERS */}
        <Grid
          container
          spacing={2}
          sx={{ mt: 3, mb: 3 }}
        >
          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <TextField
              fullWidth
              label="Search"
              placeholder="Search course or semester"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <TextField
              select
              fullWidth
              label="Filter Semester"
              value={
                semesterFilter
              }
              onChange={(e) =>
                setSemesterFilter(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                All Semesters
              </MenuItem>

              {uniqueSemesters.map(
                (
                  semester,
                  index
                ) => (
                  <MenuItem
                    key={
                      index
                    }
                    value={
                      semester
                    }
                  >
                    {
                      semester
                    }
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>

          <Grid
            size={{
              xs: 12,
              md: 4,
            }}
          >
            <TextField
              select
              fullWidth
              label="Filter Course"
              value={
                courseFilter
              }
              onChange={(e) =>
                setCourseFilter(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                All Courses
              </MenuItem>

              {uniqueCourses.map(
                (
                  course,
                  index
                ) => (
                  <MenuItem
                    key={
                      index
                    }
                    value={
                      course[0]
                    }
                  >
                    {
                      course[1]
                    }
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>
        </Grid>

        {/* TABLE */}
        <TableContainer
          component={Paper}
          elevation={2}
          sx={{
            borderRadius: 3,
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>
                    #
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Date
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Course
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Semester
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Total
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Present
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    Absent
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    Action
                  </strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredData.length >
              0 ? (
                filteredData.map(
                  (
                    item,
                    index
                  ) => {
                    const present =
                      item.attendance?.filter(
                        (
                          a
                        ) =>
                          a.status ===
                          "present"
                      ).length || 0;

                    const absent =
                      item.attendance?.filter(
                        (
                          a
                        ) =>
                          a.status ===
                          "absent"
                      ).length || 0;

                    return (
                      <TableRow
                        key={
                          item._id
                        }
                        hover
                      >
                        <TableCell>
                          {index +
                            1}
                        </TableCell>

                        <TableCell>
                          {new Date(
                            item.date
                          ).toLocaleDateString()}
                        </TableCell>

                        <TableCell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Avatar>
                              {item
                                .courseId
                                ?.courseTitle?.charAt(
                                  0
                                )}
                            </Avatar>

                            <Typography fontWeight="600">
                              {
                                item
                                  .courseId
                                  ?.courseTitle
                              }
                            </Typography>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              item
                                .semesterId
                                ?.semester
                            }
                            color="primary"
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          {
                            item
                              .attendance
                              ?.length
                          }
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              present
                            }
                            color="success"
                            size="small"
                          />
                        </TableCell>

                        <TableCell>
                          <Chip
                            label={
                              absent
                            }
                            color="error"
                            size="small"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Tooltip title="View Details">
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={
                                <VisibilityIcon />
                              }
                              onClick={() =>
                                navigate(
                                  `/teacher/attendanceview/${item.courseId?._id}`
                                )
                              }
                            >
                              View
                            </Button>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    align="center"
                  >
                    No attendance
                    records found
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

export default AttendanceView;