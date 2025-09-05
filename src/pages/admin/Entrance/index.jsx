import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid2 as Grid,
  TextField,
  Modal,
  Divider,
  MenuItem,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import Breadcrumbs from "../../../components/Breadcrumbs";
import Loader from "../../../components/Loader";
import ResponsiveTable from "../../../components/ResponsiveTable";
import EntranceForm from "./elements/EntranceForm";
// import DeleteRestoreModal from "./elements/DeleteRestoreModal";
import RenderCard from "./elements/RenderCard";
import { getEntrances, deleteEntrance, restoreEntrance } from "../../../services/entranceService";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Entrances" },
];

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const Entrance = () => {
  const [loading, setLoading] = useState(false);
  const [entranceData, setEntranceData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openEntranceModal, setOpenEntranceModal] = useState(false);
  const [openDeleteRestoreModal, setOpenDeleteRestoreModal] = useState(false);
  const [selectedEntrance, setSelectedEntrance] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    status: "all"
  });
  const debouncedName = useDebounce(searchTerm, 2000);

  useEffect(() => {
    setNameFilter(debouncedName);
  }, [debouncedName]);

  const fetchEntrances = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getEntrances(
        page + 1,
        limit,
        statusFilter === "all" ? "" : statusFilter === "active"
      );
      const data = res.data.map((entrance) => {
        const actions = [
          {
            label: "Edit",
            onClick: () => handleEntranceModal(entrance),
            color: "primary",
          },
        ];

        if (entrance.isDeleted) {
          actions.push({
            label: "Restore",
            onClick: () => handleDeleteRestore(entrance, "restore"),
            color: "success",
          });
        } else {
          actions.push({
            label: "Delete",
            onClick: () => handleDeleteRestore(entrance, "delete"),
            color: "error",
          });
        }

        return {
          ...entrance,
          isActive: entrance.isActive ? "Active" : "Inactive",
          createdAt: new Date(entrance.createdAt).toLocaleString(),
          updatedAt: new Date(entrance.updatedAt).toLocaleString(),
          actions,
        };
      });

      setEntranceData(data);
      setMetaData(res.metadata);
    } catch (error) {
      console.error("Error fetching entrances:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, nameFilter, statusFilter]);

  useEffect(() => {
    fetchEntrances();
  }, [fetchEntrances]);

  useEffect(() => {
    if (openFilterModal) {
      setModalFilters({
        status: statusFilter
      });
    }
  }, [openFilterModal, statusFilter]);

  const handleEntranceModal = (entrance = null) => {
    setSelectedEntrance(entrance);
    setOpenEntranceModal(true);
  };

  const handleDeleteRestore = (entrance, action) => {
    setSelectedEntrance({ ...entrance, action });
    setOpenDeleteRestoreModal(true);
  };

  const handleDeleteRestoreConfirm = async () => {
    try {
      if (selectedEntrance.action === "delete") {
        await deleteEntrance(selectedEntrance._id);
      } else {
        await restoreEntrance(selectedEntrance._id);
      }
      fetchEntrances();
      setOpenDeleteRestoreModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilterReset = () => {
    setModalFilters({
      status: "all"
    });
  };

  const handleApplyFilters = () => {
    setStatusFilter(modalFilters.status);
    setOpenFilterModal(false);
  };

  const columns = [
    { label: "Entrance Name", key: "name", sortable: true },
    { label: "Description", key: "description", sortable: true },
    { label: "Medium Threshold", key: "thresholdMedium", sortable: true },
    { label: "High Threshold", key: "thresholdHigh", sortable: true },
    { label: "Status", key: "isActive", sortable: true },
    { label: "Created At", key: "createdAt", sortable: true },
  ];

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 4 } }}>
      <Box>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Entrance Management
        </Typography>
        <Breadcrumbs items={breadcrumbItems} />
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <Paper sx={{ my: 4, p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Typography variant="h5" fontWeight={600}>
              Entrances
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 400 }}
              />
              <Button variant="contained" color="primary" onClick={() => handleEntranceModal(null)}>
                Add Entrance
              </Button>
              <IconButton onClick={() => setOpenFilterModal(true)}>
                <FilterListIcon />
              </IconButton>
            </Box>
          </Box>

          {loading ? (
            <Loader />
          ) : (
            <ResponsiveTable
              page={page}
              setPage={setPage}
              rowsPerPage={limit}
              setRowsPerPage={setLimit}
              metaData={metaData}
              data={entranceData}
              columns={columns}
              renderCard={(row) => <RenderCard row={row} />}
            />
          )}
        </Paper>
      </Box>

      <Modal open={openEntranceModal} onClose={() => setOpenEntranceModal(false)}>
        <EntranceForm
          entrance={selectedEntrance}
          handleClose={() => setOpenEntranceModal(false)}
          onSuccess={fetchEntrances}
        />
      </Modal>

      {/* <Modal open={openDeleteRestoreModal} onClose={() => setOpenDeleteRestoreModal(false)}>
        <DeleteRestoreModal
          item={selectedEntrance}
          itemType="entrance"
          handleClose={() => setOpenDeleteRestoreModal(false)}
          onConfirm={handleDeleteRestoreConfirm}
        />
      </Modal> */}

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Filter Entrances
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid item xs={12}>
              <TextField
                select
                size="medium"
                variant="outlined"
                label="Status"
                value={modalFilters.status}
                onChange={(e) => setModalFilters({ ...modalFilters, status: e.target.value })}
                fullWidth
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFilterReset}>Reset Filters</Button>
          <Button onClick={() => setOpenFilterModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleApplyFilters}>Apply Filters</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Entrance;