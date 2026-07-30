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
    Card,
    Button,
    TextField,
    Chip,
    CircularProgress,
    Alert,
    Grid,
    InputAdornment,
    LinearProgress,
    Avatar
} from "@mui/material";


import {
    Search,
    Clear,
    Warning,
    Security,
    Link,
    Work,
    VerifiedUser,
    Assignment
} from "@mui/icons-material";


import {
    getJobs,
    getApplications,
    getProfile
} from "../../api/dashboard";


import API from "../../api/API";





export default function EmployeeDashboard(){



const [user,setUser]=useState(null);


const [jobs,setJobs]=useState([]);


const [applications,setApplications]=useState([]);



const [search,setSearch]=useState("");



const [loading,setLoading]=useState(true);


const [error,setError]=useState("");



const [appliedJobs,setAppliedJobs]=useState([]);



const [filter,setFilter]=useState("all");



const [activeSection,setActiveSection]=useState("jobs");





useEffect(()=>{

    loadDashboard();

},[]);







// ===============================
// LOAD DASHBOARD DATA
// ===============================

const loadDashboard=async()=>{


try{


const [

profileResponse,

jobsResponse,

applicationsResponse


]=await Promise.all([


getProfile(),


getJobs(),


getApplications()


]);




const profileData =
profileResponse?.data?.user || null;



const jobData =
jobsResponse?.data?.jobs || [];



const applicationData =
applicationsResponse?.data?.applications || [];





setUser(profileData);


setJobs(jobData);


setApplications(applicationData);



setAppliedJobs(

applicationData.map(

app=>app.job_id

)

);




}

catch(error){


console.error(

"Dashboard Loading Error",

error

);



setError(

"Unable to load dashboard"

);


}



finally{


setLoading(false);


}



};









// ===============================
// APPLY JOB
// ===============================

const applyJob=async(jobId)=>{


try{


await API.post(

`/applications/${jobId}/apply`,

{

cover_letter:"",

resume_url:""

}

);



setAppliedJobs(

prev=>[

...prev,

jobId

]

);



loadDashboard();



}

catch(error){


console.error(error);



setError(

error.response?.data?.message ||

"Application failed"

);



}



};









// ===============================
// FILTER JOBS
// ===============================


const filteredJobs = jobs.filter(job=>{


const query =
search.toLowerCase();




const matchesSearch =

!query ||

job.title
?.toLowerCase()
.includes(query)


||


job.company_name
?.toLowerCase()
.includes(query)


||


job.location
?.toLowerCase()
.includes(query);






if(filter==="verified"){


return (

matchesSearch &&

job.linkedin_verified

);


}




if(filter==="suspicious"){


return (

matchesSearch &&

job.is_fake_predicted

);


}




return matchesSearch;



});











// ===============================
// LOADING SCREEN
// ===============================


if(loading){


return(


<Box sx={loadingStyle}>


<motion.div


animate={{

rotate:360

}}


transition={{

duration:2,

repeat:Infinity,

ease:"linear"

}}


>


<Security

sx={{

fontSize:80,

color:"#c084fc"

}}

/>


</motion.div>





<Typography

mt={3}

fontSize={22}

fontWeight="900"

>

Securing your AI job dashboard...

</Typography>



</Box>


);


}






return (
<Box sx={pageStyle}>


{/* Animated Background */}

<motion.div

animate={{

x:[0,80,0],

y:[0,-50,0]

}}

transition={{

duration:12,

repeat:Infinity

}}

style={{

position:"absolute",

width:420,

height:420,

borderRadius:"50%",

background:"rgba(168,85,247,.25)",

filter:"blur(120px)",

top:"0",

left:"5%"

}}

/>



<motion.div

animate={{

x:[0,-80,0],

y:[0,70,0]

}}

transition={{

duration:15,

repeat:Infinity

}}

style={{

position:"absolute",

width:350,

height:350,

borderRadius:"50%",

background:"rgba(14,165,233,.25)",

filter:"blur(120px)",

bottom:"5%",

right:"5%"

}}

/>






{/* HEADER */}


<motion.div

initial={{

opacity:0,

y:-30

}}

animate={{

opacity:1,

y:0

}}

>


<Box

display="flex"

alignItems="center"

gap={2}

>


<Avatar

sx={{

width:70,

height:70,

background:

"linear-gradient(135deg,#9333ea,#2563eb)"

}}

>

{user?.name?.charAt(0) || "U"}

</Avatar>



<Box>


<Typography

variant="h3"

fontWeight="900"

>

Welcome {user?.name || "Employee"} 🚀

</Typography>



<Typography

color="#cbd5e1"

>

AI Powered SecureHire Intelligence Platform

</Typography>


</Box>


</Box>



</motion.div>







{/* ERROR */}


{

error &&

<Alert

severity="error"

sx={{

mt:3,

borderRadius:4

}}

>

{error}

</Alert>

}








{/* STAT CARDS */}


<Grid

container

spacing={3}

mt={4}

>


{

[


[

"Available Jobs",

jobs.length,

"all",

<Work/>

],


[

"Verified Jobs",

jobs.filter(

j=>j.linkedin_verified

).length,

"verified",

<VerifiedUser/>

],



[

"Suspicious Jobs",

jobs.filter(

j=>j.is_fake_predicted

).length,

"suspicious",

<Warning/>

],



[

"Applications",

applications.length,

"applications",

<Assignment/>

]


].map((item,index)=>(



<Grid

item

xs={12}

md={3}

key={index}

>


<motion.div

whileHover={{

scale:1.05,

y:-8

}}

>


<Card

sx={statCard}

onClick={()=>{


if(item[2]==="applications"){

setActiveSection("applications");

}

else{

setActiveSection("jobs");

setFilter(item[2]);

}


}}

>


<Box

display="flex"

alignItems="center"

gap={1}

>

{item[3]}


<Typography

fontWeight="700"

>

{item[0]}

</Typography>


</Box>




<Typography

fontSize={42}

fontWeight="900"

mt={1}

>

{item[1]}

</Typography>



</Card>


</motion.div>


</Grid>



))


}


</Grid>









{/* JOB SECTION */}



{

activeSection==="jobs" &&


<>


<Card

sx={glassCard}

>


<TextField


fullWidth


placeholder="Search jobs, company or location..."


value={search}


onChange={e=>

setSearch(e.target.value)

}


InputProps={{


startAdornment:

<InputAdornment position="start">

<Search

sx={{

color:"white"

}}

/>

</InputAdornment>,



endAdornment:

search &&


<Clear

sx={{

cursor:"pointer",

color:"white"

}}


onClick={()=>setSearch("")}

/>


}}



sx={searchBox}



/>


</Card>







<Typography

variant="h4"

fontWeight="900"

mt={5}

mb={3}

>


{

filter==="verified"

?

"✓ Verified Jobs"

:

filter==="suspicious"

?

"⚠ Suspicious Jobs"

:

"Recommended Jobs"

}


</Typography>







<Grid

container

spacing={3}

>


{

filteredJobs.length===0 &&


<Typography

mt={5}

color="#cbd5e1"

>

No jobs found

</Typography>


}







{

filteredJobs.map(job=>(


<Grid

item

xs={12}

md={6}

key={job.id}

>


<motion.div

whileHover={{

scale:1.03

}}

>



<Card

sx={glassCard}

>




<Typography

variant="h5"

fontWeight="900"

>

{job.title}

</Typography>




<Typography mt={1}>

🏢 {job.company_name}

</Typography>



<Typography>

📍 {job.location}

</Typography>






<Chip


icon={

job.is_fake_predicted

?

<Warning/>

:

<Security/>

}



label={

job.is_fake_predicted

?

`Risk ${job.fake_probability || 0}%`

:

`Trust ${job.trust_score || 0}%`

}


sx={{

mt:2,

color:"white",

background:

job.is_fake_predicted

?

"#dc2626"

:

"#16a34a"

}}


/>






<Box mt={3}>


<Typography>

AI Trust Score

</Typography>



<LinearProgress

variant="determinate"

value={job.trust_score || 0}

sx={progressStyle}

/>


</Box>







{

job.linkedin_verified &&


<Chip

icon={<Link/>}

label="LinkedIn Verified"

sx={{

mt:2,

background:"#2563eb",

color:"white"

}}

/>


}








{

job.ai_explanation &&


<Typography

mt={2}

color="#cbd5e1"

>

🤖 {job.ai_explanation}

</Typography>


}








<Button


fullWidth


variant="contained"


sx={buttonStyle}


disabled={

appliedJobs.includes(job.id)

}



onClick={()=>applyJob(job.id)}


>


{

appliedJobs.includes(job.id)

?

"✓ Applied"

:

"Apply Now"

}



</Button>




</Card>



</motion.div>



</Grid>



))


}



</Grid>



</>


}









{/* APPLICATIONS */}



{

activeSection==="applications" &&


<Card

sx={glassCard}

>


<Typography

variant="h4"

fontWeight="900"

>

My Applications 📄

</Typography>




{

applications.length===0

?


<Typography

mt={3}

>

No applications yet

</Typography>


:


applications.map(app=>{


const job=

jobs.find(

j=>j.id===app.job_id

);



return(


<Card

key={app.id}

sx={applicationCard}

>


<Typography

fontSize={22}

fontWeight="900"

>

{job?.title || "Job"}

</Typography>



<Typography>

🏢 {job?.company_name}

</Typography>



<Chip

label={`Status: ${app.status}`}

sx={{

mt:2,

color:"white"

}}

/>



</Card>


)


})


}



</Card>



}





</Box>

);

}








