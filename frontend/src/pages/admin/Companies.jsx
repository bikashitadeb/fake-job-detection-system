// src/pages/admin/Companies.jsx


import React, {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    Search,

    ShieldCheck,

    ShieldAlert,

    Building2,

    Linkedin,

    CheckCircle,

    XCircle


} from "lucide-react";



import API from "../../api/API";









export default function Companies(){



    const [companies,setCompanies] = useState([]);

    const [search,setSearch] = useState("");

    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        fetchCompanies();


    },[]);









    const fetchCompanies = async()=>{


        try{


            const response = await API.get(

                "/admin/companies"

            );


            setCompanies(

                response.data.data || []

            );


        }


        catch(error){


            console.log(error);


        }


        finally{


            setLoading(false);


        }


    };









    const updateStatus = async(

        id,

        status

    )=>{


        try{


            await API.put(

                `/admin/companies/${id}/status`,

                {

                    verification_status:status

                }

            );


            fetchCompanies();


        }


        catch(error){


            console.log(error);


        }


    };









    const filteredCompanies = companies.filter(

        company =>

        company.company_name

        ?.toLowerCase()

        .includes(

            search.toLowerCase()

        )

    );









    if(loading){


        return (

            <div className="text-white animate-pulse">

                Loading companies...

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

                    Company Intelligence 🏢

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Monitor company verification,

                    reputation and AI trust scores.

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



                placeholder="Search companies..."



                className="

                bg-transparent

                outline-none

                flex-1

                text-white

                "

                />


            </div>









            {/* COMPANY GRID */}



            <div

            className="

            grid

            md:grid-cols-2

            xl:grid-cols-3

            gap-6

            "

            >



            {

            filteredCompanies.map(

            (company,index)=>(



                <motion.div



                key={company.id}



                initial={{

                    opacity:0,

                    y:20

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







                    {/* COMPANY HEADER */}



                    <div

                    className="

                    flex

                    justify-between

                    "

                    >



                        <div

                        className="

                        flex

                        gap-3

                        "

                        >


                            <div

                            className="

                            p-3

                            bg-purple-500/20

                            rounded-xl

                            "

                            >

                                <Building2/>

                            </div>



                            <div>


                                <h2

                                className="

                                font-bold

                                text-xl

                                "

                                >

                                    {

                                    company.company_name

                                    }


                                </h2>



                                <p

                                className="

                                text-sm

                                text-gray-400

                                "

                                >

                                    {

                                    company.industry

                                    ||

                                    "Technology"

                                    }

                                </p>


                            </div>


                        </div>







                        {

                        company.linkedin_verified

                        ?


                        <Linkedin

                        className="text-blue-400"

                        />


                        :


                        <ShieldAlert

                        className="text-yellow-400"

                        />


                        }


                    </div>









                    {/* TRUST SCORE */}



                    <div

                    className="

                    mt-6

                    bg-black/20

                    rounded-2xl

                    p-4

                    "

                    >


                        <p className="text-gray-400 text-sm">

                            AI Trust Score

                        </p>



                        <div

                        className="

                        flex

                        justify-between

                        items-center

                        "

                        >

                            <span

                            className="

                            text-3xl

                            font-bold

                            "

                            >

                                {

                                company.trust_score || 0

                                }%

                            </span>



                            {

                            company.trust_score >=70

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


                    </div>









                    {/* STATUS */}



                    <div

                    className="

                    mt-4

                    flex

                    justify-between

                    items-center

                    "

                    >



                        <span

                        className={`

                        px-3

                        py-1

                        rounded-full

                        text-sm

                        font-semibold


                        ${

                        company.verification_status==="verified"

                        ?

                        "bg-green-500/20 text-green-400"

                        :

                        "bg-yellow-500/20 text-yellow-400"

                        }

                        `}

                        >

                            {

                            company.verification_status

                            ||

                            "pending"

                            }


                        </span>





                    </div>









                    {/* ACTIONS */}



                    <div

                    className="

                    flex

                    gap-3

                    mt-6

                    "

                    >



                        <button


                        onClick={()=>updateStatus(

                            company.id,

                            "verified"

                        )}



                        className="

                        flex-1

                        flex

                        items-center

                        justify-center

                        gap-2

                        bg-green-600

                        py-2

                        rounded-xl

                        "

                        >

                            <CheckCircle size={16}/>

                            Approve

                        </button>








                        <button


                        onClick={()=>updateStatus(

                            company.id,

                            "rejected"

                        )}



                        className="

                        flex-1

                        flex

                        items-center

                        justify-center

                        gap-2

                        bg-red-600

                        py-2

                        rounded-xl

                        "

                        >

                            <XCircle size={16}/>

                            Reject

                        </button>



                    </div>






                </motion.div>



            )

            )

            }





            </div>






        </div>



    );


}