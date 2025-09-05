// components/User/elements/RenderCard.js
import React from "react";
import { Typography, Box, Button } from "@mui/material";

const RenderCard = ({ row }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {row.name}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Email:</strong> {row.email}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Phone:</strong> {row.phoneNo}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Role:</strong> {row.role}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Status:</strong> {row.isDeleted ? "Deleted" : "Active"}
      </Typography>
      
      <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
        {row.actions?.map((action, index) => (
          <Button
            key={index}
            variant="contained"
            color={action.color}
            onClick={action.onClick}
            size="small"
          >
            {action.label}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default RenderCard;