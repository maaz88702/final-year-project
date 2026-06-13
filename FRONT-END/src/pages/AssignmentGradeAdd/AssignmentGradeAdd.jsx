import React, { useEffect, useState, memo } from "react";
import {
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Box,
  Chip,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Stack,
} from "@mui/material";
// not showing submittedAssignment

import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { Document, Page, pdfjs } from "react-pdf";

// ================= PDF WORKER =================
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// ================= PDF VIEWER =================
const PdfViewer = memo(
  ({ submittedAssignment, baseURL, setPdfPages, pdfPages }) => {
    if (!submittedAssignment) {
      return (
        <Box
          sx={{
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Typography>Submission Preview (PDF)</Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ width: "100%" }}>
        <Document
          file={`${baseURL}/${submittedAssignment.file}`}
          onLoadSuccess={({ numPages }) => setPdfPages(numPages)}
          onLoadError={() => toast.error("PDF loading failed")}
        >
          {Array.from(new Array(pdfPages), (_, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Page
                pageNumber={index + 1}
                width={window.innerWidth * 0.38}
                renderTextLayer={true}
                renderAnnotationLayer={true}
              />
            </Box>
          ))}
        </Document>
      </Box>
    );
  }
);

const AssignmentGradeAdd = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  let teacherId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ================= STATES =================
  const [loading, setLoading] = useState(false);

  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [details, setDetails] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);
  const [submittedAssignment, setSubmittedAssignment] = useState(null);
  const [pdfPages, setPdfPages] = useState(0);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [assignRes, studentRes, gradeRes, submissionRes] = await Promise.all([
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentgrade`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentsubmitted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log("students", studentRes.data);
console.log("submissions", submissionRes.data);
        const teacherAssignments = assignRes.data.filter(
          (a) => String(a.teacherId?._id || a.teacherId) === String(teacherId)
        );

        setAssignments(teacherAssignments);
        setStudents(studentRes.data);
        setGrades(gradeRes.data);
        setSubmissions(submissionRes.data);
      } catch (error) {
        toast.error("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (token && teacherId) {
      fetchData();
    }
  }, [token, teacherId]);

  // ================= FILTER STUDENTS (FIXED ID PARSING) =================
  useEffect(() => {
    if (!selectedAssignment) {
      setFilteredStudents([]);
      return;
    }

    const assignment = assignments.find(
      (a) => String(a._id) === String(selectedAssignment)
    );

    if (!assignment) {
      setFilteredStudents([]);
      return;
    }

    // Match Semester Safely
    const semesterStudents = students.filter((student) => {
      const studentSemesterId = student.semester?._id || student.semester;
      const assignmentSemesterId = assignment.semesterId?._id || assignment.semesterId;
      return String(studentSemesterId) === String(assignmentSemesterId);
    });

    // Safely parse nested submission IDs
    const submittedStudentIds = submissions
      .filter((submission) => {
        const subAssignmentId = submission.assignmentId?._id || submission.assignmentId;
        return String(subAssignmentId) === String(selectedAssignment);
      })
      .map((submission) => {
        return String(submission.studentId?._id || submission.studentId);
      });

    // Safely parse nested grade IDs
    const gradedStudentIds = grades
      .filter((grade) => {
        const gradeAssignmentId = grade.assignmentId?._id || grade.assignmentId;
        return String(gradeAssignmentId) === String(selectedAssignment);
      })
      .map((grade) => {
        return String(grade.studentId?._id || grade.studentId);
      });

    // Student must be in the submissions pool AND not already graded
    const eligibleStudents = semesterStudents.filter(
      (student) =>
        submittedStudentIds.includes(String(student._id)) &&
        !gradedStudentIds.includes(String(student._id))
    );

    setFilteredStudents(eligibleStudents);
    
    // Reset tracking states when assignment changes
    setSelectedStudent("");
    setSubmittedAssignment(null);
    setPdfPages(0); 
  }, [selectedAssignment, assignments, students, grades, submissions]);

  // ================= LOAD QUESTIONS =================
  useEffect(() => {
    const assignment = assignments.find(
      (a) => String(a._id) === String(selectedAssignment)
    );

    if (!assignment) {
      setDetails([]);
      return;
    }

    setDetails(
      assignment.assignmentDetails.map((q) => ({
        question: q.ques,
        rubrics: q.rubrics.map((rubric) => ({
          ...rubric,
          selectedLevel: "",
          selectedMarks: 0,
          rubricIndex: rubric._id
        })),
      }))
    );

    setTotalMarks(0);
  }, [selectedAssignment, assignments]);

  // ================= FETCH SUBMITTED FILE (FIXED ID PARSING) =================
  useEffect(() => {
    const fetchSubmission = async () => {
      if (!selectedAssignment || !selectedStudent) {
        setSubmittedAssignment(null);
        setPdfPages(0);
        return;
      }

      try {
        const found = submissions.find((item) => {
          const itemAssignmentId = item.assignmentId?._id || item.assignmentId;
          const itemStudentId = item.studentId?._id || item.studentId;
          
          return String(itemAssignmentId) === String(selectedAssignment) &&
                 String(itemStudentId) === String(selectedStudent);
        });

        if (found) {
          setSubmittedAssignment(found);
        } else {
          setSubmittedAssignment(null);
          setPdfPages(0);
        }
      } catch (error) {
        toast.error("Error loading submission");
      }
    };

    fetchSubmission();
  }, [selectedAssignment, selectedStudent, submissions]);

  // ================= HANDLE RUBRIC =================
  const handleRubricSelection = (qIndex, rubricIndex, subRubric) => {
    const updated = [...details];
    updated[qIndex].rubrics[rubricIndex].selectedLevel = subRubric.level;
    updated[qIndex].rubrics[rubricIndex].selectedMarks = Number(subRubric.marks || 0);

    setDetails(updated);

    let total = 0;
    updated.forEach((question) => {
      question.rubrics.forEach((rubric) => {
        total += Number(rubric.selectedMarks || 0);
      });
    });

    setTotalMarks(total);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment || !selectedStudent) {
      return toast.error("Select student and assignment");
    }

    try {
      const formattedDetails = [];

      details.forEach((d) => {
        d.rubrics.forEach((r) => {
          if (r.selectedLevel) {
            formattedDetails.push({
              question: d.question,
              rubric: r.condition,
              level: r.selectedLevel,
              marks: Number(r.selectedMarks || 0),
            });
          }
        });
      });

      const payload = {
        assignmentId: selectedAssignment,
        studentId: selectedStudent,
        obtainmarks: totalMarks,
        details: formattedDetails,
      };

      await axios.post(`${baseURL}/api/assignmentgrade/add`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Graded successfully");

      setFilteredStudents((prev) =>
        prev.filter((s) => String(s._id) !== String(selectedStudent))
      );

      setSelectedStudent("");
      setSubmittedAssignment(null);
      setPdfPages(0);
      setDetails([]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit grade");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: "100vh", width: "100vw", display: "flex", overflow: "hidden", bgcolor: "#f5f5f5" }}>
      <Grid container sx={{ height: "100%" }}>
        
        {/* LEFT SIDE FORM CONTROL */}
        <Grid
          size={{ xs: 12, md: 7.2 }}
          sx={{
            height: "100%",
            overflowY: "auto",
            p: 3,
            borderRight: "1px solid #ddd",
            bgcolor: "white",
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Grading Details
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={2} sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Assignment"
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                >
                  {assignments.map((a) => (
                    <MenuItem key={a._id} value={a._id}>
                      {a.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  select
                  fullWidth
                  label="Student"
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  disabled={!selectedAssignment}
                >
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <MenuItem key={student._id} value={student._id}>
                        {student.studentName} ({student.rollNo})
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled>No submitted assignments available</MenuItem>
                  )}
                </TextField>
              </Grid>
            </Grid>
          </Stack>

          {selectedStudent && details.length > 0 ? (
            <form onSubmit={handleSubmit}>
              {details.map((q, qIndex) => (
                <Paper key={qIndex} variant="outlined" sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" color="secondary" component="div">
                    Question {qIndex + 1}
                  </Typography>

                  <Typography variant="body1" sx={{ mb: 2, mt: 1 }}>
                    {q.question}
                  </Typography>

                  {q.rubrics.map((rubric, rIndex) => (
                    <Box
                      key={rIndex}
                      sx={{
                        mt: 2,
                        p: 2,
                        bgcolor: "#f9f9f9",
                        borderRadius: 1,
                        borderLeft: "4px solid #1976d2",
                      }}
                    >
                      <Typography variant="body2" fontWeight="bold" sx={{ mb: 1 }}>
                        {rubric.condition}
                      </Typography>

                      <RadioGroup
                        value={rubric.selectedLevel}
                        onChange={(e) => {
                          const sub = rubric.subRubrics.find((s) => s.level === e.target.value);
                          handleRubricSelection(qIndex, rIndex, sub);
                        }}
                      >
                        <Grid container>
                          {rubric.subRubrics?.map((sr, srIndex) => (
                            <Grid size={{ xs: 12, sm: 6 }} key={srIndex}>
                              <FormControlLabel
                                value={sr.level}
                                control={<Radio size="small" />}
                                label={
                                  <Typography variant="body2">
                                    {`${sr.level} (${sr.marks} marks)`}
                                  </Typography>
                                }
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </RadioGroup>
                    </Box>
                  ))}
                </Paper>
              ))}

              {/* BOTTOM CONTROL CONTAINER */}
              <Paper
                elevation={3}
                sx={{
                  position: "sticky",
                  bottom: 0,
                  p: 2,
                  mt: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  zIndex: 10,
                }}
              >
                {/* FIX: Set component to 'div' to eliminate nested block hydration conflicts */}
                <Typography variant="h6" component="div">
                  Total Marks:
                  <Chip label={totalMarks} color="primary" sx={{ ml: 1, fontWeight: "bold" }} />
                </Typography>

                <Button type="submit" variant="contained" size="large" sx={{ px: 5 }}>
                  Submit Grade
                </Button>
              </Paper>
            </form>
          ) : (
            <Box sx={{ mt: 10, textAlign: "center", color: "text.secondary" }}>
              <Typography>Please select an assignment and student to load the rubric.</Typography>
            </Box>
          )}
        </Grid>

        {/* RIGHT SIDE PDF DISPLAY PANEL */}
        <Grid
          size={{ xs: 12, md: 4.8 }}
          sx={{
            height: "100%",
            overflowY: "auto",
            bgcolor: "#525659",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            p: 1,
          }}
        >
          <PdfViewer
            key={`${selectedAssignment}-${selectedStudent}`}
            submittedAssignment={submittedAssignment}
            baseURL={baseURL}
            setPdfPages={setPdfPages}
            pdfPages={pdfPages}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentGradeAdd;