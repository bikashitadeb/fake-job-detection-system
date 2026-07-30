// src/layouts/RecruiterLayout.jsx

import React from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";


export default function RecruiterLayout(){

    return (

        <div className="min-h-screen flex bg-[#020617] text-white">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <main className="p-6">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}