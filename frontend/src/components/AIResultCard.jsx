import React from "react";
import { motion } from "framer-motion";
import {
    ShieldCheck,
    ShieldAlert,
    Brain,
    AlertTriangle
} from "lucide-react";



const AIResultCard = ({
    prediction = "safe",
    confidence = 0,
    trustScore = 0,
    explanation = "",
    warnings = []
}) => {


    const isFake =
        prediction?.toLowerCase() === "fake";



    return (

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
                duration:0.5
            }}


            className={`
                rounded-3xl
                p-6
                shadow-xl
                backdrop-blur-xl
                border

                ${
                    isFake
                    ?
                    "bg-red-50 border-red-200"
                    :
                    "bg-green-50 border-green-200"
                }

            `}

        >



            {/* Header */}

            <div className="flex items-center justify-between mb-5">


                <div className="flex items-center gap-3">


                    {
                        isFake ?

                        <ShieldAlert
                            className="text-red-600"
                            size={35}
                        />

                        :

                        <ShieldCheck
                            className="text-green-600"
                            size={35}
                        />

                    }



                    <div>

                        <h2 className="text-xl font-bold">

                            AI Verification Result

                        </h2>


                        <p className="text-sm text-gray-500">

                            Fake Job Intelligence System

                        </p>


                    </div>


                </div>



                <Brain
                    size={35}
                    className="text-purple-600"
                />


            </div>





            {/* Prediction */}

            <div className="mb-5">


                <p className="text-sm text-gray-500">

                    Prediction

                </p>


                <h3
                    className={`
                        text-3xl
                        font-extrabold

                        ${
                            isFake
                            ?
                            "text-red-600"
                            :
                            "text-green-600"
                        }

                    `}
                >

                    {
                        isFake
                        ?
                        "FAKE JOB"
                        :
                        "GENUINE JOB"
                    }


                </h3>


            </div>







            {/* Scores */}

            <div className="grid grid-cols-2 gap-4">


                <div
                    className="
                    bg-white
                    rounded-2xl
                    p-4
                    shadow
                    "
                >

                    <p className="text-gray-500 text-sm">

                        AI Confidence

                    </p>


                    <p className="text-2xl font-bold">

                        {confidence}%

                    </p>


                </div>





                <div
                    className="
                    bg-white
                    rounded-2xl
                    p-4
                    shadow
                    "
                >

                    <p className="text-gray-500 text-sm">

                        Trust Score

                    </p>


                    <p className="text-2xl font-bold">

                        {trustScore}%

                    </p>


                </div>


            </div>









            {/* Explanation */}

            {
                explanation &&

                <div
                    className="
                    mt-5
                    bg-white
                    rounded-2xl
                    p-4
                    "
                >

                    <div className="flex gap-2 items-center mb-2">


                        <Brain
                            size={20}
                            className="text-purple-600"
                        />


                        <h4 className="font-semibold">

                            AI Explanation

                        </h4>


                    </div>



                    <p className="text-gray-600 text-sm">

                        {explanation}

                    </p>


                </div>

            }









            {/* Warning List */}


            {
                warnings.length > 0 &&


                <div
                    className="
                    mt-5
                    bg-yellow-50
                    border
                    border-yellow-200
                    rounded-2xl
                    p-4
                    "
                >


                    <div className="flex gap-2 items-center mb-3">


                        <AlertTriangle
                            className="text-yellow-600"
                            size={20}
                        />


                        <h4 className="font-semibold">

                            AI Warnings

                        </h4>


                    </div>



                    <ul className="space-y-2">


                        {
                            warnings.map(

                                (item,index)=>(

                                    <li
                                        key={index}
                                        className="
                                        text-sm
                                        text-gray-700
                                        "
                                    >

                                        • {item}

                                    </li>

                                )

                            )
                        }


                    </ul>


                </div>


            }




        </motion.div>


    );

};


export default AIResultCard;