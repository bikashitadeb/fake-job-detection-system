// components/JobCard.jsx


import React from "react";


import { motion } from "framer-motion";


import {

    MapPin,

    Building2,

    IndianRupee,

    ShieldCheck,

    ShieldAlert,

    Sparkles,

    Briefcase,

    ArrowRight

} from "lucide-react";








const JobCard = ({

    job,

    onApply

}) => {



    const trustScore =

        job?.trust_score || 0;



    const isFake =

        job?.is_fake_predicted;





    const verified =

        job?.company_verified;







    return (



        <motion.div



            initial={{

                opacity:0,

                y:30

            }}



            animate={{

                opacity:1,

                y:0

            }}



            whileHover={{

                y:-8,

                scale:1.02

            }}



            transition={{

                duration:0.3

            }}




            className="

            bg-white

            rounded-3xl

            shadow-xl

            border

            border-gray-100

            p-6

            hover:shadow-2xl

            transition

            "


        >








            {/* HEADER */}



            <div className="flex justify-between items-start">



                <div>



                    <h2

                        className="

                        text-xl

                        font-bold

                        text-gray-800

                        "

                    >

                        {job?.title}


                    </h2>





                    <div

                        className="

                        flex

                        items-center

                        gap-2

                        text-gray-500

                        mt-2

                        "

                    >


                        <Building2 size={18}/>


                        <span>

                            {

                            job?.company_name

                            ||

                            job?.company

                            ||

                            "Unknown Company"

                            }


                        </span>


                    </div>



                </div>






                {

                    verified &&


                    <div

                    className="

                    flex

                    items-center

                    gap-1

                    bg-green-100

                    text-green-700

                    px-3

                    py-1

                    rounded-full

                    text-xs

                    font-semibold

                    "

                    >


                        <ShieldCheck size={15}/>


                        Verified



                    </div>


                }



            </div>









            {/* DESCRIPTION */}


            <p

            className="

            text-gray-600

            mt-4

            line-clamp-3

            text-sm

            "

            >

                {job?.description}


            </p>









            {/* DETAILS */}


            <div

            className="

            grid

            grid-cols-2

            gap-3

            mt-5

            "

            >



                <div

                className="

                bg-gray-50

                rounded-xl

                p-3

                "

                >

                    <div className="flex gap-2 items-center text-gray-500">


                        <MapPin size={16}/>


                        Location


                    </div>


                    <p className="font-semibold mt-1">


                        {job?.location}


                    </p>


                </div>







                <div

                className="

                bg-gray-50

                rounded-xl

                p-3

                "

                >

                    <div className="flex gap-2 items-center text-gray-500">


                        <IndianRupee size={16}/>


                        Salary


                    </div>


                    <p className="font-semibold mt-1">


                        {

                        job?.salary

                        ||

                        "Not disclosed"

                        }


                    </p>


                </div>


            </div>









            {/* AI TRUST SCORE */}



            <div

            className="

            mt-5

            rounded-2xl

            bg-gradient-to-r

            from-blue-50

            to-purple-50

            p-4

            "

            >


                <div

                className="

                flex

                justify-between

                items-center

                "

                >


                    <div className="flex gap-2 items-center">


                        <Sparkles

                        size={20}

                        className="text-purple-600"

                        />


                        <span

                        className="font-semibold"

                        >

                            AI Trust Score

                        </span>


                    </div>



                    <span

                    className="

                    text-xl

                    font-bold

                    text-purple-700

                    "

                    >

                        {trustScore}%


                    </span>


                </div>






                <div

                className="

                w-full

                bg-gray-200

                rounded-full

                h-2

                mt-3

                "

                >



                    <motion.div


                    initial={{

                        width:0

                    }}


                    animate={{


                        width:`${trustScore}%`

                    }}



                    transition={{

                        duration:1

                    }}



                    className="

                    h-2

                    rounded-full

                    bg-gradient-to-r

                    from-blue-500

                    to-purple-600

                    "


                    />


                </div>



            </div>









            {/* FAKE WARNING */}



            {


                isFake &&


                <div

                className="

                mt-4

                flex

                items-center

                gap-2

                bg-red-50

                text-red-600

                rounded-xl

                p-3

                text-sm

                font-medium

                "

                >


                    <ShieldAlert size={18}/>


                    AI detected suspicious job



                </div>


            }









            {/* APPLY BUTTON */}



            <button


            onClick={()=>onApply(job)}



            className="

            mt-6

            w-full

            flex

            items-center

            justify-center

            gap-2

            bg-gradient-to-r

            from-blue-600

            to-purple-600

            text-white

            py-3

            rounded-xl

            font-semibold

            hover:scale-105

            transition

            "

            >


                Apply Now


                <ArrowRight size={18}/>


            </button>







        </motion.div>


    );


};





export default JobCard;