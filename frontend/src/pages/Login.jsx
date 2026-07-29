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
    CircularProgress,
    MenuItem
} from "@mui/material";


import {
    loginUser
} from "../api/auth.js";


import {
    useAuth
} from "../context/AuthContext.jsx";







export default function Login(){


const navigate = useNavigate();



const {
    login
}=useAuth();





const [form,setForm]=useState({

    email:"",

    password:"",

    role:"employee"

});





const [error,setError]=useState("");

const [loading,setLoading]=useState(false);






const handleChange=(e)=>{


setForm({

    ...form,

    [e.target.name]:e.target.value

});


};








const handleLogin=async(e)=>{


e.preventDefault();


setError("");

setLoading(true);




try{


const response = await loginUser(form);



const data=response.data;



console.log(
    "LOGIN RESPONSE:",
    data
);





if(!data.user){


throw new Error(
    "User data missing"
);

}







login({

    access_token:data.access_token,

    user:data.user

});







switch(data.user.role){



case "employee":


navigate(
    "/employee/dashboard"
);


break;





case "recruiter":


navigate(
    "/recruiter/dashboard"
);


break;





case "admin":


navigate(
    "/admin/dashboard"
);


break;





default:


navigate("/login");


}




}



catch(err){



console.log(

    "LOGIN ERROR:",

    err.response?.data || err.message

);





setError(

err.response?.data?.message ||

err.message ||

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


background:

"radial-gradient(circle at top,#312e81,#020617)",


padding:3


}}



>



<Card


sx={{


width:"100%",


maxWidth:420,


padding:5,


borderRadius:5,


background:

"rgba(15,23,42,.85)",


backdropFilter:

"blur(20px)",


color:"white"


}}



>



<Typography

variant="h4"

fontWeight="800"

mb={1}

>

Welcome Back

</Typography>





<Typography

sx={{

color:"#94a3b8",

mb:4

}}

>

AI Powered Fake Job Detection System

</Typography>








{
error &&

<Alert

severity="error"

sx={{mb:3}}

>

{error}

</Alert>

}









<Box

component="form"

onSubmit={handleLogin}

>






{/* ROLE SELECT */}

<TextField


select


fullWidth


label="Login As"


name="role"


value={form.role}


onChange={handleChange}


margin="normal"



InputLabelProps={{

style:{

color:"#94a3b8"

}

}}



sx={{


"& .MuiOutlinedInput-root":{

"& fieldset":{

borderColor:"#475569"

}

}


}}



>


<MenuItem value="employee">

Employee

</MenuItem>



<MenuItem value="recruiter">

Recruiter

</MenuItem>



</TextField>









<TextField

fullWidth

label="Email"

name="email"

type="email"

value={form.email}

onChange={handleChange}

margin="normal"



InputLabelProps={{

style:{

color:"#94a3b8"

}

}}



sx={{

input:{

color:"white"

},


"& .MuiOutlinedInput-root":{

"& fieldset":{

borderColor:"#475569"

}

}

}}


/>









<TextField

fullWidth

label="Password"

name="password"

type="password"

value={form.password}

onChange={handleChange}

margin="normal"



InputLabelProps={{


style:{

color:"#94a3b8"

}

}}



sx={{

input:{

color:"white"

},


"& .MuiOutlinedInput-root":{

"& fieldset":{

borderColor:"#475569"

}

}

}}


/>











<Button

fullWidth

type="submit"

variant="contained"

size="large"

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

"Login"

}



</Button>









<Button

fullWidth

sx={{

mt:2,

color:"#94a3b8"

}}


onClick={()=>navigate("/register")}

>


Create Account


</Button>







</Box>




</Card>





</Box>


);


}