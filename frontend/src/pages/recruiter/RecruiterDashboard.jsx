import {

Grid,

Card,

CardContent,

Typography,

Box,

Chip,

Button,

LinearProgress

} from "@mui/material";


import {

Work,

People,

Security,

VerifiedUser

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";





const stats=[


{

title:"Jobs Posted",

value:"32",

icon:<Work/>,

color:"#2563eb"

},



{

title:"Applications",

value:"245",

icon:<People/>,

color:"#16a34a"

},



{

title:"Recruiter Trust Score",

value:"92%",

icon:<VerifiedUser/>,

color:"#9333ea"

},



{

title:"Verification Status",

value:"Verified",

icon:<Security/>,

color:"#f97316"

}



];







const recentJobs=[


{

title:"Software Engineer",

company:"Tech Solutions",

trust:96,

status:"Verified"

},



{

title:"Frontend Developer",

company:"Startup Labs",

trust:82,

status:"Verified"

},



{

title:"Data Entry Work",

company:"Unknown Company",

trust:35,

status:"Suspicious"

}



];









export default function RecruiterDashboard(){



const navigate = useNavigate();





return(


<Box>




{/* HEADER */}


<Typography

className="dashboard-title"

>

Recruiter Dashboard 👋

</Typography>




<Typography

className="dashboard-subtitle"

mb={4}

>

Manage jobs, verify your profile and track recruitment activity.

</Typography>








{/* STATISTICS */}



<Grid

container

spacing={3}

>


{

stats.map((item,index)=>(



<Grid

item

xs={12}

sm={6}

lg={3}

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

)`


}}



>



<CardContent>



<Box

fontSize={40}

>

{item.icon}

</Box>





<Typography

variant="h4"

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









{/* VERIFICATION SECTION */}



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

Recruiter Verification Score

</Typography>






<Box>



<Typography>

Overall Trust Score

</Typography>



<Typography

variant="h2"

fontWeight="900"

color="#22c55e"

>

92%

</Typography>




<LinearProgress


variant="determinate"


value={92}


sx={{


height:10,


borderRadius:5,


mt:2

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

label="LinkedIn Verified"

color="success"

/>



<Chip

label="Official Email Verified"

color="success"

/>



<Chip

label="Company Verified"

color="success"

/>



</Box>




<Button


variant="contained"


sx={{mt:3}}


onClick={()=>navigate("/recruiter/verification")}


>


Improve Verification

</Button>





</Card>









{/* JOB POSTS */}



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

Recent Job Posts

</Typography>







<Grid

container

spacing={3}

>



{

recentJobs.map((job,index)=>(



<Grid

item

xs={12}

md={4}

key={index}

>



<Card


sx={{


background:"rgba(15,23,42,.8)",


color:"white",


borderRadius:4


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

AI Trust Score

</Typography>



<Typography

variant="h3"

fontWeight="800"

color={

job.trust>80

?

"#22c55e"

:

"#ef4444"

}

>

{job.trust}%

</Typography>



</Box>







<Chip


sx={{mt:2}}


label={job.status}


color={

job.status==="Verified"

?

"success"

:

"error"

}



/>







</CardContent>



</Card>



</Grid>



))


}



</Grid>







</Card>





</Box>


);


}