import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  IconButton,
  Tooltip,
  Badge,
  TextField,
  Button,
  Menu,
  MenuItem
} from "@mui/material";
import React, { Fragment, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../../components/Breadcrumbs";
import StatCard from "../../../components/StatCard";
import { getCameras } from "../../../services/cameraService";
import FilterListIcon from "@mui/icons-material/FilterList";
import Cached from "@mui/icons-material/Cached";
import { APIProvider, Map, AdvancedMarker, InfoWindow } from "@vis.gl/react-google-maps";
import brand from "../../../data/brand";

// Meta data
const meta = {
  title: "Cameras | KasperTech Admin",
  description: "Manage and monitor all camera devices in your system",
  keywords: "KasperTech, Admin, Cameras, Monitoring, Devices",
  robots: "index, follow",
};

const breadcrumbItems = [
  { label: "Dashboard", link: "/admin" },
  { label: "Cameras" },
];

const CameraMapComponent = ({ cameras, center }) => {
  const [clickedCamera, setClickedCamera] = useState(null);

  const StatusSymbol = ({ camera }) => (
    <Box
      sx={{
        width: 16,
        height: 16,
        backgroundColor: camera.isActive ? "#4caf50" : "#f44336",
        position: "absolute",
        top: 0,
        right: 0,
        borderRadius: "50%",
        border: "2px solid white",
      }}
    />
  );

  const InfoCard = ({ camera }) => (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        <b>Status:</b> {camera.isActive ? "Online" : "Offline"}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <b>Device ID:</b> {camera.deviceId}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <b>Entrance:</b> {camera.entrance?.name || "N/A"}
      </Typography>
      <Typography variant="subtitle2" color="text.secondary">
        <b>IP Address:</b> {camera.ipAddress || "N/A"}
      </Typography>
      {camera.streamUrl && (
        <Button
          variant="outlined"
          size="small"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => window.open(camera.streamUrl, "_blank")}
        >
          View Stream
        </Button>
      )}
    </Box>
  );

  const PointTitle = ({ camera }) => (
    <Typography variant="body2" fontWeight={600}>
      {camera.name}
    </Typography>
  );

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <Box sx={{ width: "100%", height: "70vh", borderRadius: 2, overflow: "hidden" }}>
        <Map
          defaultZoom={15}
          defaultCenter={center}
          mapId={import.meta.env.VITE_GOOGLE_MAPS_ID}
          style={{ height: "100%", width: "100%" }}
        >
          {cameras.map((camera, index) => (
            camera.location?.latitude && camera.location?.longitude && (
              <AdvancedMarker
                key={index}
                position={{
                  lat: Number(camera.location.latitude),
                  lng: Number(camera.location.longitude),
                }}
                onClick={() => setClickedCamera(index)}
              >
                <Box
                  sx={{
                    position: "relative",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    // backgroundColor: "white",
                    borderRadius: "50%",
                    // boxShadow: 2,
                  }}
                >
                  <Box
                    component="img"
                    src={brand.icon}
                    alt="Camera"
                    sx={{ width: 40, height: 40, }}
                  />
                  <StatusSymbol camera={camera} />
                </Box>
              </AdvancedMarker>
            )
          ))}

          {clickedCamera !== null && cameras[clickedCamera] && (
            <InfoWindow
              position={{
                lat: Number(cameras[clickedCamera].location.latitude),
                lng: Number(cameras[clickedCamera].location.longitude),
              }}
              onCloseClick={() => setClickedCamera(null)}
            >
              <Box>
                <PointTitle camera={cameras[clickedCamera]} />
                <InfoCard camera={cameras[clickedCamera]} />
              </Box>
            </InfoWindow>
          )}
        </Map>
      </Box>
    </APIProvider>
  );
};

