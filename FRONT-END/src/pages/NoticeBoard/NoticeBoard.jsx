import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
} from "@mui/material";
import axios from "axios";

const NoticeBoard = () => {
  const baseURL = "http://localhost:3000";

  // ================= STATE =================
  const [notices, setNotices] = useState([]);

  // ================= FETCH =================
  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/notice`);
        setNotices(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotices();
  }, []);

  // ================= DATE HELPERS =================
  const getDaysLeft = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diff = expiry - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // ================= UI =================
  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          📢 Notice Board
        </Typography>

        <List sx={{ mt: 2 }}>
          {notices.length === 0 && (
            <Typography>No notices available</Typography>
          )}

          {notices.map((n) => {
            const daysLeft = getDaysLeft(n.expiryDate);

            let statusLabel = "Active";
            let color = "success";

            if (daysLeft <= 2) {
              statusLabel = "Expiring Soon";
              color = "warning";
            }

            return (
              <ListItem
                key={n._id}
                sx={{
                  bgcolor: "#f9f9f9",
                  mb: 2,
                  borderRadius: 2,
                  display: "block",
                }}
              >
                {/* Title + Status */}
                <Typography fontWeight="bold" variant="h6">
                  {n.title}
                </Typography>

                <Chip
                  label={statusLabel}
                  color={color}
                  size="small"
                  sx={{ mt: 1 }}
                />

                {/* Message */}
                <Typography sx={{ mt: 1 }}>
                  {n.message}
                </Typography>

                {/* Expiry */}
                <Typography
                  variant="body2"
                  sx={{ mt: 1, color: "gray" }}
                >
                  Valid till:{" "}
                  {new Date(n.expiryDate).toLocaleDateString()}
                </Typography>
              </ListItem>
            );
          })}
        </List>
      </Paper>
    </Container>
  );
};

export default NoticeBoard;