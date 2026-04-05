import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import StudentNavbar from "../../components/StudentNavbar/StudentNavbar";

const AssignmentSubmit = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let studentId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      studentId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/student/login");
    }
  }, [token, navigate]);

  // ================= STATES =================
  const [assignments, setAssignments] = useState([]);
  const [submittedAssignments, setSubmittedAssignments] = useState([]);

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [file, setFile] = useState(null);

  // ================= DATE CHECK =================
  const isExpired = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, submittedRes, studentRes] = await Promise.all([
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentSubmitted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/student/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const student = studentRes.data;

        // ✅ Filter assignments by student semester
        const filteredAssignments = assignRes.data.filter(
          (a) =>
            String(a.semesterId?._id || a.semesterId) ===
            String(student.semester?._id || student.semester)
        );

        setAssignments(filteredAssignments);

        // ✅ My submissions
        const mySubmissions = submittedRes.data.filter(
          (s) => String(s.studentId?._id || s.studentId) === studentId
        );

        setSubmittedAssignments(mySubmissions);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      }
    };

    if (token && studentId) fetchData();
  }, [token, studentId]);

  // ================= DUPLICATE CHECK =================
  const isAlreadySubmitted = (assignmentId) => {
    return submittedAssignments.some(
      (s) =>
        String(s.assignmentId?._id || s.assignmentId) === assignmentId
    );
  };

  // ================= FILE =================
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const assignment = assignments.find(
      (a) => a._id === selectedAssignment
    );

    // ✅ Safety check
    if (!assignment) {
      toast.error("Invalid assignment");
      return;
    }

    if (!selectedAssignment || !file) {
      toast.error("Select assignment and upload file");
      return;
    }

    if (isExpired(assignment.dueDate)) {
      toast.error("Assignment deadline has passed");
      return;
    }

    if (isAlreadySubmitted(selectedAssignment)) {
      toast.error("You already submitted this assignment");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("studentId", studentId);
      formData.append("assignmentId", selectedAssignment);
      formData.append("file", file);

      await axios.post(
        `${baseURL}/api/assignmentSubmitted/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("Assignment submitted successfully!");

      // update UI instantly
      setSubmittedAssignments((prev) => [
        ...prev,
        { assignmentId: selectedAssignment },
      ]);

      // reset
      setSelectedAssignment("");
      setFile(null);

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Submission failed"
      );
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <StudentNavbar />
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Submit Assignment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>

            {/* Assignment Dropdown */}
            <Grid size={12}>
              <TextField
                select
                label="Select Assignment"
                fullWidth
                value={selectedAssignment}
                onChange={(e) =>
                  setSelectedAssignment(e.target.value)
                }
              >
                {assignments.length === 0 && (
                  <MenuItem disabled>No assignments</MenuItem>
                )}

                {assignments.map((a) => {
                  const submitted = isAlreadySubmitted(a._id);
                  const expired = isExpired(a.dueDate);

                  return (
                    <MenuItem
                      key={a._id}
                      value={a._id}
                      disabled={submitted || expired}
                    >
                      {a.title}
                      {submitted && " (Submitted)"}
                      {expired && " (Expired)"}
                    </MenuItem>
                  );
                })}
              </TextField>
            </Grid>

            {/* File Upload */}
            <Grid size={12}>
              <Typography sx={{ mb: 1 }}>
                Upload Assignment File
              </Typography>
              <input
                type="file"
                onChange={handleFileChange}
                key={file ? file.name : ""}
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ height: 45 }}
          >
            Submit Assignment
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentSubmit;