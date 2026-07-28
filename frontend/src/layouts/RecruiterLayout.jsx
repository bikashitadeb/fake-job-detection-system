import {

Box

} from "@mui/material";


import {

Outlet

} from "react-router-dom";


import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";





export default function RecruiterLayout(){



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







{/* MAIN CONTENT */}


<Box


sx={{


flex:1,


display:"flex",


flexDirection:"column",


overflow:"hidden"


}}


>



{/* TOP NAVBAR */}

<Navbar/>






{/* PAGE AREA */}


<Box


sx={{


flex:1,


padding:3,


overflowY:"auto",



background:


`
radial-gradient(
circle at top right,
rgba(124,58,237,.25),
transparent 40%
),

#020617
`



}}



>


<Outlet/>




</Box>





</Box>





</Box>



);


}