import React, {
  useEffect,
  useState,
} from "react";

import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Divider,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Chip,
} from "@mui/material";

import axios from "axios";

import { toast } from "react-toastify";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import {
  Document,
  Page,
  pdfjs,
} from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// PDF Worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const AssignmentGradeBySubmission = () => {
  const baseURL =
    "http://localhost:3000";

  const token =
    localStorage.getItem("jwt");

  const navigate =
    useNavigate();

  const { submissionId } =
    useParams();

  // ================= STATES =================
  const [loading, setLoading] =
    useState(true);

  const [submission, setSubmission] =
    useState(null);

  const [assignmentData, setAssignmentData] =
    useState(null);

  const [details, setDetails] =
    useState([]);

  const [totalMarks, setTotalMarks] =
    useState(0);

  const [pdfPages, setPdfPages] =
    useState(0);

  // ================= FETCH =================
  useEffect(() => {
    const fetchData =
      async () => {
        try {
          setLoading(true);

          // SUBMISSION
          const subRes =
            await axios.get(
              `${baseURL}/api/assignmentsubmitted/${submissionId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const sub =
            subRes.data;

          setSubmission(sub);

          // ASSIGNMENT
          const assignRes =
            await axios.get(
              `${baseURL}/api/assignmentPosted/${sub.assignmentId._id}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          const assignment =
            assignRes.data;

          setAssignmentData(
            assignment
          );

          // LOAD RUBRICS
          setDetails(
            assignment.assignmentDetails.map(
              (q) => ({
                question:
                  q.ques,

                rubrics:
                  q.rubrics.map(
                    (r) => ({
                      condition:
                        r.condition,

                      subRubrics:
                        r.subRubrics,

                      selectedLevel:
                        "",

                      selectedMarks:
                        0,
                    })
                  ),
              })
            )
          );

        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load grading data"
          );
        } finally {
          setLoading(false);
        }
      };

    if (submissionId) {
      fetchData();
    }
  }, [submissionId, token]);

  // ================= RUBRIC SELECT =================
  const handleRubricSelection =
    (
      qIndex,
      rubricIndex,
      subRubric
    ) => {
      const updated = [
        ...details,
      ];

      updated[qIndex].rubrics[
        rubricIndex
      ].selectedLevel =
        subRubric.level;

      updated[qIndex].rubrics[
        rubricIndex
      ].selectedMarks =
        Number(
          subRubric.marks || 0
        );

      setDetails(updated);

      // TOTAL
      let total = 0;

      updated.forEach((q) => {
        q.rubrics.forEach((r) => {
          total += Number(
            r.selectedMarks || 0
          );
        });
      });

      setTotalMarks(total);
    };

  // ================= SUBMIT =================
  const handleSubmit =
    async () => {
      try {
        const payload = {
          assignmentId:
            submission.assignmentId
              ?._id ||
            submission.assignmentId,

          studentId:
            submission.studentId
              ?._id ||
            submission.studentId,

          obtainmarks:
            totalMarks,

          details:
            details.flatMap(
              (q) =>
                q.rubrics
                  .filter(
                    (r) =>
                      r.selectedLevel
                  )
                  .map((r) => ({
                    question:
                      q.question,

                    rubric:
                      r.condition,

                    level:
                      r.selectedLevel,

                    marks: Number(
                      r.selectedMarks ||
                        0
                    ),
                  }))
            ),
        };

        await axios.post(
          `${baseURL}/api/assignmentgrade/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast.success(
          "Assignment graded successfully"
        );

        navigate("/teacher/dashboard");

      } catch (error) {
        console.error(error);

        toast.error(
          error.response?.data
            ?.message ||
            "Failed to submit grade"
        );
      }
    };

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Box
      sx={{
        height: "100vh",
        overflow: "hidden",
        bgcolor: "#f5f5f5",
      }}
    >
      <Grid
        container
        sx={{
          height: "100%",
        }}
      >
        {/* LEFT SIDE */}
        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
          sx={{
            height: "100vh",
            overflowY: "auto",
            bgcolor: "white",
            p: 3,
          }}
        >
          {/* HEADER */}
          <Typography
            variant="h5"
            fontWeight="bold"
          >
            Assignment Grading
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Student:{" "}
            <strong>
              {
                submission
                  ?.studentId
                  ?.studentName
              }
            </strong>
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Roll No:{" "}
            <strong>
              {
                submission
                  ?.studentId
                  ?.rollNo
              }
            </strong>
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Assignment:{" "}
            <strong>
              {
                assignmentData?.title
              }
            </strong>
          </Typography>

          <Divider
            sx={{ my: 3 }}
          />

          {/* QUESTIONS */}
          {details.map(
            (q, qIndex) => (
              <Paper
                key={qIndex}
                variant="outlined"
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 3,
                }}
              >
                {/* QUESTION */}
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="primary"
                  sx={{
                    mb: 2,
                  }}
                >
                  Question{" "}
                  {qIndex + 1}
                </Typography>

                <Typography
                  sx={{
                    mb: 3,
                  }}
                >
                  {q.question}
                </Typography>

                {/* RUBRICS */}
                {q.rubrics.map(
                  (
                    rubric,
                    rIndex
                  ) => (
                    <Box
                      key={rIndex}
                      sx={{
                        mb: 3,
                        p: 2,
                        border:
                          "1px solid #ddd",
                        borderRadius: 2,
                        bgcolor:
                          "#fafafa",
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                        sx={{
                          mb: 2,
                        }}
                      >
                        {
                          rubric.condition
                        }
                      </Typography>

                      <RadioGroup
                        value={
                          rubric.selectedLevel
                        }
                        onChange={(
                          e
                        ) => {
                          const selected =
                            rubric.subRubrics.find(
                              (
                                s
                              ) =>
                                s.level ===
                                e
                                  .target
                                  .value
                            );

                          handleRubricSelection(
                            qIndex,
                            rIndex,
                            selected
                          );
                        }}
                      >
                        <Grid
                          container
                          spacing={
                            2
                          }
                        >
                          {rubric.subRubrics.map(
                            (
                              sr,
                              srIndex
                            ) => (
                              <Grid
                                size={{
                                  xs: 12,
                                  md: 6,
                                }}
                                key={
                                  srIndex
                                }
                              >
                                <Paper
                                  variant="outlined"
                                  sx={{
                                    p: 2,
                                    borderRadius: 2,
                                  }}
                                >
                                  <FormControlLabel
                                    value={
                                      sr.level
                                    }
                                    control={
                                      <Radio />
                                    }
                                    label={
                                      <Box>
                                        <Typography fontWeight="bold">
                                          {
                                            sr.level
                                          }
                                        </Typography>

                                        <Typography
                                          variant="body2"
                                          color="text.secondary"
                                        >
                                          {
                                            sr.marks
                                          }{" "}
                                          Marks
                                        </Typography>
                                      </Box>
                                    }
                                  />
                                </Paper>
                              </Grid>
                            )
                          )}
                        </Grid>
                      </RadioGroup>
                    </Box>
                  )
                )}
              </Paper>
            )
          )}

          {/* FOOTER */}
          <Paper
            elevation={4}
            sx={{
              position:
                "sticky",
              bottom: 0,
              p: 2,
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              borderRadius: 2,
              zIndex: 20,
            }}
          >
            <Typography variant="h6">
              Total Marks:{" "}
              <Chip
                label={
                  totalMarks
                }
                color="primary"
              />
            </Typography>

            <Button
              variant="contained"
              size="large"
              onClick={
                handleSubmit
              }
            >
              Submit Grade
            </Button>
          </Paper>
        </Grid>

        {/* RIGHT SIDE PDF */}
        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
          sx={{
            height: "100vh",
            overflowY: "auto",
            bgcolor:
              "#525659",
            p: 2,
          }}
        >
          {submission?.file ? (
            <Document
              file={`${baseURL}/${submission.file}`}
              onLoadSuccess={({
                numPages,
              }) =>
                setPdfPages(
                  numPages
                )
              }
              onLoadError={() =>
                toast.error(
                  "Failed to load PDF"
                )
              }
            >
              {Array.from(
                new Array(
                  pdfPages
                ),
                (
                  _,
                  index
                ) => (
                  <Box
                    key={
                      index
                    }
                    sx={{
                      display:
                        "flex",
                      justifyContent:
                        "center",
                      mb: 2,
                    }}
                  >
                    <Page
                      pageNumber={
                        index +
                        1
                      }
                      width={
                        window.innerWidth *
                        0.35
                      }
                    />
                  </Box>
                )
              )}
            </Document>
          ) : (
            <Box
              sx={{
                height:
                  "100%",
                display:
                  "flex",
                justifyContent:
                  "center",
                alignItems:
                  "center",
                color: "white",
              }}
            >
              <Typography>
                No PDF Found
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentGradeBySubmission;