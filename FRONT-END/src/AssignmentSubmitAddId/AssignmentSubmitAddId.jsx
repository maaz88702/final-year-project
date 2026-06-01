import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  Divider,
  Chip,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

import { toast } from "react-toastify";

import { jwtDecode } from "jwt-decode";

const AssignmentSubmitAdd = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const baseURL = "http://localhost:3000";

  const token = localStorage.getItem("jwt");

  let studentId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);

      studentId =
        decoded.id || decoded._id;

    } catch (error) {
      console.error(error);
    }
  }

  // ================= STATES =================
  const [loading, setLoading] =
    useState(true);

  const [submitting, setSubmitting] =
    useState(false);

  const [assignment, setAssignment] =
    useState(null);

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [
    alreadySubmitted,
    setAlreadySubmitted,
  ] = useState(false);

  // ================= FETCH ASSIGNMENT =================
  useEffect(() => {
    const fetchAssignment =
      async () => {
        try {
          setLoading(true);

          // ASSIGNMENT
          const assignmentRes =
            await axios.get(
              `${baseURL}/api/assignmentPosted/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setAssignment(
            assignmentRes.data
          );

          // CHECK ALREADY SUBMITTED
          const submittedRes =
            await axios.get(
              `${baseURL}/api/assignmentsubmitted`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const found =
            submittedRes.data.find(
              (item) =>
                String(
                  item.assignmentId
                    ?._id ||
                    item.assignmentId
                ) === String(id) &&
                String(
                  item.studentId
                    ?._id ||
                    item.studentId
                ) ===
                  String(studentId)
            );

          if (found) {
            setAlreadySubmitted(true);
          }

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load assignment"
          );
        } finally {
          setLoading(false);
        }
      };

    if (id && token) {
      fetchAssignment();
    }
  }, [id, token, studentId]);

  // ================= FILE CHANGE =================
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",

      "application/msword",

      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

      "application/vnd.ms-excel",

      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "application/vnd.ms-powerpoint",

      "application/vnd.openxmlformats-officedocument.presentationml.presentation",

      "image/png",

      "image/jpeg",

      "image/jpg",

      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      toast.error(
        "Only PDF allowed"
      );

      return;
    }

    setSelectedFile(file);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      toast.error("Select file");

      return;
    }

    try {
      setSubmitting(true);

      const formData =
        new FormData();

      formData.append(
        "assignmentId",
        id
      );

      formData.append(
        "studentId",
        studentId
      );

      formData.append(
        "file",
        selectedFile
      );

      await axios.post(
        `${baseURL}/api/assignmentsubmitted/add`,
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

      navigate("/student/assignments");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Submission failed"
      );

    } finally {
      setSubmitting(false);
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
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= NOT FOUND =================
  if (!assignment) {
    return (
      <Box sx={{ p: 5 }}>
        <Typography variant="h5">
          Assignment not found
        </Typography>
      </Box>
    );
  }

  // ================= ALREADY SUBMITTED =================
  if (alreadySubmitted) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          bgcolor: "#f5f5f5",
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: "center",
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            color="success.main"
          >
            Already Submitted
          </Typography>

          <Typography sx={{ mt: 2 }}>
            You already submitted this
            assignment.
          </Typography>
        </Paper>
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        p: 3,
      }}
    >
      <Paper
        sx={{
          maxWidth: 1000,
          mx: "auto",
          p: 4,
          borderRadius: 4,
        }}
      >
        {/* HEADER */}
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Submit Assignment
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Upload your assignment
          solution file
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ASSIGNMENT INFO */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            {assignment.title}
          </Typography>

          <Chip
            label={`Total Marks: ${assignment.totalMarks}`}
            color="primary"
            sx={{ mt: 2 }}
          />

          <Typography sx={{ mt: 2 }}>
            <strong>Due Date:</strong>{" "}
            {assignment.dueDate}
          </Typography>
        </Box>

        {/* QUESTIONS */}
        <Box sx={{ mb: 5 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Questions
          </Typography>

          {assignment.assignmentDetails?.map(
            (q, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                <Typography
                  fontWeight="bold"
                >
                  Question {index + 1}
                </Typography>

                <Typography
                  sx={{ mt: 1 }}
                >
                  {q.ques}
                </Typography>
              </Paper>
            )
          )}
        </Box>

        {/* SUBMIT FORM */}
        <form onSubmit={handleSubmit}>
          <Box>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ mb: 2 }}
            >
              Upload File
            </Typography>

            <input
              type="file"
              onChange={
                handleFileChange
              }
              accept="
                .pdf
              "
            />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Allowed:
              PDF, DOC, DOCX, XLS,
              XLSX, PPT, PPTX, Images
            </Typography>

            {selectedFile && (
              <Paper
                variant="outlined"
                sx={{
                  mt: 3,
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography>
                  <strong>
                    Selected File:
                  </strong>{" "}
                  {selectedFile.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {(
                    selectedFile.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </Typography>
              </Paper>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            disabled={submitting}
            sx={{
              mt: 5,
              height: 55,
              borderRadius: 3,
              fontWeight: "bold",
            }}
          >
            {submitting ? (
              <CircularProgress
                size={24}
                color="inherit"
              />
            ) : (
              "Submit Assignment"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default AssignmentSubmitAdd;