import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  Divider,
  Box,
  Chip,
  CircularProgress,
} from "@mui/material";

import { Add, Delete } from "@mui/icons-material";

import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const EditAssignment = () => {
  const { _id } = useParams();
  const navigate = useNavigate();

  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  // ================= STATES =================
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    courseId: "",
    semesterId: "",
    dueDate: "",
    title: "",
    assignmentDetails: [],
  });

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [courseRes, assignmentRes] = await Promise.all([
          axios.get(`${baseURL}/api/course/teacher/my`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentposted/${_id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setCourses(courseRes.data);

        const assignment = assignmentRes.data;

        // Extracts matching IDs whether fields are pre-populated or raw ObjectIds
        setFormData({
          courseId: assignment.courseId?._id || assignment.courseId || "",
          semesterId: assignment.semesterId?._id || assignment.semesterId || "",
          dueDate: assignment.dueDate?.split("T")[0] || assignment.dueDate || "",
          title: assignment.title || "",
          assignmentDetails: assignment.assignmentDetails || [],
        });
      } catch (error) {
        console.error("Error preloading assignment data:", error);
        toast.error("Failed to load assignment details");
      } finally {
        setLoading(false);
      }
    };

    if (token && _id) {
      fetchData();
    }
  }, [_id, token]);

  // ================= COURSE CHANGE =================
  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find((c) => c._id === selectedCourseId);

    setFormData((prev) => ({
      ...prev,
      courseId: selectedCourseId,
      semesterId: selectedCourse?.semesterId?._id || selectedCourse?.semesterId || "",
    }));
  };

  // ================= BASIC INPUT CHANGE =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= QUESTION MANAGERS =================
  const handleQuestionChange = (index, value) => {
    const updated = [...formData.assignmentDetails];
    updated[index].ques = value;
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      assignmentDetails: [
        ...formData.assignmentDetails,
        {
          ques: "",
          rubrics: [
            {
              condition: "",
              marks: "",
              subRubrics: [
                { level: "100%", marks: 0 },
                { level: "50%", marks: 0 },
                { level: "25%", marks: 0 },
                { level: "0%", marks: 0 },
              ],
            },
          ],
        },
      ],
    });
  };

  const removeQuestion = (index) => {
    const updated = [...formData.assignmentDetails];
    updated.splice(index, 1);
    setFormData({ ...formData, assignmentDetails: updated });
  };

  // ================= RUBRIC MANAGERS =================
  const handleRubricChange = (qIndex, rIndex, field, value) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics[rIndex][field] = value;

    // Dynamically auto-compute subRubric percentage splits when the base rubric mark shifts
    if (field === "marks") {
      const marks = Number(value || 0);
      updated[qIndex].rubrics[rIndex].subRubrics = [
        { level: "100%", marks: marks },
        { level: "50%", marks: Number((marks * 0.5).toFixed(2)) },
        { level: "25%", marks: Number((marks * 0.25).toFixed(2)) },
        { level: "0%", marks: 0 },
      ];
    }

    setFormData({ ...formData, assignmentDetails: updated });
  };

  const addRubric = (qIndex) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics.push({
      condition: "",
      marks: "",
      subRubrics: [
        { level: "100%", marks: 0 },
        { level: "50%", marks: 0 },
        { level: "25%", marks: 0 },
        { level: "0%", marks: 0 },
      ],
    });
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const removeRubric = (qIndex, rIndex) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics.splice(rIndex, 1);
    setFormData({ ...formData, assignmentDetails: updated });
  };

  // ================= TOTAL MARKS CALCULATION =================
  // Added mandatory fallback initialValue '0' to stop reduce operations returning object definitions
  const calculateTotalMarks = () => {
    if (!formData.assignmentDetails) return 0;
    return formData.assignmentDetails.reduce((total, q) => {
      const rubricSum = q.rubrics ? q.rubrics.reduce((sum, r) => sum + Number(r.marks || 0), 0) : 0;
      return total + rubricSum;
    }, 0);
  };

  // ================= FORM SUBMISSION =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseId || !formData.title || !formData.dueDate) {
      return toast.error("Please fill in all mandatory assignment fields.");
    }

    try {
      setLoading(true);

      // Clean, format, and strictly cast values to match mongoose expectations precisely
      const payload = {
        courseId: formData.courseId,
        semesterId: formData.semesterId,
        title: formData.title,
        dueDate: formData.dueDate,
        assignmentDetails: formData.assignmentDetails.map((q) => ({
          ques: q.ques,
          rubrics: q.rubrics.map((r) => ({
            condition: r.condition,
            marks: Number(r.marks || 0),
            subRubrics: r.subRubrics.map((sr) => ({
              level: sr.level,
              marks: Number(sr.marks || 0),
            })),
          })),
        })),
      };

      await axios.put(
        `${baseURL}/api/assignmentPosted/update/${_id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Assignment updated successfully!");
      navigate("/teacher/teacherassignmentlist");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to update assignment contents."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !formData.title) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Edit Assignment Matrix
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Modify structural questions, base scoring rubrics, and submission parameters.
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* COURSE SELECTION */}
            <Grid size={{xs:12}}>
              <TextField
                select
                fullWidth
                label="Assigned Course"
                value={formData.courseId}
                onChange={handleCourseChange}
              >
                {courses.map((course) => (
                  <MenuItem key={course._id} value={course._id}>
                    {course.courseTitle}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* DUE DATE */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                type="date"
                fullWidth
                name="dueDate"
                label="Submission Deadline"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Grid>

            {/* TOTAL MARKS READ-ONLY VIEW */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Aggregated Matrix Marks"
                value={calculateTotalMarks()}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* TITLE */}
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Assignment Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* DYNAMIC QUESTIONS & RUBRIC SECTION */}
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
            Questions & Evaluation Rubrics
          </Typography>

          {formData.assignmentDetails.map((q, qIndex) => (
            <Paper
              key={qIndex}
              variant="outlined"
              sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: "#fafafa" }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 11 }}>
                  <TextField
                    label={`Question ${qIndex + 1} Prompt`}
                    fullWidth
                    multiline
                    rows={2}
                    value={q.ques}
                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 1 }} style={{ textAlign: "center" }}>
                  {qIndex > 0 && (
                    <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
                      <Delete />
                    </IconButton>
                  )}
                </Grid>

                {/* NESTED RUBRICS MAP */}
                {q.rubrics?.map((r, rIndex) => (
                  <React.Fragment key={rIndex}>
                    <Grid size={{ xs: 12 }}><Divider sx={{ my: 1, borderStyle: "dashed" }} /></Grid>
                    
                    <Grid size={{ xs: 6 }}>
                      <TextField
                        label="Rubric Grading Criteria Condition"
                        fullWidth
                        size="small"
                        value={r.condition}
                        onChange={(e) =>
                          handleRubricChange(qIndex, rIndex, "condition", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 4 }}>
                      <TextField
                        type="number"
                        label="Max Marks Allocation"
                        fullWidth
                        size="small"
                        value={r.marks}
                        onChange={(e) =>
                          handleRubricChange(qIndex, rIndex, "marks", e.target.value)
                        }
                      />
                    </Grid>

                    <Grid size={{ xs: 2 }} style={{ textAlign: "center" }}>
                      {rIndex > 0 && (
                        <IconButton color="error" size="small" onClick={() => removeRubric(qIndex, rIndex)}>
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>

                    {/* AUTOMATED PERCENTAGE PILL DISPLAY */}
                    <Grid size={{ xs: 12 }}>
                      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 0.5, pl: 1 }}>
                        {r.subRubrics?.map((sr, index) => (
                          <Chip
                            key={index}
                            size="small"
                            label={`${sr.level} Score Tier = ${sr.marks} pts`}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </Grid>
                  </React.Fragment>
                ))}

                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  <Button size="small" startIcon={<Add />} onClick={() => addRubric(qIndex)}>
                    Add Rubric
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {/* BLOCK INTERACTION FOOTER CONTROLS */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 4 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={addQuestion}
            >
              Add Question
            </Button>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ px: 4, py: 1.2, fontWeight: "bold" }}
            >
              {loading ? "Saving Tasks..." : "Commit Update"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default EditAssignment;