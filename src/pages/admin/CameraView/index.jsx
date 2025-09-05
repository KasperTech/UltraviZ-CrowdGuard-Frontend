import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";

const CameraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [camera, setCamera] = useState(location.state?.camera || null);
  const [loading, setLoading] = useState(!location.state?.camera);
  const [error, setError] = useState("");
  const [streamError, setStreamError] = useState(false);

  useEffect(() => {
    if (!location.state?.camera) {
      // If camera data wasn't passed, fetch it
      fetchCameraData();
    }
  }, [id]);

  const fetchCameraData = async () => {
    try {
      setLoading(true);
      // You'll need to import and use getCamera function if needed
      // const cameraRes = await getCamera(id);
      // setCamera(cameraRes);

      // For now, just set an error since we don't have the function
      setError("Camera data not available. Please navigate from the cameras list.");
    } catch (error) {
      console.error("Error fetching camera:", error);
      setError("Failed to load camera details");
    } finally {
      setLoading(false);
    }
  };

  const handleStreamError = () => {
    setStreamError(true);
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Cameras", link: "/admin/cameras" },
    { label: camera?.name || "Camera Details" },
  ];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 4 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !camera) {
    return (
      <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 4 } }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || "Camera not found"}
        </Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/admin/cameras")}>
          Back to Cameras
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 4 } }}>
      <Box sx={{ mb: 3 }}>
        {/* <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/cameras")}
          sx={{ mb: 2 }}
        >
          Back to Cameras
        </Button> */}
        <Breadcrumbs items={breadcrumbItems} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          {camera.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Live Stream Section */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Stream
              </Typography>
              <IconButton onClick={fetchCameraData} size="small">
                <RefreshIcon />
              </IconButton>
            </Box>
            <Divider sx={{ mb: 2 }} />

            {streamError ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                Unable to load video stream. Please check the stream URL.
              </Alert>
            ) : null}

            <Box
              sx={{
                position: "relative",
                paddingTop: "56.25%", // 16:9 aspect ratio
                height: 0,
                overflow: "hidden",
                borderRadius: 2,
                backgroundColor: "#000",
              }}
            >
              {camera.streamUrl ? (
                camera.streamUrl.includes("youtube.com") || camera.streamUrl.includes("youtu.be") ? (
                  <iframe
                    src={camera.streamUrl
                      .replace("watch?v=", "embed/")
                      .replace("youtu.be/", "youtube.com/embed/")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                    onError={handleStreamError}
                    title={`Live stream from ${camera.name}`}
                  />
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    height="100%"
                    color="white"
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    flexDirection="column"
                  >
                    <Typography variant="h6" gutterBottom>
                      Stream Unavailable in Browser
                    </Typography>
                    <Typography variant="body2" textAlign="center" sx={{ maxWidth: '80%' }}>
                      For RTSP streams, a dedicated streaming server is required for browser playback.
                    </Typography>
                  </Box>
                )
              ) : (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                  color="white"
                  position="absolute"
                  top={0}
                  left={0}
                  right={0}
                  bottom={0}
                >
                  <Typography>No stream URL configured</Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Camera Details Section */}
        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Camera Details
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Device ID
                </Typography>
                <Typography variant="body1">{camera.deviceId}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Entrance
                </Typography>
                <Typography variant="body1">
                  {camera?.entrance?.name || "Not assigned"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  IP Address
                </Typography>
                <Typography variant="body1">{camera.ipAddress || "Not configured"}</Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1">
                  {camera.location
                    ? `Lat: ${camera.location.latitude}, Long: ${camera.location.longitude}`
                    : "Not configured"
                  }
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={camera.isActive ? "Active" : "Inactive"}
                  color={camera.isActive ? "success" : "error"}
                  size="small"
                />
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Stream URL
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: 'break-word',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem'
                  }}
                >
                  {camera.streamUrl || "Not configured"}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Created At
                </Typography>
                <Typography variant="body1">
                  {new Date(camera.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {new Date(camera.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Detection Data and ROI Sections - Now aligned horizontally */}
        {camera.latestDetection && (
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Latest Detection Data
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="primary" gutterBottom>
                        {camera.latestDetection.count}
                      </Typography>
                      <Typography variant="body2">
                        People Count
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h4" color="secondary" gutterBottom>
                        {camera.latestDetection.density}
                      </Typography>
                      <Typography variant="body2">
                        Density
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {new Date(camera.latestDetection.timestamp).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2">
                        Date
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center' }}>
                      <Typography variant="h6" gutterBottom>
                        {new Date(camera.latestDetection.timestamp).toLocaleTimeString()}
                      </Typography>
                      <Typography variant="body2">
                        Time
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {camera.latestDetection.imageSnapshot && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Detection Snapshot
                  </Typography>
                  <Box
                    component="img"
                    src={camera.latestDetection.imageSnapshot}
                    alt="Detection snapshot"
                    sx={{
                      width: '100%',
                      maxHeight: 300,
                      objectFit: 'contain',
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: 'divider'
                    }}
                  />
                </Box>
              )}
            </Paper>
          </Grid>
        )}

        {/* ROI Information - Now aligned with Detection Data */}
        {camera.roi && (
          <Grid item xs={12} lg={4}>
            <Paper sx={{ p: 2, borderRadius: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>
                Region of Interest (ROI)
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    L1 Value
                  </Typography>
                  <Typography variant="body1">
                    {camera.roi.L1}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="textSecondary">
                    L2 Value
                  </Typography>
                  <Typography variant="body1">
                    {camera.roi.L2}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default CameraView;