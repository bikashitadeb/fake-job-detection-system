import {

Box,

Typography

} from "@mui/material";


import {

Dashboard,

Work,

Bookmark,

Assignment,

VerifiedUser,

Person,

AddCircle,

People,

Analytics,

Security

} from "@mui/icons-material";


import {

useNavigate,

useLocation

} from "react-router-dom";



import {

useAuth

} from "../context/AuthContext";





export default function Sidebar(){


const navigate = useNavigate();


const location = useLocation();


const {

user

}=useAuth();





const employeeMenu=[


{

title:"Dashboard",

path:"/employee/dashboard",

icon:<Dashboard/>

},


{

title:"Browse Jobs",

path:"/employee/jobs",

icon:<Work/>

},


{

title:"Saved Jobs",

path:"/employee/saved",

icon:<Bookmark/>

},


{

title:"Applications",

path:"/employee/applications",

icon:<Assignment/>

},


{

title:"Verified Jobs",

path:"/employee/verified",

icon:<VerifiedUser/>

},


{

title:"Profile",

path:"/employee/profile",

icon:<Person/>

}


];







const recruiterMenu=[


{

title:"Dashboard",

path:"/recruiter/dashboard",

icon:<Dashboard/>

},



{

title:"Post Job",

path:"/recruiter/post-job",

icon:<AddCircle/>

},



{

title:"My Jobs",

path:"/recruiter/jobs",

icon:<Work/>

},



{

title:"AI Verification",

path:"/recruiter/verification",

icon:<Security/>

},



{

title:"Applicants",

path:"/recruiter/applicants",

icon:<People/>

},



{

title:"Analytics",

path:"/recruiter/analytics",

icon:<Analytics/>

},



{

title:"Profile",

path:"/recruiter/profile",

icon:<Person/>

}


];





const menu =

user?.role==="recruiter"

?

recruiterMenu

:

employeeMenu;








return(


<Box


className="sidebar"


sx={{


width:260,


minHeight:"100vh",


padding:"25px 15px",


display:"flex",


flexDirection:"column",


background:

"linear-gradient(180deg,#020617,#0f172a)",


borderRight:

"1px solid rgba(255,255,255,0.08)"


}}


>



<Typography


variant="h5"


fontWeight="800"


sx={{


mb:5,


textAlign:"center",


color:"white"


}}


>


FakeJob AI

</Typography>







{

menu.map((item,index)=>(


<Box


key={index}


onClick={()=>navigate(item.path)}


className={

location.pathname===item.path

?

"active-menu sidebar-item"

:

"sidebar-item"

}



sx={{


display:"flex",


alignItems:"center",


gap:2,


cursor:"pointer",


color:

location.pathname===item.path

?

"white"

:

"#94a3b8",



padding:"14px 18px",


borderRadius:"14px",


mb:1,



transition:"0.3s",



"&:hover":{


background:

"rgba(99,102,241,.15)",


color:"white"


}


}}


>



{

item.icon

}



<Typography>


{item.title}

</Typography>



</Box>



))


}





</Box>


);


}