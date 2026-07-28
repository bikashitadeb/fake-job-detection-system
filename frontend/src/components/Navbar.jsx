import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{
        backgroundColor: "#ffffff",
        color: "#333",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
          }}
        >
          Fake Job Detection System
        </Typography>

        <IconButton color="inherit">
          <NotificationsIcon />
        </IconButton>

        <Box ml={2}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>S</Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;