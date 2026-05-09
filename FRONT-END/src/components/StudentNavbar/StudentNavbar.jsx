import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotificationBell from "../NotificationBell/NotificationBell";

const StudentNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let studentName = "Student";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      studentName = decoded.studentName || "Student";
    } catch (err) {
      console.error(err);
    }
  }

  // ================= ACTIVE ROUTE =================
  const isActive = (path) => location.pathname === path;

  const navItems = [
    // { label: "home", path: "/" },
    { label: "Dashboard", path: "/student/dashboard" },
    { label: "Submit Assignment", path: "/student/assignmentsubmit" },
    { label: "Notice Board", path: "/student/noticeboard" },
    { label: "Assignments", path: "/student/assignments" },
    { label: "My Grades", path: "/student/grades" },
  ];

  // ================= MOBILE DRAWER =================
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };

  // ================= PROFILE MENU =================
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/student/login");
  };

  // ================= UI =================
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#1976d2" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          
          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            
            {/* ☰ Mobile Menu */}
            <IconButton
              color="inherit"
              edge="start"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/student/dashboard")}
            >
              Student Panel
            </Typography>
          </Box>

          {/* CENTER (Desktop only) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  borderBottom: isActive(item.path)
                    ? "2px solid white"
                    : "none",
                  borderRadius: 0,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* RIGHT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <NotificationBell />

            <Avatar
              sx={{ bgcolor: "#fff", color: "#1976d2", cursor: "pointer" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {studentName.charAt(0).toUpperCase()}
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>{studentName}</MenuItem>

              {/* <MenuItem onClick={() => navigate("/student/profile")}>
                Profile
              </MenuItem> */}

              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>

      {/* 📱 MOBILE DRAWER */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 250 }} onClick={toggleDrawer(false)}>
          <List>
            {navItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => navigate(item.path)}
                selected={isActive(item.path)}
              >
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default StudentNavbar;