const Blank = () => {
  const [cameras, setCameras] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [offlineCount, setOfflineCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCount, setFilterCount] = useState(0);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [center, setCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // Default to India center

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        setLoading(true);
        const response = await getCameras(1, 500, "", "", "");
        setCameras(response.data || []);

        // Calculate online/offline counts
        const online = response.data.filter(camera => camera.isActive).length;
        const offline = response.data.length - online;

        setOnlineCount(online);
        setOfflineCount(offline);

        // Set map center based on first camera with location data
        const cameraWithLocation = response.data.find(c => c.location?.latitude && c.location?.longitude);
        if (cameraWithLocation) {
          setCenter({
            lat: Number(cameraWithLocation.location.latitude),
            lng: Number(cameraWithLocation.location.longitude)
          });
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCameras();
  }, []);

  const filteredCameras = cameras.filter(camera => {
    // Filter by search query
    const matchesSearch = camera.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      camera.deviceId.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by status
    const matchesStatus = statusFilter === "all" ||
      (statusFilter === "online" && camera.isActive) ||
      (statusFilter === "offline" && !camera.isActive);

    return matchesSearch && matchesStatus;
  });

  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setFilterCount(status === "all" ? 0 : 1);
    handleFilterClose();
  };

  const refreshData = async () => {
    try {
      setLoading(true);
      const response = await getCameras(1, 500, "", "", "");
      setCameras(response.data || []);

      const online = response.data.filter(camera => camera.isActive).length;
      const offline = response.data.length - online;

      setOnlineCount(online);
      setOfflineCount(offline);
    } catch (error) {
      console.error("Error refreshing cameras:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      {/* Meta Tags */}
      <Helmet>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <meta name="robots" content={meta.robots} />
      </Helmet>

      <Container maxWidth={1200} sx={{ p: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={2}>
          Camera Management
        </Typography>
        <Breadcrumbs items={breadcrumbItems} />

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mt: 2, backgroundColor: "secondary" }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Cameras"
              count={cameras.length}
              icon="mdi:camera"
              iconColor="#2196f3"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Online Cameras"
              count={onlineCount}
              icon="mdi:check-circle"
              iconColor="#4caf50"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Offline Cameras"
              count={offlineCount}
              icon="mdi:alert-circle"
              iconColor="#f44336"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="With Location"
              count={cameras.filter(c => c.location?.latitude && c.location?.longitude).length}
              icon="mdi:map-marker"
              iconColor="#ff9800"
            />
          </Grid>
        </Grid>

        {/* Map Section */}
        <Paper variant="outlined" sx={{ p: 4, borderRadius: 5, border: "none", mt: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Camera Locations
            </Typography>

            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <TextField
                label="Search Cameras"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ width: 200 }}
              />

              <Badge badgeContent={filterCount} color="secondary">
                <Tooltip title="Filter">
                  <IconButton onClick={handleFilterClick}>
                    <FilterListIcon />
                  </IconButton>
                </Tooltip>
              </Badge>

              <Menu
                anchorEl={filterAnchorEl}
                open={Boolean(filterAnchorEl)}
                onClose={handleFilterClose}
              >
                <MenuItem
                  onClick={() => handleStatusFilter("all")}
                  selected={statusFilter === "all"}
                >
                  All Cameras
                </MenuItem>
                <MenuItem
                  onClick={() => handleStatusFilter("online")}
                  selected={statusFilter === "online"}
                >
                  Online Only
                </MenuItem>
                <MenuItem
                  onClick={() => handleStatusFilter("offline")}
                  selected={statusFilter === "offline"}
                >
                  Offline Only
                </MenuItem>
              </Menu>

              <Tooltip title="Refresh">
                <IconButton onClick={refreshData}>
                  <Cached />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              <Typography>Loading cameras...</Typography>
            </Box>
          ) : filteredCameras.length > 0 ? (
            <CameraMapComponent cameras={filteredCameras} center={center} />
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "400px" }}>
              <Typography variant="h6" color="textSecondary">
                No cameras found matching your criteria
              </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </Fragment>
  );
};

export default Blank;