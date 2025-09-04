import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { Icon } from "@iconify/react";
import brand from "../data/brand";
import { useLocation, Link } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { adminRoutes, demoRoutes } from "../routes";
import { hexToRgb } from "../utils/helpers";

/************************************************** 
  UPDATE THIS sidebarData OBJECT TO UPDATE SIDEBAR 
**************************************************/
const sidebarData = [
  {
    section: "Main",
    items: [
      {
        title: "Starter",
        url: adminRoutes.starter,
        icon: <Icon icon="ic:round-dashboard" width="1.5em" height="1.5em" />,
      },
    ],
  },
  {
    section: "Demo",
    items: [
      {
        title: "Dashboard",
        url: adminRoutes.root,
        icon: <Icon icon="ic:round-dashboard" width="1.5em" height="1.5em" />,
      },
      {
        title: "Forms",
        icon: (
          <Icon
            icon="fluent:form-24-regular"
            width="1.8em"
            height="1.8em"
            style={{ marginLeft: -5 }}
          />
        ),
        subItems: [
          {
            title: "Fields",
            url: demoRoutes.formFields,
          },
          {
            title: "Simple Forms",
            url: demoRoutes.formSimple,
          },
        ],
      },
      {
        title: "Users List",
        url: demoRoutes.userList,
        icon: <Icon icon="solar:user-bold" width="1.5em" height="1.5em" />,
      },
      {
        title: "Add Product",
        url: demoRoutes.addProduct,
        icon: (
          <Icon
            icon="icon-park-outline:ad-product"
            width="1.5em"
            height="1.5em"
          />
        ),
      },
    ],
  },
];

// Sidebar Section
const SidebarSection = ({ section, expandedSections, setExpandedSections }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "#919EAB",
        mt: 2,
        "&:hover": {
          color: "#1c252e",
        },
        "&:hover .section-title": {
          ml: 0.5,
        },
        "&:hover .arrow-icon": {
          opacity: 1,
          cursor: "pointer",
        },
      }}
    >
      <Typography
        className="arrow-icon"
        sx={{
          mb: -0.5,
          opacity: 0,
        }}
      >
        <Icon
          icon={
            expandedSections[section.section]
              ? "ep:arrow-down-bold"
              : "ep:arrow-right-bold"
          }
          width="0.9em"
          height="1em"
        />
      </Typography>
      <Typography
        className="section-title"
        fontWeight={600}
        fontSize="1rem"
        lineHeight="1.5"
        sx={{ ml: 0, cursor: "pointer" }}
        onClick={() =>
          setExpandedSections((prev) => ({
            ...prev,
            [section.section]: !prev[section.section],
          }))
        }
      >
        {section.section.toUpperCase()}
      </Typography>
    </Box>
  );
};

