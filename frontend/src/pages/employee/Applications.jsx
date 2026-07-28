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

Chip,

Button

} from "@mui/material";


import {

Visibility

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";


import API from "../../api/API";





export default function Applications(){



const navigate = useNavigate();



const [applications,setApplications]=useState([]);


const [loading,setLoading]=useState(true);






useEffect(()=>{


fetchApplications();


},[]);







// ============================
// FETCH APPLICATIONS
// ============================


const fetchApplications=async()=>{


try{


const response = await API.get(

"/applications"

);



setApplications(

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









if(loading){


return(

<Typography color="white">

Loading applications...

</Typography>

);


}







const statusColor=(status)=>{


if(status==="accepted")

return "success";


if(status==="rejected")

return "error";


return "warning";


};







return(


<Box>



<Typography

className="dashboard-title"

>

My Applications 📄

</Typography>




<Typography

className="dashboard-subtitle"

mb={4}

>

Track your job applications and recruiter responses.

</Typography>







{

applications.length===0 ?


<Typography

color="#94a3b8"

>

No applications submitted yet.

</Typography>





:


<Grid

container

spacing={3}

>


{

applications.map((application,index)=>(



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

{

application.job?.title ||

application.job_title ||

"Job Position"

}

</Typography>







<Typography

color="#94a3b8"

>

{

application.job?.company ||

application.company ||

"Company"

}

</Typography>








<Box mt={2}>


<Typography>

Applied Date:

</Typography>



<Typography

color="#94a3b8"

>

{

application.created_at ||

"N/A"

}

</Typography>



</Box>







<Chip


sx={{mt:2}}


label={

application.status ||

"Pending"

}



color={

statusColor(

application.status

)

}



/>








{

application.message &&


<Box mt={2}>


<Typography

fontWeight="600"

>

Recruiter Message

</Typography>



<Typography

color="#94a3b8"

>

{

application.message

}

</Typography>



</Box>


}









<Button


fullWidth


variant="contained"


startIcon={<Visibility/>}


sx={{mt:3}}


onClick={()=>


navigate(

`/employee/job/${

application.job_id

}`

)


}



>


View Job

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