// components/CameraMap.js
import { Paper, Typography, Box } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { icon } from "@iconify/react";
import cameraIcon from "@iconify/icons-mdi/camera";
import cameraOffIcon from "@iconify/icons-mdi/camera-off";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Create custom icons
const createCameraIcon = (isActive) => {
  return L.divIcon({
    html: `<span class="iconify" data-icon="${isActive ? 'mdi:camera' : 'mdi:camera-off'}" data-inline="false" style="color: ${isActive ? '#2e7d32' : '#d32f2f'}; font-size: 24px;"></span>`,
    iconSize: [24, 24],
    className: "custom-camera-icon",
  });
};

const CameraMap = ({ cameras, viewType, loading }) => {
  // Default center (India)
  const center = [20.5937, 78.9629];
  
  if (loading) {
    return (
      <Box sx={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography>Loading cameras...</Typography>
      </Box>
    );
  }

  if (viewType === "table") {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          Cameras Table
        </Typography>
        <Box sx={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5" }}>
                <th style={{ padding: "12px", textAlign: "left" }}>Name</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Device ID</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px", textAlign: "left" }}>Location</th>
              </tr>
            </thead>
            <tbody>
              {cameras.map((camera) => (
                <tr key={camera._id} style={{ borderBottom: "1px solid #e0e0e0" }}>
                  <td style={{ padding: "12px" }}>{camera.name}</td>
                  <td style={{ padding: "12px" }}>{camera.deviceId}</td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ color: camera.isActive ? "#2e7d32" : "#d32f2f" }}>
                      {camera.isActive ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>
                    {camera.location ? 
                      `${camera.location.latitude}, ${camera.location.longitude}` : 
                      "No location data"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      </Paper>
    );
  }

  return (
    <Box sx={{ height: 400, width: "100%", borderRadius: 2, overflow: "hidden" }}>
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cameras.map((camera) => {
          if (!camera.location || !camera.location.latitude || !camera.location.longitude) {
            return null;
          }
          
          return (
            <Marker
              key={camera._id}
              position={[parseFloat(camera.location.latitude), parseFloat(camera.location.longitude)]}
              icon={createCameraIcon(camera.isActive)}
            >
              <Popup>
                <div>
                  <h3>{camera.name}</h3>
                  <p><strong>Device ID:</strong> {camera.deviceId}</p>
                  <p>
                    <strong>Status:</strong> 
                    <span style={{ color: camera.isActive ? "#2e7d32" : "#d32f2f" }}>
                      {camera.isActive ? "Online" : "Offline"}
                    </span>
                  </p>
                  <p><strong>Entrance:</strong> {camera.entrance?.name || "N/A"}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
};

export default CameraMap;