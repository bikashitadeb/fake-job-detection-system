// src/pages/recruiter/RecruiterVerification.jsx


import {

    useState

} from "react";


import {

    motion

} from "framer-motion";


import {


    ShieldCheck,

    ShieldAlert,

    Linkedin,

    Globe,

    Mail,

    Loader2,

    CheckCircle,

    AlertTriangle


} from "lucide-react";


import API from "../../api/API";









export default function RecruiterVerification(){



    const [form,setForm] = useState({

        linkedin_url:"",

        website:"",

        official_email:""

    });



    const [result,setResult] = useState(null);


    const [loading,setLoading] = useState(false);


    const [error,setError] = useState("");









    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:e.target.value

        });


    };









    const verifyRecruiter=async()=>{


        try{


            setLoading(true);

            setError("");



            const response = await API.post(

                "/verification/recruiter",

                form

            );



            setResult(

                response.data.data

                ||

                response.data

            );



        }


        catch(error){


            setError(

                error.response?.data?.message

                ||

                "Verification failed"

            );


        }


        finally{


            setLoading(false);


        }


    };









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

                    Recruiter Verification 🔐

                </h1>



                <p

                className="

                text-gray-400

                mt-2

                "

                >

                    Verify your identity and increase recruiter trust score.

                </p>


            </div>









            {

            error &&



            <div

            className="

            bg-red-500/20

            border

            border-red-500/40

            p-4

            rounded-xl

            "

            >

                {error}


            </div>


            }









            {/* FORM */}



            <div

            className="

            bg-white/10

            backdrop-blur-xl

            border

            border-white/20

            rounded-3xl

            p-8

            "

            >



                <h2

                className="

                text-2xl

                font-bold

                mb-6

                "

                >

                    Company Verification Details

                </h2>









                <div

                className="

                space-y-5

                "

                >






                    <InputBox

                    icon={<Linkedin/>}

                    name="linkedin_url"

                    placeholder="LinkedIn Company/Profile URL"

                    value={form.linkedin_url}

                    onChange={handleChange}

                    />








                    <InputBox

                    icon={<Globe/>}

                    name="website"

                    placeholder="Company Website"

                    value={form.website}

                    onChange={handleChange}

                    />









                    <InputBox

                    icon={<Mail/>}

                    name="official_email"

                    placeholder="Official Company Email"

                    value={form.official_email}

                    onChange={handleChange}

                    />








                    <button


                    disabled={loading}



                    onClick={verifyRecruiter}



                    className="

                    w-full

                    bg-gradient-to-r

                    from-blue-600

                    to-purple-600

                    py-4

                    rounded-xl

                    font-bold

                    flex

                    justify-center

                    gap-3

                    items-center

                    "

                    >



                    {

                    loading

                    ?

                    <>

                    <Loader2

                    className="animate-spin"

                    />

                    Checking...

                    </>



                    :

                    <>

                    <ShieldCheck/>

                    Verify Recruiter

                    </>


                    }



                    </button>




                </div>



            </div>









            {

            result &&



            <VerificationResult

            result={result}

            />



            }





        </div>


    );


}













function VerificationResult({

    result

}){



    const score =

    result.trust_score || 0;





    const verified =

    result.status==="Verified";








    return(



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





            <div

            className="

            flex

            items-center

            gap-3

            "

            >



                {

                verified

                ?

                <ShieldCheck

                className="text-green-400"

                size={40}

                />

                :

                <ShieldAlert

                className="text-yellow-400"

                size={40}

                />

                }





                <h2

                className="

                text-2xl

                font-bold

                "

                >

                    Verification Result

                </h2>


            </div>









            {/* SCORE */}



            <div

            className="

            mt-8

            "

            >



                <p className="text-gray-400">

                    Recruiter Trust Score

                </p>



                <h1

                className="

                text-6xl

                font-black

                "

                >

                    {score}%

                </h1>





                <div

                className="

                h-3

                bg-gray-700

                rounded-full

                mt-4

                "

                >



                    <div

                    style={{

                        width:`${score}%`

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









            {/* CHECKS */}



            <div

            className="

            mt-8

            space-y-4

            "

            >



                <CheckItem

                title="LinkedIn Validation"

                verified={result.linkedin_verified}

                />




                <CheckItem

                title="Website Verification"

                verified={result.website_verified}

                />





                <CheckItem

                title="Official Email Domain"

                verified={result.email_verified}

                />





            </div>









            <div

            className="

            mt-8

            bg-black/20

            rounded-2xl

            p-5

            "

            >



                <h3 className="font-bold">

                    AI Explanation

                </h3>



                <p

                className="

                text-gray-300

                mt-2

                "

                >

                    {

                    result.explanation

                    ||

                    "Verification completed successfully."

                    }

                </p>



            </div>






        </motion.div>



    );


}









function InputBox({

    icon,

    name,

    placeholder,

    value,

    onChange

}){


return(



<div

className="

flex

items-center

gap-3

bg-black/20

border

border-white/20

rounded-xl

px-4

"

>





{icon}





<input


name={name}


value={value}


onChange={onChange}



placeholder={placeholder}



className="

flex-1

bg-transparent

outline-none

py-4

"




/>




</div>



);


}









function CheckItem({

title,

verified

}){


return(


<div

className="

flex

items-center

gap-3

bg-black/20

rounded-xl

p-4

"

>


{

verified

?

<CheckCircle

className="text-green-400"

/>


:

<AlertTriangle

className="text-yellow-400"

/>

}



<span>

{title}

</span>



</div>


);


}