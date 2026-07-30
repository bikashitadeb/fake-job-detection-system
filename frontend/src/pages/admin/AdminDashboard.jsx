import {
    useEffect,
    useState
} from "react";


import {
    motion
} from "framer-motion";


import {
    Box,
    Typography,
    Grid,
    Card,
    Chip,
    Button,
    LinearProgress
} from "@mui/material";


import {
    Security,
    People,
    Work,
    Warning,
    Verified,
    Analytics,
    Delete,
    CheckCircle
} from "@mui/icons-material";


import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";





export default function AdminDashboard(){



const [loading,setLoading]=useState(true);



const [stats,setStats]=useState({

users:2450,

jobs:17880,

fraud:346,

verified:1250

});





const [suspiciousJobs,setSuspiciousJobs]=useState([


{

title:"Work From Home Data Entry",

company:"Unknown Pvt Ltd",

risk:94

},


{

title:"Crypto Investment Manager",

company:"ABC Finance",

risk:91

},


{

title:"Fast Money Executive",

company:"XYZ Solutions",

risk:86

}


]);









useEffect(()=>{


setTimeout(()=>{


setLoading(false);


},1000);



},[]);







if(loading){


return(


<Box

height="100vh"

display="flex"

justifyContent="center"

alignItems="center"

bgcolor="#020617"

>


<Security

sx={{

fontSize:80,

color:"#6366f1"

}}


/>


</Box>


)


}







const fraudData=[


{

name:"Genuine Jobs",

value:65

},


{

name:"Fake Jobs",

value:35

}


];





const modelData=[


{

name:"Accuracy",

value:98

},


{

name:"Precision",

value:96

},


{

name:"Recall",

value:74

}


];








return(



<Box sx={pageStyle}>







<motion.div

initial={{

opacity:0,

y:-50

}}

animate={{

opacity:1,

y:0

}}

>


<Typography

variant="h2"

fontWeight="900"

>

AI Security Command Center 🛡️

</Typography>




<Typography

color="#94a3b8"

fontSize={20}

>

Fake Job Detection Intelligence Platform

</Typography>


</motion.div>









<Grid

container

spacing={3}

mt={4}

>





<StatCard

icon={<People/>}

title="Total Users"

value={stats.users}

/>



<StatCard

icon={<Work/>}

title="Jobs Analysed"

value={stats.jobs}

/>




<StatCard

icon={<Warning/>}

title="Fraud Detected"

value={stats.fraud}

/>



<StatCard

icon={<Verified/>}

title="Verified Companies"

value={stats.verified}

/>



</Grid>









<Card sx={glass}>


<Typography

variant="h4"

fontWeight="900"

>

Platform Security Score

</Typography>





<Typography

fontSize={80}

fontWeight="900"

>

96%

</Typography>




<LinearProgress

variant="determinate"

value={96}

sx={{

height:15,

borderRadius:10

}}

/>



</Card>









<Grid

container

spacing={3}

mt={3}

>




<Grid

item

xs={12}

md={6}

>



<Card sx={glass}>


<Typography

variant="h5"

fontWeight="800"

>

Fraud Distribution

</Typography>





<ResponsiveContainer

width="100%"

height={300}

>


<PieChart>


<Pie

data={fraudData}

dataKey="value"

cx="50%"

cy="50%"

outerRadius={100}

label


>


{

fraudData.map(

(entry,index)=>(


<Cell

key={index}

fill={

index===0

?

"#22c55e"

:

"#ef4444"

}

/>


)

)

}


</Pie>


</PieChart>


</ResponsiveContainer>



</Card>


</Grid>









<Grid

item

xs={12}

md={6}

>



<Card sx={glass}>


<Typography

variant="h5"

fontWeight="800"

>

ML Model Performance

</Typography>





<ResponsiveContainer

width="100%"

height={300}

>


<BarChart

data={modelData}

>


<XAxis dataKey="name"/>


<YAxis/>


<Tooltip/>


<Bar

dataKey="value"

/>



</BarChart>


</ResponsiveContainer>



</Card>



</Grid>



</Grid>









<Card sx={glass}>


<Typography

variant="h4"

fontWeight="900"

mb={3}

>

AI Threat Monitoring 🚨

</Typography>







{

suspiciousJobs.map((job,index)=>(


<motion.div

key={index}

whileHover={{

scale:1.03

}}

>



<Card

sx={dangerCard}

>



<Typography

variant="h6"

fontWeight="900"

>

{job.title}

</Typography>




<Typography>

Company:

{job.company}

</Typography>





<Chip

icon={<Warning/>}

label={

`Risk Score ${job.risk}%`

}

sx={{

mt:2,

background:"#dc2626",

color:"white"

}}


/>






<Box mt={2}>


<Button

variant="contained"

color="success"

startIcon={<CheckCircle/>}

>

Approve

</Button>




<Button

variant="contained"

color="error"

startIcon={<Delete/>}

sx={{ml:2}}

>

Remove

</Button>



</Box>




</Card>


</motion.div>


))


}





</Card>









<Card sx={glass}>


<Typography

variant="h4"

fontWeight="900"

>

AI Intelligence Modules

</Typography>





<Grid

container

spacing={3}

mt={2}

>



{

[

"NLP Risk Analysis",

"Company Verification",

"Fake Job Prediction",

"Resume Intelligence",

"Semantic Matching"

].map((x,i)=>(



<Grid

item

xs={12}

md={4}

key={i}

>



<motion.div

whileHover={{

scale:1.05

}}

>


<Card sx={moduleCard}>


<Analytics/>


<Typography

mt={2}

fontWeight="800"

>

{x}

</Typography>



</Card>


</motion.div>



</Grid>



))


}



</Grid>



</Card>







</Box>


);


}









function StatCard({

icon,

title,

value

}){


return(


<Grid

item

xs={12}

md={3}

>


<motion.div

whileHover={{

scale:1.08,

y:-10

}}

>


<Card sx={statCard}>


{icon}



<Typography

fontSize={45}

fontWeight="900"

>

{value}

</Typography>



<Typography>

{title}

</Typography>



</Card>


</motion.div>


</Grid>


);


}









const pageStyle={


minHeight:"100vh",

padding:4,

color:"white",


background:

"linear-gradient(135deg,#020617,#111827,#312e81)"


};






const glass={


padding:4,

mt:4,

borderRadius:6,


background:

"rgba(255,255,255,.08)",


backdropFilter:"blur(25px)",


border:

"1px solid rgba(255,255,255,.1)",


color:"white"

};






const statCard={


padding:3,

borderRadius:5,


background:

"linear-gradient(135deg,#1e1b4b,#020617)",


color:"white"

};





const dangerCard={


padding:3,

marginBottom:2,

borderRadius:5,


background:

"rgba(127,29,29,.35)",


color:"white"


};





const moduleCard={


padding:3,

borderRadius:5,


background:

"rgba(255,255,255,.05)",


color:"white"

};