import React from "react";
import { Box, Skeleton, Container, Grid } from "@mui/material";

const TeacherLayoutSkeleton = () => {
  return (
    <>
      {/* Navbar Skeleton */}
      <Box
        sx={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          boxShadow: 1,
        }}
      >
        <Skeleton width={140} height={40} />
        <Skeleton variant="circular" width={40} height={40} />
      </Box>

      {/* Content */}
      <Container sx={{ mt: 4 }}>
        <Skeleton width="30%" height={40} />

        <Grid container spacing={2} sx={{ mt: 2 }}>
          {[1, 2, 3].map((i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 4 }}>
          {[1, 2, 3].map((i) => (
            <Skeleton
              key={i}
              height={50}
              sx={{ mb: 1, borderRadius: 2 }}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default TeacherLayoutSkeleton;