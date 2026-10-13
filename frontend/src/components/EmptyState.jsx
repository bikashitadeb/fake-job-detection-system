// components/EmptyState.jsx


import React from "react";

import { motion } from "framer-motion";

import {
    Inbox,
    SearchX,
    FileX,
    BellOff
} from "lucide-react";





const EmptyState = ({

    title = "Nothing here yet",

    description = "No data available",

    type = "default",

    actionText,

    onAction

}) => {




    const icons = {


        jobs:

            <SearchX
                size={55}
                className="text-blue-500"
            />,


        applications:

            <FileX
                size={55}
                className="text-purple-500"
            />,


        notifications:

            <BellOff
                size={55}
                className="text-orange-500"
            />,


        default:

            <Inbox
                size={55}
                className="text-gray-500"
            />


    };







    return (


        <motion.div


            initial={{
                opacity:0,
                scale:0.95
            }}


            animate={{
                opacity:1,
                scale:1
            }}


            transition={{
                duration:0.4
            }}



            className="
            flex
            flex-col
            items-center
            justify-center

            min-h-[300px]

            rounded-3xl

            bg-white/70

            backdrop-blur-xl

            border

            border-gray-200

            shadow-xl

            p-8

            text-center

            "


        >






            {/* ICON */}


            <motion.div


                animate={{

                    y:[0,-10,0]

                }}


                transition={{

                    duration:2,

                    repeat:Infinity

                }}


                className="
                mb-5

                p-5

                rounded-full

                bg-gray-50

                "

            >

                {
                    icons[type] || icons.default
                }


            </motion.div>









            {/* TITLE */}


            <h2
                className="
                text-2xl
                font-bold
                text-gray-800
                mb-2
                "
            >

                {title}

            </h2>








            {/* DESCRIPTION */}


            <p
                className="
                text-gray-500
                max-w-md
                "
            >

                {description}

            </p>









            {/* OPTIONAL BUTTON */}


            {

                actionText &&


                <button


                    onClick={onAction}


                    className="

                    mt-6

                    px-6

                    py-3

                    rounded-xl

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    text-white

                    font-semibold

                    shadow-lg

                    hover:scale-105

                    transition


                    "

                >

                    {actionText}


                </button>


            }




        </motion.div>


    );


};





export default EmptyState;