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
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const TeacherList = () => {
  const baseURL = "http://localhost:3000";
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/teacher`);
      setTeachers(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Delete teacher
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await axios.delete(`${baseURL}/api/teacher/delete/${id}`);
      toast.success("Teacher deleted successfully");
      setTeachers(teachers.filter((teacher) => teacher._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete teacher");
    }
  };

  // Edit teacher
  const handleEdit = (id) => {
    navigate(`/admin/teachers/edit/${id}`);
  };

  // Filter teachers by search term
  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase())
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
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <TextField
        label="Search Teacher by Name or Email"
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
              <TableCell>Teacher Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredTeachers.length > 0 ? (
              filteredTeachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.teacherName}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEdit(teacher._id)}
                      style={{ marginRight: "8px" }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleDelete(teacher._id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No teachers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default TeacherList;
