import {
    useEffect,
    useState
} from "react";


import {
    Box,
    Typography,
    Grid,
    Card,
    Button,
    CircularProgress,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from "@mui/material";


import {
    Work,
    People,
    VerifiedUser,
    Notifications,
    Add
} from "@mui/icons-material";


import {
    useNavigate
} from "react-router-dom";


import {
    getRecruiterDashboard
} from "../../api/recruiter";





export default function RecruiterDashboard(){


const navigate = useNavigate();



const [dashboard,setDashboard]=useState(null);

const [notifications,setNotifications]=useState([]);

const [loading,setLoading]=useState(true);

const [error,setError]=useState("");



const [verifyOpen,setVerifyOpen]=useState(false);

const [verifyType,setVerifyType]=useState("");

const [verifyValue,setVerifyValue]=useState("");








useEffect(()=>{


loadDashboard();


},[]);








const loadDashboard=async()=>{


try{


const response = await getRecruiterDashboard();


console.log(

"RECRUITER DASHBOARD",

response.data

);



setDashboard(

response.data

);



setNotifications([]);



}


catch(err){


console.log(

err

);


setError(

"Unable to load recruiter dashboard"

);


}


finally{


setLoading(false);


}


};








const openVerification=(type)=>{


setVerifyType(type);

setVerifyValue("");

setVerifyOpen(true);


};







const submitVerification=()=>{


console.log(

"Verification Submitted:",

verifyType,

verifyValue

);


setVerifyOpen(false);


};








if(loading){


return(

<Box

height="100vh"

display="flex"

justifyContent="center"

alignItems="center"

>

<CircularProgress/>

</Box>

);


}







const jobs =

dashboard?.jobs || [];



const applications =

dashboard?.applications || [];



const user =

dashboard?.user;








return(


<Box

sx={{

minHeight:"100vh",

background:

"linear-gradient(135deg,#020617,#111827,#312e81)",

padding:4,

color:"white"

}}

>





<Typography

variant="h4"

fontWeight="900"

>

Recruiter Dashboard 👋

</Typography>





<Typography

sx={{

color:"#94a3b8",

mb:4

}}

>

Welcome {user?.name || "Recruiter"} • Manage jobs, applicants and verification

</Typography>







{
error &&

<Typography

color="error"

>

{error}

</Typography>

}








<Grid

container

spacing={3}

>



<Grid item xs={12} md={3}>

<StatCard

icon={<Work/>}

title="Jobs Posted"

value={jobs.length}

/>

</Grid>





<Grid item xs={12} md={3}>

<StatCard

icon={<People/>}

title="Applications"

value={applications.length}

/>

</Grid>





<Grid item xs={12} md={3}>

<StatCard

icon={<VerifiedUser/>}

title="Trust Score"

value="92%"

/>

</Grid>





<Grid item xs={12} md={3}>

<StatCard

icon={<Notifications/>}

title="Notifications"

value={notifications.length}

/>

</Grid>



</Grid>









<Card sx={cardStyle}>


<Typography

variant="h5"

fontWeight="800"

mb={3}

>

Quick Actions

</Typography>





<Button

variant="contained"

startIcon={<Add/>}

onClick={()=>navigate("/recruiter/post-job")}

sx={buttonStyle}

>

Post New Job

</Button>





<Button

variant="outlined"

onClick={()=>navigate("/recruiter/applicants")}

sx={{

...buttonStyle,

ml:2,

color:"white",

borderColor:"#64748b"

}}

>

View Applicants

</Button>



</Card>









<Card sx={cardStyle}>


<Typography

variant="h5"

fontWeight="800"

>

Recruiter Verification Score

</Typography>





<Typography

fontSize={70}

fontWeight="900"

>

92%

</Typography>







<Box

sx={{

height:12,

background:"#334155",

borderRadius:10

}}

>



<Box

sx={{

width:"92%",

height:"100%",

background:

"linear-gradient(90deg,#6366f1,#22c55e)",

borderRadius:10

}}

/>



</Box>








<Box mt={3}>


<Button

variant="contained"

onClick={()=>openVerification("LinkedIn")}

sx={verifyButtonStyle}

>

LinkedIn Verified

</Button>





<Button

variant="contained"

onClick={()=>openVerification("Email")}

sx={verifyButtonStyle}

>

Email Verified

</Button>





<Button

variant="contained"

onClick={()=>openVerification("Company")}

sx={verifyButtonStyle}

>

Company Verified

</Button>



</Box>



</Card>









<Card sx={cardStyle}>


<Typography

variant="h5"

fontWeight="800"

mb={3}

>

Recent Job Posts

</Typography>





{

jobs.length===0

?

<Typography>

No jobs posted yet.

</Typography>



:

jobs.map(job=>(


<Card

key={job.id}

sx={{

background:"rgba(255,255,255,.06)",

padding:3,

marginBottom:2,

color:"white"

}}

>


<Typography

fontWeight="800"

>

{job.title}

</Typography>



<Typography>

{job.company_name}

</Typography>



</Card>


))


}



</Card>









<Card sx={cardStyle}>


<Typography

variant="h5"

fontWeight="800"

>

Notifications 🔔

</Typography>



<Divider

sx={{

my:2,

borderColor:"#475569"

}}

/>





<Typography>

No new notifications

</Typography>



</Card>









<Dialog

open={verifyOpen}

onClose={()=>setVerifyOpen(false)}

fullWidth

maxWidth="sm"

>


<DialogTitle>

Verify {verifyType}

</DialogTitle>




<DialogContent>


<TextField

fullWidth

sx={{mt:2}}

label={

verifyType==="LinkedIn"

?

"LinkedIn Profile URL"

:

verifyType==="Email"

?

"Official Email Address"

:

"Company Registration Details"

}

value={verifyValue}

onChange={(e)=>setVerifyValue(e.target.value)}

/>



</DialogContent>







<DialogActions>


<Button

onClick={()=>setVerifyOpen(false)}

>

Cancel

</Button>



<Button

variant="contained"

onClick={submitVerification}

>

Submit Verification

</Button>



</DialogActions>



</Dialog>









</Box>


);


}








function StatCard({

icon,

title,

value

}){


return(


<Card

sx={{

background:

"linear-gradient(135deg,#1e293b,#0f172a)",

padding:3,

borderRadius:4,

color:"white"

}}

>


<Box

display="flex"

gap={2}

>

{icon}

</Box>




<Typography

fontSize={40}

fontWeight="900"

>

{value}

</Typography>




<Typography>

{title}

</Typography>



</Card>


);


}







const cardStyle={


background:

"rgba(255,255,255,0.08)",


backdropFilter:"blur(20px)",


border:

"1px solid rgba(255,255,255,0.12)",


borderRadius:5,


padding:4,


mt:4,


color:"white"


};





const buttonStyle={


borderRadius:3,

padding:"12px 25px"


};





const verifyButtonStyle={


background:"#22c55e",

color:"#052e16",

borderRadius:3,

marginRight:10,

marginTop:10,

fontWeight:700


};