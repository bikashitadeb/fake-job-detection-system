// src/pages/recruiter/Analytics.jsx

import React from "react";

import {
    motion
} from "framer-motion";

import {
    BarChart3,
    TrendingUp,
    Users,
    Briefcase
} from "lucide-react";



export default function Analytics(){


    const stats=[

        {
            title:"Total Applications",
            value:"128",
            icon:<Users size={28}/>
        },

        {
            title:"Active Jobs",
            value:"24",
            icon:<Briefcase size={28}/>
        },

        {
            title:"Hiring Rate",
            value:"72%",
            icon:<TrendingUp size={28}/>
        }

    ];



    return(


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


        className="text-white"

        >



            <h1 className="
            text-4xl
            font-black
            mb-8
            ">

                Recruitment Analytics 📊

            </h1>





            <div className="
            grid
            md:grid-cols-3
            gap-6
            ">


            {
                stats.map((item,index)=>(


                    <motion.div


                    key={index}


                    whileHover={{
                        y:-8
                    }}


                    className="

                    p-6

                    rounded-3xl

                    bg-white/10

                    border

                    border-white/10

                    backdrop-blur-xl

                    "

                    >



                        <div className="
                        w-14
                        h-14
                        rounded-2xl
                        bg-gradient-to-r
                        from-blue-600
                        to-purple-600
                        flex
                        items-center
                        justify-center
                        mb-5
                        ">

                            {item.icon}

                        </div>



                        <p className="
                        text-slate-400
                        ">

                            {item.title}

                        </p>



                        <h2 className="
                        text-4xl
                        font-black
                        mt-2
                        ">

                            {item.value}

                        </h2>



                    </motion.div>


                ))
            }


            </div>






            <div className="
            mt-8
            p-8
            rounded-3xl
            bg-white/5
            border
            border-white/10
            ">


                <BarChart3 size={40}/>


                <h2 className="
                text-2xl
                font-bold
                mt-4
                ">

                    Hiring Performance

                </h2>


                <p className="
                text-slate-400
                mt-2
                ">

                    AI powered recruitment insights will appear here.

                </p>


            </div>




        </motion.div>


    );


}