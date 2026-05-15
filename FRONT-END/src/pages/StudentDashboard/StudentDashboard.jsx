import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Divider,
  Button,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
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
      toast.error("Please login first");
      navigate("/student/login");
    }
  }, [token, navigate]);

  // ================= STATES =================
  const [student, setStudent] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, assignRes, submitRes] = await Promise.all([
          axios.get(`${baseURL}/api/student/${studentId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentSubmitted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const studentData = studentRes.data;
        setStudent(studentData);

        const filteredAssignments = assignRes.data.filter(
          (a) =>
            String(a.semesterId?._id || a.semesterId) ===
            String(studentData.semester?._id || studentData.semester)
        );

        setAssignments(filteredAssignments);

        const mySubmissions = submitRes.data.filter(
          (s) => String(s.studentId?._id || s.studentId) === studentId
        );

        setSubmissions(mySubmissions);

      } catch (error) {
        console.error(error);
        toast.error("Failed to load dashboard");
      }
    };

    if (token && studentId) fetchData();
  }, [token, studentId]);

  // ================= HELPERS =================
  const getSubmission = (assignmentId) => {
    return submissions.find(
      (s) =>
        String(s.assignmentId?._id || s.assignmentId) === assignmentId
    );
  };

  const isExpired = (dueDate) => {
    return new Date() > new Date(dueDate);
  };

  const getStatus = (assignment) => {
    const submission = getSubmission(assignment._id);

    if (isExpired(assignment.dueDate))
      return { label: "Time out", color: "error" };

    if (!submission)
      return { label: "Pending", color: "warning" };

    if (submission.marks > 0)
      return { label: "Graded", color: "success" };

    return { label: "Submitted", color: "info" };
  };

  // ================= STATS =================
  const total = assignments.length;
  const submitted = submissions.length;
  const pending = total - submitted;

  // ================= UI =================
  return (
      <Container maxWidth="lg">
       
      <Paper sx={{ p: 4, mt: 4 }}>

        {/* Header */}
        <Typography variant="h5" fontWeight="bold">
          Student Dashboard
        </Typography>

        {student && (
          <>
            <Typography>Name: {student.studentName}</Typography>
            <Typography>Roll No: {student.rollNo}</Typography>
          </>
        )}

        <Divider sx={{ my: 3 }} />

        {/* 📊 Stats Cards */}
        <Grid container spacing={2}>
          <Grid size={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Total Assignments</Typography>
                <Typography variant="h6">{total}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Submitted</Typography>
                <Typography variant="h6">{submitted}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={12} md={4}>
            <Card>
              <CardContent>
                <Typography>Pending</Typography>
                <Typography variant="h6">{pending}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        {/* Assignments */}
        <Typography variant="h6" fontWeight="bold">
          Your Assignments
        </Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          {assignments.map((a) => {
            const submission = getSubmission(a._id);
            const status = getStatus(a);

            return (
              <Grid key={a._id} size={12} md={6}>
                <Card>
                  <CardContent>

                    <Typography variant="h6">
                      {a.title}
                    </Typography>

                    <Typography sx={{ mt: 1 }}>
                      Due: {a.dueDate}
                    </Typography>

                    {/* 🎯 Status */}
                    <Chip
                      label={status.label}
                      color={status.color}
                      sx={{ mt: 1 }}
                    />

                    {/* Marks */}
                    {submission && (
                      <Typography sx={{ mt: 1 }}>
                        Marks: {submission.marks || 0}
                      </Typography>
                    )}

                    {/* 🚀 Buttons */}
                    <Grid container spacing={1} sx={{ mt: 2 }}>

                      {/* Submit */}
                      <Grid>
                        <Button
                          variant="contained"
                          size="small"
                          disabled={
                            submission || isExpired(a.dueDate)
                          }
                          onClick={() =>
                            navigate(
        `/student/AssignmentSubmitAdd/${a._id}`
      )
                          }
                        >
                          Submit
                        </Button>
                      </Grid>

                      {/* View */}
                      {submission && (
                        <Grid>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() =>
                              window.open(
                                `${baseURL}/uploads/${submission.file}`,
                                "_blank"
                              )
                            }
                          >
                            View
                          </Button>
                        </Grid>
                      )}

                      {/* Download */}
                      {submission && (
                        <Grid>
                          <Button
                            variant="outlined"
                            size="small"
                            href={`${baseURL}/uploads/${submission.file}`}
                            download
                          >
                            Download
                          </Button>
                        </Grid>
                      )}

                    </Grid>

                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>

      </Paper>
    </Container>
  );
};

export default StudentDashboard;