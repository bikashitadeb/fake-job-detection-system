// src/pages/recruiter/PostedJobs.jsx


import React, {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    Eye,

    Edit3,

    Trash2,

    ShieldCheck,

    ShieldAlert,

    MapPin,

    IndianRupee


} from "lucide-react";



import {

    useNavigate

} from "react-router-dom";


import API from "../../api/API";









export default function PostedJobs(){



    const navigate = useNavigate();



    const [jobs,setJobs] = useState([]);

    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        loadJobs();


    },[]);









    const loadJobs = async()=>{


        try{


            const response = await API.get(

                "/jobs/my-jobs"

            );



            setJobs(

                response.data.jobs

                ||

                response.data.data

                ||

                []

            );


        }


        catch(error){


            console.log(

                "Jobs fetch error",

                error

            );


        }


        finally{


            setLoading(false);


        }


    };









    const deleteJob = async(id)=>{


        const confirmDelete = window.confirm(

            "Delete this job posting?"

        );



        if(!confirmDelete)

            return;





        try{


            await API.delete(

                `/jobs/${id}`

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

                Loading posted jobs...

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





            <div>


                <h1

                className="

                text-4xl

                font-bold

                "

                >

                    My Posted Jobs 📋

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Manage your job listings and AI verification results.

                </p>


            </div>









            {

            jobs.length===0 ?



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



                <h2 className="text-2xl font-bold">

                    No jobs posted yet

                </h2>



                <p className="text-gray-400 mt-2">

                    Create your first verified job posting.

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



                const trust =

                job.trust_score || 0;



                const fakeProbability =

                job.fake_probability || 0;



                const verified =

                job.status === "verified";







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







                    {/* HEADER */}



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

                            "

                            >

                                {job.company}

                            </p>


                        </div>





                        {

                        verified

                        ?

                        <ShieldCheck

                        className="text-green-400"

                        />

                        :



                        <ShieldAlert

                        className="text-yellow-400"

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

                        className="flex gap-2 items-center"

                        >

                            <MapPin size={17}/>

                            {job.location || "Remote"}

                        </p>





                        <p

                        className="flex gap-2 items-center"

                        >

                            <IndianRupee size={17}/>

                            {job.salary || "Not disclosed"}

                        </p>



                    </div>









                    {/* AI SCORE */}



                    <div

                    className="

                    mt-5

                    bg-black/20

                    rounded-2xl

                    p-4

                    "

                    >



                        <div

                        className="flex justify-between"

                        >


                            <span>

                                AI Trust Score

                            </span>



                            <b>

                                {trust}%

                            </b>


                        </div>




                        <div

                        className="

                        mt-3

                        h-2

                        bg-gray-700

                        rounded-full

                        "

                        >


                            <div


                            style={{

                                width:`${trust}%`

                            }}



                            className="

                            h-full

                            rounded-full

                            bg-gradient-to-r

                            from-green-400

                            to-blue-500

                            "

                            />



                        </div>



                    </div>









                    {/* FRAUD */}



                    {

                    fakeProbability > 50 &&



                    <div

                    className="

                    mt-4

                    bg-red-500/10

                    text-red-400

                    rounded-xl

                    p-3

                    "

                    >

                        High fraud probability:

                        {fakeProbability}%


                    </div>



                    }









                    {/* ACTIONS */}



                    <div

                    className="

                    mt-6

                    space-y-3

                    "

                    >



                        <button


                        onClick={()=>navigate(

                            `/employee/job/${job.id}`

                        )}



                        className="

                        w-full

                        bg-blue-600

                        py-3

                        rounded-xl

                        flex

                        justify-center

                        items-center

                        gap-2

                        "

                        >


                            <Eye size={18}/>


                            View


                        </button>







                        <button


                        className="

                        w-full

                        border

                        border-white/30

                        py-3

                        rounded-xl

                        flex

                        justify-center

                        items-center

                        gap-2

                        "

                        >


                            <Edit3 size={18}/>


                            Edit


                        </button>







                        <button


                        onClick={()=>deleteJob(job.id)}



                        className="

                        w-full

                        border

                        border-red-500/40

                        text-red-400

                        py-3

                        rounded-xl

                        flex

                        justify-center

                        items-center

                        gap-2

                        "

                        >


                            <Trash2 size={18}/>


                            Delete


                        </button>





                    </div>






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