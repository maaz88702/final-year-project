import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  IconButton,
  Box,
  Chip,
} from "@mui/material";

import {
  Delete,
  Download,
} from "@mui/icons-material";

import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AssignmentSubmittedList = () => {
  const baseURL = "http://localhost:3000";

  const token = localStorage.getItem("jwt");

  // ================= TEACHER ID =================
  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      teacherId =
        decoded.id || decoded._id;

    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  // ================= STATES =================
  const [data, setData] = useState([]);

  const [assignments, setAssignments] =
    useState([]);

  const [selectedAssignment,
    setSelectedAssignment] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const [submissionRes, assignmentRes] =
        await Promise.all([
          axios.get(
            `${baseURL}/api/assignmentSubmitted`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),

          axios.get(
            `${baseURL}/api/assignmentPosted`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          ),
        ]);

      console.log(
        "All Assignments:",
        assignmentRes.data
      );

      console.log(
        "All Submissions:",
        submissionRes.data
      );

      // ================= ONLY LOGGED-IN TEACHER ASSIGNMENTS =================
      const teacherAssignments =
        assignmentRes.data.filter(
          (assignment) =>
            String(
              assignment.teacherId?._id ||
              assignment.teacherId
            ) === String(teacherId)
        );

      console.log(
        "Teacher Assignments:",
        teacherAssignments
      );

      setAssignments(teacherAssignments);

      // ================= GET TEACHER ASSIGNMENT IDS =================
      const teacherAssignmentIds =
        teacherAssignments.map((a) =>
          String(a._id)
        );

      // ================= FILTER SUBMISSIONS =================
      const teacherSubmissions =
        submissionRes.data.filter(
          (submission) =>
            teacherAssignmentIds.includes(
              String(
                submission.assignmentId?._id ||
                submission.assignmentId
              )
            )
        );

      console.log(
        "Teacher Submissions:",
        teacherSubmissions
      );

      setData(teacherSubmissions);

    } catch (error) {
      console.error(error);

      toast.error(
        "Failed to fetch data"
      );
    }
  };

  useEffect(() => {
    if (token && teacherId) {
      fetchData();
    }
  }, []);

  // ================= FILTERED DATA =================
  const filteredData = useMemo(() => {
    if (!selectedAssignment) {
      return data;
    }

    return data.filter(
      (item) =>
        String(
          item.assignmentId?._id ||
          item.assignmentId
        ) === selectedAssignment
    );
  }, [data, selectedAssignment]);

  console.log(
    "Filtered Data:",
    filteredData
  );

  // ================= DELETE =================
  const handleDelete = async (id) => {
    const confirmDelete =
      window.confirm(
        "Delete this submission?"
      );

    if (!confirmDelete) return;

    try {
      await axios.delete(
        `${baseURL}/api/assignmentSubmitted/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Deleted successfully"
      );

      // remove locally
      setData((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    } catch (error) {
      console.error(error);

      toast.error("Delete failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (
    filePath
  ) => {
    if (!filePath) {
      toast.error("No file found");
      return;
    }

    const fileURL =
      `${baseURL}/uploads/${filePath}`;

    window.open(fileURL, "_blank");
  };

  // ================= UI =================
  return (
    <Container maxWidth="lg">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
        }}
      >
        {/* HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Assignment Submissions
          </Typography>

          <Chip
            label={`${filteredData.length} Submissions`}
            color="primary"
          />
        </Box>

        {/* FILTER */}
        <Grid
          container
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Grid size={12}>
            <TextField
              select
              fullWidth
              label="Filter by Assignment"
              value={selectedAssignment}
              onChange={(e) =>
                setSelectedAssignment(
                  e.target.value
                )
              }
            >
              <MenuItem value="">
                All Assignments
              </MenuItem>

              {assignments.map(
                (assignment) => (
                  <MenuItem
                    key={assignment._id}
                    value={
                      assignment._id
                    }
                  >
                    {assignment.title}
                  </MenuItem>
                )
              )}
            </TextField>
          </Grid>
        </Grid>

        {/* EMPTY */}
        {filteredData.length === 0 && (
          <Paper
            sx={{
              p: 4,
              textAlign: "center",
              bgcolor: "#fafafa",
            }}
          >
            <Typography
              variant="h6"
            >
              No submissions found
            </Typography>
          </Paper>
        )}

        {/* SUBMISSIONS */}
        {filteredData.map((item) => (
          <Paper
            key={item._id}
            sx={{
              p: 3,
              mb: 2,
              borderRadius: 3,
              boxShadow: 2,
            }}
          >
            <Typography mb={1}>
              <strong>
                Student:
              </strong>{" "}
              {
                item.studentId
                  ?.studentName
              }{" "}
              —
              <strong>
                {" "}
                {
                  item.studentId
                    ?.rollNo
                }
              </strong>
            </Typography>

            <Typography mb={1}>
              <strong>
                Assignment:
              </strong>{" "}
              {
                item.assignmentId
                  ?.title
              }
            </Typography>

            <Typography mb={1}>
              <strong>
                Submitted:
              </strong>{" "}
              {new Date(
                item.createdAt
              ).toLocaleString()}
            </Typography>

            {/* ACTIONS */}
            <Box
              display="flex"
              gap={1}
              mt={2}
            >
              {/* DOWNLOAD */}
              <IconButton
                color="primary"
                onClick={() =>
                  handleDownload(
                    item.file
                  )
                }
              >
                <Download />
              </IconButton>

              {/* DELETE */}
              <IconButton
                color="error"
                onClick={() =>
                  handleDelete(
                    item._id
                  )
                }
              >
                <Delete />
              </IconButton>
            </Box>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default AssignmentSubmittedList;