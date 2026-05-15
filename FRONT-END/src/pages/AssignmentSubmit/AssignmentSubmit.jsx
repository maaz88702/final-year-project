import React, {
  useEffect,
  useState,
} from "react";

import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Box,
} from "@mui/material";

import axios from "axios";

import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";

import { useNavigate } from "react-router-dom";

const AssignmentSubmit = () => {
  const baseURL =
    "http://localhost:3000";

  const navigate = useNavigate();

  // ================= JWT =================
  const token =
    localStorage.getItem("jwt");

  let studentId = "";

  if (token) {
    try {
      const decoded =
        jwtDecode(token);

      studentId =
        decoded.id ||
        decoded._id;
    } catch (err) {
      console.error(
        "Invalid token",
        err
      );
    }
  }

  // ================= AUTH =================
  useEffect(() => {
    if (!token) {
      toast.error(
        "Please login first"
      );

      navigate("/student/login");
    }
  }, [token, navigate]);

  // ================= STATES =================
  const [loading, setLoading] =
    useState(false);

  const [assignments, setAssignments] =
    useState([]);

  const [
    submittedAssignments,
    setSubmittedAssignments,
  ] = useState([]);

  const [
    selectedAssignment,
    setSelectedAssignment,
  ] = useState("");

  const [file, setFile] =
    useState(null);

  // ================= DATE CHECK =================
  const isExpired = (
    dueDate
  ) => {
    return (
      new Date() >
      new Date(dueDate)
    );
  };

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData =
      async () => {
        try {
          setLoading(true);

          const [
            assignRes,
            submittedRes,
            studentRes,
          ] =
            await Promise.all([
              axios.get(
                `${baseURL}/api/assignmentPosted`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),

              axios.get(
                `${baseURL}/api/assignmentSubmitted`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),

              axios.get(
                `${baseURL}/api/student/${studentId}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              ),
            ]);

          const student =
            studentRes.data;

          // FILTER ASSIGNMENTS BY SEMESTER
          const filteredAssignments =
            assignRes.data.filter(
              (a) =>
                String(
                  a
                    .semesterId
                    ?._id ||
                    a.semesterId
                ) ===
                String(
                  student
                    .semester
                    ?._id ||
                    student.semester
                )
            );

          setAssignments(
            filteredAssignments
          );

          // MY SUBMISSIONS
          const mySubmissions =
            submittedRes.data.filter(
              (s) =>
                String(
                  s.studentId
                    ?._id ||
                    s.studentId
                ) ===
                String(studentId)
            );

          setSubmittedAssignments(
            mySubmissions
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load data"
          );
        } finally {
          setLoading(false);
        }
      };

    if (token && studentId) {
      fetchData();
    }
  }, [token, studentId]);

  // ================= CHECK SUBMITTED =================
  const isAlreadySubmitted =
    (assignmentId) => {
      return submittedAssignments.some(
        (s) =>
          String(
            s.assignmentId
              ?._id ||
              s.assignmentId
          ) ===
          String(assignmentId)
      );
    };

  // ================= FILE CHANGE =================
  const handleFileChange = (
    e
  ) => {
    const selectedFile =
      e.target.files[0];

    if (!selectedFile) return;

    // ONLY PDF
    if (
      selectedFile.type !==
      "application/pdf"
    ) {
      toast.error(
        "Only PDF files are allowed"
      );

      e.target.value = "";

      return;
    }

    setFile(selectedFile);

    console.log(
      "Selected File:",
      selectedFile
    );
  };

  // ================= SUBMIT =================
  const handleSubmit =
    async (e) => {
      e.preventDefault();

      const assignment =
        assignments.find(
          (a) =>
            String(a._id) ===
            String(
              selectedAssignment
            )
        );

      if (!assignment) {
        toast.error(
          "Invalid assignment"
        );

        return;
      }

      if (
        !selectedAssignment
      ) {
        toast.error(
          "Select assignment"
        );

        return;
      }

      if (!file) {
        toast.error(
          "Upload PDF file"
        );

        return;
      }

      if (
        isExpired(
          assignment.dueDate
        )
      ) {
        toast.error(
          "Assignment deadline expired"
        );

        return;
      }

      if (
        isAlreadySubmitted(
          selectedAssignment
        )
      ) {
        toast.error(
          "Assignment already submitted"
        );

        return;
      }

      try {
        const formData =
          new FormData();

        formData.append(
          "studentId",
          studentId
        );

        formData.append(
          "assignmentId",
          selectedAssignment
        );

        formData.append(
          "file",
          file
        );

        await axios.post(
          `${baseURL}/api/assignmentSubmitted/add`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        toast.success(
          "Assignment submitted successfully"
        );

        // UPDATE UI
        setSubmittedAssignments(
          (prev) => [
            ...prev,
            {
              assignmentId:
                selectedAssignment,
            },
          ]
        );

        // RESET
        setSelectedAssignment(
          ""
        );

        setFile(null);

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Submission failed"
        );
      }
    };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "center",
          mt: 5,
        }}
      >
        <Typography>
          Loading...
        </Typography>
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          borderRadius: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Submit Assignment
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Upload your assignment
          in PDF format only
        </Typography>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <Grid
            container
            spacing={2}
            sx={{ mt: 2 }}
          >
            {/* ASSIGNMENT */}
            <Grid size={12}>
              <TextField
                select
                fullWidth
                label="Select Assignment"
                value={
                  selectedAssignment
                }
                onChange={(e) =>
                  setSelectedAssignment(
                    e.target.value
                  )
                }
              >
                {assignments.length ===
                  0 && (
                  <MenuItem disabled>
                    No assignments
                  </MenuItem>
                )}

                {assignments.map(
                  (a) => {
                    const submitted =
                      isAlreadySubmitted(
                        a._id
                      );

                    const expired =
                      isExpired(
                        a.dueDate
                      );

                    return (
                      <MenuItem
                        key={
                          a._id
                        }
                        value={
                          a._id
                        }
                        disabled={
                          submitted ||
                          expired
                        }
                      >
                        {
                          a.title
                        }

                        {submitted &&
                          " (Submitted)"}

                        {expired &&
                          " (Expired)"}
                      </MenuItem>
                    );
                  }
                )}
              </TextField>
            </Grid>

            {/* FILE */}
            <Grid size={12}>
              <Typography
                sx={{
                  mb: 1,
                }}
              >
                Upload PDF File
              </Typography>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleFileChange
                }
              />

              {file && (
                <Typography
                  sx={{
                    mt: 1,
                    fontSize:
                      "14px",
                  }}
                >
                  Selected File:{" "}
                  {file.name}
                </Typography>
              )}
            </Grid>
          </Grid>

          <Divider
            sx={{ my: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              height: 45,
              borderRadius: 2,
            }}
          >
            Submit Assignment
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentSubmit;