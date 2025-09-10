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
import CameraForm from "./elements/CameraForm";
import DeleteRestoreModal from "./elements/DeleteRestoreModal";
import RenderCard from "./elements/RenderCard";
import { getCameras, deleteCamera, restoreCamera } from "../../../services/cameraService";
import { getEntrances } from "../../../services/entranceService";
import { useNavigate } from "react-router-dom";

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Cameras" },
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

const Camera = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [cameraData, setCameraData] = useState([]);
  const [metaData, setMetaData] = useState({});
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [deviceIdFilter, setDeviceIdFilter] = useState("");
  const [entranceFilter, setEntranceFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openCameraModal, setOpenCameraModal] = useState(false);
  const [openDeleteRestoreModal, setOpenDeleteRestoreModal] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [modalFilters, setModalFilters] = useState({
    entrance: "",
    status: "all"
  });
  const [entrances, setEntrances] = useState([]);
  const debouncedDeviceId = useDebounce(searchTerm, 2000);

  useEffect(() => {
    setDeviceIdFilter(debouncedDeviceId);
  }, [debouncedDeviceId]);

  const fetchCameras = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getCameras(
        page + 1,
        limit,
        deviceIdFilter,
        entranceFilter,
        statusFilter === "all" ? "" : statusFilter === "active"
      );
      const data = res.data.map((camera) => {
        const actions = [
          {
            label: "View",
            onClick: () => navigate(`/admin/cameras/view/${camera._id}`, {
              state: { camera }
            }),
            color: "secondary",
          },
          {
            label: "Edit",
            onClick: () => handleCameraModal(camera),
            color: "primary",
          },
        ];

        if (camera.isDeleted) {
          actions.push({
            label: "Restore",
            onClick: () => handleDeleteRestore(camera, "restore"),
            color: "success",
          });
        } else {
          actions.push({
            label: "Delete",
            onClick: () => handleDeleteRestore(camera, "delete"),
            color: "error",
          });
        }



        return {
          ...camera,
          entranceId: camera?.entrance?.name || "--",
          isActive: camera.isActive ? "Active" : "Inactive",
          createdAt: new Date(camera.createdAt).toLocaleString(),
          updatedAt: new Date(camera.updatedAt).toLocaleString(),
          actions,
        };
      });

      setCameraData(data);
      setMetaData(res.metadata);
    } catch (error) {
      console.error("Error fetching cameras:", error);
    } finally {
      setLoading(false);
    }
  }, [page, limit, deviceIdFilter, entranceFilter, statusFilter]);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  useEffect(() => {
    if (openFilterModal) {
      setModalFilters({
        entrance: entranceFilter,
        status: statusFilter
      });
    }
  }, [openFilterModal, entranceFilter, statusFilter]);

  useEffect(() => {
    const fetchEntrances = async () => {
      try {
        const res = await getEntrances();
        setEntrances(res.data);
      } catch (error) {
        console.error("Error fetching entrances:", error);
      }
    };
    fetchEntrances();
  }, []);

  const handleCameraModal = (camera = null) => {
    setSelectedCamera(camera);
    setOpenCameraModal(true);
  };

  const handleDeleteRestore = (camera, action) => {
    setSelectedCamera({ ...camera, action });
    setOpenDeleteRestoreModal(true);
  };

  const handleDeleteRestoreConfirm = async () => {
    try {
      if (selectedCamera.action === "delete") {
        await deleteCamera(selectedCamera._id);
      } else {
        await restoreCamera(selectedCamera._id);
      }
      fetchCameras();
      setOpenDeleteRestoreModal(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleFilterReset = () => {
    setModalFilters({
      entrance: "",
      status: "all"
    });
  };

  const handleApplyFilters = () => {
    setEntranceFilter(modalFilters.entrance);
    setStatusFilter(modalFilters.status);
    setOpenFilterModal(false);
  };

  const columns = [
    { label: "Camera Name", key: "name", sortable: true },
    { label: "Device ID", key: "deviceId", sortable: true },
    { label: "Entrance", key: "entranceId", sortable: true },
    { label: "IP Address", key: "ipAddress", sortable: true },
    { label: "Status", key: "isActive", sortable: true, format: (value) => value ? "Active" : "Inactive" },
    { label: "Created At", key: "createdAt", sortable: true },
  ];

  return (
    <Container maxWidth={1200} sx={{ p: { xs: 2, sm: 4 } }}>
      <Box>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Camera Management
        </Typography>
        <Breadcrumbs items={breadcrumbItems} />
        <Divider style={{ marginTop: 16, marginBottom: 16 }} />

        <Paper sx={{ my: 4, p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 3, mb: 2, flexDirection: { xs: "column", sm: "row" } }}>
            <Typography variant="h5" fontWeight={600}>
              Cameras
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexDirection: { xs: "column", sm: "row" } }}>
              <TextField
                size="small"
                variant="outlined"
                placeholder="Search by Device ID"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: 400 }}
              />
              <Button variant="contained" color="primary" onClick={() => handleCameraModal(null)}>
                Add Camera
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
              data={cameraData}
              columns={columns}
              renderCard={(row) => <RenderCard row={row} />}
            />
          )}
        </Paper>
      </Box>

      <Modal open={openCameraModal} onClose={() => setOpenCameraModal(false)}>
        <CameraForm
          camera={selectedCamera}
          entrances={entrances}
          handleClose={() => setOpenCameraModal(false)}
          onSuccess={fetchCameras}
        />
      </Modal>

      <Modal open={openDeleteRestoreModal} onClose={() => setOpenDeleteRestoreModal(false)}>
        <DeleteRestoreModal
          item={selectedCamera}
          itemType="camera"
          handleClose={() => setOpenDeleteRestoreModal(false)}
          onConfirm={handleDeleteRestoreConfirm}
        />
      </Modal>

      <Dialog open={openFilterModal} onClose={() => setOpenFilterModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight={600}>
            Filter Cameras
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ flexDirection: "column" }}>
            <Grid item xs={12}>
              <TextField
                size="medium"
                variant="outlined"
                label="Filter by Entrance ID"
                value={modalFilters.entrance}
                onChange={(e) => setModalFilters({ ...modalFilters, entrance: e.target.value })}
                fullWidth
              />
            </Grid>
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

export default Camera;