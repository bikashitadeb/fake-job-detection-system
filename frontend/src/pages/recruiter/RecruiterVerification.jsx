import {

useState

} from "react";


import {

Box,

Card,

CardContent,

Typography,

TextField,

Button,

Chip,

Alert,

LinearProgress

} from "@mui/material";


import {

VerifiedUser,

Warning,

Security

} from "@mui/icons-material";


import API from "../../api/API";





export default function RecruiterVerification(){



const [form,setForm]=useState({

linkedin_url:"",

website:"",

official_email:""

});



const [result,setResult]=useState(null);


const [loading,setLoading]=useState(false);


const [error,setError]=useState("");







const handleChange=(e)=>{


setForm({

...form,

[e.target.name]:

e.target.value

});


};








const verifyRecruiter=async()=>{


setLoading(true);

setError("");



try{


const response = await API.post(

"/verification/recruiter",

form

);



setResult(

response.data.data

);



}

catch(err){


setError(

err.response?.data?.message ||

"Verification failed"

);


}

finally{


setLoading(false);


}



};









const getStatusColor=()=>{


if(!result)

return "warning";



if(result.status==="Verified")

return "success";



if(result.status==="Suspicious")

return "error";



return "warning";


};









return(


<Box>



<Typography

className="dashboard-title"

>

Recruiter Verification 🔐

</Typography>





<Typography

className="dashboard-subtitle"

mb={4}

>

Verify your identity and increase recruiter trust score.

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







<Card

className="glass"


sx={{

padding:3,

color:"white"

}}



>


<CardContent>



<Typography

variant="h5"

fontWeight="700"

mb={3}

>

Company Verification Details

</Typography>







<TextField


fullWidth


label="LinkedIn Company/Profile URL"


name="linkedin_url"


value={form.linkedin_url}


onChange={handleChange}


margin="normal"


/>







<TextField


fullWidth


label="Company Website"


name="website"


value={form.website}


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








<Button


fullWidth


variant="contained"


size="large"


disabled={loading}


sx={{


mt:3,


height:55,


background:

"linear-gradient(90deg,#4f46e5,#7c3aed)"

}}



onClick={verifyRecruiter}



>


{

loading

?

"Checking..."

:

"Verify Recruiter"

}


</Button>






</CardContent>


</Card>









{

result &&



<Card

className="glass"

sx={{

mt:4,

padding:3,

color:"white"

}}



>



<CardContent>




<Typography

variant="h5"

fontWeight="700"

>

Verification Result

</Typography>







<Box mt={3}>


<Typography>

Recruiter Trust Score

</Typography>



<Typography

variant="h2"

fontWeight="900"

color="#22c55e"

>

{

result.trust_score ||

0

}%

</Typography>







<LinearProgress


variant="determinate"


value={

result.trust_score || 0

}


sx={{

mt:2,

height:10,

borderRadius:5

}}


/>



</Box>








<Chip


sx={{mt:3}}


icon={

result.status==="Verified"

?

<VerifiedUser/>

:

<Warning/>

}



label={

result.status ||

"Needs Review"

}



color={

getStatusColor()

}



/>







<Box mt={3}>


<Typography

fontWeight="700"

>

Verification Checks

</Typography>



<Typography

color="#cbd5e1"

mt={1}

>

✓ LinkedIn URL Validation

</Typography>



<Typography

color="#cbd5e1"

>

✓ Company Website Check

</Typography>



<Typography

color="#cbd5e1"

>

✓ Official Email Domain Check

</Typography>



</Box>









<Box mt={3}>


<Typography

fontWeight="700"

>

AI Explanation

</Typography>



<Typography

color="#94a3b8"

mt={1}

>

{

result.explanation ||

"Verification completed."

}

</Typography>


</Box>





</CardContent>


</Card>



}



</Box>


);


}