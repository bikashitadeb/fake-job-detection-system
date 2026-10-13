// src/pages/Profile.jsx


import {

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

    ShieldCheck,

    ShieldAlert,

    Edit3,

    Lock,

    LogOut,

    Briefcase


} from "lucide-react";


import {

    useNavigate

} from "react-router-dom";


import API from "../api/API";









export default function Profile(){



    const navigate = useNavigate();



    const [user,setUser] = useState(null);


    const [loading,setLoading] = useState(true);









    useEffect(()=>{


        loadProfile();


    },[]);









    const loadProfile = async()=>{


        try{


            const response = await API.get(

                "/auth/profile"

            );



            setUser(

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









    const logout = ()=>{


        localStorage.removeItem(

            "token"

        );


        navigate("/login");


    };









    if(loading){


        return (

            <div className="text-white animate-pulse">

                Loading profile...

            </div>

        );


    }









    if(!user){


        return (

            <div className="text-white">

                Unable to load profile

            </div>

        );


    }









    const trustScore =

    user.trust_score || 0;









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

                My Profile 👤

            </h1>



            <p

            className="

            text-gray-400

            mt-2

            "

            >

                Manage your account and security settings.

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









            {/* PROFILE HEADER */}



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

                    w-24

                    h-24

                    rounded-full

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    flex

                    items-center

                    justify-center

                    "

                    >

                        <User size={45}/>

                    </div>







                    <div>


                        <h2

                        className="

                        text-3xl

                        font-bold

                        "

                        >

                            {user.name}

                        </h2>



                        <div

                        className="

                        flex

                        gap-2

                        items-center

                        mt-2

                        "

                        >

                            <Briefcase size={18}/>


                            <span

                            className="

                            capitalize

                            "

                            >

                            {user.role}

                            </span>


                        </div>


                    </div>




                </div>









                {

                user.is_verified

                ?

                <ShieldCheck

                size={45}

                className="text-green-400"

                />

                :

                <ShieldAlert

                size={45}

                className="text-yellow-400"

                />

                }



            </div>









            {/* DETAILS */}



            <div

            className="

            grid

            md:grid-cols-2

            gap-5

            mt-10

            "

            >




                <InfoCard

                icon={<Mail/>}

                title="Email"

                value={user.email}

                />






                <InfoCard

                icon={<Phone/>}

                title="Phone"

                value={

                    user.phone ||

                    "Not added"

                }

                />







                <InfoCard

                icon={<Briefcase/>}

                title="Account Type"

                value={user.role}

                />







                <InfoCard

                icon={<ShieldCheck/>}

                title="Account Status"

                value={

                    user.is_active

                    ?

                    "Active"

                    :

                    "Inactive"

                }

                />




            </div>









            {/* TRUST SCORE */}



            <div

            className="

            mt-10

            bg-black/20

            rounded-2xl

            p-6

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









            {/* ACTIONS */}



            <div

            className="

            mt-8

            grid

            md:grid-cols-3

            gap-4

            "

            >




                <button

                className="

                bg-gradient-to-r

                from-blue-600

                to-purple-600

                rounded-xl

                py-3

                flex

                justify-center

                gap-2

                items-center

                "

                >

                    <Edit3 size={18}/>

                    Edit Profile

                </button>







                <button

                className="

                border

                border-white/30

                rounded-xl

                py-3

                flex

                justify-center

                gap-2

                items-center

                "

                >

                    <Lock size={18}/>

                    Change Password

                </button>








                <button


                onClick={logout}


                className="

                border

                border-red-500/40

                text-red-400

                rounded-xl

                py-3

                flex

                justify-center

                gap-2

                items-center

                "

                >

                    <LogOut size={18}/>

                    Logout

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


        <p

        className="

        text-gray-400

        text-sm

        "

        >

            {title}

        </p>



        <p className="font-semibold">

            {value}

        </p>


    </div>



</div>


);


}