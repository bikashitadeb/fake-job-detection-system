// src/pages/Notifications.jsx

import React from "react";

import {
    motion
} from "framer-motion";

import {
    Bell,
    ShieldAlert,
    CheckCircle
} from "lucide-react";




export default function Notifications(){


const notifications=[

{
title:"AI Fraud Alert",
message:"Suspicious job posting detected",
type:"fraud"
},


{
title:"Application Update",
message:"Your application status changed",
type:"normal"
},


{
title:"Verification Complete",
message:"Company verification completed",
type:"success"
}

];





return(


<div

className="

min-h-screen

text-white

space-y-6

"

>


<h1

className="

text-4xl

font-black

"

>

Notifications

</h1>





<div

className="

grid

gap-5

"

>


{

notifications.map((item,index)=>(


<motion.div


key={index}


initial={{

opacity:0,

y:30

}}



animate={{

opacity:1,

y:0

}}



transition={{

delay:index*.15

}}



whileHover={{

scale:1.02

}}



className="

p-6

rounded-3xl

bg-white/10

backdrop-blur-xl

border

border-white/10

shadow-xl

flex

gap-5

items-center

"


>


<div

className="

p-4

rounded-2xl

bg-gradient-to-r

from-purple-600

to-blue-600

"

>


{

item.type==="fraud"

?

<ShieldAlert/>

:

item.type==="success"

?

<CheckCircle/>

:

<Bell/>

}


</div>





<div>


<h2

className="

text-xl

font-bold

"

>

{item.title}

</h2>



<p

className="

text-gray-300

mt-2

"

>

{item.message}

</p>


</div>



</motion.div>


))


}


</div>



</div>


);


}