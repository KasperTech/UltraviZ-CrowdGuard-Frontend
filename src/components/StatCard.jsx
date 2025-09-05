import { Box, IconButton, Paper, Typography } from "@mui/material";
import { Icon } from "@iconify/react";

const StatCard = ({ title, count, icon, iconColor, action, handleAction }) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        border: "none",
        borderRadius: 3,
        maxHeight: 110,
        p: 4,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography fontWeight={600} sx={{ fontSize: "1rem", mb: 1 }}>
          {title.toUpperCase()}
        </Typography>
        <Typography
          fontSize="2rem"
          fontWeight={700}
          color="primary"
          sx={{ lineHeight: 1.2 }}
        >
          {count}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "end",
          mt: 2,
        }}
      >
        {action ? (
          <IconButton aria-label="icon" size="small" onClick={handleAction}>
            <Icon
              icon={icon}
              style={{
                fontSize: "4rem",
                color: iconColor,
                opacity: 0.2,
              }}
            />
          </IconButton>
        ) : (
          <Icon
            icon={icon}
            style={{
              fontSize: "4rem",
              color: iconColor,
              opacity: 0.2,
            }}
          />
        )}
      </Box>
    </Paper>
  );
};

export default StatCard;
