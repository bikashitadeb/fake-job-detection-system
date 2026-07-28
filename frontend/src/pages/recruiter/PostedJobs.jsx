import {
    useEffect,
    useState
} from "react";


import {

    Box,

    Grid,

    Card,

    CardContent,

    Typography,

    Button,

    Chip,

    Stack

} from "@mui/material";


import {

Delete,

Edit,

Visibility,

VerifiedUser,

Warning

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";


import API from "../../api/API";





export default function PostedJobs(){



const navigate = useNavigate();



const [jobs,setJobs]=useState([]);


const [loading,setLoading]=useState(true);







useEffect(()=>{


loadJobs();


},[]);







// ==========================
// FETCH RECRUITER JOBS
// ==========================


const loadJobs=async()=>{


try{


const response = await API.get(

"/jobs/my-jobs"

);



setJobs(

response.data.data || []

);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);


}


};









// ==========================
// DELETE JOB
// ==========================


const deleteJob=async(id)=>{


try{


await API.delete(

`/jobs/${id}`

);



setJobs(

jobs.filter(

(job)=>job.id!==id

)

);



}

catch(error){


console.log(error);


}


};








if(loading){


return(

<Typography color="white">

Loading posted jobs...

</Typography>

);


}








return(


<Box>



<Typography

className="dashboard-title"

>

My Posted Jobs 📋

</Typography>




<Typography

className="dashboard-subtitle"

mb={4}

>

Manage your job postings and AI verification results.

</Typography>









{

jobs.length===0 ?


<Typography color="#94a3b8">

No jobs posted yet.

</Typography>




:


<Grid

container

spacing={3}

>



{

jobs.map((job,index)=>(



<Grid

item

xs={12}

md={6}

lg={4}

key={index}

>





<Card

className="glass"


sx={{

height:"100%",

color:"white"

}}


>



<CardContent>





<Typography

variant="h6"

fontWeight="800"

>

{job.title}

</Typography>






<Typography

color="#94a3b8"

>

{job.company}

</Typography>







<Box mt={2}>


<Typography>

📍 {job.location}

</Typography>



<Typography>

💰 {job.salary || "Not disclosed"}

</Typography>



</Box>







<Stack

direction="row"

spacing={1}

mt={3}

flexWrap="wrap"

>


<Chip


icon={

job.status==="verified"

?

<VerifiedUser/>

:

<Warning/>

}


label={

job.status ||

"Pending"

}



color={

job.status==="verified"

?

"success"

:

"warning"

}



/>





<Chip


label={

`Trust Score ${
job.trust_score || 0
}%`

}



/>



</Stack>








<Stack

spacing={1}

mt={3}

>



<Button


variant="contained"


startIcon={<Visibility/>}


onClick={()=>


navigate(

`/employee/job/${job.id}`

)


}

>


View

</Button>






<Button


variant="outlined"


startIcon={<Edit/>}


sx={{


color:"white",

borderColor:"#64748b"

}}

>


Edit

</Button>






<Button


variant="outlined"


startIcon={<Delete/>}


sx={{


color:"#f87171",

borderColor:"#ef4444"

}}



onClick={()=>deleteJob(job.id)}



>


Delete

</Button>





</Stack>







</CardContent>



</Card>





</Grid>



))


}




</Grid>



}




</Box>


);


}