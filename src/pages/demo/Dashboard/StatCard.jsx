import { Box, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

const StatCard = ({ title, count, icon }) => {
  return (
    <Paper
      variant="outlined"
      sx={{ border: "none", borderRadius: 6, minHeight: 150, p: 4 }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography fontWeight={600}>{title.toUpperCase()}</Typography>
          <Typography fontSize="4rem" fontWeight={700} color="primary">
            {count}
          </Typography>
        </Box>
        <Icon
          icon={icon}
          style={{ fontSize: "6rem", color: "blue", opacity: 0.2 }}
        />
      </Box>
    </Paper>
  );
};

export default StatCard;
