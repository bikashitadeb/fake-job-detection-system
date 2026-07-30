import React, {

    useEffect,

    useState

} from "react";


import {

    useParams,

    useNavigate

} from "react-router-dom";


import {

    motion

} from "framer-motion";


import {


    ArrowLeft,

    Bookmark,

    MapPin,

    IndianRupee,

    Building2,

    ShieldCheck,

    AlertTriangle


} from "lucide-react";



import API from "../../api/API";


import TrustScore from "../../components/TrustScore";


import AIResultCard from "../../components/AIResultCard";









export default function JobDetails(){



    const {

        id

    } = useParams();



    const navigate = useNavigate();





    const [job,setJob] = useState(null);


    const [loading,setLoading] = useState(true);


    const [applying,setApplying] = useState(false);








    useEffect(()=>{


        fetchJob();


    },[]);









    const fetchJob = async()=>{


        try{


            const response = await API.get(

                `/jobs/${id}`

            );



            setJob(

                response.data.job

                ||

                response.data.data

            );


        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    };









    const applyJob = async()=>{


        try{


            setApplying(true);



            await API.post(

                `/applications/${id}/apply`,

                {

                    cover_letter:"Interested in this opportunity"

                }

            );



            alert(

                "Application submitted successfully"

            );


        }


        catch(error){


            alert(

                error.response?.data?.message

                ||

                "Already applied"

            );


        }


        finally{


            setApplying(false);


        }


    };









    if(loading){


        return (

            <div className="text-white animate-pulse">

                Loading job details...

            </div>

        );


    }








    if(!job){


        return (

            <div className="text-white">

                Job not found

            </div>

        );


    }









    const fakeProbability =


        job.fake_probability > 1

        ?

        job.fake_probability

        :

        job.fake_probability * 100;






    const trustScore =


        job.trust_score

        ||

        100 - fakeProbability;








    return(



        <div

        className="

        text-white

        space-y-8

        "

        >







            {/* BACK */}



            <button


            onClick={()=>navigate(-1)}


            className="

            flex

            items-center

            gap-2

            text-gray-300

            hover:text-white

            "

            >


                <ArrowLeft size={20}/>

                Back


            </button>









            {/* MAIN CARD */}



            <motion.div



            initial={{

                opacity:0,

                y:30

            }}



            animate={{

                opacity:1,

                y:0

            }}



            className="

            bg-white/10

            backdrop-blur-xl

            border

            border-white/20

            rounded-3xl

            p-8

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



                        <h1

                        className="

                        text-4xl

                        font-bold

                        "

                        >

                            {job.title}

                        </h1>



                        <div

                        className="

                        flex

                        items-center

                        gap-2

                        mt-3

                        text-gray-400

                        "

                        >


                            <Building2 size={18}/>


                            {job.company}



                        </div>



                    </div>






                    {

                    job.company_verified &&



                    <ShieldCheck

                    size={35}

                    className="text-green-400"

                    />

                    }



                </div>









                {/* DETAILS */}



                <div

                className="

                grid

                md:grid-cols-2

                gap-5

                mt-8

                "

                >




                    <InfoCard

                    icon={<MapPin/>}

                    title="Location"

                    value={job.location}

                    />





                    <InfoCard

                    icon={<IndianRupee/>}

                    title="Salary"

                    value={job.salary || "Not disclosed"}

                    />





                </div>









                {/* DESCRIPTION */}



                <div className="mt-8">


                    <h2 className="text-2xl font-bold">

                        Job Description

                    </h2>



                    <p className="text-gray-300 mt-3 leading-relaxed">

                        {job.description}

                    </p>


                </div>









                {/* AI SCORE */}



                <div

                className="

                mt-10

                grid

                lg:grid-cols-2

                gap-6

                "

                >



                    <TrustScore


                        trustScore={trustScore}


                        fakeProbability={fakeProbability}


                        verified={job.company_verified}


                        riskLevel={

                            trustScore>=80

                            ?

                            "low"

                            :

                            trustScore>=50

                            ?

                            "medium"

                            :

                            "high"

                        }


                    />







                    <AIResultCard


                        prediction={

                            job.is_fake_predicted

                            ?

                            "fake"

                            :

                            "safe"

                        }


                        confidence={

                            job.ai_confidence || 0

                        }


                        trustScore={trustScore}


                        explanation={

                            job.explanation

                        }


                        warnings={

                            job.ai_warnings || []

                        }


                    />


                </div>









                {/* WARNING */}



                {

                trustScore < 50 &&



                <div

                className="

                mt-6

                bg-red-500/10

                border

                border-red-500/30

                rounded-2xl

                p-5

                flex

                gap-3

                "

                >


                    <AlertTriangle

                    className="text-red-400"

                    />



                    <p>

                        AI detected suspicious patterns.

                        Apply carefully.

                    </p>


                </div>



                }









                {/* ACTIONS */}



                <div

                className="

                flex

                gap-4

                mt-8

                "

                >



                    <button


                    onClick={applyJob}


                    disabled={applying}



                    className="

                    flex-1

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    py-3

                    rounded-xl

                    font-bold

                    hover:scale-105

                    transition

                    "

                    >

                        {

                        applying

                        ?

                        "Applying..."

                        :

                        "Apply Now"

                        }


                    </button>







                    <button


                    className="

                    px-6

                    rounded-xl

                    border

                    border-gray-500

                    flex

                    items-center

                    gap-2

                    "

                    >


                        <Bookmark size={18}/>


                        Save


                    </button>



                </div>







            </motion.div>







        </div>


    );



}









function InfoCard({

    icon,

    title,

    value

}){


    return (


        <div

        className="

        bg-black/20

        rounded-2xl

        p-5

        flex

        gap-3

        items-center

        "

        >


            {icon}



            <div>


                <p className="text-gray-400 text-sm">

                    {title}

                </p>



                <p className="font-semibold">

                    {value || "Not available"}

                </p>


            </div>



        </div>


    );


}