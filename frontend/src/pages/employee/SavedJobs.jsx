// src/pages/employee/SavedJobs.jsx


import React, {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    Bookmark,

    Trash2,

    Eye,

    MapPin,

    IndianRupee,

    ShieldCheck,

    ShieldAlert


} from "lucide-react";



import {

    useNavigate

} from "react-router-dom";


import API from "../../api/API";









export default function SavedJobs(){



    const navigate = useNavigate();



    const [jobs,setJobs] = useState([]);

    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        fetchSavedJobs();


    },[]);









    const fetchSavedJobs = async()=>{


        try{


            const response = await API.get(

                "/saved-jobs"

            );



            setJobs(

                response.data.data

                ||

                response.data.jobs

                ||

                []

            );


        }


        catch(error){


            console.log(

                "Saved jobs error",

                error

            );


        }


        finally{


            setLoading(false);


        }


    };









    const removeJob = async(id)=>{


        try{


            await API.delete(

                `/saved-jobs/${id}`

            );



            setJobs(

                previous =>

                previous.filter(

                    job => job.id !== id

                )

            );


        }


        catch(error){


            console.log(error);


        }


    };









    if(loading){


        return (

            <div className="text-white animate-pulse">

                Loading saved jobs...

            </div>

        );


    }









    return(



        <div

        className="

        text-white

        space-y-8

        "

        >






            {/* HEADER */}



            <div>


                <h1

                className="

                text-4xl

                font-bold

                "

                >

                    Saved Jobs ⭐

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Your bookmarked AI verified opportunities.

                </p>


            </div>









            {

            jobs.length === 0 ?



            <div

            className="

            bg-white/10

            backdrop-blur-xl

            border

            border-white/20

            rounded-3xl

            p-10

            text-center

            "

            >


                <Bookmark

                size={50}

                className="

                mx-auto

                text-purple-400

                "

                />



                <h2

                className="

                text-2xl

                font-bold

                mt-4

                "

                >

                    No Saved Jobs

                </h2>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Save interesting jobs to view them later.

                </p>


            </div>






            :





            <div

            className="

            grid

            md:grid-cols-2

            xl:grid-cols-3

            gap-6

            "

            >







            {

            jobs.map(

            (job,index)=>{



                const fakeProbability =


                job.fake_probability > 1

                ?

                job.fake_probability

                :

                (job.fake_probability || 0)*100;






                const trustScore =


                job.trust_score

                ||

                100 - fakeProbability;







                return(



                <motion.div



                key={job.id || index}



                initial={{

                    opacity:0,

                    y:30

                }}



                animate={{

                    opacity:1,

                    y:0

                }}



                transition={{

                    delay:index*0.05

                }}



                whileHover={{

                    scale:1.03

                }}



                className="

                bg-white/10

                backdrop-blur-xl

                border

                border-white/20

                rounded-3xl

                p-6

                "

                >







                    {/* TITLE */}



                    <div

                    className="

                    flex

                    justify-between

                    "

                    >



                        <div>


                            <h2

                            className="

                            text-xl

                            font-bold

                            "

                            >

                                {job.title}

                            </h2>



                            <p

                            className="

                            text-gray-400

                            mt-1

                            "

                            >

                                {job.company}

                            </p>


                        </div>







                        {

                        trustScore >=70

                        ?

                        <ShieldCheck

                        className="text-green-400"

                        />

                        :

                        <ShieldAlert

                        className="text-red-400"

                        />

                        }



                    </div>









                    {/* DETAILS */}



                    <div

                    className="

                    mt-5

                    space-y-3

                    text-gray-300

                    "

                    >


                        <p

                        className="

                        flex

                        gap-2

                        items-center

                        "

                        >

                            <MapPin size={17}/>

                            {job.location || "Remote"}

                        </p>





                        <p

                        className="

                        flex

                        gap-2

                        items-center

                        "

                        >

                            <IndianRupee size={17}/>

                            {job.salary || "Not disclosed"}

                        </p>



                    </div>









                    {/* TRUST SCORE */}



                    <div

                    className="

                    mt-5

                    bg-black/20

                    rounded-2xl

                    p-4

                    "

                    >



                        <div

                        className="

                        flex

                        justify-between

                        "

                        >


                            <span>

                                AI Trust Score

                            </span>



                            <b>

                                {Math.round(trustScore)}%

                            </b>


                        </div>





                        <div

                        className="

                        h-2

                        bg-gray-700

                        rounded-full

                        mt-3

                        "

                        >



                            <div

                            style={{

                                width:`${trustScore}%`

                            }}



                            className="

                            h-full

                            bg-gradient-to-r

                            from-green-400

                            to-blue-500

                            rounded-full

                            "

                            />


                        </div>



                    </div>









                    {/* ACTIONS */}



                    <button


                    onClick={()=>navigate(

                        `/employee/job/${job.id}`

                    )}



                    className="

                    mt-6

                    w-full

                    flex

                    justify-center

                    items-center

                    gap-2

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    py-3

                    rounded-xl

                    font-semibold

                    "

                    >


                        <Eye size={18}/>


                        View Job


                    </button>








                    <button


                    onClick={()=>removeJob(job.id)}



                    className="

                    mt-3

                    w-full

                    flex

                    justify-center

                    items-center

                    gap-2

                    border

                    border-red-500/40

                    text-red-400

                    py-3

                    rounded-xl

                    "

                    >


                        <Trash2 size={18}/>


                        Remove


                    </button>






                </motion.div>


                );


            }

            )

            }






            </div>


            }





        </div>


    );


}