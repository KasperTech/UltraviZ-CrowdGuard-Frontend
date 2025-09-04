import { Fragment } from "react";
import {
  Container,
  Grid2 as Grid,
  Paper,
  styled,
  Typography,
} from "@mui/material";
import { Helmet } from "react-helmet-async";

import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";

import StatCard from "./StatCard";

import { stats } from "../../../data/dashboard";
import { LineChart } from "@mui/x-charts/LineChart";

const StyledText = styled("text")(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: "middle",
  dominantBaseline: "central",
  fontSize: 20,
  fontFamily: theme.typography.fontFamily,
}));

function PieCenterLabel({ children }) {
  const { width, height, left, top } = useDrawingArea();
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  );
}

// Meta data
const meta = {
  title: "Dashboard | HelioWeb Admin",
  description:
    "HelioWeb Admin Dashboard provides an overview of key metrics and charts for sales and statistics.",
  keywords: "HelioWeb, Admin, Dashboard, Sales, Statistics, Metrics",
  robots: "index, follow",
};

const Dashboard = () => {
  const pieChartData = [
    {
      innerRadius: 60,
      outerRadius: 80,
      cornerRadius: 5,
      data: [
        { label: "Kids", value: 50, color: "blue" },
        { value: 350, color: "lightgrey" },
      ],
    },
    {
      innerRadius: 90,
      outerRadius: 110,
      cornerRadius: 5,
      data: [
        { label: "Male", value: 100, color: "orange" },
        { value: 350, color: "lightgrey" },
      ],
    },
    {
      innerRadius: 120,
      outerRadius: 140,
      cornerRadius: 5,
      data: [
        { label: "Female", value: 200, color: "red" },
        { value: 350, color: "lightgrey" },
      ],
    },
  ];

  const lineChartData = [
    {
      data: [4000, 3000, 2000, 2780, 1890, 2390, 3490],
      label: "Expense",
      color: "red",
    },
    {
      data: [2400, 1398, 9800, 3908, 4800, 3800, 4300],
      label: "Income",
      color: "green",
    },
  ];

  const xAxisData = [
    {
      scaleType: "point",
      data: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    },
  ];

  return (
    <Fragment>
      {/* Meta Tags */}
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
      </Helmet>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ p: 4 }}>
        <Grid container spacing={3}>
          {/* Stats */}
          {stats.map((stat, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={i}>
              <StatCard
                title={stat.title}
                count={stat.count}
                icon={stat.icon}
              />
            </Grid>
          ))}
          {/* Charts */}
          <Grid size={{ xs: 12, lg: 6, xl: 4 }}>
            <Paper
              variant="outlined"
              sx={{
                border: "none",
                borderRadius: 6,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                width: "100%",
                height: 400,
              }}
            >
              <Typography variant="h5" fontWeight={500}>
                Sale by gender
              </Typography>
              <PieChart
                height={400}
                series={pieChartData}
                slotProps={{
                  legend: { hidden: true },
                }}
              >
                <PieCenterLabel>Total 350</PieCenterLabel>
              </PieChart>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, lg: 6, xl: 8 }}>
            <Paper
              variant="outlined"
              sx={{
                border: "none",
                borderRadius: 6,
                p: 4,
                display: "flex",
                flexDirection: "column",
                alignContent: "center",
                justifyContent: "center",
                width: "100%",
                height: 400,
              }}
            >
              <Typography variant="h5" fontWeight={500}>
                Yearly Sales
              </Typography>
              <LineChart series={lineChartData} xAxis={xAxisData} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fragment>
  );
};

export default Dashboard;
