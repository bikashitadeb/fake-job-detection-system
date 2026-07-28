import { createTheme } from "@mui/material/styles";


const theme = createTheme({

    palette: {

        mode: "dark",

        primary: {
            main: "#6366f1"
        },

        secondary: {
            main: "#8b5cf6"
        },

        background: {

            default: "#020617",

            paper: "#0f172a"

        },

        text: {

            primary: "#ffffff",

            secondary: "#94a3b8"

        }

    },


    typography: {

        fontFamily: "Inter, Arial, sans-serif"

    },


    shape: {

        borderRadius: 16

    }


});


export default theme;