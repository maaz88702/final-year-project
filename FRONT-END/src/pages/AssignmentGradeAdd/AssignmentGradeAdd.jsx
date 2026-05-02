import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  MenuItem,
  Divider,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";

const AssignmentGradeAdd = () => {
  const baseURL = "http://localhost:3000";

  // ================= JWT =================
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
  const [assignments, setAssignments] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);

  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  const [details, setDetails] = useState([]);
  const [totalMarks, setTotalMarks] = useState(0);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignRes, studentRes, gradeRes] = await Promise.all([
          axios.get(`${baseURL}/api/assignmentPosted`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/student`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${baseURL}/api/assignmentGrade`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const teacherAssignments = assignRes.data.filter(
          (a) =>
            String(a.teacherId?._id || a.teacherId) === teacherId
        );

        setAssignments(teacherAssignments);
        setStudents(studentRes.data);
        setGrades(gradeRes.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load data");
      }
    };

    if (token && teacherId) fetchData();
  }, [token, teacherId]);

  // ================= AUTO SELECT FIRST ASSIGNMENT =================
  useEffect(() => {
    if (assignments.length > 0 && !selectedAssignment) {
      setSelectedAssignment(assignments[0]._id);
    }
  }, [assignments]);

  // ================= FILTER STUDENTS =================
  useEffect(() => {
    if (!selectedAssignment) return;

    const assignment = assignments.find(
      (a) => a._id === selectedAssignment
    );

    if (!assignment) return;

    // students of same semester
    const semesterStudents = students.filter(
      (s) =>
        String(s.semester?._id || s.semester) ===
        String(
          assignment.semesterId?._id ||
            assignment.semesterId
        )
    );

    // already graded
    const gradedStudentIds = grades
      .filter(
        (g) =>
          String(
            g.assignmentId?._id || g.assignmentId
          ) === selectedAssignment
      )
      .map((g) =>
        String(g.studentId?._id || g.studentId)
      );

    // remove graded
    const ungradedStudents =
      semesterStudents.filter(
        (s) =>
          !gradedStudentIds.includes(
            String(s._id)
          )
      );

    setFilteredStudents(ungradedStudents);
    setSelectedStudent("");
  }, [selectedAssignment, students, assignments, grades]);

  // ================= LOAD QUESTIONS =================
  useEffect(() => {
    if (!selectedAssignment) return;

    const assignment = assignments.find(
      (a) => a._id === selectedAssignment
    );

    if (!assignment) return;

    const mapped =
      assignment.assignmentDetails.map((q) => ({
        question: q.ques,
        rubrics: q.rubrics,
        selectedIndexes: [],
        marks: 0,
      }));

    setDetails(mapped);
    setTotalMarks(0);
  }, [selectedAssignment]);

  // ================= CHECKBOX =================
  const handleCheckboxChange = (
    qIndex,
    rIndex,
    marks
  ) => {
    const updated = [...details];
    const selected =
      updated[qIndex].selectedIndexes;

    if (selected.includes(rIndex)) {
      updated[qIndex].selectedIndexes =
        selected.filter((i) => i !== rIndex);
      updated[qIndex].marks -= marks;
    } else {
      updated[qIndex].selectedIndexes.push(rIndex);
      updated[qIndex].marks += marks;
    }

    setDetails(updated);

    const total = updated.reduce(
      (sum, q) => sum + q.marks,
      0
    );

    setTotalMarks(total);
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedAssignment || !selectedStudent) {
      toast.error("Select assignment & student");
      return;
    }

    try {
      const payload = {
        assignmentId: selectedAssignment,
        studentId: selectedStudent,
        obtainmarks: totalMarks,
        details: details.map((d) => ({
          question: d.question,
          marks: d.marks,
        })),
      };

      await axios.post(
        `${baseURL}/api/assignmentGrade/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Grade added successfully!");

      // update graded list
      setGrades((prev) => [
        ...prev,
        {
          assignmentId: selectedAssignment,
          studentId: selectedStudent,
        },
      ]);

      // reset only student
      setSelectedStudent("");

      // reset checkboxes (NOT remove questions)
      const resetDetails = details.map((q) => ({
        ...q,
        selectedIndexes: [],
        marks: 0,
      }));

      setDetails(resetDetails);
      setTotalMarks(0);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit"
      );
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Assignment Grading
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {/* Assignment */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Assignment"
                fullWidth
                value={selectedAssignment}
                onChange={(e) =>
                  setSelectedAssignment(
                    e.target.value
                  )
                }
              >
                {assignments.length === 0 && (
                  <MenuItem disabled>
                    No assignments
                  </MenuItem>
                )}
                {assignments.map((a) => (
                  <MenuItem
                    key={a._id}
                    value={a._id}
                  >
                    {a.title}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Student */}
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                select
                label="Student"
                fullWidth
                value={selectedStudent}
                onChange={(e) =>
                  setSelectedStudent(
                    e.target.value
                  )
                }
              >
                {filteredStudents.length === 0 ? (
                  <MenuItem disabled>
                    All students graded ✅
                  </MenuItem>
                ) : (
                  filteredStudents.map((s) => (
                    <MenuItem
                      key={s._id}
                      value={s._id}
                    >
                      {s.studentName} —{" "}
                      {s.rollNo}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Message when no student */}
          {!selectedStudent && (
            <Typography sx={{ mb: 2 }}>
              Select a student to start grading
            </Typography>
          )}

          {/* Questions */}
          {selectedStudent &&
            details.map((q, qIndex) => (
              <Paper
                key={qIndex}
                sx={{ p: 2, mb: 2 }}
              >
                <Typography fontWeight="bold">
                  Q{qIndex + 1}: {q.question}
                </Typography>

                <FormGroup>
                  {q.rubrics.map((r, rIndex) => (
                    <FormControlLabel
                      key={rIndex}
                      control={
                        <Checkbox
                          checked={q.selectedIndexes.includes(
                            rIndex
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              qIndex,
                              rIndex,
                              r.marks
                            )
                          }
                        />
                      }
                      label={`${r.condition} (${r.marks} marks)`}
                    />
                  ))}
                </FormGroup>

                <Typography sx={{ mt: 1 }}>
                  Marks: {q.marks}
                </Typography>
              </Paper>
            ))}

          <Typography
            sx={{ mt: 2, fontWeight: "bold" }}
          >
            Total Marks: {totalMarks}
          </Typography>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, height: 45 }}
          >
            Submit Grade
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default AssignmentGradeAdd;