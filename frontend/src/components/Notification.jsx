// components/Notification.jsx


import React from "react";


import { motion } from "framer-motion";


import {


    Bell,

    ShieldAlert,

    CheckCircle,

    Briefcase,

    Trash2,

    Clock


} from "lucide-react";









const Notification = ({

    notification,

    onRead,

    onDelete

}) => {




    const message =

        notification?.message || "";






    const isFraudAlert =

        message.toLowerCase()

        .includes("fake")

        ||

        message.toLowerCase()

        .includes("suspicious");






    const isApplication =

        message.toLowerCase()

        .includes("application");








    const getIcon = ()=>{


        if(isFraudAlert){


            return (

                <ShieldAlert

                    size={28}

                    className="text-red-600"

                />

            );


        }



        if(isApplication){


            return (

                <Briefcase

                    size={28}

                    className="text-blue-600"

                />

            );


        }





        return (

            <Bell

                size={28}

                className="text-purple-600"

            />

        );


    };









    return (



        <motion.div



            initial={{

                opacity:0,

                x:50

            }}



            animate={{

                opacity:1,

                x:0

            }}



            whileHover={{

                scale:1.02

            }}



            className={`

            relative

            flex

            gap-4

            items-start

            p-5

            rounded-3xl

            border

            shadow-lg

            backdrop-blur-xl

            transition


            ${

            notification?.is_read

            ?

            "bg-white border-gray-200"

            :

            "bg-blue-50 border-blue-200"

            }


            `}



        >







            {/* ICON */}



            <div

            className="

            p-3

            rounded-2xl

            bg-white

            shadow

            "

            >


                {getIcon()}


            </div>










            {/* CONTENT */}



            <div

            className="flex-1"

            >



                <div

                className="

                flex

                justify-between

                "

                >



                    <h3

                    className="

                    font-bold

                    text-gray-800

                    "

                    >

                        Notification

                    </h3>





                    {

                    !notification?.is_read &&


                    <span

                    className="

                    text-xs

                    bg-blue-600

                    text-white

                    px-2

                    py-1

                    rounded-full

                    "

                    >

                        New

                    </span>


                    }



                </div>









                <p

                className="

                mt-2

                text-gray-600

                text-sm

                "

                >

                    {message}

                </p>









                <div

                className="

                flex

                items-center

                gap-2

                mt-3

                text-xs

                text-gray-500

                "

                >


                    <Clock size={14}/>


                    {

                    notification?.created_at

                    ?

                    new Date(

                        notification.created_at

                    ).toLocaleString()

                    :

                    "Recently"

                    }


                </div>







                {/* ACTIONS */}



                <div

                className="

                flex

                gap-3

                mt-4

                "

                >




                    {


                    !notification?.is_read &&


                    <button


                    onClick={()=>onRead(notification.id)}


                    className="

                    flex

                    items-center

                    gap-2

                    px-4

                    py-2

                    rounded-xl

                    bg-green-100

                    text-green-700

                    text-sm

                    font-semibold

                    hover:bg-green-200

                    "

                    >



                        <CheckCircle size={16}/>


                        Mark Read



                    </button>



                    }








                    <button


                    onClick={()=>onDelete(notification.id)}


                    className="

                    flex

                    items-center

                    gap-2

                    px-4

                    py-2

                    rounded-xl

                    bg-red-100

                    text-red-600

                    text-sm

                    font-semibold

                    hover:bg-red-200

                    "

                    >



                        <Trash2 size={16}/>


                        Delete



                    </button>



                </div>







            </div>







        </motion.div>


    );



};





export default Notification;