// Sidebar Nav item
const SidebarNavItem = ({
  section,
  handleNavItemToggle,
  isActive,
  isSubNavActive,
  expandedNavItems,
  expandedSections,
  handleDrawerClose,
}) => {
  return (
    <List>
      <Collapse
        in={expandedSections[section.section]}
        timeout="auto"
        unmountOnExit
      >
        {section.items.map((item) => (
          <Box key={item.title} sx={{ position: "relative" }}>
            {/* Main Nav Item */}
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={item.subItems ? Box : Link}
                to={item.subItems ? undefined : item.url}
                onClick={() => {
                  if (item.subItems) {
                    handleNavItemToggle(item.title); // Toggle subnav
                  } else {
                    handleDrawerClose(); // Close drawer on click
                  }
                }}
                sx={{
                  background: (theme) =>
                    isActive(item.url) || isSubNavActive(item.subItems)
                      ? `rgba(${hexToRgb(theme.palette.primary.main)}, 0.3)`
                      : "inherit",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: (theme) =>
                      isActive(item.url) || isSubNavActive(item.subItems)
                        ? `rgba(${hexToRgb(theme.palette.primary.main)}, 0.3)`
                        : "lightgrey", // Only change background if not active
                    borderRadius: 2,
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    mr: -3,
                    color: (theme) =>
                      isActive(item.url) || isSubNavActive(item.subItems)
                        ? theme.palette.primary.main
                        : theme.palette.greyNavItem.main,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  primaryTypographyProps={{
                    sx: {
                      fontWeight:
                        isActive(item.url) || isSubNavActive(item.subItems)
                          ? 600
                          : 400,
                      color:
                        isActive(item.url) || isSubNavActive(item.subItems)
                          ? "primary.main"
                          : "text.secondary",
                    },
                  }}
                />

                {item.subItems && (
                  <Icon
                    icon={
                      expandedNavItems[item.title]
                        ? "ep:arrow-down-bold"
                        : "ep:arrow-right-bold"
                    }
                    width="0.9em"
                    height="1em"
                  />
                )}
              </ListItemButton>
            </ListItem>

            {/* Sub Nav Items */}
            {item.subItems && (
              <SidebarSubNavItem
                item={item}
                expandedNavItems={expandedNavItems}
                isActive={isActive}
                handleDrawerClose={handleDrawerClose}
              />
            )}
          </Box>
        ))}
      </Collapse>
    </List>
  );
};

// Sidebar Sub nav item
const SidebarSubNavItem = ({
  item,
  expandedNavItems,
  isActive,
  handleDrawerClose,
}) => {
  return (
    <Collapse
      in={expandedNavItems[item.title]}
      timeout="auto"
      unmountOnExit
      sx={{ pr: 4 }}
    >
      {item.subItems.map((subItem, index) => (
        <ListItem
          key={subItem.title}
          disablePadding
          sx={{
            mt: 0.5,
            pl: 1,
            ml: 4,
            mb: index === item.subItems.length - 1 ? 1 : 0,
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              left: "-5px",
              top: "-12px",
              borderLeft: "2px solid #e8e8e8",
              borderBottom: "2px solid #e8e8e8",
              borderBottomLeftRadius: "10px",
              width: "12px",
              height: "2em",
              zIndex: 9,
              mr: 1,
            },
            "&::after": {
              content: '""',
              position: "absolute",
              left: "-5px",
              bottom: "-10px",
              borderLeft: "2px solid #e8e8e8",
              width: "8px",
              height: "120%",
              zIndex: 9,
            },
            "&:last-child::after": {
              display: "none",
            },
          }}
        >
          <ListItemButton
            component={Link}
            to={subItem.url}
            onClick={handleDrawerClose}
            sx={{
              height: "38px",
              backgroundColor: isActive(subItem.url)
                ? "#efefef"
                : "transparent",
              borderRadius: isActive(subItem.url) ? 2 : 0,
              "&:hover": {
                backgroundColor: "#efefef",
                borderRadius: 2,
              },
            }}
          >
            <ListItemText primary={subItem.title} />
          </ListItemButton>
        </ListItem>
      ))}
    </Collapse>
  );
};

const Sidebar = ({ drawerWidth, mobileOpen, handleDrawerClose, container }) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Initialize all sections to be open by default
  const [expandedSections, setExpandedSections] = useState(
    sidebarData.reduce((acc, section) => {
      acc[section.section] = true;
      return acc;
    }, {})
  );
  const [expandedNavItems, setExpandedNavItems] = useState({});

  // Toggle nav item collapse
  const handleNavItemToggle = (title) => {
    setExpandedNavItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Check if a URL is active
  const isActive = (url) => location.pathname === url;
  const isSubNavActive = (subItems) =>
    subItems && subItems.some((subItem) => location.pathname === subItem.url);

  const drawer = (
    <div>
      <Toolbar>
        <Box sx={{ p: 2, py: 4 }}>
          <Box component="img" src={brand.icon} alt="Logo" height="100%" />
        </Box>
      </Toolbar>
      {sidebarData.map((section) => (
        <Box key={section.section} sx={{ px: 3 }}>
          <SidebarSection
            section={section}
            expandedSections={expandedSections}
            setExpandedSections={setExpandedSections}
          />
          <SidebarNavItem
            section={section}
            handleNavItemToggle={handleNavItemToggle}
            handleDrawerClose={handleDrawerClose}
            isActive={isActive}
            isSubNavActive={isSubNavActive}
            expandedSections={expandedSections}
            expandedNavItems={expandedNavItems}
          />
        </Box>
      ))}
      <Box
        sx={{
          px: 4,
          display: "flex",
          justifyContent: "center",
          width: "100%",
          position: "absolute",
          bottom: 20,
        }}
      >
        <Button
          variant="contained"
          fullWidth
          sx={{ height: 48, fontSize: "1.5 rem" }}
          endIcon={<Icon icon="hugeicons:logout-03" width="1em" height="1em" />}
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
    </div>
  );

  return (
    <nav>
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

export default Sidebar;
