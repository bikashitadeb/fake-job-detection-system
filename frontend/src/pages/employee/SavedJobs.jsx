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

Chip

} from "@mui/material";


import {

Bookmark,

Delete,

Visibility

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";


import API from "../../api/API";





export default function SavedJobs(){



const navigate = useNavigate();



const [jobs,setJobs]=useState([]);


const [loading,setLoading]=useState(true);






useEffect(()=>{


fetchSavedJobs();


},[]);








// ============================
// GET SAVED JOBS
// ============================


const fetchSavedJobs=async()=>{


try{


const response = await API.get(

"/saved-jobs"

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







// ============================
// REMOVE SAVED JOB
// ============================


const removeJob=async(id)=>{


try{


await API.delete(

`/saved-jobs/${id}`

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

Loading saved jobs...

</Typography>

);


}






return(


<Box>



<Typography

className="dashboard-title"

>

Saved Jobs ⭐

</Typography>




<Typography

className="dashboard-subtitle"

mb={4}

>

Your bookmarked opportunities.

</Typography>







{

jobs.length===0 ?



<Typography

color="#94a3b8"

>

No saved jobs yet.

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

fontWeight="700"

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







<Chip


sx={{mt:2}}


label={

job.status ||

"Pending"

}


/>







<Button


fullWidth


variant="contained"


startIcon={<Visibility/>}


sx={{mt:3}}


onClick={()=>


navigate(

`/employee/job/${job.id}`

)


}



>


View Job

</Button>







<Button


fullWidth


startIcon={<Delete/>}


sx={{


mt:1,


color:"#f87171"

}}



onClick={()=>removeJob(job.id)}


>


Remove

</Button>







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