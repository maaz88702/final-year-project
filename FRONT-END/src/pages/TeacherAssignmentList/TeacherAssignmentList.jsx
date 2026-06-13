import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Chip,
  Stack,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const TeacherAssignmentList = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (err) {
      console.error(err);
    }
  }

  const [loading, setLoading] = useState(false);
  const [assignments, setAssignments] = useState([]);
  const [search, setSearch] = useState("");

  // ================= FETCH ASSIGNMENTS =================
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `${baseURL}/api/assignmentPosted`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const teacherAssignments = res.data.filter(
          (item) =>
            String(item.teacherId?._id || item.teacherId) ===
            String(teacherId)
        );

        setAssignments(teacherAssignments);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load assignments");
      } finally {
        setLoading(false);
      }
    };

    if (teacherId) {
      fetchAssignments();
    }
  }, [teacherId, token]);

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this assignment?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${baseURL}/api/assignmentPosted/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAssignments((prev) =>
        prev.filter((item) => item._id !== id)
      );

      toast.success("Assignment deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete assignment");
    }
  };

  // ================= FILTER =================
  const filteredAssignments = assignments.filter(
    (item) =>
      item.title
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.courseId?.courseTitle
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* HEADER */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
      >
        My Assignments
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        View and manage assignments you have posted.
      </Typography>

      {/* SEARCH */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Search Assignment"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />
      </Paper>

      {/* SUMMARY */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <Paper sx={{ p: 2 }}>
            <Typography color="text.secondary">
              Total Assignments
            </Typography>

            <Typography
              variant="h4"
              fontWeight="bold"
            >
              {assignments.length}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* TABLE */}
      <TableContainer
        component={Paper}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>#</strong>
              </TableCell>

              <TableCell>
                <strong>Title</strong>
              </TableCell>

              <TableCell>
                <strong>Course</strong>
              </TableCell>

              <TableCell>
                <strong>Semester</strong>
              </TableCell>

              <TableCell>
                <strong>Due Date</strong>
              </TableCell>

              <TableCell>
                <strong>Total Marks</strong>
              </TableCell>

              <TableCell>
                <strong>Questions</strong>
              </TableCell>

              <TableCell align="center">
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map(
                (assignment, index) => (
                  <TableRow
                    key={assignment._id}
                    hover
                  >
                    <TableCell>
                      {index + 1}
                    </TableCell>

                    <TableCell>
                      <Typography
                        fontWeight="600"
                      >
                        {assignment.title}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {assignment.courseId
                        ?.courseTitle ||
                        "N/A"}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          assignment
                            .semesterId
                            ?.semester ||
                          "N/A"
                        }
                        color="primary"
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {assignment.dueDate}
                    </TableCell>

                    <TableCell>
                      {
                        assignment.totalMarks
                      }
                    </TableCell>

                    <TableCell>
                      {
                        assignment
                          .assignmentDetails
                          ?.length
                      }
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="center"
                      >
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() =>
                            navigate(
                              `/teacher/view-assignment/${assignment._id}`
                            )
                          }
                        >
                          View
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            navigate(
                              `/teacher/edit-assignment/${assignment._id}`
                            )
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          onClick={() =>
                            handleDelete(
                              assignment._id
                            )
                          }
                        >
                          Delete
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )
              )
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                >
                  No assignments found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherAssignmentList;