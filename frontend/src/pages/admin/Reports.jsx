// src/pages/admin/Reports.jsx


import React,{useEffect,useState} from "react";


import {motion} from "framer-motion";


import {

AlertTriangle,
CheckCircle,
Clock

} from "lucide-react";


import API from "../../api/API";






export default function Reports(){


const [reports,setReports]=useState([]);





useEffect(()=>{

fetchReports();

},[]);





const fetchReports=async()=>{


try{


const res=await API.get(

"/admin/reports"

);


setReports(

res.data.data || []

);


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

Fraud Reports 📋

</h1>


<p className="
text-gray-400
">

Review AI generated and user submitted fraud reports.

</p>







<div className="
space-y-5
">


{

reports.map((report,index)=>(


<motion.div


key={report.id}


initial={{
opacity:0,
x:-20
}}


animate={{
opacity:1,
x:0
}}



className="
bg-white/10
border
border-white/20
backdrop-blur-xl
rounded-3xl
p-6
"

>



<div className="
flex
justify-between
">


<div>


<h2 className="
font-bold
text-xl
">

Job ID : {report.job_id}

</h2>


<p className="
text-gray-400
mt-2
">

{report.reason}

</p>


</div>




<AlertTriangle

className="text-yellow-400"

/>


</div>







<div className="
flex
gap-3
mt-5
">


<span className="
bg-yellow-500/20
text-yellow-300
px-4
py-2
rounded-full
flex
gap-2
items-center
">

<Clock size={16}/>

{report.status}

</span>





</div>




</motion.div>


))


}


</div>



</div>


);


}