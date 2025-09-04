import { ArrowBack } from "@mui/icons-material";
import { Box, Button, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
        <Typography variant="h1" fontWeight={700} color="error">
          404
        </Typography>
        <Typography variant="h3">Page not found!</Typography>
        <Button
          size="large"
          startIcon={<ArrowBack />}
          component={Link}
          to="/admin"
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
