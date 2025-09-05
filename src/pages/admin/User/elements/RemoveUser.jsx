// components/User/elements/RemoveUser.js
import React from "react";
import { Typography, Box, Button } from "@mui/material";

const RemoveUser = ({ user, handleClose, onConfirm }) => {
  const isDelete = user?.action === "delete";

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        minWidth: 300,
      }}
    >
      <Typography variant="h6" mb={2}>
        Confirm {isDelete ? "Delete" : "Restore"}
      </Typography>
      <Typography mb={3}>
        Are you sure you want to {isDelete ? "delete" : "restore"} user{" "}
        <strong>{user?.name}</strong>?
      </Typography>
      <Box display="flex" justifyContent="flex-end" gap={1}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          color={isDelete ? "error" : "success"}
          onClick={onConfirm}
        >
          {isDelete ? "Delete" : "Restore"}
        </Button>
      </Box>
    </Box>
  );
};

export default RemoveUser;