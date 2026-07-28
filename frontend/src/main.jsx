import React from "react";

import ReactDOM from "react-dom/client";

import {
    BrowserRouter
} from "react-router-dom";


import {
    ThemeProvider
} from "@mui/material/styles";


import App from "./App.jsx";


import {
    AuthProvider
} from "./context/AuthContext.jsx";


import theme from "./theme/theme.js";


import "./theme/dashboard.css";





ReactDOM
.createRoot(
    document.getElementById("root")
)
.render(

<React.StrictMode>


<BrowserRouter>


<ThemeProvider theme={theme}>


<AuthProvider>


<App/>


</AuthProvider>


</ThemeProvider>


</BrowserRouter>


</React.StrictMode>


);