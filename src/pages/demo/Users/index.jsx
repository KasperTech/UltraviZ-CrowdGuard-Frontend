import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Chip,
  Grid2 as Grid,
  MenuItem,
  Select,
  TextField,
  IconButton,
  Tooltip,
  Collapse,
  FormControl,
  InputLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Icon } from "@iconify/react";

import ResponsiveTable from "../../../components/ResponsiveTable";
import Breadcrumbs from "../../../components/Breadcrumbs";

import users from "../../../data/users";
import { fetchPaginatedData } from "../../../utils/helpers";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Users" },
  { label: "List" },
];

const Users = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [metaData, setMetaData] = useState();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchField, setSearchField] = useState("name");

  // mock data fetching
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setTimeout(() => {
        const response = fetchPaginatedData(page, rowsPerPage, users);
        const data = response.data.map((user, index) => ({
          _id: user._id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          company: user.company,
          role: user.role,
          actions: [
            {
              label: "Edit",
              onClick: () => alert(`Edit ${user.name} | ${user._id}`),
              color: "primary",
            },
            {
              label: "View",
              onClick: () => alert(`View ${index + 1}`),
              color: "secondary",
              icon: <Icon icon="mdi:eye" width="1.2em" height="1.2em" />,
            },
            {
              icon: (
                <Icon
                  icon="mingcute:more-2-fill"
                  width="1.2em"
                  height="1.2em"
                />
              ),
              moreActions: [
                {
                  label: "Activate",
                  onClick: () => alert(`Activate ${user.name} | ${user._id}`),
                  color: "red",
                },
                {
                  label: "Deactivate",
                  onClick: () => alert(`Deactivate ${user.name} | ${user._id}`),
                  color: "green",
                },
              ],
            },
          ],
        }));
        setUserData(data);
        setMetaData(response.metaData);
        setLoading(false);
      }, 3000);
    };

    fetchData();
  }, [page, rowsPerPage]);

  // Column definitions for the table
  const columns = [
    { label: "Name", key: "name", sortable: true },
    { label: "Email", key: "email", sortable: true },
    { label: "Phone", key: "phone" },
    { label: "Company", key: "company" },
    {
      label: "Role",
      key: "role",
      render: (row) => <Chip label={row.role} size="small" />,
    },
  ];

  const bulkActions = [
    {
      label: "Delete Selected",
      color: "error",
      onClick: (selectedItems) =>
        alert(`Deleting ${selectedItems.length} users`),
    },
    {
      label: "Activate",
      color: "success",
      onClick: (selectedItems) =>
        alert(`Activating ${selectedItems.length} users`),
    },
  ];

  // Sorting configuration
  const sortConfig = {
    name: (a, b) => a.localeCompare(b),
    email: (a, b) => a.localeCompare(b),
  };

  // Handling row selection
  const handleSelection = (selectedItems) => {
    console.log("Selected Items:", selectedItems);
  };

  // Function to render cards for mobile view
  const renderCard = (row) => (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Typography variant="h6">{row.name}</Typography>
        <Typography fontSize="0.75rem">{row.company}</Typography>
      </Grid>
      <Grid item xs={6} textAlign="right">
        <Typography fontSize="0.75rem">{row.phone}</Typography>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Typography fontSize="0.75rem">Email: {row.email}</Typography>
      </Grid>
      <Grid item xs={12} mt={2}>
        <Chip label={row.role} size="small" />
      </Grid>
      <Grid item xs={12} mt={2}>
        {row.actions.map((action, index) =>
          action.label ? (
            <Button
              key={index}
              variant="contained"
              color={action.color || "primary"}
              onClick={action.onClick}
              sx={{ margin: 0.5 }}
              startIcon={action.icon && action.icon}
            >
              {action.label}
            </Button>
          ) : (
            <>
              {action.moreActions.map((item, i) => (
                <Button
                  key={i}
                  onClick={() => {
                    item.onClick();
                    setAnchorEl(null);
                  }}
                  sx={{
                    background: item.color && item.color,
                    color: "white",
                    m: 0.5,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </>
          )
        )}
      </Grid>
    </Grid>
  );

  return (
    <Container maxWidth={1200} sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        User Details
      </Typography>
      <Breadcrumbs items={breadcrumbItems} />
      <Box component="main" sx={{ mt: 4 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 0, md: 4 },
            borderRadius: 5,
            border: "none",
          }}
        >
          {/* Search Field */}
          <Grid container spacing={2} mb={3} mx={{ xs: 3, md: 0 }}>
            <Grid size={{ xs: 8, md: 6 }}>
              <Box display="flex" alignItems="center" mt={4}>
                <FormControl sx={{ minWidth: 120, mr: { xs: 2, md: 0 } }}>
                  <InputLabel>Search By</InputLabel>
                  <Select
                    size="small"
                    value={searchField}
                    label="Search By"
                    onChange={(e) => setSearchField(e.target.value)}
                  >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="email">Email</MenuItem>
                    <MenuItem value="company">Company</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  variant="outlined"
                  label={`Search ${searchField}`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ width: 300 }}
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 4, md: 6 }} sx={{ textAlign: "right" }}>
              <Tooltip title="Filter" sx={{ mt: 4, ml: { xs: 2, md: 0 } }}>
                <IconButton>
                  <FilterListIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>

          {/* Table */}
          <Box sx={{ mx: { xs: 0, md: -4 } }}>
            <ResponsiveTable
              page={page}
              setPage={setPage}
              rowsPerPage={rowsPerPage}
              setRowsPerPage={setRowsPerPage}
              metaData={metaData}
              loading={loading}
              data={userData}
              columns={columns}
              renderCard={renderCard}
              selectable
              multiSelect
              onSelect={handleSelection}
              sortConfig={sortConfig}
              bulkActions={bulkActions}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Users;
