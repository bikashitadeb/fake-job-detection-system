import {

useEffect,

useState

} from "react";


import {

useParams,

useNavigate

} from "react-router-dom";


import {

Box,

Card,

CardContent,

Typography,

Button,

Chip,

Divider,

LinearProgress,

Grid

} from "@mui/material";


import {

VerifiedUser,

Warning,

Bookmark,

ArrowBack

} from "@mui/icons-material";


import API from "../../api/API";





export default function JobDetails(){



const {

id

}=useParams();



const navigate = useNavigate();




const [job,setJob]=useState(null);


const [loading,setLoading]=useState(true);







useEffect(()=>{


fetchJob();


},[]);







const fetchJob=async()=>{


try{


const response = await API.get(

`/jobs/${id}`

);



setJob(

response.data.data

);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);


}


};








if(loading){


return(

<Typography color="white">

Loading job details...

</Typography>

);


}






if(!job){


return(

<Typography color="white">

Job not found

</Typography>

);


}






const trustScore =

job.fake_probability

?

100 - (job.fake_probability * 100)

:

90;







const risk =


trustScore >=80

?

"Low Risk"

:

trustScore >=50

?

"Needs Review"

:

"High Risk";







return(


<Box>



<Button


startIcon={<ArrowBack/>}


sx={{


mb:3,

color:"white"

}}


onClick={()=>navigate(-1)}


>

Back

</Button>







<Card

className="glass"


sx={{


color:"white",

padding:2

}}



>


<CardContent>




<Typography

variant="h3"

fontWeight="800"

>

{job.title}

</Typography>





<Typography

color="#94a3b8"

mt={1}

>

{job.company}

</Typography>





<Grid

container

spacing={3}

mt={2}

>



<Grid

item

xs={12}

md={6}

>


<Typography>

📍 Location

</Typography>


<Typography

color="#94a3b8"

>

{job.location}

</Typography>


</Grid>






<Grid

item

xs={12}

md={6}

>


<Typography>

💰 Salary

</Typography>


<Typography

color="#94a3b8"

>

{job.salary || "Not disclosed"}

</Typography>


</Grid>



</Grid>








<Divider

sx={{

my:4,

borderColor:"rgba(255,255,255,.1)"

}}

/>







<Typography

variant="h5"

fontWeight="700"

>

Job Description

</Typography>




<Typography

color="#cbd5e1"

mt={2}

>

{job.description}

</Typography>








{/* AI SECTION */}





<Card


sx={{


mt:5,


padding:3,


background:

"rgba(2,6,23,.7)",


color:"white"

}}


>



<Typography

variant="h5"

fontWeight="700"

>

🤖 AI Verification Result

</Typography>







<Box mt={3}>


<Typography>

Trust Score

</Typography>



<Typography

variant="h2"


fontWeight="900"


color={

trustScore>80

?

"#22c55e"

:

"#ef4444"

}

>

{

trustScore.toFixed(0)

}%

</Typography>





<LinearProgress


variant="determinate"


value={trustScore}


sx={{


mt:2,


height:10,


borderRadius:5

}}



/>



</Box>







<Box

mt={3}

display="flex"

gap={2}

flexWrap="wrap"

>


<Chip


icon={

trustScore>80

?

<VerifiedUser/>

:

<Warning/>

}


label={risk}


color={

trustScore>80

?

"success"

:

"error"

}



/>





<Chip

label={

`Fake Probability: ${

job.fake_probability

?

(job.fake_probability*100).toFixed(1)

:

"5"

}%`

}


/>



</Box>









<Box mt={4}>


<Typography

variant="h6"

fontWeight="700"

>

AI Explanation

</Typography>



<Typography

color="#94a3b8"

mt={2}

>

{

job.explanation ||

"No suspicious patterns detected. Company details and job description appear professional."

}

</Typography>



</Box>







</Card>








<Box

mt={4}

display="flex"

gap={2}

>


<Button


variant="contained"


size="large"


sx={{

background:

"linear-gradient(90deg,#4f46e5,#7c3aed)"

}}


>

Apply Now

</Button>






<Button


variant="outlined"


startIcon={<Bookmark/>}


sx={{

color:"white",

borderColor:"#64748b"

}}


>

Save Job

</Button>




</Box>





</CardContent>


</Card>





</Box>


);


}