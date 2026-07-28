import {

Box,

Typography,

IconButton,

Avatar,

Tooltip

} from "@mui/material";


import {

Notifications,

Logout

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";


import {

useAuth

} from "../context/AuthContext";





export default function Navbar(){



const navigate = useNavigate();


const {

user,

logout

}=useAuth();







const handleLogout=()=>{


logout();


navigate("/login");


};






return(


<Box


sx={{


height:"70px",


width:"100%",


display:"flex",


alignItems:"center",


justifyContent:"space-between",


padding:"0 30px",


background:

"rgba(15,23,42,0.75)",


backdropFilter:

"blur(15px)",


borderBottom:

"1px solid rgba(255,255,255,0.08)",


position:"sticky",


top:0,


zIndex:10


}}


>



{/* LEFT SIDE */}


<Box>


<Typography


variant="h5"


fontWeight="800"


sx={{


background:

"linear-gradient(90deg,#6366f1,#a855f7)",


WebkitBackgroundClip:"text",


color:"transparent"


}}



>


FakeJob AI


</Typography>


</Box>







{/* RIGHT SIDE */}


<Box


sx={{


display:"flex",


alignItems:"center",


gap:2


}}



>





<Tooltip title="Notifications">


<IconButton

sx={{

color:"white"

}}

>


<Notifications/>


</IconButton>


</Tooltip>







<Box


sx={{


display:"flex",


alignItems:"center",


gap:1.5


}}



>



<Avatar


sx={{


background:

"linear-gradient(135deg,#4f46e5,#9333ea)"

}}


>


{

user?.full_name

?

user.full_name[0].toUpperCase()

:

"U"

}


</Avatar>





<Box>


<Typography


fontWeight="600"


color="white"


>


{

user?.full_name ||

"User"

}


</Typography>



<Typography


fontSize="12px"


color="#94a3b8"


>


{

user?.role ||

"Guest"

}


</Typography>


</Box>



</Box>







<Tooltip title="Logout">


<IconButton


onClick={handleLogout}


sx={{


color:"#f87171"

}}


>


<Logout/>


</IconButton>


</Tooltip>






</Box>





</Box>



);


}