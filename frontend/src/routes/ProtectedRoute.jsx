
import { Navigate, Outlet } from "react-router-dom";

import {
    Box,
    CircularProgress,
    Typography
} from "@mui/material";

import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({
    allowedRoles = [],
    children
}) {
    const {
        user,
        token,
        loading,
        isAuthenticated
    } = useAuth();

    // Wait for the saved session to initialize.
    if (loading) {
        return (
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg,#ede9fe,#fce7f3)"
                }}
            >
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                >
                    <CircularProgress size={60} thickness={5} />
                </motion.div>

                <Typography
                    sx={{
                        mt: 3,
                        fontWeight: 700,
                        color: "#6d28d9"
                    }}
                >
                    Securing your session...
                </Typography>
            </Box>
        );
    }

    // Require an authenticated session.
    if (!token || !isAuthenticated || !user) {
        return <Navigate to="/login" replace />;
    }

    const currentRole = String(user.role || "")
        .trim()
        .toLowerCase();

    const permittedRoles = allowedRoles.map((role) =>
        String(role).trim().toLowerCase()
    );

    // Restrict access to the allowed roles.
    if (
        permittedRoles.length > 0 &&
        !permittedRoles.includes(currentRole)
    ) {
        return <Navigate to="/unauthorized" replace />;
    }

    // Support both nested routes and direct element routes.
    return children || <Outlet />;
}
