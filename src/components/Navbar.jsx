import { useState } from "react";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Notifications } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { adminRoutes } from "../routes";
import brand from "../data/brand";

const Navbar = ({ handleDrawerToggle, drawerWidth }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState(null);

  const handleNotificationsClick = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setAnchorElNotifications(null);
  };

  const handleAvatarClick = (event) => {
    setAnchorElAvatar(event.currentTarget);
  };

  const handleAvatarClose = () => {
    setAnchorElAvatar(null);
  };

  const handleProfile = () => {
    navigate(adminRoutes.starter);
    handleAvatarClose();
  };

  const handleLogout = () => {
    logout();
    handleAvatarClose();
  };

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: drawerWidth },
        height: "72px",
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(10px)", // Glassmorphism effect
      }}
    >
      <Toolbar sx={{ height: "100%" }}>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { md: "none" } }}
        >
          <Box component="img" src={brand.icon} alt="Logo" height="100%" />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Hi, {user?.name}
        </Typography>

        <IconButton sx={{ mr: 2 }} onClick={handleNotificationsClick}>
          <Badge badgeContent={4} color="success">
            <Notifications color="secondary" />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleNotificationsClose}
        >
          <MenuItem onClick={handleNotificationsClose}>Notification 1</MenuItem>
          <MenuItem onClick={handleNotificationsClose}>Notification 2</MenuItem>
          <MenuItem onClick={handleNotificationsClose}>Notification 3</MenuItem>
          <MenuItem onClick={handleNotificationsClose}>Notification 4</MenuItem>
        </Menu>

        <IconButton onClick={handleAvatarClick}>
          <Avatar sx={{ background: (theme) => theme.palette.primary.main }}>
            {user?.name[0]}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorElAvatar}
          open={Boolean(anchorElAvatar)}
          onClose={handleAvatarClose}
        >
          <MenuItem onClick={handleProfile}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
