import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  FormControlLabel,
  Switch,
  Button,
  Stack
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";

const NotificationSettings = () => {
  const baseURL = "http://localhost:3000";
  const token = localStorage.getItem("jwt");

  const [settings, setSettings] = useState({
    assignment: true,
    notice: true,
    attendance: true,
  });

  const fetchSettings = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/notification-settings`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSettings(res.data);
    } catch (error) {
      toast.error("Failed to load settings",error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (name) => {
    setSettings((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const saveSettings = async () => {
    try {
      await axios.put(
        `${baseURL}/api/notification-settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Settings saved");
    } catch (error) {
      toast.error("Failed to save settings");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 5, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Notification Settings
        </Typography>

        <Stack spacing={2}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.assignment}
                onChange={() =>
                  handleChange("assignment")
                }
              />
            }
            label="Assignment Alerts"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.notice}
                onChange={() =>
                  handleChange("notice")
                }
              />
            }
            label="Notice Alerts"
          />

          <FormControlLabel
            control={
              <Switch
                checked={settings.attendance}
                onChange={() =>
                  handleChange("attendance")
                }
              />
            }
            label="Attendance Alerts"
          />

          <Button
            variant="contained"
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default NotificationSettings;