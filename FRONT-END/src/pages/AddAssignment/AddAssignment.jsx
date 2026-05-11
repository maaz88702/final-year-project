// fixing backend and db of it
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
} from "@mui/material";
import {
  Add,
  Delete,
} from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AddAssignment = () => {
  const baseURL =
    "http://localhost:3000";

  // ================= JWT =================
  const token =
    localStorage.getItem("jwt");

  let teacherId = "";

  if (token) {
    try {
      const decoded =
        jwtDecode(token);

      teacherId =
        decoded.id ||
        decoded._id;

      console.log(
        "✅ Decoded Teacher ID:",
        teacherId
      );
    } catch (error) {
      console.error(
        "❌ Invalid Token:",
        error
      );
    }
  }

  // ================= STATES =================
  const [courses, setCourses] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      courseId: "",
      semesterId: "",
      dueDate: "",
      title: "",
      assignmentDetails: [
        {
          ques: "",
          rubrics: [
            {
              condition: "",
              marks: "",
              subRubrics: [
                {
                  level: "100%",
                  marks: "",
                },
                {
                  level: "50%",
                  marks: "",
                },
                {
                  level: "25%",
                  marks: "",
                },
                {
                  level: "0%",
                  marks: 0,
                },
              ],
            },
          ],
        },
      ],
    });

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses =
      async () => {
        try {
          console.log(
            "✅ Fetching courses..."
          );

          const res =
            await axios.get(
              `${baseURL}/api/course/teacher/my`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          console.log(
            "✅ Courses:",
            res.data
          );

          setCourses(res.data);

          // DEFAULT COURSE
          if (
            res.data &&
            res.data.length > 0
          ) {
            setFormData(
              (prev) => ({
                ...prev,
                courseId:
                  res.data[0]._id,
                semesterId:
                  res.data[0]
                    .semesterId,
              })
            );
          }
        } catch (error) {
          console.error(error);

          toast.error(
            "Failed to load courses"
          );
        }
      };

    if (token) {
      fetchCourses();
    }
  }, [token]);

  // ================= COURSE CHANGE =================
  const handleCourseChange = (
    e
  ) => {
    const selectedCourseId =
      e.target.value;

    const selectedCourse =
      courses.find(
        (c) =>
          c._id ===
          selectedCourseId
      );

    setFormData((prev) => ({
      ...prev,
      courseId:
        selectedCourseId,
      semesterId:
        selectedCourse
          ?.semesterId || "",
    }));
  };

  // ================= BASIC INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  // ================= QUESTION =================
  const handleQuestionChange = (
    index,
    value
  ) => {
    const updated = [
      ...formData.assignmentDetails,
    ];

    updated[index].ques = value;

    setFormData({
      ...formData,
      assignmentDetails: updated,
    });
  };

  // ================= RUBRIC =================
  const handleRubricChange = (
    qIndex,
    rIndex,
    field,
    value
  ) => {
    const updated = [
      ...formData.assignmentDetails,
    ];

    updated[qIndex].rubrics[
      rIndex
    ][field] = value;

    // AUTO GENERATE SUB RUBRIC MARKS
    if (field === "marks") {
      const fullMarks =
        Number(value || 0);

      updated[qIndex].rubrics[
        rIndex
      ].subRubrics = [
        {
          level: "100%",
          marks: fullMarks,
        },
        {
          level: "50%",
          marks:
            fullMarks * 0.5,
        },
        {
          level: "25%",
          marks:
            fullMarks * 0.25,
        },
        {
          level: "0%",
          marks: 0,
        },
      ];
    }

    setFormData({
      ...formData,
      assignmentDetails: updated,
    });
  };

  // ================= ADD QUESTION =================
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
                {
                  level: "100%",
                  marks: "",
                },
                {
                  level: "50%",
                  marks: "",
                },
                {
                  level: "25%",
                  marks: "",
                },
                {
                  level: "0%",
                  marks: 0,
                },
              ],
            },
          ],
        },
      ],
    });
  };

  // ================= REMOVE QUESTION =================
  const removeQuestion = (
    index
  ) => {
    const updated = [
      ...formData.assignmentDetails,
    ];

    updated.splice(index, 1);

    setFormData({
      ...formData,
      assignmentDetails: updated,
    });
  };

  // ================= ADD RUBRIC =================
  const addRubric = (
    qIndex
  ) => {
    const updated = [
      ...formData.assignmentDetails,
    ];

    updated[qIndex].rubrics.push(
      {
        condition: "",
        marks: "",
        subRubrics: [
          {
            level: "100%",
            marks: "",
          },
          {
            level: "50%",
            marks: "",
          },
          {
            level: "25%",
            marks: "",
          },
          {
            level: "0%",
            marks: 0,
          },
        ],
      }
    );

    setFormData({
      ...formData,
      assignmentDetails: updated,
    });
  };

  // ================= REMOVE RUBRIC =================
  const removeRubric = (
    qIndex,
    rIndex
  ) => {
    const updated = [
      ...formData.assignmentDetails,
    ];

    updated[qIndex].rubrics.splice(
      rIndex,
      1
    );

    setFormData({
      ...formData,
      assignmentDetails: updated,
    });
  };

  // ================= TOTAL MARKS =================
  const calculateTotalMarks =
    () => {
      return formData.assignmentDetails.reduce(
        (total, q) => {
          return (
            total +
            q.rubrics.reduce(
              (sum, r) =>
                sum +
                Number(
                  r.marks || 0
                ),
              0
            )
          );
        },
        0
      );
    };

  // ================= SUBMIT =================
  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,

        assignmentDetails:
          formData.assignmentDetails.map(
            (q) => ({
              ques: q.ques,

              rubrics:
                q.rubrics.map(
                  (r) => ({
                    condition:
                      r.condition,

                    marks: Number(
                      r.marks
                    ),

                    subRubrics:
                      r.subRubrics.map(
                        (
                          sr
                        ) => ({
                          level:
                            sr.level,

                          marks:
                            Number(
                              sr.marks
                            ),
                        })
                      ),
                  })
                ),
            })
          ),
      };

      console.log(
        "✅ Payload:",
        payload
      );

      await axios.post(
        `${baseURL}/api/assignmentPosted/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Assignment posted successfully!"
      );

      // RESET
      setFormData({
        courseId:
          courses[0]?._id || "",
        semesterId:
          courses[0]
            ?.semesterId || "",
        dueDate: "",
        title: "",
        assignmentDetails: [
          {
            ques: "",
            rubrics: [
              {
                condition: "",
                marks: "",
                subRubrics: [
                  {
                    level:
                      "100%",
                    marks: "",
                  },
                  {
                    level:
                      "50%",
                    marks: "",
                  },
                  {
                    level:
                      "25%",
                    marks: "",
                  },
                  {
                    level:
                      "0%",
                    marks: 0,
                  },
                ],
              },
            ],
          },
        ],
      });
    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data
          ?.message ||
          "Failed to post assignment"
      );
    } finally {
      setLoading(false);
    }
  };

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
          Post Assignment
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Create assignment
          questions, rubrics &
          grading criteria
        </Typography>

        <form
          onSubmit={handleSubmit}
        >
          <Grid
            container
            spacing={2}
            sx={{ mt: 2 }}
          >
            {/* COURSE */}
            <Grid size={12}>
              <TextField
                select
                label="Select Course"
                fullWidth
                required
                value={
                  formData.courseId
                }
                onChange={
                  handleCourseChange
                }
              >
                {courses.map(
                  (course) => (
                    <MenuItem
                      key={
                        course._id
                      }
                      value={
                        course._id
                      }
                    >
                      {
                        course.courseTitle
                      }
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/* DUE DATE */}
            <Grid size={6}>
              <TextField
                type="date"
                label="Due Date"
                name="dueDate"
                fullWidth
                required
                InputLabelProps={{
                  shrink: true,
                }}
                value={
                  formData.dueDate
                }
                onChange={
                  handleChange
                }
              />
            </Grid>

            {/* TOTAL */}
            <Grid size={6}>
              <TextField
                label="Total Marks"
                fullWidth
                value={calculateTotalMarks()}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            {/* TITLE */}
            <Grid size={12}>
              <TextField
                label="Assignment Title"
                name="title"
                fullWidth
                required
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="h6"
            fontWeight="bold"
          >
            Questions &
            Rubrics
          </Typography>

          {formData.assignmentDetails.map(
            (q, qIndex) => (
              <Paper
                key={qIndex}
                sx={{
                  p: 3,
                  mt: 3,
                  borderRadius: 3,
                  bgcolor:
                    "#fafafa",
                }}
              >
                <Grid
                  container
                  spacing={2}
                >
                  {/* QUESTION */}
                  <Grid size={11}>
                    <TextField
                      label={`Question ${
                        qIndex + 1
                      }`}
                      fullWidth
                      value={
                        q.ques
                      }
                      onChange={(
                        e
                      ) =>
                        handleQuestionChange(
                          qIndex,
                          e.target
                            .value
                        )
                      }
                    />
                  </Grid>

                  <Grid size={1}>
                    {qIndex >
                      0 && (
                      <IconButton
                        color="error"
                        onClick={() =>
                          removeQuestion(
                            qIndex
                          )
                        }
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Grid>

                  {/* RUBRICS */}
                  {q.rubrics.map(
                    (
                      r,
                      rIndex
                    ) => (
                      <React.Fragment
                        key={
                          rIndex
                        }
                      >
                        <Grid
                          size={6}
                        >
                          <TextField
                            label="Rubric Condition"
                            fullWidth
                            value={
                              r.condition
                            }
                            onChange={(
                              e
                            ) =>
                              handleRubricChange(
                                qIndex,
                                rIndex,
                                "condition",
                                e
                                  .target
                                  .value
                              )
                            }
                          />
                        </Grid>

                        <Grid
                          size={4}
                        >
                          <TextField
                            type="number"
                            label="Marks"
                            fullWidth
                            value={
                              r.marks
                            }
                            onChange={(
                              e
                            ) =>
                              handleRubricChange(
                                qIndex,
                                rIndex,
                                "marks",
                                e
                                  .target
                                  .value
                              )
                            }
                          />
                        </Grid>

                        <Grid
                          size={2}
                        >
                          {rIndex >
                            0 && (
                            <IconButton
                              color="error"
                              onClick={() =>
                                removeRubric(
                                  qIndex,
                                  rIndex
                                )
                              }
                            >
                              <Delete />
                            </IconButton>
                          )}
                        </Grid>

                        {/* SUB RUBRICS */}
                        <Grid
                          size={12}
                        >
                          <Box
                            sx={{
                              display:
                                "flex",
                              gap: 1,
                              flexWrap:
                                "wrap",
                            }}
                          >
                            {r.subRubrics?.map(
                              (
                                sr,
                                index
                              ) => (
                                <Chip
                                  key={
                                    index
                                  }
                                  label={`${sr.level} = ${sr.marks} marks`}
                                  color="primary"
                                  variant="outlined"
                                />
                              )
                            )}
                          </Box>
                        </Grid>
                      </React.Fragment>
                    )
                  )}

                  <Grid size={12}>
                    <Button
                      startIcon={
                        <Add />
                      }
                      onClick={() =>
                        addRubric(
                          qIndex
                        )
                      }
                    >
                      Add Rubric
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
            )
          )}

          {/* ADD QUESTION */}
          <Button
            sx={{ mt: 3 }}
            startIcon={<Add />}
            onClick={addQuestion}
          >
            Add Question
          </Button>

          {/* SUBMIT */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 4,
              height: 50,
              borderRadius: 2,
            }}
          >
            {loading
              ? "Posting..."
              : "Post Assignment"}
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddAssignment;
