import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  CircularProgress,
  Divider,
} from "@mui/material";

import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import CampaignIcon from "@mui/icons-material/Campaign";

import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const baseURL = "http://localhost:3000";
const token = localStorage.getItem("jwt");
  const navigate = useNavigate();

  // ================= STATE =================
  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    notices: 0,
  });

  const [recentNotices, setRecentNotices] =
    useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

       const [
  studentRes,
  teacherRes,
  courseRes,
  noticeRes,
] = await Promise.all([
  axios.get(
    `${baseURL}/api/student`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ),

  axios.get(
    `${baseURL}/api/teacher`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ),

  axios.get(
    `${baseURL}/api/course`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ),

  axios.get(
    `${baseURL}/api/notice`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  ),
]);

        setStats({
          students:
            studentRes.data.length,
          teachers:
            teacherRes.data.length,
          courses:
            courseRes.data.length,
          notices:
            noticeRes.data.length,
        });

        // latest notices
        const sortedNotices =
          noticeRes.data
            .sort(
              (a, b) =>
                new Date(
                  b.createdAt
                ) -
                new Date(
                  a.createdAt
                )
            )
            .slice(0, 5);

        setRecentNotices(
          sortedNotices
        );

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ================= CARD =================
  const StatCard = ({
    title,
    value,
    icon,
  }) => (
    <Paper
      sx={{
        p: 3,
        borderRadius: 4,
        height: "100%",
        boxShadow: 3,
        transition: "0.3s",
        "&:hover": {
          transform:
            "translateY(-5px)",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            {title}
          </Typography>

          <Typography
            variant="h3"
            fontWeight="bold"
            mt={1}
          >
            {value}
          </Typography>
        </Box>

        <Box
          sx={{
            bgcolor:
              "primary.main",
            color: "white",
            p: 2,
            borderRadius: 3,
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
          }}
        >
          {icon}
        </Box>
      </Box>
    </Paper>
  );

  // ================= LOADING =================
  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ================= UI =================
  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >
      {/* HEADER */}
      <Box mb={4}>
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          Admin Dashboard
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          mt={1}
        >
          Manage students,
          teachers, courses,
          and notices
        </Typography>
      </Box>

      {/* ================= STATS ================= */}
      <Grid
        container
        spacing={3}
      >
        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Students"
            value={
              stats.students
            }
            icon={
              <PeopleIcon
                fontSize="large"
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Teachers"
            value={
              stats.teachers
            }
            icon={
              <SchoolIcon
                fontSize="large"
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Courses"
            value={
              stats.courses
            }
            icon={
              <MenuBookIcon
                fontSize="large"
              />
            }
          />
        </Grid>

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <StatCard
            title="Notices"
            value={
              stats.notices
            }
            icon={
              <CampaignIcon
                fontSize="large"
              />
            }
          />
        </Grid>
      </Grid>

      {/* ================= QUICK ACTIONS ================= */}
      <Paper
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          mb={3}
        >
          Quick Actions
        </Typography>

        <Grid
          container
          spacing={2}
        >
          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 50,
              }}
              onClick={() =>
                navigate(
                  "/admin/studentlist"
                )
              }
            >
              Manage Students
            </Button>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 50,
              }}
              onClick={() =>
                navigate(
                  "/admin/teacherslist"
                )
              }
            >
              Manage Teachers
            </Button>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 50,
              }}
              onClick={() =>
                navigate(
                  "/admin/courseview"
                )
              }
            >
              Manage Courses
            </Button>
          </Grid>

          <Grid
            size={{
              xs: 12,
              sm: 6,
              md: 3,
            }}
          >
            <Button
              fullWidth
              variant="contained"
              sx={{
                height: 50,
              }}
              onClick={() =>
                navigate(
                  "/admin/notice"
                )
              }
            >
              Manage Notices
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* ================= RECENT NOTICES ================= */}
      <Paper
        sx={{
          mt: 5,
          p: 3,
          borderRadius: 4,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Recent Notices
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Latest announcements
          and notices
        </Typography>

        {recentNotices.length ===
        0 ? (
          <Typography>
            No notices found
          </Typography>
        ) : (
          recentNotices.map(
            (
              notice,
              index
            ) => (
              <Box
                key={
                  notice._id
                }
              >
                <Box
                  sx={{
                    py: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                  >
                    {notice.title ||
                      "Notice"}
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      mt: 1,
                    }}
                  >
                    {notice.description ||
                      notice.notice ||
                      "No description"}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display:
                        "block",
                      mt: 1,
                    }}
                  >
                    {new Date(
                      notice.createdAt
                    ).toLocaleString()}
                  </Typography>
                </Box>

                {index !==
                  recentNotices.length -
                    1 && (
                  <Divider />
                )}
              </Box>
            )
          )
        )}
      </Paper>
    </Container>
  );
};

export default AdminDashboard;