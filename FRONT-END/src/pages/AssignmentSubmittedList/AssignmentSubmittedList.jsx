import React, { useEffect, useState } from "react";
filtering is remaining, rest is aproximately done
import {
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import { Delete, Edit, Download } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AssignmentSubmittedList = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const token = localStorage.getItem("jwt");

  const [data, setData] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState("");

  // ================= FETCH DATA =================
  const fetchData = async () => {
    try {
      const [res, assignRes] = await Promise.all([
        axios.get(`${baseURL}/api/assignmentSubmitted`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseURL}/api/assignmentPosted`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setData(res.data);
      setAssignments(assignRes.data);

    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ================= FILTER =================
  const filteredData = selectedAssignment
    ? data.filter(
        (d) =>
          String(d.assignmentId?._id || d.assignmentId) ===
          selectedAssignment
      )
    : data;

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this submission?")) return;

    try {
      await axios.delete(
        `${baseURL}/api/assignmentSubmitted/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Deleted successfully");
      fetchData();

    } catch (error) {
      console.error(error);
      toast.error("Delete failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (filePath) => {
    if (!filePath) {
      toast.error("No file found");
      return;
    }

    // adjust if your backend serves static files
    // `${baseURL}/uploads/${fileName}`
    const fileURL = `${baseURL}/uploads/${filePath}`;
    window.open(fileURL, "_blank");
  };

  // ================= GRADE =================
  const handleGrade = (submission) => {
    navigate("/teacher/add-grade", {
      state: {
        assignmentId: submission.assignmentId?._id || submission.assignmentId,
        studentId: submission.studentId?._id || submission.studentId,
      },
    });
  };

  // ================= UI =================
  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Assignment Submissions
        </Typography>

        {/* FILTER */}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item size={12}>
            <TextField
              select
              label="Filter by Assignment"
              fullWidth
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
            >
              <MenuItem value="">All</MenuItem>

              {assignments.map((a) => (
                <MenuItem key={a._id} value={a._id}>
                  {a.title}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        {/* LIST */}
        {filteredData.map((item) => (
          <Paper key={item._id} sx={{ p: 2, mt: 2 }}>
            <Typography>
              <strong>Student:</strong>{" "}
              {item.studentId?.studentName} —{" "}
              <strong>{item.studentId?.rollNo}</strong>
            </Typography>

            <Typography>
              <strong>Assignment:</strong>{" "}
              {item.assignmentId?.title}
            </Typography>

            <Typography>
              <strong>Marks:</strong> {item.marks || 0}
            </Typography>

            {/* ACTION BUTTONS */}
            <Grid container spacing={1} sx={{ mt: 1 }}>

              {/* Download */}
              <Grid>
                <IconButton
                  color="primary"
                  onClick={() => handleDownload(item.file)}
                >
                  <Download />
                </IconButton>
              </Grid>

              {/* Grade */}
              <Grid>
                <IconButton
                  color="success"
                  onClick={() => handleGrade(item)}
                >
                  <Edit />
                </IconButton>
              </Grid>

              {/* Delete */}
              <Grid>
                <IconButton
                  color="error"
                  onClick={() => handleDelete(item._id)}
                >
                  <Delete />
                </IconButton>
              </Grid>

            </Grid>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default AssignmentSubmittedList;