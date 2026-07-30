import {

    Outlet,

    NavLink,

    useNavigate

} from "react-router-dom";


import {

    motion

} from "framer-motion";


import {

    Box,

    Typography,

    IconButton,

    Avatar,

    Tooltip

} from "@mui/material";


import {

    Dashboard,

    Work,

    Bookmark,

    Assignment,

    Logout,

    Notifications,

    Shield

} from "@mui/icons-material";


import {

    useAuth

} from "../context/AuthContext.jsx";







export default function EmployeeLayout(){



const navigate = useNavigate();


const {

    user,

    logout

}=useAuth();






const menu=[


{

name:"Dashboard",

path:"dashboard",

icon:<Dashboard/>

},


{

name:"Jobs",

path:"jobs",

icon:<Work/>

},


{

name:"Saved Jobs",

path:"saved",

icon:<Bookmark/>

},


{

name:"Applications",

path:"applications",

icon:<Assignment/>

}



];







const handleLogout=()=>{


logout();


navigate("/login");


};







return(



<Box


sx={{


minHeight:"100vh",


display:"flex",



background:

"linear-gradient(135deg,#020617,#111827)",



color:"white"


}}



>









{/* SIDEBAR */}



<motion.aside


initial={{

x:-100,

opacity:0

}}


animate={{

x:0,

opacity:1

}}



transition={{

duration:.6

}}




style={{


width:280,


padding:25,


position:"fixed",


height:"100vh",



background:

"rgba(15,23,42,.75)",



backdropFilter:

"blur(25px)",



borderRight:

"1px solid rgba(255,255,255,.1)"


}}


>









<Box

display="flex"

alignItems="center"

gap={2}

mb={5}

>


<Shield

sx={{

fontSize:45,

color:"#c084fc"

}}

/>



<Typography

fontSize={22}

fontWeight={900}

sx={{

background:

"linear-gradient(90deg,#c084fc,#f472b6)",


WebkitBackgroundClip:"text",

color:"transparent"

}}

>

SecureHire AI

</Typography>


</Box>









{

menu.map((item)=>(


<NavLink


key={item.path}


to={item.path}



style={({isActive})=>({


textDecoration:"none",


color:"white",


display:"block",


marginBottom:15,


borderRadius:15,


background:isActive?


"linear-gradient(90deg,#9333ea,#ec4899)"

:

"transparent"


})}



>



<motion.div


whileHover={{


x:8


}}



style={{


display:"flex",


alignItems:"center",


gap:15,


padding:"14px 18px",


fontWeight:700



}}



>


{item.icon}


{item.name}



</motion.div>



</NavLink>


))


}













<Box


position="absolute"


bottom={40}


left={25}


right={25}


>



<motion.div


whileHover={{scale:1.03}}



style={{


padding:20,


borderRadius:20,


background:

"rgba(255,255,255,.08)",


border:

"1px solid rgba(255,255,255,.1)"


}}



>



<Box

display="flex"

alignItems="center"

gap={2}

>


<Avatar

sx={{

background:"#9333ea"

}}

>


{

user?.name?.charAt(0)

}


</Avatar>



<Box>


<Typography

fontWeight={800}

>


{user?.name || "Employee"}


</Typography>



<Typography

fontSize={12}

color="#cbd5e1"

>


Employee


</Typography>


</Box>


</Box>





</motion.div>



</Box>









</motion.aside>









{/* MAIN AREA */}



<Box


ml="280px"


width="calc(100% - 280px)"


>




{/* TOP NAVBAR */}



<Box


height={90}


display="flex"


alignItems="center"


justifyContent="space-between"



px={5}



sx={{


background:

"rgba(15,23,42,.5)",


backdropFilter:

"blur(20px)",


borderBottom:

"1px solid rgba(255,255,255,.1)"


}}



>



<Typography

fontSize={26}

fontWeight={900}

>


Employee Portal


</Typography>







<Box

display="flex"

gap={2}

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






<Tooltip title="Logout">


<IconButton

onClick={handleLogout}


sx={{

color:"#f472b6"

}}


>

<Logout/>

</IconButton>



</Tooltip>



</Box>




</Box>









{/* PAGE CONTENT */}



<Box


p={5}


>


<Outlet/>

</Box>







</Box>









</Box>


);



}