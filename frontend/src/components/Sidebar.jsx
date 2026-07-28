import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import WorkIcon from "@mui/icons-material/Work";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AnalyticsIcon from "@mui/icons-material/Analytics";

import { Link, useLocation } from "react-router-dom";

const drawerWidth = 240;

export default function Sidebar() {
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
    },
    {
      text: "My Jobs",
      icon: <WorkIcon />,
      path: "/jobs",
    },
    {
      text: "Post Job",
      icon: <AddCircleIcon />,
      path: "/post-job",
    },
    {
      text: "AI Reports",
      icon: <AnalyticsIcon />,
      path: "/reports",
    },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />

      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>

            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}