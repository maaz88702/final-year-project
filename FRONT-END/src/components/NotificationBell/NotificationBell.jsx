import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";

import { jwtDecode } from "jwt-decode";
import {
  useDispatch,
  useSelector,
} from "react-redux";

import socket from "../../socket";

import {
  fetchNotifications,
  addNotification,
  markAsRead,
  markAllRead,
} from "../../redux/slices/notificationSlice";

const NotificationBell = () => {
  const dispatch = useDispatch();

  const { notifications } = useSelector(
    (state) => state.notifications
  );

  const [anchorEl, setAnchorEl] =
    useState(null);

  const token =
    localStorage.getItem("jwt");

  // ================= USER ID =================
  const userId = useMemo(() => {
    if (!token) return "";

    try {
      const decoded =
        jwtDecode(token);

      return (
        decoded.id ||
        decoded._id ||
        ""
      );
    } catch (error) {
      console.error(
        "Invalid token"
      );
      return "";
    }
  }, [token]);

  // ================= FETCH OLD + SOCKET LIVE =================
  useEffect(() => {
    if (!userId) return;

    // Load saved notifications
    dispatch(
      fetchNotifications(userId)
    );

    // Join socket room
    socket.emit(
      "joinRoom",
      userId
    );

    // Live notification
    socket.on(
      "newNotification",
      (data) => {
        dispatch(
          addNotification(data)
        );

        console.log(
          "Received:",
          data
        );
      }
    );

    return () => {
      socket.off(
        "newNotification"
      );
    };
  }, [userId, dispatch]);

  // ================= COUNT =================
  const unreadCount =
    notifications.filter(
      (n) => !n.read
    ).length;

  // ================= ACTIONS =================
  const handleRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleReadAll = () => {
    dispatch(
      markAllRead(userId)
    );
  };

  return (
    <>
      {/* Bell */}
      <IconButton
        onClick={(e) =>
          setAnchorEl(
            e.currentTarget
          )
        }
      >
        <Badge
          badgeContent={
            unreadCount
          }
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Menu */}
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() =>
          setAnchorEl(null)
        }
        PaperProps={{
          sx: {
            width: 350,
            maxHeight: 500,
          },
        }}
      >
        {/* Header */}
        <Box p={2}>
          <Typography variant="h6">
            Notifications
          </Typography>

          {unreadCount >
            0 && (
            <Button
              size="small"
              onClick={
                handleReadAll
              }
            >
              Mark All Read
            </Button>
          )}
        </Box>

        <Divider />

        {/* Empty */}
        {notifications
          .length ===
          0 && (
          <MenuItem>
            No Notifications
          </MenuItem>
        )}

        {/* List */}
        {notifications.map(
          (item) => (
            <MenuItem
              key={item._id}
              onClick={() =>
                handleRead(
                  item._id
                )
              }
              sx={{
                whiteSpace:
                  "normal",
                bgcolor:
                  item.read
                    ? "#fff"
                    : "#eef6ff",
                fontWeight:
                  item.read
                    ? 400
                    : 700,
              }}
            >
              {item.message}
            </MenuItem>
          )
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;