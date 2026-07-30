import {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {

    Search,

    MapPin,

    IndianRupee,

    ShieldCheck,

    ShieldAlert,

    Bookmark

} from "lucide-react";


import {

    useNavigate

} from "react-router-dom";


import API from "../../api/API";


import EmptyState from "../../components/EmptyState";









export default function JobPostings(){



    const navigate = useNavigate();



    const [jobs,setJobs] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        fetchJobs();


    },[]);









    const fetchJobs = async()=>{


        try{


            const response = await API.get(

                "/jobs"

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

                "Job fetch error",

                error

            );


        }


        finally{


            setLoading(false);


        }


    };









    const filteredJobs = jobs.filter(

        job =>



        job.title

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )



        ||



        job.company

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );









    if(loading){


        return (

            <div

            className="

            text-white

            animate-pulse

            "

            >

                Loading verified jobs...

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

                    Browse Jobs 💼

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    AI verified opportunities with fraud detection.

                </p>


            </div>









            {/* SEARCH */}



            <div

            className="

            flex

            items-center

            gap-3

            bg-white/10

            backdrop-blur-xl

            border

            border-white/20

            rounded-2xl

            px-5

            py-3

            "

            >



                <Search

                className="text-gray-400"

                />



                <input


                value={search}


                onChange={e=>

                    setSearch(e.target.value)

                }



                placeholder="Search jobs or companies..."



                className="

                flex-1

                bg-transparent

                outline-none

                text-white

                "

                />


            </div>









            {

            filteredJobs.length===0 ?


            <EmptyState


            title="No jobs found"


            description="Try searching with another keyword."


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

            filteredJobs.map(

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

                100-fakeProbability;





                const safe = trustScore>=70;







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

                        safe

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









                    {/* BUTTONS */}



                    <button


                    onClick={()=>navigate(

                        `/employee/job/${job.id}`

                    )}



                    className="

                    mt-6

                    w-full

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    py-3

                    rounded-xl

                    font-semibold

                    "

                    >

                        View Details

                    </button>







                    <button



                    className="

                    mt-3

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

                        <Bookmark size={18}/>

                        Save Job


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