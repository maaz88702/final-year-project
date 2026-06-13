import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  Divider,
  Box,
  Chip,
  Button,
  CircularProgress,
  TextField,
  Card,
  CardContent,
} from "@mui/material";
import { CheckCircleOutline, Save, ArrowBack, CloudDownload } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const AssignmentGradeUpdate = () => {
  const { gradeId } = useParams(); 
  const navigate = useNavigate();

  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  // ================= STATES =================
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [metaInfo, setMetaInfo] = useState({
    studentName: "",
    rollNo: "",
    assignmentTitle: "",
    totalMarks: 0,
    submissionFile: "",
  });

  const [formData, setFormData] = useState({
    assignmentId: "",
    studentId: "",
    obtainmarks: 0,
    details: [], 
  });

  // ================= FETCH AND HYDRATE DATA =================
  useEffect(() => {
    const fetchGradingData = async () => {
      try {
        setLoading(true);

        const gradeRes = await axios.get(`${baseURL}/api/assignmentGrade/${gradeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const gradeRecord = gradeRes.data?.data || gradeRes.data;
        if (!gradeRecord) {
          toast.error("Grade record not found.");
          setLoading(false);
          return;
        }

        const assignmentObj = gradeRecord.assignmentId || {};
        const studentObj = gradeRecord.studentId || {};

        let structuralDetails = [];

        // 1. Process items out of the database array using both schema property variations safely
        if (gradeRecord.details && gradeRecord.details.length > 0) {
          structuralDetails = gradeRecord.details.map((d) => ({
            question: d.question || "",
            rubric: d.rubric || d.rubricCondition || "", 
            level: d.level || d.selectedLevel || "",
            marks: Number(d.marks ?? d.obtainedMarks ?? 0),
            fullMarks: Number(d.fullMarks || 0),
            subRubrics: d.subRubrics || []
          }));
        }

        // 2. Mix configuration metrics over to the template structure layout loops
        if (assignmentObj.assignmentDetails && assignmentObj.assignmentDetails.length > 0) {
          if (structuralDetails.length === 0) {
            assignmentObj.assignmentDetails.forEach((q) => {
              if (q.rubrics && Array.isArray(q.rubrics)) {
                q.rubrics.forEach((r) => {
                  structuralDetails.push({
                    question: q.ques,
                    rubric: r.condition,
                    level: "", 
                    marks: 0,  
                    fullMarks: Number(r.subRubrics?.reduce((max, sub) => Math.max(max, sub.marks), 0) || 0),
                    subRubrics: r.subRubrics || [], 
                  });
                });
              }
            });
          } else {
            structuralDetails = structuralDetails.map((detailItem) => {
              const matchedQuesBlock = assignmentObj.assignmentDetails.find(
                (aq) => aq.ques === detailItem.question
              );
              
              const matchedRubricBlock = matchedQuesBlock?.rubrics?.find(
                (ar) => ar.condition === detailItem.rubric
              );

              const cleanSubRubrics = matchedRubricBlock?.subRubrics || detailItem.subRubrics || [];
              const calculatedFullMarks = Number(cleanSubRubrics.reduce((max, sub) => Math.max(max, sub.marks), 0) || 0);

              return {
                ...detailItem,
                fullMarks: detailItem.fullMarks || calculatedFullMarks,
                subRubrics: cleanSubRubrics
              };
            });
          }
        }

        setMetaInfo({
          studentName: studentObj.studentName || "Enrolled Student",
          rollNo: studentObj.rollNo || "N/A",
          assignmentTitle: assignmentObj.title || "Assignment",
          totalMarks: assignmentObj.totalMarks || 0,
          submissionFile: gradeRecord.submissionId?.file || gradeRecord.file || "", 
        });

        setFormData({
          assignmentId: assignmentObj._id || gradeRecord.assignmentId || "",
          studentId: studentObj._id || gradeRecord.studentId || "",
          obtainmarks: gradeRecord.obtainmarks !== undefined ? gradeRecord.obtainmarks : 0,
          details: structuralDetails,
        });

      } catch (error) {
        console.error("Error setting up context data objects:", error);
        toast.error("Failed to fetch assignment structural criteria details.");
      } finally {
        setLoading(false);
      }
    };

    if (token && gradeId) {
      fetchGradingData();
    } else {
      setLoading(false);
    }
  }, [gradeId, token]);

  // ================= UTILITY SUMMATION =================
  const aggregateScore = (detailsArray) => {
    return detailsArray.reduce((acc, item) => acc + Number(item.marks || 0), 0);
  };

  // ================= CHIP CLICK INTERACTION HANDLER =================
  const handleSelectTier = (index, tier) => {
    const updatedDetails = [...formData.details];
    if (!updatedDetails[index]) return;

    updatedDetails[index].level = tier.level;
    updatedDetails[index].marks = Number(tier.marks);

    setFormData((prev) => ({
      ...prev,
      details: updatedDetails,
      obtainmarks: aggregateScore(updatedDetails),
    }));
  };

  // ================= SUBMIT SCORE ACTION =================
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Prevent submission if elements are missing point assignments
    const incompleteCriteria = formData.details.some(d => !d.level || !d.rubric);
    if (incompleteCriteria) {
      toast.error("Validation Error: Please select a performance level tier for all criteria blocks.");
      return;
    }

    try {
      setSaving(true);

      // ✅ DUAL-KEYED PAYLOAD
      // Sends both configurations simultaneously to satisfy both the schema validation paths and controller formats cleanly
      const payload = {
        assignmentId: formData.assignmentId,
        studentId: formData.studentId,
        obtainmarks: Number(formData.obtainmarks),
        details: formData.details.map((d) => ({
          // Keys mapped for structural layout processing inside controller loop maps
          question: String(d.question),
          rubricCondition: String(d.rubric),
          fullMarks: Number(d.fullMarks || 0),
          obtainedMarks: Number(d.marks || 0),
          selectedLevel: String(d.level),
          subRubrics: d.subRubrics || [],

          // Keys expected by Mongoose validators on the schema model directly
          rubric: String(d.rubric),
          level: String(d.level),
          marks: Number(d.marks || 0)
        })),
      };

      // Calls target API route handler mapping route query params safely
      await axios.put(
        `${baseURL}/api/assignmentGrade/update/${gradeId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Marks matrix updated successfully!");
      navigate("/teacher/studentgrades");
    } catch (error) {
      console.error("Grading matrix put dispatch failed:", error);
      toast.error(error.response?.data?.message || "Failed saving evaluations.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ my: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 2, textTransform: "none" }}
      >
        Back to Grades
      </Button>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        {/* ================= HEADER BLOCK ================= */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2, flexWrap: "wrap", gap: 2 }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Update Student Evaluation
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 0.5 }}>
              Assignment: <strong>{metaInfo.assignmentTitle}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Student: {metaInfo.studentName} ({metaInfo.rollNo})
            </Typography>
          </Box>

          {/* TOTAL FRACTION SCORE BANNER CARD */}
          <Card variant="outlined" sx={{ bgcolor: "#f0f7ff", borderColor: "#b3d7ff", minWidth: 160 }}>
            <CardContent sx={{ p: "12px !important", textAlign: "center" }}>
              <Typography variant="caption" color="primary" fontWeight="bold">
                AGGREGATE MARK
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                {formData.obtainmarks} <span style={{ fontSize: "16px", color: "#666" }}>/ {metaInfo.totalMarks}</span>
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* FILE DOWNLOAD ATTACHMENT ACTION IF APPLICABLE */}
        {metaInfo.submissionFile && (
          <Box sx={{ my: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: 2, display: "inline-flex", alignItems: "center" }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Submitted Document Attachments:
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<CloudDownload />}
              href={`${baseURL}/${metaInfo.submissionFile}`}
              target="_blank"
              rel="noreferrer"
            >
              Download File
            </Button>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        {/* ================= EVALUATION GRID MATRIX FORM ================= */}
        <form onSubmit={handleFormSubmit}>
          {formData.details.length === 0 ? (
            <Typography color="text.secondary" sx={{ textAlign: "center", my: 4 }}>
              No evaluation criteria details found for this assignment structure.
            </Typography>
          ) : (
            formData.details.map((item, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: item.level ? "#fafdfa" : "#fffbfb", 
                  borderColor: item.level ? "#c3e6cb" : "#f5c6cb",
                }}
              >
                <Grid container spacing={2}>
                  {/* CRITERIA STEP ROW */}
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" color="text.primary">
                      Q{index + 1}: {item.question}
                    </Typography>
                  </Grid>

                  {/* RUBRIC DEFINITION CONTENT PROMPT */}
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Evaluation Target:</strong> {item.rubric}
                    </Typography>
                  </Grid>

                  <Grid item xs={12}><Divider sx={{ borderStyle: "dashed", my: 0.5 }} /></Grid>

                  {/* TARGET INTERACTIVE OPTION CHIPS CONTAINER */}
                  <Grid item xs={12}>
                    <Typography 
                      variant="caption" 
                      fontWeight="bold" 
                      color={item.level ? "text.secondary" : "error"} 
                      display="block" 
                      sx={{ mb: 1 }}
                    >
                      Select Performance Tier Level: {!item.level && " (Required)"}
                    </Typography>
                    
                    <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
                      {item.subRubrics && item.subRubrics.length > 0 ? (
                        item.subRubrics.map((tier, tIdx) => {
                          const isSelected = item.level === tier.level;
                          return (
                            <Chip
                              key={tIdx}
                              label={`${tier.level} (${tier.marks} pts)`}
                              clickable
                              color={isSelected ? "success" : "default"}
                              variant={isSelected ? "filled" : "outlined"}
                              icon={isSelected ? <CheckCircleOutline /> : undefined}
                              onClick={() => handleSelectTier(index, tier)}
                              sx={{ py: 2, fontWeight: isSelected ? "bold" : "normal" }}
                            />
                          );
                        })
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          No performance levels defined for this criterion.
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* SELECTION ASSIGNMENT SUMMARY TEXT FIELD COUNTER */}
                  <Grid item xs={12} sm={4} sx={{ mt: 1 }}>
                    <TextField
                      label="Points Awarded"
                      size="small"
                      type="number"
                      fullWidth
                      value={item.marks}
                      InputProps={{ readOnly: true }}
                      error={!item.level}
                      helperText={item.level ? `Tier Selected: ${item.level} (Max: ${item.fullMarks} pts)` : "Please choose an option tier block above"}
                    />
                  </Grid>
                </Grid>
              </Paper>
            ))
          )}

          {/* INTERACTION ACTION CONTROL FOOTER BAR */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={saving || formData.details.length === 0}
              startIcon={<Save />}
              sx={{ px: 4, fontWeight: "bold" }}
            >
              {saving ? "Saving Changes..." : "Apply Scoring Changes"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentGradeUpdate;