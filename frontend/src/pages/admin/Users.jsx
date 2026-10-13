// src/pages/admin/Users.jsx


import React,{useEffect,useState} from "react";


import {motion} from "framer-motion";


import {

User,

ShieldCheck,

Ban

} from "lucide-react";


import API from "../../api/API";








export default function Users(){


const [users,setUsers]=useState([]);





useEffect(()=>{

loadUsers();

},[]);





const loadUsers=async()=>{


try{


const res=await API.get(

"/admin/users"

);


setUsers(

res.data.data || []

);


}

catch(err){

console.log(err);

}


};







const toggleStatus=async(user)=>{


try{


await API.put(

`/admin/users/${user.id}/status`,

{

is_active:!user.is_active

}

);


loadUsers();


}

catch(err){

console.log(err);

}


};







return(



<div className="
text-white
space-y-8
">


<h1 className="
text-4xl
font-bold
">

User Management 👥

</h1>



<p className="
text-gray-400
">

Manage employees, recruiters and account security.

</p>







<div className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
">


{

users.map(user=>(


<motion.div


key={user.id}


whileHover={{

scale:1.03

}}



className="
bg-white/10
border
border-white/20
rounded-3xl
p-6
backdrop-blur-xl
"


>



<div className="
flex
justify-between
">


<div className="
flex
gap-3
items-center
">


<div className="
p-3
rounded-xl
bg-purple-500/20
">


<User/>


</div>


<div>


<h2 className="
font-bold
">

{user.name}

</h2>


<p className="
text-gray-400
text-sm
">

{user.email}

</p>


</div>


</div>



<ShieldCheck

className="
text-green-400
"

/>


</div>







<div className="
mt-5
space-y-2
">


<p>

Role:

<b> {user.role}</b>

</p>


<p>

Trust Score:

<b>

{user.trust_score || 0}%

</b>

</p>


</div>







<button


onClick={()=>toggleStatus(user)}


className="
mt-5
w-full
bg-red-600
rounded-xl
py-2
flex
justify-center
gap-2
"

>


<Ban size={18}/>


{

user.is_active

?

"Deactivate"

:

"Activate"

}


</button>




</motion.div>


))


}



</div>






</div>


);


}