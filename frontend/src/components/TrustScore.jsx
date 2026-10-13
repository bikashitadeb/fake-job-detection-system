// components/TrustScore.jsx


import React from "react";


import { motion } from "framer-motion";


import {


    ShieldCheck,

    ShieldAlert,

    AlertTriangle,

    Sparkles


} from "lucide-react";








const TrustScore = ({

    trustScore = 0,

    fakeProbability = 0,

    riskLevel = "low",

    verified = false


}) => {




    const score = Math.min(

        Math.max(trustScore,0),

        100

    );








    const radius = 55;


    const circumference =

        2 *

        Math.PI *

        radius;



    const offset =

        circumference -

        (

            score / 100

        )

        *

        circumference;








    const getRiskStyle = ()=>{


        switch(

            riskLevel?.toLowerCase()

        ){


            case "critical":

            case "high":

                return {


                    color:"text-red-600",

                    bg:"bg-red-50",

                    border:"border-red-200"

                };



            case "medium":

                return {


                    color:"text-yellow-600",

                    bg:"bg-yellow-50",

                    border:"border-yellow-200"

                };



            default:

                return {


                    color:"text-green-600",

                    bg:"bg-green-50",

                    border:"border-green-200"

                };


        }


    };







    const risk = getRiskStyle();









    return (



        <motion.div



            initial={{

                opacity:0,

                scale:0.9

            }}



            animate={{

                opacity:1,

                scale:1

            }}



            transition={{

                duration:0.5

            }}



            className="

            bg-white

            rounded-3xl

            shadow-xl

            border

            p-6

            "

        >







            {/* HEADER */}



            <div

            className="

            flex

            items-center

            gap-3

            mb-6

            "

            >



                <div

                className="

                p-3

                rounded-2xl

                bg-purple-100

                "

                >

                    <Sparkles

                    className="text-purple-600"

                    />

                </div>




                <div>


                    <h2

                    className="

                    text-xl

                    font-bold

                    "

                    >

                        AI Trust Analysis

                    </h2>


                    <p

                    className="

                    text-sm

                    text-gray-500

                    "

                    >

                        Machine Learning Verification

                    </p>


                </div>



            </div>









            {/* CIRCLE SCORE */}



            <div

            className="

            flex

            justify-center

            "

            >



                <div

                className="

                relative

                w-40

                h-40

                "

                >




                    <svg

                    className="

                    w-full

                    h-full

                    rotate-[-90deg]

                    "

                    >



                        <circle

                        cx="80"

                        cy="80"

                        r={radius}

                        strokeWidth="12"

                        fill="none"

                        className="

                        stroke-gray-200

                        "

                        />






                        <motion.circle


                        cx="80"

                        cy="80"

                        r={radius}


                        strokeWidth="12"


                        fill="none"


                        strokeLinecap="round"


                        strokeDasharray={circumference}


                        initial={{

                            strokeDashoffset:circumference

                        }}


                        animate={{

                            strokeDashoffset:offset

                        }}


                        transition={{

                            duration:1

                        }}



                        className="

                        stroke-blue-600

                        "

                        />




                    </svg>







                    <div

                    className="

                    absolute

                    inset-0

                    flex

                    flex-col

                    items-center

                    justify-center

                    "

                    >



                        <span

                        className="

                        text-3xl

                        font-bold

                        "

                        >

                            {score}%

                        </span>


                        <span

                        className="

                        text-xs

                        text-gray-500

                        "

                        >

                            Trust

                        </span>



                    </div>




                </div>



            </div>









            {/* DETAILS */}



            <div

            className="

            grid

            grid-cols-2

            gap-4

            mt-8

            "

            >




                <div

                className="

                bg-gray-50

                rounded-2xl

                p-4

                "

                >



                    <p

                    className="

                    text-sm

                    text-gray-500

                    "

                    >

                        Fake Probability

                    </p>


                    <p

                    className="

                    text-xl

                    font-bold

                    text-red-600

                    "

                    >

                        {fakeProbability}%

                    </p>



                </div>







                <div

                className="

                bg-gray-50

                rounded-2xl

                p-4

                "

                >



                    <p

                    className="

                    text-sm

                    text-gray-500

                    "

                    >

                        Verification

                    </p>




                    <div

                    className="

                    flex

                    items-center

                    gap-2

                    mt-1

                    "

                    >


                    {

                    verified

                    ?

                    <ShieldCheck

                    size={20}

                    className="text-green-600"

                    />


                    :

                    <ShieldAlert

                    size={20}

                    className="text-orange-600"

                    />


                    }



                    <span

                    className="font-semibold"

                    >

                        {

                        verified

                        ?

                        "Verified"

                        :

                        "Pending"

                        }


                    </span>



                    </div>


                </div>



            </div>









            {/* RISK LEVEL */}



            <div

            className={`

            mt-5

            rounded-2xl

            border

            p-4

            flex

            items-center

            justify-between

            ${risk.bg}

            ${risk.border}

            `}

            >



                <div

                className="

                flex

                items-center

                gap-2

                "

                >

                    <AlertTriangle

                    size={20}

                    className={risk.color}

                    />


                    <span

                    className="font-semibold"

                    >

                        Risk Level

                    </span>


                </div>





                <span

                className={`

                font-bold

                uppercase

                ${risk.color}

                `}

                >

                    {riskLevel}

                </span>



            </div>







        </motion.div>



    );


};





export default TrustScore;