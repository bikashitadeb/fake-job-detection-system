import {
    useState
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    TextField,
    Button,
    Card,
    Typography,
    Box,
    Alert,
    MenuItem,
    CircularProgress
} from "@mui/material";


import {

registerEmployee,

registerRecruiter

} from "../api/auth";





export default function Register(){


const navigate = useNavigate();



const [role,setRole]=useState("employee");



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








const submitRegister=async(e)=>{


e.preventDefault();


setError("");

setSuccess("");

setLoading(true);



try{


let response;



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





setSuccess(

"Registration successful. Redirecting to login..."

);



setTimeout(()=>{


navigate("/login");


},1500);





}

catch(err){


setError(

err.response?.data?.message ||

"Registration failed"

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


justifyContent:"center",


alignItems:"center",


background:

"radial-gradient(circle at top,#312e81,#020617)",


padding:3


}}



>



<Card


sx={{


width:"100%",


maxWidth:500,


padding:5,


borderRadius:5,


background:

"rgba(15,23,42,.9)",


color:"white"


}}

>




<Typography

variant="h4"

fontWeight="800"

mb={1}

>

Create Account

</Typography>



<Typography

sx={{

color:"#94a3b8",

mb:3

}}

>

Join AI Powered Recruitment Platform

</Typography>






{
error &&

<Alert

severity="error"

sx={{mb:2}}

>

{error}

</Alert>

}





{
success &&

<Alert

severity="success"

sx={{mb:2}}

>

{success}

</Alert>

}







<TextField


select


fullWidth


label="Register As"


value={role}


onChange={(e)=>

setRole(e.target.value)

}


margin="normal"



>


<MenuItem value="employee">

Employee

</MenuItem>


<MenuItem value="recruiter">

Recruiter

</MenuItem>


</TextField>








<Box

component="form"

onSubmit={submitRegister}

>



<TextField

fullWidth

label="Full Name"

name="full_name"

value={form.full_name}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="Email"

name="email"

type="email"

value={form.email}

onChange={handleChange}

margin="normal"

/>






<TextField

fullWidth

label="Password"

name="password"

type="password"

value={form.password}

onChange={handleChange}

margin="normal"

/>






<TextField

fullWidth

label="Phone"

name="phone"

value={form.phone}

onChange={handleChange}

margin="normal"

/>







{

role==="recruiter" &&

<>


<TextField

fullWidth

label="Company Name"

name="company_name"

value={form.company_name}

onChange={handleChange}

margin="normal"

/>




<TextField

fullWidth

label="Company Website"

name="company_website"

value={form.company_website}

onChange={handleChange}

margin="normal"

/>




<TextField

fullWidth

label="Official Company Email"

name="official_email"

value={form.official_email}

onChange={handleChange}

margin="normal"

/>





<TextField

fullWidth

label="LinkedIn URL"

name="linkedin_url"

value={form.linkedin_url}

onChange={handleChange}

margin="normal"

/>


</>


}





<Button


fullWidth


type="submit"


variant="contained"


disabled={loading}


sx={{


mt:4,


height:50,


borderRadius:3,


background:

"linear-gradient(90deg,#4f46e5,#7c3aed)"

}}


>


{

loading ?

<CircularProgress

size={25}

color="inherit"

/>

:

"Register"

}


</Button>





<Button

fullWidth

sx={{

mt:2,

color:"#94a3b8"

}}

onClick={()=>navigate("/login")}

>

Already have account? Login

</Button>





</Box>




</Card>




</Box>


);


}