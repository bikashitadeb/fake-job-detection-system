import React, {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    Eye,

    Briefcase,

    Calendar,

    CheckCircle,

    XCircle,

    Clock


} from "lucide-react";


import {

    useNavigate

} from "react-router-dom";


import API from "../../api/API";


import EmptyState from "../../components/EmptyState";








export default function Applications(){



    const navigate = useNavigate();



    const [applications,setApplications] = useState([]);

    const [loading,setLoading] = useState(true);








    useEffect(()=>{


        fetchApplications();


    },[]);









    const fetchApplications = async()=>{


        try{


            const response = await API.get(

                "/applications/my"

            );



            setApplications(

                response.data.applications

                ||

                response.data.data

                ||

                []

            );


        }



        catch(error){


            console.log(

                "Application fetch error",

                error

            );


        }



        finally{


            setLoading(false);


        }


    };









    const getStatus = (status)=>{


        switch(

            status?.toLowerCase()

        ){



            case "accepted":

                return {


                    text:"Accepted",

                    icon:<CheckCircle size={16}/>,

                    style:

                    "bg-green-500/20 text-green-400"

                };




            case "rejected":

                return {


                    text:"Rejected",

                    icon:<XCircle size={16}/>,

                    style:

                    "bg-red-500/20 text-red-400"

                };





            default:


                return {


                    text:"Pending",

                    icon:<Clock size={16}/>,

                    style:

                    "bg-yellow-500/20 text-yellow-400"

                };


        }


    };









    if(loading){


        return (

            <div

            className="

            text-white

            animate-pulse

            "

            >

                Loading applications...

            </div>

        );


    }









    return (



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

                    My Applications 📄

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Track your job applications and recruiter responses.

                </p>


            </div>









            {

            applications.length === 0 ?



            <EmptyState


                type="applications"


                title="No applications yet"


                description="Start applying for verified jobs."


                actionText="Browse Jobs"


                onAction={()=>navigate("/jobs")}


            />



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

            applications.map(

                (application,index)=>{



                    const status = getStatus(

                        application.status

                    );





                    const job =

                    application.job || {};





                    return (



                    <motion.div



                    key={application.id || index}



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

                    shadow-xl

                    "



                    >









                        {/* JOB TITLE */}



                        <div

                        className="

                        flex

                        justify-between

                        "

                        >



                            <div>



                                <div

                                className="

                                flex

                                items-center

                                gap-2

                                "

                                >

                                    <Briefcase

                                    className="text-purple-400"

                                    />


                                    <h2

                                    className="

                                    text-xl

                                    font-bold

                                    "

                                    >

                                    {

                                    job.title

                                    ||

                                    application.job_title

                                    ||

                                    "Job Position"

                                    }


                                    </h2>



                                </div>





                                <p

                                className="

                                text-gray-400

                                mt-2

                                "

                                >

                                {

                                job.company

                                ||

                                application.company

                                ||

                                "Company"

                                }


                                </p>


                            </div>



                        </div>









                        {/* DATE */}



                        <div

                        className="

                        mt-5

                        flex

                        gap-2

                        text-gray-400

                        text-sm

                        "

                        >

                            <Calendar size={16}/>



                            {

                            application.created_at

                            ?

                            new Date(

                                application.created_at

                            ).toLocaleDateString()

                            :

                            "Date unavailable"

                            }


                        </div>









                        {/* STATUS */}



                        <div

                        className={`

                        mt-5

                        flex

                        items-center

                        gap-2

                        px-4

                        py-2

                        rounded-xl

                        w-fit

                        ${status.style}

                        `}

                        >



                            {status.icon}



                            {status.text}



                        </div>









                        {/* MESSAGE */}



                        {

                        application.message &&



                        <div

                        className="

                        mt-5

                        bg-black/20

                        rounded-xl

                        p-4

                        "

                        >


                            <p

                            className="

                            text-sm

                            text-gray-300

                            "

                            >

                                Recruiter Message

                            </p>


                            <p

                            className="

                            mt-1

                            "

                            >

                                {application.message}

                            </p>



                        </div>



                        }









                        {/* BUTTON */}



                        <button


                        onClick={()=>navigate(

                            `/employee/job/${

                            application.job_id

                            }`

                        )}



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

                        py-3

                        rounded-xl

                        font-semibold

                        hover:scale-105

                        transition

                        "

                        >



                            <Eye size={18}/>


                            View Job



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