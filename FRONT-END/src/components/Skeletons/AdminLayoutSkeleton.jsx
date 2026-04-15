import React from "react";
import { Box, Skeleton, Container, Grid } from "@mui/material";

const AdminLayoutSkeleton = () => {
  return (
    <>
      {/* Navbar Skeleton */}
      <Box
        sx={{
          height: 64,
          px: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: 1,
        }}
      >
        <Skeleton variant="text" width={150} height={40} />
        <Box sx={{ display: "flex", gap: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={80} height={30} />
        </Box>
      </Box>

      {/* Content Skeleton */}
      <Container sx={{ mt: 4 }}>
        {/* Page Title */}
        <Skeleton variant="text" width="40%" height={50} />

        {/* Cards */}
        <Grid container spacing={3} sx={{ mt: 1 }}>
          {[1, 2, 3].map((item) => (
            <Grid key={item} size={{ xs: 12, md: 4 }}>
              <Skeleton
                variant="rectangular"
                height={120}
                sx={{ borderRadius: 3 }}
              />
            </Grid>
          ))}
        </Grid>

        {/* Table/List Skeleton */}
        <Box sx={{ mt: 4 }}>
          {[1, 2, 3, 4].map((row) => (
            <Skeleton
              key={row}
              variant="rectangular"
              height={50}
              sx={{ mb: 1, borderRadius: 2 }}
            />
          ))}
        </Box>
      </Container>
    </>
  );
};

export default AdminLayoutSkeleton;