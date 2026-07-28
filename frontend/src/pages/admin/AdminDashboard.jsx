import {

useEffect,

useState

} from "react";


import {

Grid,

Card,

CardContent,

Typography,

Box,

Chip,

Table,

TableBody,

TableCell,

TableContainer,

TableHead,

TableRow,

Paper

} from "@mui/material";


import {

People,

Business,

Work,

Warning,

VerifiedUser,

Analytics

} from "@mui/icons-material";


import API from "../../api/API";





export default function AdminDashboard(){



const [stats,setStats]=useState({});


const [fakeJobs,setFakeJobs]=useState([]);


const [loading,setLoading]=useState(true);







useEffect(()=>{


loadDashboard();


},[]);









const loadDashboard=async()=>{


try{


const response = await API.get(

"/admin/dashboard"

);



setStats(

response.data.data.stats || {}

);



setFakeJobs(

response.data.data.fake_jobs || []

);



}

catch(error){


console.log(error);


}

finally{


setLoading(false);


}


};








const cards=[


{


title:"Total Users",

value:stats.total_users || 0,

icon:<People/>,

color:"#2563eb"


},


{


title:"Recruiters",

value:stats.total_recruiters || 0,

icon:<Business/>,

color:"#9333ea"


},


{


title:"Total Jobs",

value:stats.total_jobs || 0,

icon:<Work/>,

color:"#16a34a"


},


{


title:"Fake Jobs",

value:stats.fake_jobs || 0,

icon:<Warning/>,

color:"#dc2626"


},


{


title:"Verified Jobs",

value:stats.verified_jobs || 0,

icon:<VerifiedUser/>,

color:"#0891b2"


},


{


title:"Avg Trust Score",

value:

`${stats.average_trust_score || 0}%`,

icon:<Analytics/>,

color:"#f97316"


}



];







if(loading){


return(

<Typography color="white">

Loading admin dashboard...

</Typography>

);


}








return(


<Box>




<Typography

className="dashboard-title"

>

Admin Dashboard 👑

</Typography>





<Typography

className="dashboard-subtitle"

mb={4}

>

Monitor platform security and AI detection analytics.

</Typography>









<Grid

container

spacing={3}

>



{

cards.map((item,index)=>(



<Grid

item

xs={12}

sm={6}

lg={4}

key={index}

>



<Card


className="glass stat-card"


sx={{


background:

`linear-gradient(

135deg,

${item.color},

#020617

)`,


color:"white"

}}



>


<CardContent>



<Box

fontSize={40}

>

{item.icon}

</Box>




<Typography

variant="h3"

fontWeight="800"

mt={2}

>

{item.value}

</Typography>



<Typography>

{item.title}

</Typography>



</CardContent>


</Card>




</Grid>



))


}




</Grid>









<Card


className="glass"


sx={{


mt:5,

padding:3,

color:"white"

}}



>



<Typography

variant="h5"

fontWeight="700"

mb={3}

>

Suspicious Jobs Detected By AI 🚨

</Typography>








<TableContainer

component={Paper}


sx={{


background:"transparent"

}}


>



<Table>


<TableHead>


<TableRow>


<TableCell

sx={{color:"white"}}

>

Job

</TableCell>


<TableCell

sx={{color:"white"}}

>

Company

</TableCell>


<TableCell

sx={{color:"white"}}

>

Trust Score

</TableCell>


<TableCell

sx={{color:"white"}}

>

Status

</TableCell>


</TableRow>


</TableHead>







<TableBody>



{

fakeJobs.map((job,index)=>(



<TableRow

key={index}

>



<TableCell

sx={{color:"white"}}

>

{job.title}

</TableCell>





<TableCell

sx={{color:"white"}}

>

{job.company}

</TableCell>





<TableCell

sx={{color:"white"}}

>

{job.trust_score}%

</TableCell>





<TableCell>


<Chip


label="Suspicious"


color="error"

/>


</TableCell>






</TableRow>



))


}



</TableBody>



</Table>


</TableContainer>






</Card>








</Box>


);


}