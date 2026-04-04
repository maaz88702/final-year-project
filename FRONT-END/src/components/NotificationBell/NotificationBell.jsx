import React, { useEffect, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NotificationBell = () => {
  const baseURL = "http://localhost:3000";

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let userId = "";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || decoded._id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  // ================= STATE =================
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // ================= FETCH =================
  const fetchNotifications = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/notification/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userId) fetchNotifications();

    // 🔁 Optional auto-refresh every 10 sec (FYP boost)
    const interval = setInterval(() => {
      if (userId) fetchNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, [userId]);

  // ================= MARK AS READ =================
  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `${baseURL}/api/notification/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ================= COUNT =================
  const unreadCount = notifications.filter((n) => !n.read).length;

  // ================= UI =================
  return (
    <>
      {/* 🔔 Bell Icon */}
      <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* 📩 Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: { width: 300, maxHeight: 400 }
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography fontWeight="bold">Notifications</Typography>
        </Box>

        <Divider />

        {notifications.length === 0 && (
          <MenuItem>No notifications</MenuItem>
        )}

        {notifications.map((n) => (
          <MenuItem
            key={n._id}
            onClick={() => handleMarkAsRead(n._id)}
            sx={{
              whiteSpace: "normal",
              alignItems: "flex-start",
              bgcolor: n.read ? "white" : "#eef6ff",
            }}
          >
            <Box>
              <Typography
                variant="body2"
                fontWeight={n.read ? "normal" : "bold"}
              >
                {n.message}
              </Typography>

              <Typography variant="caption" color="gray">
                {new Date(n.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default NotificationBell;