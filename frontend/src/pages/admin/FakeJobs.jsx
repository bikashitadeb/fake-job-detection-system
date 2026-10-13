// src/pages/admin/FakeJobs.jsx


import React,{useEffect,useState} from "react";

import {motion} from "framer-motion";

import {

ShieldAlert,
Trash2,
Eye,
Brain

} from "lucide-react";


import API from "../../api/API";





export default function FakeJobs(){


const [jobs,setJobs]=useState([]);





useEffect(()=>{

loadJobs();

},[]);





const loadJobs=async()=>{

try{

const res=await API.get(
"/admin/fake-jobs"
);


setJobs(
res.data.data || []
);


}

catch(err){

console.log(err);

}

};








const deleteJob=async(id)=>{


try{

await API.delete(

`/jobs/${id}`

);


loadJobs();


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

AI Detected Fake Jobs 🚨

</h1>



<p className="
text-gray-400
">

Monitor suspicious job postings detected by AI models.

</p>






<div className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
">


{

jobs.map((job,index)=>(


<motion.div


key={job.id}


initial={{
opacity:0,
y:20
}}


animate={{
opacity:1,
y:0
}}



className="
bg-white/10
backdrop-blur-xl
border
border-white/20
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
text-xl
font-bold
">

{job.title}

</h2>


<p className="
text-gray-400
">

{job.company}

</p>

</div>



<ShieldAlert

className="text-red-400"

/>


</div>







<div className="
mt-5
bg-red-500/10
rounded-2xl
p-4
">


<p className="
text-gray-400
">

Fake Probability

</p>


<h3 className="
text-3xl
font-bold
text-red-400
">

{job.fake_probability || 0}%

</h3>


</div>







<div className="
mt-5
flex
gap-3
">


<button

className="
flex-1
bg-blue-600
rounded-xl
py-2
flex
justify-center
gap-2
"

>


<Eye size={18}/>

View


</button>





<button

onClick={()=>deleteJob(job.id)}

className="
flex-1
bg-red-600
rounded-xl
py-2
flex
justify-center
gap-2
"

>

<Trash2 size={18}/>

Delete


</button>


</div>





</motion.div>


))


}



</div>




</div>


);


}