import React, { useEffect, useMemo, useState } from "react";
import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Divider,
  Box,
  Chip,
  CircularProgress,
  Button,
  Stack,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CampaignIcon from "@mui/icons-material/Campaign";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const NotificationBell = () => {
  const baseURL = "http://localhost:3000";

  // ================= TOKEN =================
  const token = localStorage.getItem("jwt");
  console.log("JWT Token:", token);
  // ================= USER ID =================
  const userId = useMemo(() => {
    if (!token) return "";

    try {
      const decoded = jwtDecode(token);
      return decoded.id || decoded._id || "";
    } catch (error) {
      console.error("Invalid token", error);
      return "";
    }
  }, [token]);

  // ================= STATES =================
  const [notifications, setNotifications] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    if (!userId || !token) return;

    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/notification/${userId}`,
        // `${baseURL}/api/notification-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Notifications fetched:", res.data);
      setNotifications(res.data || []);
    } catch (error) {
      console.error("Fetch notification error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= AUTO REFRESH =================
  useEffect(() => {
    if (!userId || !token) return;

    fetchNotifications();

    const interval = setInterval(() => {
      fetchNotifications();
    }, 10000); // every 10 sec

    return () => clearInterval(interval);
  }, [userId, token]);

  // ================= MARK AS READ =================
  const handleMarkAsRead = async (id) => {
    try {
      await axios.patch(
        `${baseURL}/api/notification/read/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, read: true } : item
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ================= MARK ALL AS READ =================
  const handleMarkAllRead = async () => {
    try {
      const unread = notifications.filter((n) => !n.read);

      await Promise.all(
        unread.map((item) =>
          axios.patch(
            `${baseURL}/api/notification/read/${item._id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
        )
      );

      setNotifications((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
        }))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // ================= HELPERS =================
  const unreadCount = notifications.filter(
    (item) => !item.read
  ).length;

  const getIcon = (type) => {
    if (type === "assignment") {
      return (
        <AssignmentIcon
          fontSize="small"
          color="primary"
        />
      );
    }

    return (
      <CampaignIcon
        fontSize="small"
        color="warning"
      />
    );
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);

    const diff = Math.floor((now - created) / 1000);

    if (diff < 60) return "Just now";

    if (diff < 3600) {
      const min = Math.floor(diff / 60);
      return `${min} min${min > 1 ? "s" : ""} ago`;
    }

    if (diff < 86400) {
      const hr = Math.floor(diff / 3600);
      return `${hr} hr${hr > 1 ? "s" : ""} ago`;
    }

    const day = Math.floor(diff / 86400);
    return `${day} day${day > 1 ? "s" : ""} ago`;
  };

  // ================= UI =================
  return (
    <>
      {/* Notification Bell */}
      <IconButton
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
        >
          <NotificationsIcon color="inherit" />
        </Badge>
      </IconButton>

      {/* Dropdown */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            width: 380,
            maxHeight: 500,
            mt: 1,
            borderRadius: 3,
          },
        }}
      >
        {/* Header */}
        <Box sx={{ px: 2, py: 1.5 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              fontWeight="bold"
            >
              Notifications
            </Typography>

            {unreadCount > 0 && (
              <Chip
                label={`${unreadCount} New`}
                color="error"
                size="small"
              />
            )}
          </Stack>

          {unreadCount > 0 && (
            <Button
              startIcon={<DoneAllIcon />}
              size="small"
              sx={{ mt: 1 }}
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Loading */}
        {loading && (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <CircularProgress size={28} />
          </Box>
        )}

        {/* Empty */}
        {!loading &&
          notifications.length === 0 && (
            <MenuItem>
              No notifications found
            </MenuItem>
          )}

        {/* Notification List */}
        {!loading &&
          notifications.map((item) => (
            <MenuItem
              key={item._id}
              onClick={() =>
                handleMarkAsRead(item._id)
              }
              sx={{
                alignItems: "flex-start",
                gap: 1.5,
                py: 1.5,
                whiteSpace: "normal",
                bgcolor: item.read
                  ? "#fff"
                  : "#eef6ff",
                borderLeft: item.read
                  ? "4px solid transparent"
                  : "4px solid #1976d2",
              }}
            >
              {/* Icon */}
              <Box sx={{ mt: 0.5 }}>
                {getIcon(item.type)}
              </Box>

              {/* Content */}
              <Box sx={{ flex: 1 }}>
                {item.type ===
                  "assignment" &&
                  !item.read && (
                    <Chip
                      label="NEW ASSIGNMENT"
                      size="small"
                      color="success"
                      sx={{ mb: 0.5 }}
                    />
                  )}

                {item.type === "notice" &&
                  !item.read && (
                    <Chip
                      label="NEW NOTICE"
                      size="small"
                      color="warning"
                      sx={{ mb: 0.5 }}
                    />
                  )}

                <Typography
                  variant="body2"
                  fontWeight={
                    item.read ? 400 : 700
                  }
                >
                  {item.message}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {getTimeAgo(
                    item.createdAt
                  )}
                </Typography>
              </Box>
            </MenuItem>
          ))}
      </Menu>
    </>
  );
};

export default NotificationBell;