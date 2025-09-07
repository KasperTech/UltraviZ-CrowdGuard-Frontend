import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid2 as Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  Button,
  Alert,
  CircularProgress,
  IconButton,
  Snackbar,
} from "@mui/material";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { startCamera, stopCamera } from "../../../services/cameraService";
import { set } from "react-hook-form";
import { LineChart, LinePlot } from "@mui/x-charts";
import { useSocket } from "../../../context/SocketContext";

const CameraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [camera, setCamera] = useState(location.state?.camera || null);
  const [loading, setLoading] = useState(!location.state?.camera);
  const [error, setError] = useState("");
  const [streamError, setStreamError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [chartDataX, setChartDataX] = useState([]);
  const [chartDataY, setChartDataY] = useState([]);

  const { socket } = useSocket()

  useEffect(() => {
    if (!location.state?.camera) {
      // If camera data wasn't passed, fetch it
      fetchCameraData();
    }
  }, [id]);



  useEffect(() => {
    if (!socket) return;
    socket.on('countUpdate', (data) => {
      data = JSON.parse(data)
      console.log('countUpdate', data);
      if (data.camera_id === id) {
        setChartDataX((prev) => {
          const newData = [...prev, new Date().toLocaleTimeString()];
          return newData.slice(-10); // Keep only the last 5 entries
        });
        setChartDataY((prev) => {
          const newData = [...prev, data.count];
          return newData.slice(-10); // Keep only the last 10 entries
        });
      }
    });
  }, [socket]);

  const startCameraById = async () => {

    try {
      await startCamera(camera._id);
      setSuccess(true)
      setCameraOn(true)
      setSeverity("success")
      setMessage("Camera started successfully")
    } catch (error) {
      console.error("Error starting camera:", error);
      setSeverity("error")
      setMessage("Failed to start camera")
      setSuccess(true)

    }
  }

  const stopCameraById = async () => {

    try {
      await stopCamera(camera._id);
      setCameraOn(false)
      setSuccess(true)
      setSeverity("success")
      setMessage("Camera stopped successfully")
    } catch (error) {
      console.error("Error stopping camera:", error);
      setSeverity("error");
      setMessage("Failed to stop camera");
      setSuccess(true);
    }
  }

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




  return (
    <Container maxWidth="xl" sx={{ p: { xs: 2, sm: 4 } }}>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess(false)} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <Box sx={{ mb: 2 }}>
        <Breadcrumbs items={breadcrumbItems} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight={600}>
          {camera.name}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Live Stream Section */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Live Stream
              </Typography>
              {cameraOn ? (<Button onClick={stopCameraById} size="small" variant="outlined" color="error">
                Stop Detection
              </Button>) : (<Button onClick={startCameraById} size="small" variant="contained" color="primary">
                Start Detection
              </Button>)}
              {/* <IconButton onClick={fetchCameraData} size="small">
                <RefreshIcon />
              </IconButton> */}
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
              {cameraOn ? (
                true ? (
                  <iframe
                    src={
                      "http://localhost:5000/api/camera/video_feed/" + id}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "1024px",
                      height: "576px",
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
                  <Typography>Please start the detection for live view </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Camera Details Section */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Paper sx={{ p: 2, borderRadius: 3, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Camera Details
              </Typography>
              <Divider sx={{ mb: 2 }} />

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  {/* <Typography variant="body2" color="textSecondary" gutterBottom>
                  Device ID
                </Typography> */}
                  <Typography variant="body1"><b>Device Id: </b>
                    {camera.deviceId}</Typography>
                </Box>

                <Box>
                  {/* <Typography variant="body2" color="textSecondary" gutterBottom>
                 
                </Typography> */}
                  <Typography variant="body1">
                    <b>Entrance: </b>
                    {camera?.entrance?.name || "Not assigned"}
                  </Typography>
                </Box>

                {/* <Box>
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
              </Box> */}

                <Box>
                  {/* <Typography variant="body2" color="textSecondary">
                  Threshold
                </Typography> */}
                  <Typography variant="body1">
                    <b>Threshold:</b>  {camera.threshold || "Not configured"}
                  </Typography>
                </Box>

                {/* <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Status
                </Typography>
                <Chip
                  label={camera.isActive ? "Active" : "Inactive"}
                  color={camera.isActive ? "success" : "error"}
                  size="small"
                />
              </Box> */}

                {/* <Box>
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
              </Box> */}


              </Box>
            </Paper>
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Real time graph
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <div>
                  {true ? (<LineChart
                    colors={['#94BBD6']}
                    xAxis={[{ scaleType: 'band', data: chartDataX }]}
                    series={[{ data: chartDataY, label: 'People Count' }]}
                    width={500}   // ✅ must be a number
                    height={300}
                  />) : (<Typography variant="body2" color="textSecondary" gutterBottom>
                    Start the detection to view real time graph
                  </Typography>)}
                </div>
                {/* Add any additional information you want to display here */}
              </Paper>
            </Box>
          </Box>
        </Grid>

        {/* ROI Information - Now aligned with Detection Data */}
      </Grid>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Region of Interest (ROI) Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {camera.roi ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ROI Coordinates
                  </Typography>
                  <Typography variant="body1">
                    {`Height: 576px, Width: 1024px, L1: ${camera.roi.L1}, L2: ${camera.roi.L2}`}
                  </Typography>
                </Box>

                {/* <Box>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Description
                  </Typography>
                  <Typography variant="body1">
                    {camera.roi.description || "No description provided"}
                  </Typography>
                </Box> */}
              </Box>
            ) : (
              <Typography>No ROI information configured for this camera.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
          <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Rate of Change of People
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" color="textSecondary" gutterBottom>
              In people/minute
            </Typography>
            <Typography variant="body1">
              10 people/minute
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CameraView;