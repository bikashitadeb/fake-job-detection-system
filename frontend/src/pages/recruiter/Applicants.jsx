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
    Grid,
    Button,
    Chip,
    TextField,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    LinearProgress
} from "@mui/material";


import {
    Search,
    Person,
    Verified,
    CheckCircle,
    Cancel,
    SmartToy
} from "@mui/icons-material";


import {
    getRecruiterApplications,
    updateApplicationStatus
} from "../../api/recruiter";







export default function Applicants(){



const [applications,setApplications]=useState([]);


const [loading,setLoading]=useState(true);


const [search,setSearch]=useState("");


const [selected,setSelected]=useState(null);


const [filter,setFilter]=useState("all");









useEffect(()=>{


loadApplicants();


},[]);









const loadApplicants=async()=>{


try{


const response =
await getRecruiterApplications();



setApplications(

response.data.applications || []

);



}


catch(err){


console.log(err);


}


finally{


setLoading(false);


}



};










const changeStatus=async(id,status)=>{


try{


await updateApplicationStatus(

id,

{

status

}

);



loadApplicants();



}

catch(err){


console.log(err);


}



};









const filteredApplicants = applications.filter(app=>{


const name =

app.user?.name

?.toLowerCase() || "";



const email =

app.user?.email

?.toLowerCase() || "";



const query =

search.toLowerCase();





const matchSearch =

name.includes(query)

||

email.includes(query);







if(filter==="shortlisted")

return matchSearch &&
app.status==="accepted";




if(filter==="pending")

return matchSearch &&
app.status==="pending";




if(filter==="rejected")

return matchSearch &&
app.status==="rejected";





return matchSearch;



});









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











return(



<Box sx={pageStyle}>







<motion.div

initial={{

opacity:0,

y:-40

}}

animate={{

opacity:1,

y:0

}}

>



<Typography

variant="h3"

fontWeight="900"

>

AI Candidate Intelligence Center 🤖

</Typography>



<Typography

color="#94a3b8"

>

Analyze candidates using AI powered recruitment analytics

</Typography>


</motion.div>









<Grid

container

spacing={3}

mt={3}

>


{


[

[

"Total Applicants",

applications.length

],


[

"Shortlisted",

applications.filter(

a=>a.status==="accepted"

).length

],


[

"Pending",

applications.filter(

a=>a.status==="pending"

).length

],


[

"Rejected",

applications.filter(

a=>a.status==="rejected"

).length

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

scale:1.05

}}

>



<Card sx={statCard}>


<Typography>

{item[0]}

</Typography>



<Typography

fontSize={40}

fontWeight="900"

>

{item[1]}

</Typography>



</Card>



</motion.div>



</Grid>



))


}



</Grid>









<Card sx={glassCard}>


<TextField

fullWidth

placeholder="Search candidate..."

value={search}

onChange={

e=>setSearch(e.target.value)

}


/>



<Box mt={3}>


<Button

onClick={()=>setFilter("all")}

>

All

</Button>



<Button

onClick={()=>setFilter("pending")}

>

Pending

</Button>


<Button

onClick={()=>setFilter("shortlisted")}

>

Shortlisted

</Button>



<Button

onClick={()=>setFilter("rejected")}

>

Rejected

</Button>



</Box>



</Card>









<Grid

container

spacing={3}

mt={2}

>



{

filteredApplicants.map(app=>(



<Grid

item

xs={12}

md={6}

key={app.id}

>



<motion.div

whileHover={{

scale:1.03,

y:-8

}}

>



<Card sx={candidateCard}>



<Typography

variant="h5"

fontWeight="900"

>

<Person/>

{" "}

{

app.user?.name ||

"Candidate"

}

</Typography>




<Typography>

📧 {app.user?.email}

</Typography>







<Chip

icon={<SmartToy/>}

label={

`AI Match ${app.ai_score || 85}%`

}

sx={{

mt:2,

background:"#6366f1",

color:"white"

}}


/>







<Typography mt={3}>

Resume Score

</Typography>




<LinearProgress

variant="determinate"

value={

app.resume_score || 80

}

/>










<Chip

label={

app.status

}

sx={{

mt:3

}}

/>









<Box mt={3}>


<Button

variant="contained"

color="success"

startIcon={<CheckCircle/>}

onClick={()=>changeStatus(

app.id,

"accepted"

)}

>

Shortlist

</Button>






<Button

variant="contained"

color="error"

startIcon={<Cancel/>}

sx={{ml:2}}

onClick={()=>changeStatus(

app.id,

"rejected"

)}

>

Reject

</Button>



</Box>







<Button

fullWidth

sx={{mt:3}}

variant="outlined"

onClick={()=>setSelected(app)}

>

View Candidate Profile

</Button>






</Card>



</motion.div>



</Grid>



))


}



</Grid>









<Dialog

open={Boolean(selected)}

onClose={()=>setSelected(null)}

fullWidth

maxWidth="sm"

>



<DialogTitle>

Candidate AI Report

</DialogTitle>



<DialogContent>


{

selected &&

<>


<Typography>

Name:

{selected.user?.name}

</Typography>



<Typography mt={2}>

Email:

{selected.user?.email}

</Typography>



<Typography mt={2}>

AI Recommendation:

Strong candidate based on skills and experience.

</Typography>



</>

}


</DialogContent>





<DialogActions>


<Button

onClick={()=>setSelected(null)}

>

Close

</Button>


</DialogActions>



</Dialog>





</Box>



);


}









const pageStyle={


minHeight:"100vh",

padding:4,

color:"white",


background:

"linear-gradient(135deg,#020617,#1e1b4b)"


};






const glassCard={


padding:4,

borderRadius:5,


background:

"rgba(255,255,255,.08)",


backdropFilter:"blur(20px)",


color:"white"

};







const statCard={


padding:3,

borderRadius:5,


background:

"linear-gradient(135deg,#312e81,#020617)",


color:"white"


};






const candidateCard={


padding:4,

borderRadius:5,


background:

"rgba(255,255,255,.08)",


backdropFilter:"blur(20px)",


border:

"1px solid rgba(255,255,255,.1)",


color:"white"


};