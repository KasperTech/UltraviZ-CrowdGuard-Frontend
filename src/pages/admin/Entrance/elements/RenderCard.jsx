// components/Entrance/elements/RenderCard.js
import React from "react";
import { Typography, Box, Button, Chip } from "@mui/material";

const RenderCard = ({ row }) => {
  return (
    <Box p={2}>
      <Typography variant="h6" fontWeight={600} gutterBottom>
        {row.name}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Description:</strong> {row.description || "--"}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>Medium Threshold:</strong> {row.thresholdMedium}
      </Typography>
      <Typography variant="body2" gutterBottom>
        <strong>High Threshold:</strong> {row.thresholdHigh}
      </Typography>
      <Box mb={1}>
        <Chip 
          label={row.isActive ? "Active" : "Inactive"} 
          color={row.isActive ? "success" : "default"} 
          size="small" 
        />
        {row.isDeleted && (
          <Chip label="Deleted" color="error" size="small" sx={{ ml: 1 }} />
        )}
      </Box>
      
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