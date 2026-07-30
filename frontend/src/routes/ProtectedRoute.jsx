import {

    Navigate,

    Outlet

} from "react-router-dom";


import {

    Box,

    CircularProgress,

    Typography

} from "@mui/material";


import {

    motion

} from "framer-motion";


import {

    useAuth

} from "../context/AuthContext.jsx";







export default function ProtectedRoute({

    allowedRoles = []

}) {



    const {

        user,

        token,

        loading,

        isAuthenticated

    } = useAuth();








    // ==============================
    // AUTH LOADING
    // ==============================


    if (loading) {


        return (


            <Box


                sx={{


                    minHeight:"100vh",

                    display:"flex",

                    flexDirection:"column",

                    alignItems:"center",

                    justifyContent:"center",

                    background:

                    "linear-gradient(135deg,#ede9fe,#fce7f3)"


                }}



            >



                <motion.div


                    animate={{

                        rotate:360

                    }}


                    transition={{

                        duration:2,

                        repeat:Infinity,

                        ease:"linear"

                    }}



                >


                    <CircularProgress

                        size={60}

                        thickness={5}

                    />


                </motion.div>





                <Typography


                    sx={{


                        mt:3,

                        fontWeight:700,

                        color:"#6d28d9"

                    }}


                >

                    Securing your session...

                </Typography>




            </Box>


        );

    }









    // ==============================
    // NOT LOGGED IN
    // ==============================


    if(

        !token ||

        !isAuthenticated ||

        !user

    ){


        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }








    // ==============================
    // ROLE PROTECTION
    // ==============================


    if(


        allowedRoles.length > 0 &&


        !allowedRoles.includes(

            user.role

        )


    ){


        return (

            <Navigate

                to="/unauthorized"

                replace

            />

        );


    }








    // ==============================
    // ACCESS GRANTED
    // ==============================


    return <Outlet />;


}