import { Outlet } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Box } from "@mui/material";
import { useState } from "react";

const drawerWidth = 300;

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  // const [isClosing, setIsClosing] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <ProtectedRoute>
      <Box sx={{ height: "100vh" }}>
        <Navbar
          drawerWidth={drawerWidth}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Sidebar
          drawerWidth={drawerWidth}
          mobileOpen={mobileOpen}
          handleDrawerClose={handleDrawerClose}
          handleDrawerToggle={handleDrawerToggle}
        />
        <Box
          component="main"
          sx={{
            ml: { xs: 0, md: `${drawerWidth}px` },
            px: { xs: 0, md: 4 },
            py: { xs: 8, md: 12 },
            minHeight: "100%",
            background: (theme) => theme.palette.background.main,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </ProtectedRoute>
  );
};

export default AdminLayout;
