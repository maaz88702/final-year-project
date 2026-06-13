import React, { useState ,useMemo} from "react";
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
  Collapse,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import NotificationBell from "../NotificationBell/NotificationBell";

const TeacherNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ================= JWT =================
  const token = localStorage.getItem("jwt");
  let teacherName = "Teacher";

  if (token) {
    try {
      const decoded = jwtDecode(token);
      teacherName = decoded.teacherName || "Teacher";
    } catch (err) {
      console.error(err);
    }
  }

  // ================= ACTIVE ROUTE CHECKER =================
  const isActive = (path) => location.pathname === path;

  // Checks if any route inside the dropdown list is currently open
  const isAssignmentDropdownActive = useMemo(() => {
    const dropdownPaths = [
      "/teacher/addassignment",
      "/teacher/add-grade",
      "/teacher/AssignmentSubmittedList",
      "/teacher/assignmentrecord"
    ];
    return dropdownPaths.some(path => location.pathname === path);
  }, [location.pathname]);

  // ================= TOP LEVEL NAV ITEMS =================
  const primaryNavItems = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Attendance", path: "/teacher/attendance" },
    { label: "Attendance View", path: "/teacher/attendanceview" },
    { label: "StudentGrades", path: "/teacher/StudentGrades" },
  ];

  // ================= DROPDOWN ASSIGNMENT SUB-ITEMS =================
  const assignmentDropdownItems = [
    { label: "Post Assignment", path: "/teacher/addassignment" },
    { label: "Grade Assignment", path: "/teacher/add-grade" },
    { label: "Assignment Submitted", path: "/teacher/AssignmentSubmittedList" },
    { label: "Assignment View", path: "/teacher/assignmentrecord" },
    { label: "Assignment List", path: "/teacher/teacherassignmentlist" }
  ];

  // ================= MOBILE DRAWER STATES =================
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);

  const toggleDrawer = (state) => () => {
    setDrawerOpen(state);
    if (!state) setMobileDropdownOpen(false); // Reset dropdown when closing
  };

  const handleMobileDropdownToggle = (e) => {
    e.stopPropagation(); // Stop parent layout click tracking from closing drawer instantly
    setMobileDropdownOpen(!mobileDropdownOpen);
  };

  // ================= DESKTOP DROPDOWN STATE =================
  const [assignmentAnchorEl, setAssignmentAnchorEl] = useState(null);
  const isDropdownOpen = Boolean(assignmentAnchorEl);

  const handleDropdownOpen = (event) => {
    setAssignmentAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAssignmentAnchorEl(null);
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    handleDropdownClose();
  };

  // ================= PROFILE MENU =================
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    navigate("/teacher/login");
  };

  // ================= UI =================
  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#2e7d32" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

          {/* LEFT SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* ☰ Mobile Menu Trigger Button */}
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
              onClick={() => navigate("/teacher/dashboard")}
            >
              Teacher Panel
            </Typography>
          </Box>

          {/* CENTER NAVIGATION (Desktop only layout) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
            
            {/* Base item link buttons */}
            <Button
              color="inherit"
              onClick={() => navigate("/teacher/dashboard")}
              sx={{
                borderBottom: isActive("/teacher/dashboard") ? "2px solid white" : "none",
                borderRadius: 0,
                fontSize: "0.75rem"
              }}
            >
              Dashboard
            </Button>

            {/* Assignments Category Dropdown Button */}
            <Button
              color="inherit"
              onClick={handleDropdownOpen}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{
                borderBottom: isAssignmentDropdownActive ? "2px solid white" : "none",
                borderRadius: 0,
                fontSize: "0.75rem"
              }}
            >
              Assignments
            </Button>

            {/* Desktop Popover Dropdown Anchored Overlay Menu Component */}
            <Menu
              anchorEl={assignmentAnchorEl}
              open={isDropdownOpen}
              onClose={handleDropdownClose}
              disableScrollLock={true}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {assignmentDropdownItems.map((subItem) => (
                <MenuItem
                  key={subItem.path}
                  onClick={() => handleDropdownItemClick(subItem.path)}
                  selected={isActive(subItem.path)}
                  sx={{ fontSize: "0.85rem" }}
                >
                  {subItem.label}
                </MenuItem>
              ))}
            </Menu>

            {/* Render Remaining Top-Level Link Controls */}
            {primaryNavItems.slice(1).map((item) => (
              <Button
                key={item.path}
                color="inherit"
                onClick={() => navigate(item.path)}
                sx={{
                  borderBottom: isActive(item.path) ? "2px solid white" : "none",
                  borderRadius: 0,
                  fontSize: "0.75rem"
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* RIGHT PROFILE SECTION */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {/* <NotificationBell /> */}

            <Avatar
              sx={{ bgcolor: "#fff", color: "#2e7d32", cursor: "pointer" }}
              onClick={(e) => setProfileAnchorEl(e.currentTarget)}
            >
              {teacherName.charAt(0).toUpperCase()}
            </Avatar>

            <Menu
              anchorEl={profileAnchorEl}
              open={Boolean(profileAnchorEl)}
              onClose={() => setProfileAnchorEl(null)}
            >
              <MenuItem disabled>{teacherName}</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>

        </Toolbar>
      </AppBar>

      {/* 📱 MOBILE SIDE DRAWER PANEL */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box sx={{ width: 260 }}>
          <List component="nav">
            
            {/* Dashboard Link Option */}
            <ListItemButton
              onClick={() => { navigate("/teacher/dashboard"); setDrawerOpen(false); }}
              selected={isActive("/teacher/dashboard")}
            >
              <ListItemText primary="Dashboard" />
            </ListItemButton>

            {/* Collapsible Mobile Drawer Segment Trigger Link */}
            <ListItemButton onClick={handleMobileDropdownToggle}>
              <ListItemText primary="Assignments" />
              {mobileDropdownOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            {/* Nested Sub-List Drawer Child Links Wrapper */}
            <Collapse in={mobileDropdownOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {assignmentDropdownItems.map((subItem) => (
                  <ListItemButton
                    key={subItem.path}
                    sx={{ pl: 4 }}
                    onClick={() => { navigate(subItem.path); setDrawerOpen(false); }}
                    selected={isActive(subItem.path)}
                  >
                    <ListItemText 
                      primary={subItem.label} 
                      primaryTypographyProps={{ fontSize: '0.9rem' }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            {/* Standard Remainder Mobile Drawer Menu Row Options */}
            {primaryNavItems.slice(1).map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => { navigate(item.path); setDrawerOpen(false); }}
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

export default TeacherNavbar;