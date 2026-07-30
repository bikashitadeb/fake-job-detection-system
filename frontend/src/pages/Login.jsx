// src/pages/Login.jsx

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
    TextField,
    Button,
    Card,
    Typography,
    Box,
    Alert,
    CircularProgress,
    MenuItem,
    IconButton,
    InputAdornment
} from "@mui/material";


import {
    Shield,
    AutoAwesome,
    Visibility,
    VisibilityOff,
    Email,
    Lock
} from "@mui/icons-material";


import {
    loginUser
} from "../api/auth.js";


import {
    useAuth
} from "../context/AuthContext.jsx";






export default function Login(){


    const navigate = useNavigate();


    const {login}=useAuth();



    const [showPassword,setShowPassword]=useState(false);


    const [loading,setLoading]=useState(false);


    const [error,setError]=useState("");



    const [form,setForm]=useState({

        email:"",

        password:"",

        role:"employee"

    });






    const handleChange=(e)=>{


        setForm({

            ...form,

            [e.target.name]:

            e.target.value

        });


    };









    const handleLogin=async(e)=>{


        e.preventDefault();


        if(loading)

            return;



        setLoading(true);

        setError("");



        try{


            // FIXED:
            // loginUser already returns response.data

            const data = await loginUser(form);



            console.log(

                "LOGIN RESPONSE:",

                data

            );





            if(!data || !data.access_token){


                throw new Error(

                    "Token missing from response"

                );


            }






            localStorage.setItem(

                "access_token",

                data.access_token

            );





            localStorage.setItem(

                "user",

                JSON.stringify(

                    data.user

                )

            );





            login(data);







            const routes={


                employee:

                "/employee/dashboard",



                recruiter:

                "/recruiter/dashboard",



                admin:

                "/admin/dashboard"


            };







            const role = data.user?.role;





            console.log(

                "LOGIN ROLE:",

                role

            );







            if(!role){


                throw new Error(

                    "User role missing"

                );


            }







            navigate(

                routes[role]

            );



        }




        catch(err){



            console.log(

                "LOGIN ERROR",

                err

            );



            setError(


                err.response?.data?.message

                ||

                err.message

                ||

                "Invalid email or password"


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


px:2,



background:



`

radial-gradient(

circle at top left,

rgba(139,92,246,.35),

transparent 40%

),


radial-gradient(

circle at bottom right,

rgba(236,72,153,.3),

transparent 40%

),


#020617

`



}}



>








<motion.div


animate={{

x:[0,80,0],

y:[0,-60,0]

}}



transition={{

duration:12,

repeat:Infinity

}}



style={{


position:"absolute",

width:320,

height:320,

borderRadius:"50%",

background:"rgba(139,92,246,.3)",

filter:"blur(120px)",

top:-100,

left:-100


}}



/>







<motion.div


animate={{


x:[0,-80,0],


y:[0,60,0]


}}



transition={{


duration:15,

repeat:Infinity


}}



style={{


position:"absolute",

width:320,

height:320,

borderRadius:"50%",

background:"rgba(236,72,153,.25)",

filter:"blur(120px)",

bottom:-100,

right:-100


}}


/>









<motion.div


initial={{


opacity:0,

scale:.9,

y:30


}}



animate={{


opacity:1,

scale:1,

y:0


}}



transition={{


duration:.6


}}



>



<Card


sx={{


width:"100%",


maxWidth:430,


p:{


xs:3,

sm:4


},



borderRadius:5,



background:

"rgba(15,23,42,.82)",



backdropFilter:

"blur(25px)",



border:

"1px solid rgba(255,255,255,.12)",



boxShadow:

"0 35px 90px rgba(0,0,0,.6)"



}}



>










<Box


sx={{


textAlign:"center",

mb:3

}}



>


<motion.div


animate={{


rotate:[0,10,-10,0],


scale:[1,1.1,1]


}}



transition={{


duration:4,

repeat:Infinity

}}



>


<Shield


sx={{


fontSize:{


xs:55,

sm:65

},


color:"#c084fc",


filter:

"drop-shadow(0 0 20px #c084fc)"


}}


/>



</motion.div>







<Typography


sx={{


fontSize:{


xs:"2rem",

sm:"2.4rem"

},


fontWeight:900,


background:

"linear-gradient(90deg,#c084fc,#f472b6)",


WebkitBackgroundClip:

"text",


color:"transparent"


}}



>

SecureHire AI

</Typography>







</Box>









{
error &&


<Alert


severity="error"


sx={{


mb:2,


borderRadius:3

}}



>

{error}

</Alert>


}









<form onSubmit={handleLogin}>





<TextField


select


fullWidth


label="Account Type"


name="role"


value={form.role}


onChange={handleChange}



sx={{


...inputStyle,

mb:2

}}



>



<MenuItem value="employee">

Employee

</MenuItem>


<MenuItem value="recruiter">

Recruiter

</MenuItem>


<MenuItem value="admin">

Administrator

</MenuItem>



</TextField>








<TextField


fullWidth


label="Email Address"


name="email"


type="email"


value={form.email}


onChange={handleChange}



sx={{


...inputStyle,

mb:2

}}



slotProps={{


input:{


startAdornment:(


<InputAdornment position="start">


<Email sx={{color:"#c084fc"}}/>


</InputAdornment>


)


}


}}


/>










<TextField


fullWidth


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



sx={inputStyle}



slotProps={{



input:{



startAdornment:(


<InputAdornment position="start">


<Lock sx={{color:"#c084fc"}}/>


</InputAdornment>


),





endAdornment:(


<InputAdornment position="end">


<IconButton


type="button"


onClick={()=>setShowPassword(!showPassword)}


>


{

showPassword

?

<VisibilityOff sx={{color:"white"}}/>

:

<Visibility sx={{color:"white"}}/>

}


</IconButton>



</InputAdornment>


)



}


}}



/>









<motion.div


whileHover={{scale:1.03}}


whileTap={{scale:.96}}



>


<Button


fullWidth


type="submit"


disabled={loading}


variant="contained"



sx={{


mt:3,


height:52,


borderRadius:3,


fontWeight:900,


background:

"linear-gradient(90deg,#8b5cf6,#ec4899)"



}}



>



{

loading

?


<CircularProgress

size={25}

color="inherit"

/>


:

<>

<AutoAwesome sx={{mr:1}}/>

Secure Login

</>


}



</Button>



</motion.div>









<Button


fullWidth


variant="outlined"


onClick={()=>navigate("/register")}



sx={{


mt:2,


height:48,


borderRadius:3,


color:"#c084fc",


borderColor:"rgba(192,132,252,.4)",


fontWeight:700,



"&:hover":{


borderColor:"#ec4899",


background:

"rgba(236,72,153,.08)"


}



}}



>


Create New Account

</Button>







</form>






</Card>



</motion.div>





</Box>


);


}









const inputStyle={



"& .MuiInputLabel-root":{

color:"#94a3b8"

},




"& .MuiOutlinedInput-root":{



borderRadius:3,


background:

"rgba(255,255,255,.05)",


color:"white",




"& .MuiOutlinedInput-input":{


padding:"14px"

},




"& input":{


color:"white",


fontWeight:600


},




"& fieldset":{


borderColor:

"rgba(255,255,255,.18)"


},




"&:hover fieldset":{


borderColor:"#c084fc"


},




"&.Mui-focused fieldset":{


borderColor:"#ec4899",


borderWidth:2


}


}



};