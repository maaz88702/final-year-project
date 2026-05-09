import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const StudentList = () => {
  const navigate = useNavigate();
  const baseURL = "http://localhost:3000";
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all students
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/student`);
      setStudents(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Delete student
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      await axios.delete(`${baseURL}/api/student/delete/${id}`);
      toast.success("Student deleted successfully");
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete student");
    }
  };

  // Edit student
  const handleEdit = (id) => {
   navigate(`/admin/student/edit/${id}`);
  };

  // Filter students based on search term (name, email, or roll number)
  const filteredStudents = students.filter(
    (student) =>
      student.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.rollNo && student.rollNo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </div>
    );

  return (
    <>  
  
    <Paper style={{ padding: "20px", margin: "20px" }}>
      {/* Search Bar */}
      <TextField
        label="Search Student by Name, Email, or Roll No"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Roll No</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student._id}>
                  <TableCell>{student.studentName}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.rollNo}</TableCell>
                  <TableCell>{student.semester?.semester || "N/A"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(student._id)}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(student._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No students found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
      </>
  );
};

export default StudentList;
