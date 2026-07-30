// src/pages/Register.jsx


import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    motion
} from "framer-motion";



import {

    Person,

    Business,

    Email,

    Phone,

    Lock,

    Visibility,

    VisibilityOff

} from "@mui/icons-material";



import {

    Box,

    Card,

    Typography,

    TextField,

    Button,

    Alert,

    ToggleButton,

    ToggleButtonGroup,

    InputAdornment,

    IconButton,

    CircularProgress

} from "@mui/material";



import {

    registerEmployee,

    registerRecruiter

} from "../api/auth";







export default function Register(){



const navigate = useNavigate();



const [role,setRole]=useState("employee");


const [showPassword,setShowPassword]=useState(false);


const [loading,setLoading]=useState(false);


const [error,setError]=useState("");


const [success,setSuccess]=useState("");





const [form,setForm]=useState({


    full_name:"",

    email:"",

    password:"",

    phone:"",


    company_name:"",

    company_website:"",

    linkedin_url:"",

    official_email:""


});



const handleChange=(e)=>{


    setForm({

        ...form,

        [e.target.name]:

        e.target.value

    });


};
// =====================================================
// REGISTER SUBMIT
// =====================================================


const submitRegister = async(e)=>{


    e.preventDefault();


    setLoading(true);

    setError("");

    setSuccess("");




    try{


        let response;




        // ==========================
        // EMPLOYEE REGISTER
        // ==========================


        if(role==="employee"){



            response = await registerEmployee({


                full_name:

                form.full_name,



                email:

                form.email,



                password:

                form.password,



                phone:

                form.phone


            });



        }




        // ==========================
        // RECRUITER REGISTER
        // ==========================


        else{



            response = await registerRecruiter({



                full_name:

                form.full_name,



                email:

                form.email,



                password:

                form.password,



                phone:

                form.phone,



                company_name:

                form.company_name,



                company_website:

                form.company_website,



                linkedin_url:

                form.linkedin_url,



                official_email:

                form.official_email



            });



        }








        console.log(

            "REGISTER SUCCESS:",

            response.data

        );







        setSuccess(

            "Account created successfully 🚀 Redirecting..."

        );







        setTimeout(()=>{


            navigate("/login");


        },1500);





    }



    catch(err){



        console.log(

            "REGISTER ERROR:",

            err

        );





        setError(


            err.response?.data?.message

            ||

            "Registration failed. Please try again."


        );



    }



    finally{


        setLoading(false);


    }



};
return(


<Box


sx={{


minHeight:"100vh",


display:"flex",


alignItems:"center",


justifyContent:"center",


position:"relative",


overflow:"hidden",


padding:{


xs:2,

sm:4


},



background:

`

radial-gradient(

circle at 10% 10%,

rgba(139,92,246,.35),

transparent 35%

),


radial-gradient(

circle at 90% 90%,

rgba(236,72,153,.25),

transparent 35%

),


#020617

`



}}



>





{/* ==========================
    FLOATING GLOW EFFECTS
========================== */}



<Box


sx={{


position:"absolute",


width:300,


height:300,


borderRadius:"50%",


background:

"rgba(139,92,246,.25)",


filter:"blur(100px)",


top:-120,


left:-120



}}


/>







<Box


sx={{


position:"absolute",


width:350,


height:350,


borderRadius:"50%",


background:

"rgba(236,72,153,.20)",


filter:"blur(120px)",


bottom:-150,


right:-150



}}


/>









{/* ==========================
    MAIN CARD ANIMATION
========================== */}



<motion.div



initial={{

opacity:0,

y:40,

scale:.95

}}



animate={{

opacity:1,

y:0,

scale:1

}}



transition={{

duration:.6,

ease:"easeOut"

}}



style={{

width:"100%",

display:"flex",

justifyContent:"center"

}}



>







<Card


sx={{


width:"100%",


maxWidth:620,


padding:{


xs:3,


sm:5


},


zIndex:2



}}


>









{/* ==========================
        HEADER
========================== */}




<Typography


sx={{



fontSize:{


xs:"2.2rem",


sm:"3rem"


},



fontWeight:900,


lineHeight:1.1,



background:


"linear-gradient(90deg,#c084fc,#ec4899)",



WebkitBackgroundClip:

"text",



color:"transparent"



}}


>


Create Account 🚀


</Typography>








<Typography


color="text.secondary"


sx={{


mt:1,


mb:4,


fontSize:"1.05rem"


}}


>


Join SecureHire AI Recruitment Platform


</Typography>








{/* ERROR */}



{

error &&



<Alert


severity="error"


sx={{mb:3}}


>


{error}


</Alert>


}







{/* SUCCESS */}



{

success &&



<Alert


severity="success"


sx={{mb:3}}


>


{success}


</Alert>


}







{/* ==========================
        ROLE SELECT
========================== */}



<ToggleButtonGroup


fullWidth


exclusive


value={role}


onChange={(e,value)=>{


if(value)

setRole(value)


}}



sx={{



mb:3,



"& .MuiToggleButton-root":{


height:55,


fontWeight:700,


fontSize:"1rem"



}



}}



>






<ToggleButton


value="employee"


>


<Person

sx={{mr:1}}

/>


Employee


</ToggleButton>







<ToggleButton


value="recruiter"


>


<Business

sx={{mr:1}}

/>


Recruiter


</ToggleButton>







</ToggleButtonGroup>
<form

onSubmit={submitRegister}

>


<motion.div


initial={{

opacity:0,

y:20

}}


animate={{

opacity:1,

y:0

}}



transition={{


duration:.5

}}



>





<TextField


label="Full Name"


name="full_name"


value={form.full_name}


onChange={handleChange}




InputProps={{



startAdornment:(


<InputAdornment position="start">


<Person/>


</InputAdornment>


)



}}



sx={{


mb:2


}}



/>









<TextField


label="Email Address"


name="email"


type="email"


value={form.email}


onChange={handleChange}





InputProps={{



startAdornment:(


<InputAdornment position="start">


<Email/>


</InputAdornment>


)



}}



sx={{


mb:2


}}



/>









<TextField


label="Password"


name="password"



type={

showPassword

?

"text"

:

"password"

}



value={form.password}


onChange={handleChange}





InputProps={{



startAdornment:(


<InputAdornment position="start">


<Lock/>


</InputAdornment>


),






endAdornment:(


<InputAdornment position="end">


<IconButton



onClick={()=>


setShowPassword(

!showPassword

)


}



edge="end"



>



{


showPassword

?

<VisibilityOff/>

:

<Visibility/>

}



</IconButton>


</InputAdornment>


)



}}





sx={{


mb:2


}}



/>









<TextField


label="Phone Number"


name="phone"


value={form.phone}


onChange={handleChange}




InputProps={{



startAdornment:(


<InputAdornment position="start">


<Phone/>


</InputAdornment>


)



}}



sx={{


mb:2


}}



/>







</motion.div>













{/* ==========================
    RECRUITER SECTION
========================== */}





{

role==="recruiter" &&



<motion.div


initial={{


opacity:0,


height:0


}}



animate={{


opacity:1,


height:"auto"


}}



transition={{


duration:.4


}}



>



<Typography


variant="h6"


fontWeight="800"


sx={{


mt:2,


mb:2,


color:"#c084fc"


}}


>


Company Verification Details


</Typography>







<TextField


label="Company Name"


name="company_name"


value={form.company_name}


onChange={handleChange}



sx={{


mb:2


}}



/>







<TextField


label="Company Website"


name="company_website"


value={form.company_website}


onChange={handleChange}



sx={{


mb:2


}}



/>









<TextField


label="Official Company Email"


name="official_email"


value={form.official_email}


onChange={handleChange}



sx={{


mb:2


}}



/>









<TextField


label="LinkedIn URL"


name="linkedin_url"


value={form.linkedin_url}


onChange={handleChange}



sx={{


mb:2


}}



/>







</motion.div>



}

<Button


fullWidth


type="submit"


disabled={loading}



sx={{


mt:3,


height:58,


fontSize:"1rem",


fontWeight:800,


borderRadius:4,



background:

"linear-gradient(90deg,#8b5cf6,#ec4899)",



"&:hover":{


transform:"translateY(-3px)",


boxShadow:

"0 20px 40px rgba(236,72,153,.35)"

}



}}



>



{

loading ?



<CircularProgress


size={26}


sx={{


color:"white"


}}


/>



:



"Create Account 🚀"



}



</Button>









{/* LOGIN BUTTON */}



<Button



fullWidth



variant="text"



onClick={()=>navigate("/login")}



sx={{



mt:2,


color:"#cbd5e1",


fontWeight:600



}}



>



Already have an account? Login



</Button>







</form>







</Card>







</motion.div>







</Box>


);



}