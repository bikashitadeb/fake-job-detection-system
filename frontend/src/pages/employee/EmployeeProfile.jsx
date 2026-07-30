// src/pages/employee/EmployeeProfile.jsx


import React, {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    User,

    Mail,

    Phone,

    FileText,

    Edit3,

    ShieldCheck,

    Award,

    Upload


} from "lucide-react";



import API from "../../api/API";









export default function EmployeeProfile(){



    const [profile,setProfile] = useState(null);


    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        fetchProfile();


    },[]);









    const fetchProfile = async()=>{


        try{


            const response = await API.get(

                "/auth/profile"

            );



            setProfile(

                response.data.user

                ||

                response.data.data

            );


        }


        catch(error){


            console.log(

                "Profile error",

                error

            );


        }


        finally{


            setLoading(false);


        }


    };









    if(loading){


        return (

            <div className="text-white animate-pulse">

                Loading profile...

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

            p-8

            "

            >




                <div

                className="

                flex

                flex-col

                md:flex-row

                gap-6

                items-center

                "

                >





                    {/* PROFILE IMAGE */}



                    <div

                    className="

                    w-32

                    h-32

                    rounded-full

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    flex

                    items-center

                    justify-center

                    shadow-xl

                    "

                    >


                        <User

                        size={60}

                        className="text-white"

                        />


                    </div>









                    <div

                    className="flex-1"

                    >



                        <h1

                        className="

                        text-4xl

                        font-bold

                        "

                        >

                            {

                            profile?.name

                            ||

                            "Employee"

                            }

                        </h1>



                        <p

                        className="

                        text-gray-400

                        mt-2

                        "

                        >

                            Job Seeker Profile

                        </p>






                        <button

                        className="

                        mt-5

                        px-5

                        py-3

                        rounded-xl

                        bg-gradient-to-r

                        from-blue-600

                        to-purple-600

                        flex

                        gap-2

                        items-center

                        "

                        >

                            <Edit3 size={18}/>


                            Edit Profile


                        </button>



                    </div>







                </div>





            </motion.div>









            {/* PROFILE DETAILS */}



            <div

            className="

            grid

            md:grid-cols-2

            gap-6

            "

            >







                <ProfileCard

                    icon={<Mail/>}

                    title="Email"

                    value={profile?.email}

                />




                <ProfileCard

                    icon={<Phone/>}

                    title="Phone"

                    value={profile?.phone || "Not added"}

                />




                <ProfileCard

                    icon={<Award/>}

                    title="Skills"

                    value={profile?.skills || "Add your skills"}

                />




                <ProfileCard

                    icon={<FileText/>}

                    title="Resume"

                    value={profile?.resume_url ? "Uploaded" : "Not uploaded"}

                />






            </div>









            {/* AI TRUST SECTION */}



            <motion.div



            initial={{

                opacity:0,

                scale:0.95

            }}



            animate={{

                opacity:1,

                scale:1

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





                <div

                className="

                flex

                items-center

                gap-3

                "

                >



                    <ShieldCheck

                    className="text-green-400"

                    size={35}

                    />



                    <div>


                        <h2

                        className="

                        text-2xl

                        font-bold

                        "

                        >

                            AI Profile Trust Score

                        </h2>


                        <p

                        className="text-gray-400"

                        >

                            Based on profile completeness and verification

                        </p>


                    </div>


                </div>






                <div

                className="

                mt-6

                "

                >



                    <div

                    className="

                    flex

                    justify-between

                    "

                    >



                        <span>

                            Trust Score

                        </span>


                        <span

                        className="

                        font-bold

                        "

                        >

                            {

                            profile?.trust_score || 0

                            }%

                        </span>


                    </div>






                    <div

                    className="

                    mt-3

                    h-3

                    bg-gray-700

                    rounded-full

                    "

                    >



                        <motion.div


                        initial={{

                            width:0

                        }}


                        animate={{


                            width:

                            `${profile?.trust_score || 0}%`


                        }}


                        transition={{

                            duration:1

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





            </motion.div>









            {/* RESUME UPLOAD */}



            <div

            className="

            bg-white/10

            border

            border-white/20

            rounded-3xl

            p-8

            "

            >



                <h2

                className="

                text-xl

                font-bold

                mb-4

                "

                >

                    Resume

                </h2>





                <button

                className="

                flex

                items-center

                gap-2

                bg-purple-600

                px-6

                py-3

                rounded-xl

                "

                >


                    <Upload size={18}/>


                    Upload Resume


                </button>



            </div>







        </div>



    );



}









function ProfileCard({

    icon,

    title,

    value

}){


    return (



        <motion.div



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



            <div

            className="

            flex

            items-center

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

                    {icon}

                </div>



                <div>


                    <p className="text-gray-400 text-sm">

                        {title}

                    </p>


                    <p className="font-semibold mt-1">

                        {value || "Not available"}

                    </p>


                </div>


            </div>



        </motion.div>


    );

}