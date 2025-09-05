import { Box, CircularProgress } from "@mui/material";

const Loader = ({height, width}) => {
  return (
    <Box
      sx={{
        height: height || "100vh",
        width: width || "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size="2rem" />
    </Box>
  );
};

export default Loader;
