import React, { useEffect, useState } from "react";
// finished but fix due data later 
import "./AddAssignment.css";
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

        // console.log(decoded);
        teacherId = decoded.id;
        // console.log("Logged in teacher ID:", teacherId);
    }

    // ================= STATES =================
    const [courses, setCourses] = useState([]);
    const [semesters, setSemesters] = useState([]);

    const [formData, setFormData] = useState({
        courseId: "",
        semesterId: "",
        dueDate: "",
        title: "",
        assignmentDetails: [
            { ques: "", rubrics: [{ condition: "", marks: "" }] }
        ]
    });

    // ================= CALCULATE TOTAL MARKS =================
    const calculateTotalMarks = () => {
        return formData.assignmentDetails.reduce((total, q) => {
            return total + q.rubrics.reduce((sum, r) => sum + Number(r.marks || 0), 0);
        }, 0);
    };

    // ================= FETCH COURSES & SEMESTERS =================
    useEffect(() => {
        const fetchDropdownData = async () => {
            try {
                const [courseRes, semesterRes] = await Promise.all([
                    axios.get(`${baseURL}/api/course`, { headers: { Authorization: `Bearer ${token}` } }),
                    axios.get(`${baseURL}/api/semester`, { headers: { Authorization: `Bearer ${token}` } })
                ]);
                // console.log("All courses:", courseRes.data);
                // Filter courses for logged-in teacher


                const teacherCourses = courseRes.data.filter(
                    (course) => course.teacher && String(course.teacher._id) === teacherId
                );

                // console.log("Filtered courses for teacher:", teacherCourses);


                setCourses(teacherCourses);
                setSemesters(semesterRes.data);
                // console.log("Semesters:", semesterRes.data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load courses or semesters");
            }
        };

        if (token && teacherId) fetchDropdownData();
    }, [token, teacherId]);

    // ================= BASIC INPUT HANDLER =================
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // ================= QUESTIONS & RUBRICS HANDLERS =================
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

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                // totalMarks: calculateTotalMarks(),
                assignmentDetails: formData.assignmentDetails.map((q) => ({
                    ques: q.ques,
                    rubrics: q.rubrics.map((r) => ({ condition: r.condition, marks: Number(r.marks) }))
                }))
            };
            // console.log("Submitting payload:", payload);
            await axios.post(`${baseURL}/api/assignmentPosted/add`, payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success("Assignment posted successfully!");
            setFormData({
                courseId: "",
                semesterId: "",
                dueDate: "",
                title: "",
                assignmentDetails: [{ ques: "", rubrics: [{ condition: "", marks: "" }] }]
            });
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to post assignment");
        }
    };

    // ================= UI =================
    return (
        <Container maxWidth="md">
            <Paper sx={{ p: 4, mt: 4 }}>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Post Assignment
                </Typography>

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        {/* Course Dropdown */}
                        <Grid xs={12} md={6}>
                           <TextField
    select
    label="Select Course"
    name="courseId"
    fullWidth
    required
    value={formData.courseId || courses[0]?._id} // default to first course
    onChange={handleChange}
>
    {courses.length === 0 && <MenuItem disabled>No courses available</MenuItem>}
    {courses.map((course) => (
        <MenuItem key={course._id} value={course._id}>
            {course.courseTitle}
        </MenuItem>
    ))}
</TextField>

                        </Grid>

                        {/* Semester Dropdown */}
                        <Grid xs={12} md={6}>
                            <TextField
                                select
                                label="Select Semester"
                                name="semesterId"
                                fullWidth
                                required
                                value={formData.semesterId || semesters[0]?._id} // default to first semester
                                onChange={handleChange}
                            >
                                {semesters.map((sem) => (
                                    <MenuItem key={sem._id} value={sem._id}>
                                        {sem.semester}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        {/* Due Date */}
                        <Grid xs={12} md={6}>
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
                        <Grid xs={12} md={6}>
                            <TextField
                                label="Total Marks (Auto)"
                                fullWidth
                                value={calculateTotalMarks()}
                                InputProps={{ readOnly: true }}
                            />
                        </Grid>

                        {/* Title */}
                        <Grid xs={12}>
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
                        <Paper key={qIndex} sx={{ p: 2, mt: 2, bgcolor: "#f7f7f7" }}>
                            <Grid container spacing={2}>
                                <Grid xs={11}>
                                    <TextField
                                        label={`Question ${qIndex + 1}`}
                                        fullWidth
                                        value={q.ques}
                                        onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
                                    />
                                </Grid>
                                <Grid xs={1}>
                                    {qIndex > 0 && (
                                        <IconButton color="error" onClick={() => removeQuestion(qIndex)}>
                                            <Delete />
                                        </IconButton>
                                    )}
                                </Grid>

                                {q.rubrics.map((r, rIndex) => (
                                    <React.Fragment key={rIndex}>
                                        <Grid xs={6}>
                                            <TextField
                                                label="Rubric Condition"
                                                fullWidth
                                                value={r.condition}
                                                onChange={(e) =>
                                                    handleRubricChange(qIndex, rIndex, "condition", e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid xs={4}>
                                            <TextField
                                                type="number"
                                                label="Marks"
                                                fullWidth
                                                value={r.marks}
                                                onChange={(e) =>
                                                    handleRubricChange(qIndex, rIndex, "marks", e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid xs={2}>
                                            {rIndex > 0 && (
                                                <IconButton color="error" onClick={() => removeRubric(qIndex, rIndex)}>
                                                    <Delete />
                                                </IconButton>
                                            )}
                                        </Grid>
                                    </React.Fragment>
                                ))}

                                <Grid xs={12}>
                                    <Button size="small" startIcon={<Add />} onClick={() => addRubric(qIndex)}>
                                        Add Rubric
                                    </Button>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))}

                    <Button sx={{ mt: 2 }} startIcon={<Add />} onClick={addQuestion}>
                        Add Question
                    </Button>

                    <Button type="submit" variant="contained" fullWidth sx={{ mt: 3, height: 45 }}>
                        Post Assignment
                    </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default AddAssignment;
