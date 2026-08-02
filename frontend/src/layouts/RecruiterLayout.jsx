// src/layouts/RecruiterLayout.jsx

import React, {
    useState
} from "react";

import {
    Outlet
} from "react-router-dom";

import {
    motion
} from "framer-motion";

import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

import {
    Menu
} from "lucide-react";



export default function RecruiterLayout(){


    const [sidebarOpen,setSidebarOpen] = useState(false);



    return (

        <div className="
        min-h-screen
        w-full
        bg-[#020617]
        text-white
        overflow-hidden
        ">


            {/* SIDEBAR */}

            <Sidebar

                open={sidebarOpen}

                setOpen={setSidebarOpen}

            />




            {/* MENU BUTTON */}

            <button


                onClick={()=>setSidebarOpen(true)}


                className="

                fixed

                top-6

                left-6

                z-[200]

                w-12

                h-12

                rounded-xl

                bg-gradient-to-r

                from-blue-600

                to-purple-600

                flex

                items-center

                justify-center

                shadow-xl

                hover:scale-110

                transition

                "

            >

                <Menu size={25}/>


            </button>








            {/* MAIN CONTENT */}


            <div className="

            min-h-screen

            w-full

            flex

            flex-col

            pl-0

            ">



                {/* NAVBAR */}

                <Navbar />







                {/* PAGE */}

                <main

                className="

                flex-1

                pt-0

                px-6

                md:px-10

                pb-10

                "

                >



                    <motion.div


                    initial={{

                        opacity:0,

                        y:20

                    }}


                    animate={{

                        opacity:1,

                        y:0

                    }}


                    transition={{

                        duration:.4

                    }}


                    className="

                    max-w-[1600px]

                    mx-auto

                    w-full

                    "

                    >


                        <Outlet/>


                    </motion.div>



                </main>




            </div>





        </div>


    );


}