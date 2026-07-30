// src/components/Navbar.jsx


import React, { useState } from "react";

import {
    motion
} from "framer-motion";


import {

    Bell,

    UserCircle,

    LogOut,

    Menu,

    X,

    ShieldCheck,

    ChevronDown

} from "lucide-react";


import {

    useNavigate

} from "react-router-dom";



import {

    logoutUser,

    getCurrentUser

} from "../api/auth";







const Navbar = () => {



    const navigate = useNavigate();



    const user = getCurrentUser();



    const [open,setOpen] = useState(false);



    const [mobile,setMobile] = useState(false);






    const handleLogout = async()=>{


        try{

            await logoutUser();

        }

        catch(error){

            console.log(
                "LOGOUT ERROR",
                error
            );

        }


        localStorage.removeItem(
            "access_token"
        );


        localStorage.removeItem(
            "user"
        );


        navigate("/login");


    };









    return (



        <motion.nav



            initial={{

                y:-50,

                opacity:0

            }}



            animate={{

                y:0,

                opacity:1

            }}



            className="

            fixed

            top-0

            left-0

            right-0

            z-50

            backdrop-blur-xl

            bg-white/70

            border-b

            border-gray-200

            shadow-sm

            "


        >





            <div

            className="

            max-w-7xl

            mx-auto

            px-6

            py-4

            flex

            justify-between

            items-center

            "


            >






                {/* LOGO */}



                <div

                onClick={()=>navigate("/")}

                className="

                flex

                items-center

                gap-3

                cursor-pointer

                "

                >



                    <div

                    className="

                    p-2

                    rounded-xl

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    "

                    >


                        <ShieldCheck

                        className="text-white"

                        size={25}

                        />


                    </div>





                    <div>


                        <h1

                        className="

                        text-xl

                        font-bold

                        bg-gradient-to-r

                        from-blue-600

                        to-purple-600

                        bg-clip-text

                        text-transparent

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

                            AI Job Verification


                        </p>


                    </div>


                </div>










                {/* DESKTOP MENU */}



                <div

                className="

                hidden

                md:flex

                items-center

                gap-6

                "

                >




                    <button

                    onClick={()=>navigate("/dashboard")}

                    className="

                    text-gray-700

                    hover:text-blue-600

                    transition

                    "

                    >

                        Dashboard

                    </button>





                    <button

                    onClick={()=>navigate("/jobs")}

                    className="

                    text-gray-700

                    hover:text-blue-600

                    transition

                    "

                    >

                        Jobs

                    </button>









                    <button

                    onClick={()=>navigate("/notifications")}

                    className="

                    relative

                    "

                    >


                        <Bell

                        size={22}

                        className="text-gray-700"

                        />


                        <span

                        className="

                        absolute

                        -top-2

                        -right-2

                        bg-red-500

                        text-white

                        text-xs

                        w-5

                        h-5

                        rounded-full

                        flex

                        items-center

                        justify-center

                        "

                        >

                            3

                        </span>


                    </button>









                    {/* PROFILE */}



                    <div

                    className="relative"

                    >



                        <button


                        onClick={()=>setOpen(!open)}


                        className="

                        flex

                        items-center

                        gap-2

                        "

                        >



                            <UserCircle

                            size={30}

                            className="text-gray-700"

                            />



                            <span

                            className="font-medium"

                            >

                                {user?.name || "User"}

                            </span>



                            <ChevronDown

                            size={18}

                            />



                        </button>







                        {

                        open &&



                        <motion.div


                        initial={{

                            opacity:0,

                            y:-10

                        }}


                        animate={{

                            opacity:1,

                            y:0

                        }}


                        className="

                        absolute

                        right-0

                        mt-3

                        w-48

                        bg-white

                        rounded-2xl

                        shadow-xl

                        border

                        p-3

                        "


                        >



                            <button

                            onClick={()=>navigate("/profile")}

                            className="

                            w-full

                            text-left

                            px-3

                            py-2

                            rounded-lg

                            hover:bg-gray-100

                            "

                            >

                                Profile

                            </button>







                            <button

                            onClick={handleLogout}

                            className="

                            w-full

                            text-left

                            px-3

                            py-2

                            rounded-lg

                            hover:bg-red-50

                            text-red-600

                            flex

                            gap-2

                            items-center

                            "

                            >


                                <LogOut size={17}/>

                                Logout


                            </button>




                        </motion.div>


                        }




                    </div>






                </div>









                {/* MOBILE BUTTON */}



                <button

                className="md:hidden"

                onClick={()=>setMobile(!mobile)}

                >


                    {

                    mobile

                    ?

                    <X/>

                    :

                    <Menu/>

                    }


                </button>





            </div>









            {/* MOBILE MENU */}



            {

            mobile &&



            <motion.div


            initial={{

                opacity:0

            }}


            animate={{

                opacity:1

            }}



            className="

            md:hidden

            px-6

            pb-5

            space-y-3

            "


            >



                <button

                className="block"

                onClick={()=>navigate("/dashboard")}

                >

                    Dashboard

                </button>



                <button

                className="block"

                onClick={()=>navigate("/jobs")}

                >

                    Jobs

                </button>



                <button

                onClick={handleLogout}

                className="

                text-red-600

                "

                >

                    Logout

                </button>



            </motion.div>


            }





        </motion.nav>


    );


};





export default Navbar;