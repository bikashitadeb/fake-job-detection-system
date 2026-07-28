import {

Grid,

Card,

CardContent,

Typography,

Box,

Chip,

Button

} from "@mui/material";



import {

Work,

VerifiedUser,

Bookmark,

Assignment

} from "@mui/icons-material";



import {

useNavigate

} from "react-router-dom";





const stats=[


{

title:"Available Jobs",

value:"124",

icon:<Work/>,

color:"#2563eb"

},



{

title:"Verified Jobs",

value:"98",

icon:<VerifiedUser/>,

color:"#16a34a"

},



{

title:"Saved Jobs",

value:"16",

icon:<Bookmark/>,

color:"#9333ea"

},



{

title:"Applications",

value:"12",

icon:<Assignment/>,

color:"#f97316"

}


];






const jobs=[


{

title:"Software Engineer",

company:"Google",

location:"Bangalore",

trust:96,

status:"Verified"

},



{

title:"Frontend Developer",

company:"Infosys",

location:"Remote",

trust:87,

status:"Verified"

},



{

title:"Data Entry Operator",

company:"Unknown",

location:"Online",

trust:24,

status:"Suspicious"

}



];








export default function EmployeeDashboard(){



const navigate=useNavigate();





return(


<Box>



{/* HEADER */}



<Typography


className="dashboard-title"


>

Employee Dashboard 👋

</Typography>




<Typography


className="dashboard-subtitle"


mb={4}

>

Find verified jobs protected by AI.

</Typography>






{/* STAT CARDS */}


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


sx={{


fontSize:40

}}



>


{item.icon}


</Box>




<Typography


variant="h3"


fontWeight="700"


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









{/* JOB SECTION */}


<Card


className="glass"


sx={{


mt:5,


padding:3

}}


>




<Typography


variant="h5"


fontWeight="700"


mb={3}


>

AI Verified Job Recommendations

</Typography>







<Grid


container

spacing={3}

>



{

jobs.map((job,index)=>(



<Grid


item

xs={12}

md={4}

key={index}

>



<Card


sx={{


height:"100%",


background:

"rgba(15,23,42,.8)",


color:"white",


borderRadius:4,


border:

"1px solid rgba(255,255,255,.08)"

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



<Typography


mt={1}

>

📍 {job.location}

</Typography>






<Box


mt={2}

>



<Typography>


AI Trust Score

</Typography>



<Typography


fontSize={28}


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








<Button


fullWidth


variant="contained"


sx={{mt:3}}


onClick={()=>


navigate("/employee/jobs")


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






</Card>





</Box>


);


}