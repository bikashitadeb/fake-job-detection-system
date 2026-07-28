import {

Box

} from "@mui/material";


import {

Outlet

} from "react-router-dom";


import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";




export default function EmployeeLayout(){



return(


<Box


sx={{


display:"flex",


minHeight:"100vh",


background:"#020617"


}}



>




{/* SIDEBAR */}

<Sidebar/>





{/* MAIN AREA */}


<Box


sx={{


flex:1,


display:"flex",


flexDirection:"column",


overflow:"hidden"


}}


>



{/* NAVBAR */}

<Navbar/>






{/* PAGE CONTENT */}


<Box


sx={{


flex:1,


padding:3,


overflowY:"auto",



background:


"radial-gradient(circle at top left,rgba(79,70,229,.18),transparent 40%),#020617"



}}



>


<Outlet/>


</Box>





</Box>






</Box>



);


}