import { Box, Toolbar } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <>
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 4,
            backgroundColor: "#f5f7fa",
            minHeight: "100vh",
          }}
        >
          <Toolbar />
          {children}
        </Box>
      </Box>
    </>
  );
}