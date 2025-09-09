import React, { useState, useEffect, useRef } from "react";
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
  TextField,
  LinearProgress,
} from "@mui/material";

import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrumbs from "../../../components/Breadcrumbs";
import { startCamera, stopCamera, updateCamera } from "../../../services/cameraService";
import { set } from "react-hook-form";
import { LineChart, LinePlot } from "@mui/x-charts";
import { useSocket } from "../../../context/SocketContext";
import GaugeChart from 'react-gauge-chart';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { ArrowUpward, Moving, TrendingDown } from "@mui/icons-material";

const CameraView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [camera, setCamera] = useState(location.state?.camera || null);
  const [loading, setLoading] = useState(!location.state?.camera);
  const [streamError, setStreamError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");

  const [chartDataX, setChartDataX] = useState([]);
  const [chartDataY, setChartDataY] = useState([]);

  const { socket } = useSocket()
  const bufferRef = useRef([]); // to collect counts before averaging
  const lastMeanRef = useRef(null);
  const lastTimeRef = useRef(null);
  const [rate, setRate] = useState("N/A")
  const [roi, setRoi] = useState({ l1: camera?.roi?.L1 || 0, l2: camera?.roi?.L2 || 0, threshold: camera?.threshold || 0 });
  const [currentMean, setCurrentMean] = useState(0);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);
  const [numberOfGuards, setNumberOfGuards] = useState(0);
  const [increment, setIncrement] = useState(null);

  const guardsForFifty = 1; // one guard every 50 people

  useEffect(() => {
    if (!location.state?.camera) {
      // If camera data wasn't passed, fetch it
      fetchCameraData();
    }
  }, [id]);


  const handleROIUpdate = async () => {
    // Logic to update ROI
    console.log("Update ROI clicked", camera);
    let data = { ...camera, roi: { L1: parseInt(roi.l1), L2: parseInt(roi.l2) }, entranceId: camera.entrance._id, threshold: parseInt(roi.threshold) };
    try {
      // setLoading(true);
      await updateCamera(camera._id, data);
      setCamera({ ...camera, roi: { L1: parseInt(roi.l1), L2: parseInt(roi.l2) }, threshold: parseInt(roi.threshold) })
      setSuccess(true)
      setSeverity("success")
      setMessage("ROI updated successfully")
    } catch (error) {
      console.error("Error updating ROI:", error);
      setSeverity("error")
      setMessage("Failed to update ROI")
      setSuccess(true)
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleCountUpdate = (data) => {
      data = JSON.parse(data);

      if (data.camera_id === id) {
        bufferRef.current.push(data.count);

        if (bufferRef.current.length === 5) {
          const mean =
            bufferRef.current.reduce((a, b) => a + b, 0) /
            bufferRef.current.length;

          bufferRef.current = []; // reset buffer
          const now = new Date();

          let ratePerMinute = null;
          if (lastMeanRef.current !== null && lastTimeRef.current !== null) {
            const deltaPeople = mean - lastMeanRef.current;
            const deltaTimeMin =
              (now.getTime() - lastTimeRef.current.getTime()) / 60000; // ms → minutes

            if (deltaTimeMin > 0) {
              ratePerMinute = deltaPeople / deltaTimeMin;
            }
            if (mean > lastMeanRef.current) {
              setIncrement("up")
            }
            else {
              setIncrement("down")
            }
          }

          // store current as "last" for next round
          lastMeanRef.current = mean;
          lastTimeRef.current = now;
          setCurrentMean(mean.toFixed(2));

          console.log(
            "Mean:",
            mean,
            "Rate of change (people/min):",
            ratePerMinute
          );
          setNumberOfGuards(Math.ceil(mean / 50) * guardsForFifty);
          setRate(ratePerMinute ? ratePerMinute.toFixed(2) : "N/A");

          setChartDataX((prev) => {
            const newData = [...prev, new Date().toLocaleTimeString()];
            return newData.slice(-10);
          });
          setChartDataY((prev) => {
            const newData = [...prev, mean];
            return newData.slice(-10);
          });
        }
      }
    };

    socket.on("countUpdate", handleCountUpdate);

    return () => {
      socket.off("countUpdate", handleCountUpdate);
    };
  }, [socket, id]);


  console.log("Chart Data X:", chartDataX);
  console.log("Chart Data Y:", chartDataY);


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

  const showHeatmap = () => {
    // Logic to show heatmap
    console.log("Show Heatmap clicked");
    setHeatmapEnabled(!heatmapEnabled);
  }

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
              {/* {cameraOn && (<Button onClick={showHeatmap} size="small" variant="outlined">
                {heatmapEnabled ? "Hide Heatmap" : "Show Heatmap"}
              </Button>)} */}
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
                !heatmapEnabled ? (
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
                  <iframe
                    src={
                      "http://localhost:5000/api/camera/heatmap/" + id
                    }
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

            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Real time graph
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  {true ? (<LineChart
                    colors={['#94BBD6']}
                    xAxis={[{ scaleType: 'band', data: chartDataX, label: "Time ➜" }]}
                    yAxis={[
                      {
                        label: 'Count',
                      },
                    ]}
                    series={[{ data: chartDataY, label: 'Mean Count' }]}
                    width={500}
                    height={250}
                  />) : (<Typography variant="body2" color="textSecondary" gutterBottom>
                    Start the detection to view real time graph
                  </Typography>)}
                </Box>
                {/* Add any additional information you want to display here */}
              </Paper>
            </Box>
            <Box sx={{ width: '100%' }}>
              <Paper sx={{ p: 2, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Real time prediction and Rate
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2} alignItems="center" justifyContent="space-between">
                  <Grid size={{ xs: 12, sm: 6 }} >

                    <GaugeChart
                      id="people-count-gauge"
                      nrOfLevels={5}          // number of color segments
                      colors={["#00C851", "#FFC371", "#FF5F6D",]}  // red → yellow → green
                      arcWidth={0.1}          // thickness of arc
                      percent={currentMean / camera.threshold}    // value between 0 and 1
                      hideText={true}
                      needleColor="#345243"
                      needleBaseColor="#345243"
                      needleScale={0.4}
                      style={{ width: '200px' }}
                    />
                    <Typography variant="body2" align="center">
                      Current Count: {currentMean} ppl
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }} >

                    {rate < 0 ? (
                      <Typography variant="body2" color="textSecondary" gutterBottom>Crowd under control</Typography>
                    ) : (
                      <Typography variant="body2" color="body1" gutterBottom>Time to stampede: {currentMean ? (
                        `${((camera.threshold - currentMean) / rate).toFixed(2)} min`
                      ) : ("No data")}</Typography>
                    )}
                    {/* <Typography variant="body2" color="textSecondary" gutterBottom>{currentMean ? (
                      `Current Mean = ${currentMean} ppl`
                    ) : ("No data")}</Typography> */}
                    <Typography variant="body2" gutterBottom>Guards required: {currentMean ? (
                      `${numberOfGuards}`
                    ) : ("No data")}</Typography>
                    <Typography variant="body2" sx={{ display: "flex", alignItems: "center", gap: 0.8 }}
                    >
                      Rate = {rate} ppl/min {increment === "up" ? (<Moving sx={{ fontSize: 25, color: "green" }} />) : (increment === "down" && <TrendingDown sx={{ fontSize: 25, color: "red" }} />)}
                    </Typography>
                  </Grid>
                </Grid>




                {/* <Typography variant="body2" color="textSecondary" gutterBottom>
                  In people/minute
                </Typography>
                <Typography variant="body1">
                  {rate}
                </Typography> */}
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
              <Grid container spacing={2}>
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    ROI Coordinates
                  </Typography>
                </Grid>

                <Grid size={{ xs: 4 }}>
                  <TextField
                    label="L1"
                    type="number"
                    fullWidth
                    value={roi.threshold}
                    disabled={cameraOn}
                    onChange={(e) => setRoi({ ...roi, threshold: e.target.value })}
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label="L1"
                    type="number"
                    fullWidth
                    value={roi.l1}
                    disabled={cameraOn}
                    onChange={(e) => setRoi({ ...roi, l1: e.target.value })}
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                  />
                </Grid>
                <Grid size={{ xs: 4 }}>
                  <TextField
                    label="L2"
                    type="number"
                    fullWidth
                    value={roi.l2}
                    disabled={cameraOn}
                    onChange={(e) => setRoi({ ...roi, l2: e.target.value })}
                  // InputProps={{
                  //   readOnly: true,
                  // }}
                  />
                </Grid>
                <Grid size={{ xs: 3 }}>
                  {cameraOn ? (
                    <Typography variant="body2" color="textSecondary" gutterBottom>
                      Can't update ROI while detection is running
                    </Typography>
                  ) : (<Button variant="contained" color="primary" onClick={handleROIUpdate}>Update ROI</Button>)}
                </Grid>

              </Grid>
            ) : (
              <Typography>No ROI information configured for this camera.</Typography>
            )}
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, lg: 4 }}>
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
                  <b>Height:</b> 576 px
                </Typography>
              </Box>


              <Box>
                {/* <Typography variant="body2" color="textSecondary">
                  Threshold
                </Typography> */}
                <Typography variant="body1">
                  <b>Width:</b> 1024 px
                </Typography>
              </Box>



            </Box>
          </Paper>

        </Grid>
      </Grid>
    </Container >
  );
};

export default CameraView;