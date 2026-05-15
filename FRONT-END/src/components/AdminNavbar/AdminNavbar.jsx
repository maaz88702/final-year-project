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

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let adminName = "Admin";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      adminName = decoded.adminName || "Admin";
    } catch (err) {
      console.error(err);
    }
  }

  // ================= ACTIVE ROUTE =================
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Students", path: "/admin/studentlist" },
    { label: "Teachers", path: "/admin/teacherslist" },
    { label: "Courses", path: "/admin/courseview" },
    // { label: "Assignments", path: "/admin/assignments" },
    { label: "Notices", path: "/admin/notice" },
    { label: "Semesters", path: "/admin/semesterview" },
    // { label: "Submissions", path: "/admin/submissions" },
  ];

  // ================= DRAWER =================
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
  };

  // ================= PROFILE =================
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/admin/login");
  };

  // ================= UI =================
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#6a1b9a" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LEFT */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

            {/* ☰ Mobile */}
            <IconButton
              color="inherit"
              sx={{ display: { xs: "block", md: "none" } }}
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              sx={{ cursor: "pointer", fontWeight: "bold" }}
              onClick={() => navigate("/admin/dashboard")}
            >
              Admin Panel
            </Typography>
          </Box>

          {/* CENTER (Desktop) */}
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

            {/* 🔔 Notifications */}
            {/* <NotificationBell /> */}

            {/* 👤 Profile */}
            <Avatar
              sx={{ bgcolor: "#fff", color: "#6a1b9a", cursor: "pointer" }}
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              {adminName.charAt(0).toUpperCase()}
            </Avatar>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>{adminName}</MenuItem>

              {/* <MenuItem onClick={() => navigate("/admin/profile")}>
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

export default AdminNavbar;