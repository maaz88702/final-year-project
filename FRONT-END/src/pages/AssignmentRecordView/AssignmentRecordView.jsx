import React, { useEffect, useState, memo } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  Grid,
  Button,
} from "@mui/material";

import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Document, Page, pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const PdfViewer = memo(({ fileUrl }) => {
  const [numPages, setNumPages] = useState(null);

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Document
        file={fileUrl}
        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
        onLoadError={(error) => console.error("PDF Render Error:", error)}
        loading={
          <Box sx={{ display: "flex", justifyContent: "center", py: 5 }}>
            <CircularProgress />
          </Box>
        }
      >
        {numPages &&
          Array.from(new Array(numPages), (_, index) => (
            <Box
              key={index}
              sx={{
                mb: 3,
                display: "flex",
                justifyContent: "center",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                bgcolor: "white",
              }}
            >
              <Page
                pageNumber={index + 1}
                width={700}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Box>
          ))}
      </Document>
    </Box>
  );
});

const AssignmentRecordView = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [submittedFile, setSubmittedFile] = useState(null);

  useEffect(() => {
    const fetchRecordData = async () => {
      try {
        setLoading(true);
        
        // Single call to our aggregated backend route
        const res = await axios.get(
          `${baseURL}/api/assignment-record-view/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setRecord(res.data.grade);
        setSubmittedFile(res.data.submission);
      } catch (error) {
        console.error("Data Fetching Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRecordData();
    }
  }, [id, token]);

  if (loading) {
    return (
      <Box sx={{ height: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!record) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h5">Assignment Record Not Found</Typography>
      </Box>
    );
  }

  const assignment = record.assignmentId || {};
  const student = record.studentId || {};
  const percentage = assignment.totalMarks > 0 ? ((record.obtainmarks / assignment.totalMarks) * 100).toFixed(1) : 0;

  return (
    <Box sx={{ p: 4, backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyBox: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">Assignment Record</Typography>
        <Button variant="contained" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          Back
        </Button>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          {assignment.title || "Untitled Assignment"}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Student Name:</strong> {student.studentName || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Roll No:</strong> {student.rollNo || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Course:</strong> {assignment.courseId?.courseTitle || "N/A"}
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Total Marks:</strong> <Chip label={assignment.totalMarks || 0} color="primary" />
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Obtained Marks:</strong> <Chip label={record.obtainmarks || 0} color="success" />
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography component="div">
              <strong>Percentage:</strong> <Chip label={`${percentage}%`} color={percentage >= 50 ? "success" : "error"} />
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" fontWeight="bold" mb={3}>Rubric Details</Typography>
      {record.details?.map((detail, index) => (
        <Paper key={index} elevation={2} sx={{ p: 3, mb: 3, borderRadius: 3 }}>
          <Typography variant="h6" color="primary" gutterBottom>Question {index + 1}</Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography sx={{ mb: 1 }}><strong>Question:</strong> {detail.question}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Rubric:</strong> {detail.rubric}</Typography>
          <Typography sx={{ mb: 1 }}><strong>Level:</strong> {detail.level}</Typography>
          <Typography component="div"><strong>Marks:</strong> <Chip label={detail.marks} color="secondary" /></Typography>
        </Paper>
      ))}

      <Typography variant="h5" fontWeight="bold" mt={5} mb={3}>Submitted Assignment File</Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, bgcolor: "#525659", display: "flex", justifyContent: "center" }}>
        {submittedFile && submittedFile.file ? (
          <PdfViewer fileUrl={`${baseURL}/${submittedFile.file}`} />
        ) : (
          <Typography sx={{ color: "white", fontStyle: "italic", py: 2 }}>
            No submitted file found for this assignment record
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AssignmentRecordView;