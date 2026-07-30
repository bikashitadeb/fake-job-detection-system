// =====================================================
// SECUREHIRE AI - APPLICATION ENTRY
// Premium Production Setup
// =====================================================


import React from "react";

import ReactDOM from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";


import {
    ThemeProvider
} from "@mui/material/styles";


import {
    CssBaseline
} from "@mui/material";


import {
    AnimatePresence
} from "framer-motion";


import App from "./App.jsx";


import {
    AuthProvider
} from "./context/AuthContext.jsx";


import theme from "./theme/theme.js";


// Global styles
import "./index.css";

import "./theme/dashboard.css";




// =====================================================
// ROOT PROVIDER
// =====================================================


function Root(){


    return (

        <BrowserRouter>


            <ThemeProvider theme={theme}>


                {/* MUI Global Reset */}
                <CssBaseline />



                <AuthProvider>


                    <AnimatePresence mode="wait">


                        <App />


                    </AnimatePresence>


                </AuthProvider>


            </ThemeProvider>


        </BrowserRouter>

    );

}





// =====================================================
// APPLICATION MOUNT
// =====================================================


const root = ReactDOM.createRoot(

    document.getElementById("root")

);



root.render(


    <React.StrictMode>


        <Root />


    </React.StrictMode>


);