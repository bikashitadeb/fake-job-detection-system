// src/pages/recruiter/RecruiterProfile.jsx


import {

    useEffect,

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {

    User,

    Building2,

    Mail,

    Phone,

    ShieldCheck,

    ShieldAlert,

    Edit3,

    Lock

} from "lucide-react";


import API from "../../api/API";









export default function RecruiterProfile(){



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









    if(!profile){


        return (

            <div className="text-white">

                Profile unavailable

            </div>

        );


    }









    const trustScore =

        profile.trust_score || 0;









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

                    Recruiter Profile 👤

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Manage your recruiter account and verification status.

                </p>


            </div>









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







                {/* HEADER */}



                <div

                className="

                flex

                justify-between

                items-center

                "

                >



                    <div

                    className="

                    flex

                    gap-5

                    items-center

                    "

                    >



                        <div

                        className="

                        w-20

                        h-20

                        rounded-full

                        bg-gradient-to-r

                        from-blue-600

                        to-purple-600

                        flex

                        items-center

                        justify-center

                        "

                        >

                            <User size={40}/>


                        </div>






                        <div>


                            <h2

                            className="

                            text-2xl

                            font-bold

                            "

                            >

                                {profile.name}

                            </h2>



                            <p className="text-gray-400">

                                Recruiter Account

                            </p>


                        </div>



                    </div>







                    {

                    profile.is_verified

                    ?

                    <ShieldCheck

                    size={40}

                    className="text-green-400"

                    />

                    :

                    <ShieldAlert

                    size={40}

                    className="text-yellow-400"

                    />

                    }



                </div>









                {/* DETAILS */}



                <div

                className="

                mt-8

                grid

                md:grid-cols-2

                gap-5

                "

                >






                    <ProfileItem

                    icon={<Mail/>}

                    label="Email"

                    value={profile.email}

                    />







                    <ProfileItem

                    icon={<Phone/>}

                    label="Phone"

                    value={profile.phone || "Not added"}

                    />








                    <ProfileItem

                    icon={<Building2/>}

                    label="Company"

                    value={

                        profile.company_name

                        ||

                        "Company not added"

                    }

                    />






                    <ProfileItem

                    icon={<User/>}

                    label="Role"

                    value={profile.role}

                    />







                </div>









                {/* TRUST SCORE */}



                <div

                className="

                mt-8

                bg-black/20

                rounded-2xl

                p-5

                "

                >



                    <div

                    className="

                    flex

                    justify-between

                    "

                    >



                        <span>

                            Recruiter Trust Score

                        </span>



                        <b>

                            {trustScore}%

                        </b>


                    </div>





                    <div

                    className="

                    mt-3

                    h-3

                    bg-gray-700

                    rounded-full

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









                {/* ACTION BUTTONS */}



                <div

                className="

                mt-8

                flex

                gap-4

                "

                >




                    <button


                    className="

                    flex-1

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    py-3

                    rounded-xl

                    flex

                    justify-center

                    items-center

                    gap-2

                    "

                    >


                        <Edit3 size={18}/>


                        Edit Profile


                    </button>







                    <button


                    className="

                    flex-1

                    border

                    border-white/30

                    rounded-xl

                    flex

                    justify-center

                    items-center

                    gap-2

                    "

                    >


                        <Lock size={18}/>


                        Change Password


                    </button>






                </div>








            </motion.div>







        </div>


    );


}









function ProfileItem({

    icon,

    label,

    value

}){


return(



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

            {label}

        </p>



        <p className="font-semibold">

            {value}

        </p>


    </div>



</div>



);


}