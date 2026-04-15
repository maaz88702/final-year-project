import React from "react";
import { Box, Skeleton, Container } from "@mui/material";

const StudentLayoutSkeleton = () => {
  return (
    <>
      <Box sx={{ height: 64, display: "flex", alignItems: "center", px: 2 }}>
        <Skeleton width={150} height={40} />
      </Box>

      <Container sx={{ mt: 4 }}>
        <Skeleton height={50} width="40%" />
        <Skeleton height={120} sx={{ mt: 2 }} />
        <Skeleton height={120} sx={{ mt: 2 }} />
      </Container>
    </>
  );
};

export default StudentLayoutSkeleton;