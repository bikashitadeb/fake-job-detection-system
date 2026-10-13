
import { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Tooltip,
  Drawer,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Dashboard,
  Work,
  Bookmark,
  Assignment,
  Logout,
  Notifications,
  Shield,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import { useAuth } from "../context/AuthContext.jsx";

const SIDEBAR_WIDTH = 260;

const menu = [
  { name: "Dashboard", path: "/employee/dashboard", icon: <Dashboard /> },
  { name: "Jobs", path: "/employee/jobs", icon: <Work /> },
  { name: "Saved Jobs", path: "/employee/saved", icon: <Bookmark /> },
  {
    name: "Applications",
    path: "/employee/applications",
    icon: <Assignment />,
  },
];

export default function EmployeeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const closeMobileMenu = () => setMobileOpen(false);

  const sidebar = (
    <Box sx={sidebarStyle}>
      {/* Brand */}
      <Box sx={brandStyle}>
        <Box sx={brandIcon}>
          <Shield sx={{ fontSize: 30 }} />
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography sx={brandName}>FakeGuard AI</Typography>
          <Typography sx={brandSubtitle}>EMPLOYEE WORKSPACE</Typography>
        </Box>
      </Box>

      <Typography sx={sectionLabel}>MENU</Typography>

      <Box component="nav" sx={{ mt: 1 }}>
        {menu.map((item) => {
          const active =
            location.pathname === item.path ||
            (item.path === "/employee/jobs" &&
              location.pathname.startsWith("/employee/job/"));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              style={{ textDecoration: "none" }}
            >
              <Box
                component={motion.div}
                whileHover={{ x: 3 }}
                sx={{
                  ...navItem,
                  ...(active ? activeNavItem : {}),
                }}
              >
                <Box
                  sx={{
                    ...navIcon,
                    ...(active ? activeNavIcon : {}),
                  }}
                >
                  {item.icon}
                </Box>

                <Typography
                  component="span"
                  sx={{
                    flex: 1,
                    fontSize: 13,
                    fontWeight: active ? 750 : 550,
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
            </NavLink>
          );
        })}
      </Box>

      <Box sx={{ flexGrow: 1, minHeight: 30 }} />

      {/* Signed-in user */}
      <Box sx={profileCard}>
        <Avatar sx={profileAvatar}>
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </Avatar>

        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography sx={profileName} noWrap>
            {user?.name || "Employee"}
          </Typography>
          <Typography sx={profileRole}>Employee account</Typography>
        </Box>

        <Tooltip title="Log out">
          <IconButton
            onClick={handleLogout}
            aria-label="Log out"
            sx={logoutButton}
          >
            <Logout fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <Box sx={appShell}>
      {/* Desktop sidebar */}
      {!isMobile && (
        <Box component="aside" sx={desktopSidebar}>
          {sidebar}
        </Box>
      )}

      {/* Mobile sidebar */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={closeMobileMenu}
        PaperProps={{
          sx: {
            width: SIDEBAR_WIDTH,
            maxWidth: "85vw",
            background: "#0c1220",
            color: "#f8fafc",
            borderRight: "1px solid rgba(148,163,184,.16)",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
          <IconButton
            onClick={closeMobileMenu}
            aria-label="Close menu"
            sx={{ color: "#cbd5e1" }}
          >
            <Close />
          </IconButton>
        </Box>
        {sidebar}
      </Drawer>

      {/* Main content */}
      <Box component="main" sx={mainArea}>
        {/* Top bar */}
        <Box component="header" sx={topbar}>
          <Box sx={headerLeft}>
            {isMobile && (
              <IconButton
                onClick={() => setMobileOpen(true)}
                aria-label="Open navigation"
                sx={menuButton}
              >
                <MenuIcon />
              </IconButton>
            )}

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={headerTitle}>Employee Portal</Typography>
              <Typography sx={headerSubtitle}>
                Your career workspace
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Tooltip title="Notifications">
              <IconButton
                onClick={() => navigate("/employee/notifications")}
                aria-label="Notifications"
                sx={headerAction}
              >
                <Notifications />
              </IconButton>
            </Tooltip>

            <Tooltip title="Profile">
              <IconButton
                onClick={() => navigate("/employee/profile")}
                aria-label="Profile"
                sx={{ p: 0.3 }}
              >
                <Avatar sx={headerAvatar}>
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Nested route content */}
        <Box component="section" sx={pageContent}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

/* Main layout */

const appShell = {
  display: "flex",
  width: "100%",
  minWidth: 0,
  minHeight: "100vh",
  overflowX: "clip",
  color: "#f8fafc",
  background: "#090d19",
};

const desktopSidebar = {
  display: "flex",
  flex: `0 0 ${SIDEBAR_WIDTH}px`,
  width: SIDEBAR_WIDTH,
  minWidth: SIDEBAR_WIDTH,
  minHeight: "100vh",
  position: "relative",
  zIndex: 10,
  borderRight: "1px solid rgba(148,163,184,.14)",
};

const sidebarStyle = {
  display: "flex",
  flexDirection: "column",
  width: "100%",
  minHeight: "100vh",
  p: 2.5,
  background: "linear-gradient(180deg,#10182a,#0a101d)",
};

const brandStyle = {
  display: "flex",
  alignItems: "center",
  gap: 1.4,
  py: 1.5,
  mb: 3,
};

const brandIcon = {
  width: 44,
  height: 44,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: 2.5,
  color: "#e9ddff",
  background: "linear-gradient(135deg,#8249e8,#455de1)",
  boxShadow: "0 8px 22px rgba(124,58,237,.24)",
};

const brandName = {
  fontSize: 16,
  fontWeight: 900,
  letterSpacing: "-.4px",
  background: "linear-gradient(90deg,#d8c5ff,#a7c7ff)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

const brandSubtitle = {
  mt: 0.4,
  color: "#8290aa",
  fontSize: 8,
  fontWeight: 800,
  letterSpacing: "1.1px",
};

const sectionLabel = {
  px: 1,
  color: "#71809b",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: "1.5px",
};

const navItem = {
  display: "flex",
  alignItems: "center",
  gap: 1.3,
  minHeight: 46,
  px: 1.2,
  py: 1,
  mb: 0.8,
  borderRadius: 2,
  color: "#9ba9c1",
  border: "1px solid transparent",
  transition: "background .2s ease, color .2s ease",
  "&:hover": {
    color: "#f8fafc",
    background: "rgba(148,163,184,.07)",
  },
};

const activeNavItem = {
  color: "#ede5ff",
  background: "rgba(139,92,246,.15)",
  borderColor: "rgba(167,139,250,.23)",
  boxShadow: "inset 3px 0 0 #a78bfa",
};

const navIcon = {
  width: 32,
  height: 32,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  borderRadius: 1.5,
  color: "#8290aa",
  "& svg": { fontSize: 19 },
};

const activeNavIcon = {
  color: "#c4b5fd",
  background: "rgba(139,92,246,.15)",
};

const profileCard = {
  display: "flex",
  alignItems: "center",
  gap: 1.2,
  p: 1.3,
  borderRadius: 2.5,
  border: "1px solid rgba(148,163,184,.15)",
  background: "rgba(255,255,255,.035)",
};

const profileAvatar = {
  width: 38,
  height: 38,
  flexShrink: 0,
  color: "#fff",
  fontWeight: 800,
  background: "linear-gradient(135deg,#8249e8,#455de1)",
};

const profileName = {
  color: "#e5eaf5",
  fontSize: 12,
  fontWeight: 800,
};

const profileRole = {
  mt: 0.4,
  color: "#8290aa",
  fontSize: 10,
};

const logoutButton = {
  color: "#f0a2c7",
  "&:hover": {
    color: "#fff",
    background: "rgba(244,114,182,.12)",
  },
};

const mainArea = {
  display: "flex",
  flex: "1 1 0%",
  flexDirection: "column",
  width: 0,
  minWidth: 0,
  minHeight: "100vh",
  overflowX: "clip",
  background:
    "radial-gradient(ellipse at top left,rgba(76,55,148,.12),transparent 42%),#090d19",
};

const topbar = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 2,
  flexShrink: 0,
  width: "100%",
  minHeight: 76,
  px: { xs: 2, sm: 3, md: 4 },
  py: 1.5,
  borderBottom: "1px solid rgba(148,163,184,.13)",
  background: "rgba(13,19,33,.9)",
  backdropFilter: "blur(18px)",
};

const headerLeft = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  minWidth: 0,
};

const headerTitle = {
  fontSize: { xs: 17, sm: 19 },
  fontWeight: 850,
  color: "#edf2ff",
};

const headerSubtitle = {
  mt: 0.3,
  fontSize: 10,
  color: "#8491aa",
};

const menuButton = {
  color: "#d8ccff",
  background: "rgba(139,92,246,.12)",
  borderRadius: 2,
};

const headerAction = {
  color: "#a9b6cd",
  "&:hover": {
    color: "#e9ddff",
    background: "rgba(139,92,246,.12)",
  },
};

const headerAvatar = {
  width: 34,
  height: 34,
  fontSize: 13,
  fontWeight: 800,
  color: "#fff",
  background: "linear-gradient(135deg,#8249e8,#455de1)",
  border: "2px solid rgba(196,181,253,.25)",
};

const pageContent = {
  flex: "1 1 auto",
  width: "100%",
  minWidth: 0,
  p: { xs: 2, sm: 2.5, md: 3, lg: 4 },
  "& > *": {
    minWidth: 0,
  },
};
