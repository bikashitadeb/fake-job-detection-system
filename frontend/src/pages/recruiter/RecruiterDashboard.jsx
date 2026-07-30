import React from "react";
import { motion } from "framer-motion";

import {
    Briefcase,
    Users,
    CheckCircle,
    Eye,
    ShieldCheck,
    AlertTriangle,
    XCircle,
    ArrowUpRight,
    FileText
} from "lucide-react";


const stats = [

    {
        title:"Total Jobs",
        value:"24",
        icon:<Briefcase/>,
        color:"from-purple-500 to-purple-700",
        growth:"+12%"
    },

    {
        title:"Total Applicants",
        value:"128",
        icon:<Users/>,
        color:"from-blue-500 to-cyan-500",
        growth:"+18%"
    },

    {
        title:"Shortlisted",
        value:"36",
        icon:<CheckCircle/>,
        color:"from-pink-500 to-purple-600",
        growth:"+8%"
    },

    {
        title:"Profile Views",
        value:"342",
        icon:<Eye/>,
        color:"from-cyan-500 to-blue-600",
        growth:"+24%"
    }

];




const jobs=[

{
title:"Frontend Developer",
company:"TechCorp Solutions",
location:"Bangalore",
time:"2 days ago"
},

{
title:"Backend Developer",
company:"InnovateX",
location:"Remote",
time:"5 days ago"
},

{
title:"Data Scientist",
company:"DataMinds",
location:"Hyderabad",
time:"1 week ago"
},

{
title:"UI/UX Designer",
company:"DesignHub",
location:"Pune",
time:"1 week ago"
}

];





export default function RecruiterDashboard(){


return (

<div className="
min-h-screen
text-white
space-y-8
">


{/* HEADER */}

<motion.div

initial={{opacity:0,y:20}}

animate={{opacity:1,y:0}}

>

<p className="text-gray-400 text-xl">
Welcome back 👋
</p>


<h1 className="
text-5xl
font-black
bg-gradient-to-r
from-purple-400
to-pink-500
bg-clip-text
text-transparent
">

Bikashita

</h1>


<p className="text-gray-400 mt-2">
Here's what's happening with your recruitment today.
</p>


</motion.div>







{/* STAT CARDS */}


<div className="
grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-4
gap-6
">


{
stats.map((item,index)=>(


<motion.div

key={index}

whileHover={{
y:-8,
scale:1.03
}}

transition={{
duration:.3
}}

className="
relative
overflow-hidden
rounded-3xl
p-6
bg-white/5
border
border-white/10
backdrop-blur-xl
shadow-xl
"

>


<div className={`
w-14
h-14
rounded-2xl
flex
items-center
justify-center
bg-gradient-to-r
${item.color}
`}>

{item.icon}

</div>


<p className="
mt-5
text-gray-400
">

{item.title}

</p>


<h2 className="
text-4xl
font-black
mt-2
">

{item.value}

</h2>


<p className="
text-green-400
mt-4
">

↑ {item.growth} from last month

</p>



</motion.div>


))

}

</div>








<div className="
grid
lg:grid-cols-2
gap-8
">



{/* JOB POSTS */}


<div className="
rounded-3xl
bg-white/5
border
border-white/10
backdrop-blur-xl
p-6
">


<div className="
flex
justify-between
items-center
mb-6
">


<h2 className="
text-2xl
font-bold
flex
gap-3
items-center
">

<FileText className="text-purple-400"/>

Recent Job Postings

</h2>


<button className="
px-4
py-2
rounded-xl
bg-purple-600/30
hover:bg-purple-600
transition
">

View All

</button>


</div>





{
jobs.map((job,index)=>(

<div

key={index}

className="
flex
justify-between
items-center
border-b
border-white/10
py-5
"

>


<div>

<h3 className="
font-bold
text-lg
">

{job.title}

</h3>


<p className="
text-gray-400
">

{job.company} • {job.location}

</p>


</div>


<span className="
text-green-400
text-sm
">

Active

</span>


</div>


))

}



</div>









{/* AI FRAUD CARD */}


<div className="
rounded-3xl
bg-white/5
border
border-white/10
backdrop-blur-xl
p-6
">


<h2 className="
text-2xl
font-bold
flex
items-center
gap-3
">

<ShieldCheck className="text-purple-400"/>

AI Fraud Detection Overview

</h2>




<div className="
flex
justify-center
my-10
">


<div className="
w-52
h-52
rounded-full
border-[12px]
border-purple-500
flex
flex-col
justify-center
items-center
shadow-[0_0_50px_rgba(168,85,247,.6)]
">


<h1 className="
text-5xl
font-black
">

92%

</h1>


<p className="text-gray-400">
Trust Score
</p>


</div>


</div>





<div className="space-y-4">


<div className="
flex
justify-between
bg-black/20
p-4
rounded-xl
">

<span className="flex gap-3">

<CheckCircle className="text-green-400"/>

Verified Jobs

</span>


<b className="text-green-400">
48
</b>

</div>





<div className="
flex
justify-between
bg-black/20
p-4
rounded-xl
">


<span className="flex gap-3">

<AlertTriangle className="text-yellow-400"/>

Suspicious Jobs

</span>


<b className="text-yellow-400">
4
</b>


</div>






<div className="
flex
justify-between
bg-black/20
p-4
rounded-xl
">


<span className="flex gap-3">

<XCircle className="text-red-400"/>

Fraudulent Jobs

</span>


<b className="text-red-400">
1
</b>


</div>


</div>



</div>





</div>




{/* PREMIUM BANNER */}


<motion.div

whileHover={{
scale:1.02
}}

className="
rounded-3xl
p-6
bg-gradient-to-r
from-purple-700
to-blue-700
flex
justify-between
items-center
"

>


<div>

<h2 className="
text-3xl
font-black
">

Upgrade to Premium

</h2>

<p>
Get advanced fraud detection and priority support.
</p>


</div>


<button className="
px-6
py-3
rounded-xl
bg-white
text-purple-700
font-bold
">

Upgrade Now

</button>


</motion.div>



</div>


);


}