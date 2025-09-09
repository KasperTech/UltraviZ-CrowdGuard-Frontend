import { useState, useEffect, useRef } from "react";
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
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Alert as MuiAlert,
  Button
} from "@mui/material";
import {
  Notifications,
  Warning,
  Error,
  Info,
  CheckCircle,
  Close
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { adminRoutes } from "../routes";
import brand from "../data/brand";
import { getAlerts, markAlertAsRead } from "../services/alertService";
import { useSocket } from "../context/SocketContext";

const Navbar = ({ handleDrawerToggle, drawerWidth }) => {
  const { user, logout } = useAuth();
  const { socket } = useSocket();
  const navigate = useNavigate();
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);
  const [anchorElAvatar, setAnchorElAvatar] = useState(null);
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  const severityIcons = {
    critical: <Error color="error" />,
    high: <Warning color="warning" />,
    medium: <Info color="info" />,
    low: <CheckCircle color="success" />
  };

  const severityColors = {
    critical: "error",
    high: "warning",
    medium: "info",
    low: "success"
  };

  const fetchUnreadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAlerts(1, 10, null, false, false, false);
      setUnreadAlerts(response.data || []);
      setUnreadCount(response.metadata?.total_results || 0);
    } catch (err) {
      console.error("Failed to fetch alerts", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async () => {
    try {
      await markAlertAsRead();
      setUnreadCount(0);
      // Keep the alerts visible but mark them as read locally
      setUnreadAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    } catch (err) {
      console.error("Failed to mark alerts as read", err);
      setError("Failed to mark notifications as read");
    }
  };

  const handleNotificationsClick = async (event) => {
    setAnchorElNotifications(event.currentTarget);
    
    // Only fetch if we haven't already or if we need to refresh
    if (!hasFetchedRef.current || unreadCount > 0) {
      await fetchUnreadAlerts();
      hasFetchedRef.current = true;
    }
    
    // Mark all as read when opening the menu
    if (unreadCount > 0) {
      await handleMarkAsRead();
    }
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

  // Listen for new alerts via socket
  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (alert) => {
      // Update unread count
      setUnreadCount(prev => prev + 1);
      
      // Add to unread alerts list if menu is open
      if (anchorElNotifications) {
        setUnreadAlerts(prev => [alert, ...prev.slice(0, 9)]);
      }
    };

    socket.on('globalAlert', handleNewAlert);
    socket.on('newAlert', handleNewAlert);

    return () => {
      socket.off('globalAlert', handleNewAlert);
      socket.off('newAlert', handleNewAlert);
    };
  }, [socket, anchorElNotifications]);

  // Fetch initial unread count on component mount
  useEffect(() => {
    fetchUnreadAlerts();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString();
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
        backdropFilter: "blur(10px)",
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
          <Badge badgeContent={unreadCount} color="error">
            <Notifications color="secondary" />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNotifications}
          open={Boolean(anchorElNotifications)}
          onClose={handleNotificationsClose}
          PaperProps={{
            style: { maxHeight: 400, width: 350 },
          }}
        >
          <MenuItem disabled>
            <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button 
                size="small" 
                onClick={handleMarkAsRead}
                sx={{ minWidth: 'auto' }}
              >
                Mark all read
              </Button>
            )}
          </MenuItem>
          <Divider />
          
          {error && (
            <MuiAlert severity="error" sx={{ mx: 1, my: 0.5 }}>
              {error}
            </MuiAlert>
          )}
          
          {loading ? (
            <MenuItem>
              <Typography variant="body2">Loading...</Typography>
            </MenuItem>
          ) : unreadAlerts.length > 0 ? (
            <List sx={{ py: 0 }}>
              {unreadAlerts.map((alert) => (
                <ListItem 
                  key={alert._id} 
                  alignItems="flex-start"
                  sx={{
                    borderLeft: `3px solid`,
                    borderColor: `${severityColors[alert.severity]}.main`,
                    py: 1,
                    "&:hover": {
                      backgroundColor: 'action.hover',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {severityIcons[alert.severity]}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Typography variant="body2" fontWeight="bold">
                          {alert.title}
                        </Typography>
                        <Chip 
                          label={alert.severity} 
                          size="small" 
                          color={severityColors[alert.severity]}
                          variant="outlined"
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                          {alert.message}
                        </Typography>
                        {alert.createdAt && (
                          <Typography variant="caption" display="block" color="textSecondary" sx={{ mt: 0.5 }}>
                            {formatDate(alert.createdAt)}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <MenuItem onClick={handleNotificationsClose}>
              <Typography variant="body2" color="textSecondary">
                No new notifications
              </Typography>
            </MenuItem>
          )}
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