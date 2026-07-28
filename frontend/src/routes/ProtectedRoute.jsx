import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";



export default function ProtectedRoute({

    role

}) {


    const {

        user,

        token,

        loading

    } = useAuth();





    // Check authentication loading

    if (loading) {

        return (

            <div

                style={{

                    color: "white",

                    textAlign: "center",

                    marginTop: "100px",

                    fontSize: "20px"

                }}

            >

                Loading...

            </div>

        );

    }





    // No token = not logged in

    if (!token) {

        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }





    // No user data

    if (!user) {

        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }





    // Role protection

    if (role && user.role !== role) {

        return (

            <Navigate

                to="/login"

                replace

            />

        );

    }





    // Allow access

    return <Outlet />;


}