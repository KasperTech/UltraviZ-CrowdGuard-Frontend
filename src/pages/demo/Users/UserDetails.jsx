import { Box, Container, Paper, Typography } from "@mui/material";
import Breadcrumbs from "../../../components/Breadcrumbs";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Users" },
  { label: "Details" },
];

const UserDetails = () => {
  return (
    <Container maxWidth="xl" sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        User Details
      </Typography>
      <Breadcrumbs items={breadcrumbItems} />
      <Box component="main" sx={{ mt: 4 }}>
        <Paper variant="outlined" sx={{ p: { xs: 0, md: 2 } }}></Paper>
      </Box>
    </Container>
  );
};

export default UserDetails;
