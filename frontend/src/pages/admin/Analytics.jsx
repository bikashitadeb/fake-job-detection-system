// src/pages/admin/Analytics.jsx


import {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    ShieldAlert,

    ShieldCheck,

    BriefcaseBusiness,

    Building2


} from "lucide-react";



import {

    Bar,

    Doughnut

} from "react-chartjs-2";



import {


    Chart as ChartJS,

    CategoryScale,

    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend,



} from "chart.js";



import API from "../../api/API";





ChartJS.register(

    CategoryScale,

    LinearScale,

    BarElement,

    ArcElement,

    Tooltip,

    Legend

);









export default function Analytics(){



    const [data,setData] = useState(null);

    const [error,setError] = useState("");







    useEffect(()=>{


        fetchAnalytics();


    },[]);








    const fetchAnalytics = async()=>{


        try{


            const response = await API.get(

                "/admin/analytics"

            );



            setData(

                response.data.data

            );


        }


        catch(err){


            setError(

                "Unable to load analytics"

            );


        }


    };









    if(error){


        return (

            <div className="text-red-400">

                {error}

            </div>

        );


    }








    if(!data){


        return (

            <div

            className="

            text-white

            animate-pulse

            "

            >

                Loading AI Analytics...

            </div>

        );


    }









    const monthlyJobs = {


        labels:

        data.jobs_per_month?.map(

            item=>item.month

        ) || [],



        datasets:[

            {

                label:"Jobs Posted",


                data:

                data.jobs_per_month?.map(

                    item=>item.count

                ) || [],


                borderRadius:10

            }

        ]

    };









    const fakeVsReal = {


        labels:[

            "Fake Jobs",

            "Genuine Jobs"

        ],



        datasets:[

            {

                data:[

                    data.fake_jobs || 0,

                    data.genuine_jobs || 0

                ]


            }

        ]

    };









    const trustScore = {


        labels:[

            "Low",

            "Medium",

            "High",

            "Excellent"

        ],



        datasets:[

            {

                label:"Trust Distribution",


                data:

                data.trust_distribution || []

            }

        ]

    };









    const companies = {


        labels:

        data.top_companies?.map(

            item=>item.company

        ) || [],



        datasets:[

            {

                label:"Jobs",


                data:

                data.top_companies?.map(

                    item=>item.jobs

                ) || []

            }

        ]

    };









    const cards=[


        {

            title:"Total Jobs",

            value:data.total_jobs || 0,

            icon:<BriefcaseBusiness/>,

            color:"blue"

        },


        {

            title:"Fake Jobs Detected",

            value:data.fake_jobs || 0,

            icon:<ShieldAlert/>,

            color:"red"

        },


        {

            title:"Verified Jobs",

            value:data.genuine_jobs || 0,

            icon:<ShieldCheck/>,

            color:"green"

        },


        {

            title:"Companies",

            value:data.total_companies || 0,

            icon:<Building2/>,

            color:"purple"

        }


    ];









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

                    AI Recruitment Analytics 📊

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Monitor fake job detection,

                    trust scores and recruitment intelligence.

                </p>


            </div>









            {/* KPI CARDS */}



            <div

            className="

            grid

            md:grid-cols-4

            gap-6

            "

            >



            {

            cards.map((card,index)=>(


                <motion.div


                key={index}


                whileHover={{

                    scale:1.05

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



                    <div

                    className="

                    flex

                    justify-between

                    "

                    >


                        <div>


                            <p className="text-gray-400">


                                {card.title}


                            </p>


                            <h2

                            className="

                            text-3xl

                            font-bold

                            mt-2

                            "

                            >

                                {card.value}

                            </h2>


                        </div>


                        <div

                        className="

                        p-3

                        bg-purple-500/20

                        rounded-xl

                        "

                        >

                            {card.icon}

                        </div>


                    </div>


                </motion.div>


            ))

            }


            </div>









            {/* CHARTS */}



            <div

            className="

            grid

            lg:grid-cols-2

            gap-6

            "

            >






                <ChartCard

                title="Jobs Posted Monthly"

                chart={<Bar data={monthlyJobs}/>}

                />





                <ChartCard

                title="Fake vs Genuine Jobs"

                chart={<Doughnut data={fakeVsReal}/>}

                />





                <ChartCard

                title="Trust Score Distribution"

                chart={<Bar data={trustScore}/>}

                />





                <ChartCard

                title="Top Companies"

                chart={<Bar data={companies}/>}

                />





            </div>





        </div>



    );


}









function ChartCard({

    title,

    chart

}){


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



        className="

        bg-white/10

        backdrop-blur-xl

        border

        border-white/20

        rounded-3xl

        p-6

        "

        >


            <h2

            className="

            text-xl

            font-bold

            mb-5

            "

            >

                {title}

            </h2>



            {chart}


        </motion.div>


    );


}