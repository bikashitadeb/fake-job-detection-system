import {
    useEffect,
    useState
} from "react";


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
    InputAdornment
} from "@mui/material";


import {
    VerifiedUser,
    Search,
    Clear,
    Warning
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

const [searchQuery,setSearchQuery]=useState("");


const [loading,setLoading]=useState(true);


const [error,setError]=useState("");


const [appliedJobs,setAppliedJobs]=useState([]);


const [showVerified,setShowVerified]=useState(false);


const [showSuspicious,setShowSuspicious]=useState(false);


const [activeSection,setActiveSection]=useState("jobs");







useEffect(()=>{

    loadDashboard();

},[]);








const loadDashboard=async()=>{


try{


const profileResponse =
await getProfile();



const jobsResponse =
await getJobs();



const applicationsResponse =
await getApplications();




setUser(
profileResponse.data.user
);



setJobs(
jobsResponse.data.jobs || []
);



setApplications(
applicationsResponse.data.applications || []
);



setAppliedJobs(

applicationsResponse.data.applications?.map(

app=>app.job_id

) || []

);



}

catch(err){


console.log(err);


setError(
"Unable to load employee dashboard"
);


}

finally{

setLoading(false);

}

};








const applyJob=async(jobId)=>{


try{


await API.post(

`/applications/${jobId}/apply`,

{

cover_letter:"",

resume_url:""

}

);



alert(
"Application submitted successfully"
);



setAppliedJobs(prev=>[

...prev,

jobId

]);



loadDashboard();



}

catch(err){


setError(

err.response?.data?.message ||

"Unable to apply"

);


}


};









const handleSearch=(e)=>{


if(e.key==="Enter"){


setSearchQuery(

search.trim()

);


}

};







const clearSearch=()=>{


setSearch("");

setSearchQuery("");

};









const filteredJobs = jobs.filter(job=>{


const query =
searchQuery.toLowerCase();




const matchesSearch =


!query ||

job.title?.toLowerCase()
.includes(query)


||

job.company_name?.toLowerCase()
.includes(query)


||

job.company?.toLowerCase()
.includes(query)


||

job.location?.toLowerCase()
.includes(query);





const matchesVerified =

showVerified

?

job.status==="verified"

:

true;





const matchesSuspicious =

showSuspicious

?

job.is_fake_predicted === true

:

true;





return (

matchesSearch

&&

matchesVerified

&&

matchesSuspicious

);


});









if(loading){


return(

<Box

display="flex"

justifyContent="center"

mt={10}

>

<CircularProgress/>

</Box>

);

}









return(


<Box

sx={{

minHeight:"100vh",

background:
"linear-gradient(135deg,#020617,#172554)",

padding:4,

color:"white"

}}

>





<Typography

variant="h4"

fontWeight="900"

>

Welcome {user?.name || "Employee"} 👋

</Typography>





<Typography

sx={{

color:"#94a3b8",

mb:4

}}

>

Find verified jobs using AI powered fake job detection

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






<Card sx={cardStyle}>


<TextField

fullWidth

placeholder="Search jobs, company or location and press Enter"

value={search}

onChange={(e)=>setSearch(e.target.value)}

onKeyDown={handleSearch}



InputProps={{

startAdornment:(

<InputAdornment position="start">

<Search sx={{color:"white"}}/>

</InputAdornment>

),


endAdornment:

search &&

(

<Clear

sx={{

cursor:"pointer",

color:"white"

}}

onClick={clearSearch}

/>

)

}}


/>


</Card>









<Grid

container

spacing={3}

sx={{mt:2}}

>





<Grid

item

xs={12}

md={3}

>


<Card

sx={statCard}

onClick={()=>{

setShowVerified(false);

setShowSuspicious(false);

setActiveSection("jobs");

}}

>


<Typography>

Available Jobs

</Typography>



<Typography

fontSize={40}

fontWeight="900"

>

{jobs.length}

</Typography>


</Card>

</Grid>








<Grid

item

xs={12}

md={3}

>


<Card

sx={statCard}

onClick={()=>{

setActiveSection("applications");

}}

>


<Typography>

Applications

</Typography>



<Typography

fontSize={40}

fontWeight="900"

>

{applications.length}

</Typography>


</Card>

</Grid>








<Grid

item

xs={12}

md={3}

>


<Card

sx={statCard}

onClick={()=>{

setShowVerified(true);

setShowSuspicious(false);

setActiveSection("jobs");

}}

>


<Typography>

Verified Jobs

</Typography>



<Typography

fontSize={40}

fontWeight="900"

>

{

jobs.filter(

job=>job.status==="verified"

).length

}

</Typography>


</Card>

</Grid>








<Grid

item

xs={12}

md={3}

>


<Card

sx={{

...statCard,

background:
"linear-gradient(135deg,#7f1d1d,#450a0a)"

}}

onClick={()=>{

setShowSuspicious(true);

setShowVerified(false);

setActiveSection("jobs");

}}

>


<Typography>

⚠ Suspicious Jobs

</Typography>



<Typography

fontSize={40}

fontWeight="900"

>

{

jobs.filter(

job=>job.is_fake_predicted===true

).length

}

</Typography>


</Card>

</Grid>






</Grid>









{
activeSection==="jobs" &&

<>


<Typography

variant="h5"

fontWeight="800"

mt={5}

mb={3}

>

{

showSuspicious

?

"⚠ Suspicious Jobs"

:

showVerified

?

"✓ Verified Jobs"

:

"Available Jobs"

}


</Typography>







<Grid

container

spacing={3}

>


{

filteredJobs.length===0

?

<Typography>

No jobs found.

</Typography>


:


filteredJobs.map(job=>(


<Grid

item

xs={12}

md={6}

key={job.id}

>


<Card sx={cardStyle}>


<Typography

variant="h6"

fontWeight="900"

>

{job.title}

</Typography>




<Typography>

Company:

{job.company_name || job.company}

</Typography>




<Typography>

Location:

{job.location}

</Typography>





<Chip

icon={

job.is_fake_predicted

?

<Warning/>

:

<VerifiedUser/>

}

label={

job.is_fake_predicted

?

`Suspicious ${job.fake_probability}%`

:

`AI Trust Score ${job.trust_score || 0}%`

}

sx={{

mt:2,

background:

job.is_fake_predicted

?

"#dc2626"

:

"#22c55e",

color:"white"

}}

/>






{
job.linkedin_verified &&

<Chip

label="LinkedIn Verified"

sx={{

mt:2,

ml:1,

background:"#2563eb",

color:"white"

}}

/>

}





<Button

fullWidth

variant="contained"

sx={{mt:3}}

disabled={

appliedJobs.includes(job.id)

}

onClick={()=>applyJob(job.id)}

>

{

appliedJobs.includes(job.id)

?

"Applied"

:

"Apply Now"

}


</Button>




</Card>


</Grid>


))


}


</Grid>


</>


}







</Box>


);


}







const cardStyle={

background:
"rgba(255,255,255,0.08)",

backdropFilter:"blur(20px)",

border:
"1px solid rgba(255,255,255,0.1)",

borderRadius:5,

padding:3,

color:"white"

};





const statCard={

background:
"linear-gradient(135deg,#1e293b,#0f172a)",

padding:3,

borderRadius:4,

color:"white",

cursor:"pointer"

};