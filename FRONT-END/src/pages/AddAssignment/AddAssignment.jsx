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
  Divider
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AddAssignment = () => {
  const baseURL = "http://localhost:3000";

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let teacherId = "";

  if (token) {
    const decoded = jwtDecode(token);
    teacherId = decoded.id;
  }
console.log("Decoded JWT:", { teacherId });
  // ================= STATES =================
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    courseId: "",
    semesterId: "",
    dueDate: "",
    title: "",
    assignmentDetails: [
      { ques: "", rubrics: [{ condition: "", marks: "" }] }
    ]
  });

  // ================= FETCH COURSES =================
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get(
          `${baseURL}/api/course/teacher/my`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setCourses(res.data);

        // ✅ Set default course + semester
        if (res.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            courseId: res.data[0]._id,
            semesterId: res.data[0].semesterId
          }));
        }

      } catch (error) {
        console.error(error);
        toast.error("Failed to load courses");
      }
    };

    if (token) fetchCourses();
  }, [token]);

  // ================= HANDLE COURSE CHANGE =================
  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;

    const selectedCourse = courses.find(
      (c) => c._id === selectedCourseId
    );

    setFormData((prev) => ({
      ...prev,
      courseId: selectedCourseId,
      semesterId: selectedCourse?.semesterId || ""
    }));
  };

  // ================= BASIC INPUT =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ================= QUESTIONS =================
  const handleQuestionChange = (index, value) => {
    const updated = [...formData.assignmentDetails];
    updated[index].ques = value;
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const handleRubricChange = (qIndex, rIndex, field, value) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics[rIndex][field] = value;
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const addQuestion = () => {
    setFormData({
      ...formData,
      assignmentDetails: [
        ...formData.assignmentDetails,
        { ques: "", rubrics: [{ condition: "", marks: "" }] }
      ]
    });
  };

  const removeQuestion = (index) => {
    const updated = [...formData.assignmentDetails];
    updated.splice(index, 1);
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const addRubric = (qIndex) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics.push({ condition: "", marks: "" });
    setFormData({ ...formData, assignmentDetails: updated });
  };

  const removeRubric = (qIndex, rIndex) => {
    const updated = [...formData.assignmentDetails];
    updated[qIndex].rubrics.splice(rIndex, 1);
    setFormData({ ...formData, assignmentDetails: updated });
  };

  // ================= TOTAL MARKS =================
  const calculateTotalMarks = () => {
    return formData.assignmentDetails.reduce((total, q) => {
      return total + q.rubrics.reduce(
        (sum, r) => sum + Number(r.marks || 0),
        0
      );
    }, 0);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        assignmentDetails: formData.assignmentDetails.map((q) => ({
          ques: q.ques,
          rubrics: q.rubrics.map((r) => ({
            condition: r.condition,
            marks: Number(r.marks)
          }))
        }))
      };

      console.log("Payload:", payload);

      await axios.post(
        `${baseURL}/api/assignmentPosted/add`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Assignment posted successfully!");

      // reset
      setFormData({
        courseId: "",
        semesterId: "",
        dueDate: "",
        title: "",
        assignmentDetails: [
          { ques: "", rubrics: [{ condition: "", marks: "" }] }
        ]
      });

    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to post assignment"
      );
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Post Assignment
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>

            {/* Course */}
            <Grid size={12}>
              <TextField
                select
                label="Select Course"
                fullWidth
                required
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

            {/* Due Date */}
            <Grid size={6}>
              <TextField
                type="date"
                label="Due Date"
                name="dueDate"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={handleChange}
              />
            </Grid>

            {/* Total Marks */}
            <Grid size={6}>
              <TextField
                label="Total Marks"
                fullWidth
                value={calculateTotalMarks()}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Title */}
            <Grid size={12}>
              <TextField
                label="Assignment Title"
                name="title"
                fullWidth
                required
                value={formData.title}
                onChange={handleChange}
              />
            </Grid>

          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6">Questions & Rubrics</Typography>

          {formData.assignmentDetails.map((q, qIndex) => (
            <Paper key={qIndex} sx={{ p: 2, mt: 2 }}>
              <Grid container spacing={2}>
                <Grid size={11}>
                  <TextField
                    label={`Question ${qIndex + 1}`}
                    fullWidth
                    value={q.ques}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, e.target.value)
                    }
                  />
                </Grid>

                <Grid size={1}>
                  {qIndex > 0 && (
                    <IconButton onClick={() => removeQuestion(qIndex)}>
                      <Delete />
                    </IconButton>
                  )}
                </Grid>

                {q.rubrics.map((r, rIndex) => (
                  <React.Fragment key={rIndex}>
                    <Grid size={6}>
                      <TextField
                        label="Condition"
                        fullWidth
                        value={r.condition}
                        onChange={(e) =>
                          handleRubricChange(
                            qIndex,
                            rIndex,
                            "condition",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid size={4}>
                      <TextField
                        type="number"
                        label="Marks"
                        fullWidth
                        value={r.marks}
                        onChange={(e) =>
                          handleRubricChange(
                            qIndex,
                            rIndex,
                            "marks",
                            e.target.value
                          )
                        }
                      />
                    </Grid>

                    <Grid size={2}>
                      {rIndex > 0 && (
                        <IconButton
                          onClick={() =>
                            removeRubric(qIndex, rIndex)
                          }
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}

                <Grid size={12}>
                  <Button onClick={() => addRubric(qIndex)}>
                    + Add Rubric
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button sx={{ mt: 2 }} onClick={addQuestion}>
            + Add Question
          </Button>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Post Assignment
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AddAssignment;