const pageStyle={


position:"relative",

minHeight:"100vh",

padding:4,

overflow:"hidden",

color:"white",

background:

"linear-gradient(135deg,#020617,#111827,#312e81)"

};





const glassCard={


padding:4,


borderRadius:6,


background:

"rgba(255,255,255,.08)",


backdropFilter:"blur(25px)",


border:

"1px solid rgba(255,255,255,.15)",


color:"white",


boxShadow:

"0 30px 80px rgba(0,0,0,.35)"


};






const statCard={


padding:4,


borderRadius:6,


cursor:"pointer",


color:"white",


background:

"linear-gradient(135deg,#7c3aed,#1e1b4b)",


boxShadow:

"0 20px 50px rgba(124,58,237,.35)"


};






const searchBox={


"& input":{

color:"white"

},


"& .MuiOutlinedInput-root":{

borderRadius:4,

background:"rgba(255,255,255,.1)"

}

};






const progressStyle={


height:10,


borderRadius:10,


background:

"rgba(255,255,255,.2)",



"& .MuiLinearProgress-bar":{


background:

"linear-gradient(90deg,#22c55e,#06b6d4)"


}


};






const buttonStyle={


mt:3,


height:55,


borderRadius:4,


fontWeight:"900",


fontSize:16,


background:

"linear-gradient(90deg,#9333ea,#2563eb)"


};






const applicationCard={


marginTop:3,


padding:3,


borderRadius:5,


background:

"rgba(255,255,255,.08)",


color:"white"


};