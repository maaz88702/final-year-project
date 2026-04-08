import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { toast } from "react-toastify";

const NoticeBoardAdmin = () => {
  const baseURL = "http://localhost:3000";

  // ================= STATES =================
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // ================= FETCH =================
  const fetchNotices = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/notice`);
      setNotices(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load notices");
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // ================= ADD =================
  const handleAdd = async () => {
    if (!title || !message || !expiryDate) {
      toast.error("Please fill all fields");
      return;
    }

    // Optional frontend validation
    if (new Date(expiryDate) < new Date()) {
      toast.error("Expiry date must be in the future");
      return;
    }

    try {
      await axios.post(`${baseURL}/api/notice/add`, {
        title,
        message,
        expiryDate,
      });

      toast.success("Notice added successfully");

      // Reset form
      setTitle("");
      setMessage("");
      setExpiryDate("");

      fetchNotices();

    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add notice"
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${baseURL}/api/notice/delete/${id}`);

      toast.success("Notice deleted");
      fetchNotices();

    } catch (err) {
      console.error(err);
      toast.error("Delete failed");
    }
  };

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Notice Board (Admin)
        </Typography>

        {/* Title */}
        <TextField
          fullWidth
          label="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Message */}
        <TextField
          fullWidth
          multiline
          rows={3}
          label="Notice Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Expiry Date */}
        <TextField
          fullWidth
          type="date"
          label="Expiry Date"
          InputLabelProps={{ shrink: true }}
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* Add Button */}
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2, height: 45 }}
          onClick={handleAdd}
        >
          Add Notice
        </Button>

        <Divider sx={{ my: 3 }} />

        {/* Notices List */}
        <List>
          {notices.length === 0 && (
            <Typography>No notices available</Typography>
          )}

          {notices.map((n) => (
            <ListItem
              key={n._id}
              sx={{
                bgcolor: "#f5f5f5",
                mb: 1,
                borderRadius: 2,
              }}
              secondaryAction={
                <IconButton
                  onClick={() => handleDelete(n._id)}
                >
                  <DeleteIcon color="error" />
                </IconButton>
              }
            >
              <ListItemText
                primary={n.title}
                secondary={
                  <>
                    {n.message}
                    <br />
                    <strong>Expires:</strong>{" "}
                    {new Date(n.expiryDate).toLocaleDateString()}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
};

export default NoticeBoardAdmin;