import { Box, Container, Paper, Typography } from "@mui/material";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { Fragment } from "react";
import { Helmet } from "react-helmet-async";

// Meta data
const meta = {
  title: "Starter | HelioWeb Admin",
  description:
    "HelioWeb Admin Dashboard provides an overview of key metrics and charts for sales and statistics.",
  keywords: "HelioWeb, Admin, Dashboard, Sales, Statistics, Metrics",
  robots: "index, follow",
};

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Starter" },
];

const Blank = () => {
  return (
    <Fragment>
      {/* Meta Tags */}
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
      </Helmet>

      <Container maxWidth="xl" sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Starter Page
        </Typography>
        <Breadcrumbs items={breadcrumbItems} />
        <Box component="main" sx={{ mt: 4 }}>
          <Paper
            variant="outlined"
            sx={{ p: { xs: 0, md: 4 }, borderRadius: 5, border: "none" }}
          >
            {/* Page Content */}
          </Paper>
        </Box>
      </Container>
    </Fragment>
  );
};

export default Blank;
