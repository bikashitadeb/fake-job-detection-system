// src/components/Sidebar.jsx


import React, { useState } from "react";

import { motion } from "framer-motion";

import {

    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    ShieldCheck,
    BarChart3,
    Bell,
    Settings,
    Menu,
    X,
    Building2

} from "lucide-react";


import {

    NavLink

} from "react-router-dom";



import {

    getCurrentUser

} from "../api/auth";







const Sidebar = () => {



    const user = getCurrentUser();



    const [open,setOpen] = useState(true);





    const role = user?.role || "employee";







    const menus = {



        employee:[


            {
                name:"Dashboard",
                path:"/dashboard",
                icon:<LayoutDashboard/>
            },


            {
                name:"Browse Jobs",
                path:"/jobs",
                icon:<Briefcase/>
            },


            {
                name:"Applications",
                path:"/applications",
                icon:<FileText/>
            },


            {
                name:"Notifications",
                path:"/notifications",
                icon:<Bell/>
            },


            {
                name:"Profile",
                path:"/profile",
                icon:<Users/>
            }


        ],






        recruiter:[


            {
                name:"Dashboard",
                path:"/recruiter/dashboard",
                icon:<LayoutDashboard/>
            },


            {
                name:"My Jobs",
                path:"/recruiter/jobs",
                icon:<Briefcase/>
            },


            {
                name:"Post Job",
                path:"/recruiter/create-job",
                icon:<Building2/>
            },


            {
                name:"Applicants",
                path:"/recruiter/applicants",
                icon:<Users/>
            },


            {
                name:"Analytics",
                path:"/recruiter/analytics",
                icon:<BarChart3/>
            },


            {
                name:"Notifications",
                path:"/notifications",
                icon:<Bell/>
            }


        ],







        admin:[


            {
                name:"Dashboard",
                path:"/admin",
                icon:<LayoutDashboard/>
            },


            {
                name:"Users",
                path:"/admin/users",
                icon:<Users/>
            },


            {
                name:"Jobs",
                path:"/admin/jobs",
                icon:<Briefcase/>
            },


            {
                name:"Fraud Detection",
                path:"/admin/fraud",
                icon:<ShieldCheck/>
            },


            {
                name:"Analytics",
                path:"/admin/analytics",
                icon:<BarChart3/>
            },


            {
                name:"Settings",
                path:"/admin/settings",
                icon:<Settings/>
            }


        ]



    };






    const activeMenus = menus[role] || menus.employee;







    return (



        <>





        {/* MOBILE BUTTON */}


        <button


        onClick={()=>setOpen(!open)}


        className="

        fixed

        top-5

        left-5

        z-50

        md:hidden

        bg-white

        p-3

        rounded-xl

        shadow-lg

        "


        >


            {

            open

            ?

            <X/>

            :

            <Menu/>

            }


        </button>









        <motion.aside



            initial={{

                x:-300

            }}



            animate={{

                x:open ? 0 : -300

            }}



            transition={{

                duration:0.4

            }}





            className="

            fixed

            left-0

            top-0

            bottom-0

            z-40

            w-72

            bg-white/80

            backdrop-blur-xl

            border-r

            border-gray-200

            shadow-xl

            p-6

            "


        >







            {/* BRAND */}



            <div

            className="

            mb-10

            "

            >


                <div

                className="

                flex

                items-center

                gap-3

                "

                >


                    <div

                    className="

                    p-3

                    rounded-2xl

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    "

                    >


                        <ShieldCheck

                        className="text-white"

                        />


                    </div>





                    <div>


                        <h1

                        className="

                        font-bold

                        text-xl

                        "

                        >

                            FakeGuard AI

                        </h1>



                        <p

                        className="

                        text-xs

                        text-gray-500

                        "

                        >

                            {role.toUpperCase()}

                        </p>


                    </div>


                </div>


            </div>









            {/* MENU */}



            <div

            className="

            space-y-3

            "

            >



            {

            activeMenus.map((item,index)=>(



                <NavLink


                key={index}


                to={item.path}



                className={({isActive})=>`


                flex

                items-center

                gap-4

                px-4

                py-3

                rounded-2xl

                transition



                ${

                isActive

                ?

                "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"

                :

                "text-gray-600 hover:bg-gray-100"

                }


                `}



                >



                    {item.icon}



                    <span

                    className="

                    font-medium

                    "

                    >

                        {item.name}

                    </span>



                </NavLink>



            ))


            }



            </div>







        </motion.aside>





        </>


    );


};






export default Sidebar;