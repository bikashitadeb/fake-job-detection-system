// src/components/Sidebar.jsx

import React from "react";

import {
    motion
} from "framer-motion";


import {
    LayoutDashboard,
    Briefcase,
    FileText,
    Users,
    ShieldCheck,
    BarChart3,
    Bell,
    Settings,
    Building2,
    X
} from "lucide-react";


import {
    NavLink
} from "react-router-dom";


import {
    getCurrentUser
} from "../api/auth";






const Sidebar = ({
    open,
    setOpen
}) => {



    const user = getCurrentUser();


    const role = user?.role || "employee";






    const menus = {


        employee:[


            {
                name:"Dashboard",
                path:"/employee/dashboard",
                icon:<LayoutDashboard size={22}/>
            },


            {
                name:"Browse Jobs",
                path:"/employee/jobs",
                icon:<Briefcase size={22}/>
            },


            {
                name:"Applications",
                path:"/employee/applications",
                icon:<FileText size={22}/>
            },


            {
                name:"Notifications",
                path:"/notifications",
                icon:<Bell size={22}/>
            },


            {
                name:"Profile",
                path:"/profile",
                icon:<Users size={22}/>
            }


        ],






        recruiter:[


            {
                name:"Dashboard",
                path:"/recruiter/dashboard",
                icon:<LayoutDashboard size={22}/>
            },


            {
                name:"My Jobs",
                path:"/recruiter/jobs",
                icon:<Briefcase size={22}/>
            },


            {
                name:"Post Job",
                path:"/recruiter/post-job",
                icon:<Building2 size={22}/>
            },


            {
                name:"Applicants",
                path:"/recruiter/applicants",
                icon:<Users size={22}/>
            },


            {
                name:"Analytics",
                path:"/recruiter/analytics",
                icon:<BarChart3 size={22}/>
            },


            {
                name:"Notifications",
                path:"/notifications",
                icon:<Bell size={22}/>
            }


        ],







        admin:[


            {
                name:"Dashboard",
                path:"/admin/dashboard",
                icon:<LayoutDashboard size={22}/>
            },


            {
                name:"Users",
                path:"/admin/users",
                icon:<Users size={22}/>
            },


            {
                name:"Jobs",
                path:"/admin/jobs",
                icon:<Briefcase size={22}/>
            },


            {
                name:"Fraud Detection",
                path:"/admin/fraud",
                icon:<ShieldCheck size={22}/>
            },


            {
                name:"Analytics",
                path:"/admin/analytics",
                icon:<BarChart3 size={22}/>
            },


            {
                name:"Settings",
                path:"/admin/settings",
                icon:<Settings size={22}/>
            }


        ]

    };







    const activeMenus =
        menus[role] || menus.employee;








return (


<>


{/* BACKDROP */}

{

open &&

<motion.div

initial={{
opacity:0
}}

animate={{
opacity:1
}}

exit={{
opacity:0
}}

onClick={()=>setOpen(false)}

className="

fixed

inset-0

bg-black/40

backdrop-blur-sm

z-[120]

"

/>

}








<motion.aside



initial={false}



animate={{

x:open ? 0 : -350

}}



transition={{

duration:.45,

ease:"easeInOut"

}}




className="

fixed

top-0

left-0

z-[150]

h-screen

w-80

bg-white/95

backdrop-blur-xl

shadow-2xl

border-r

border-gray-200

p-6

flex

flex-col

overflow-y-auto

"

>








{/* CLOSE BUTTON */}



<button


onClick={()=>setOpen(false)}



className="

absolute

top-5

right-5

w-10

h-10

rounded-xl

bg-purple-100

text-purple-700

flex

items-center

justify-center

hover:scale-110

transition

"

>

<X size={22}/>

</button>










{/* BRAND */}



<div

className="

mb-10

mt-5

"

>



<div

className="

flex

items-center

gap-3

"

>



<div

className="

w-14

h-14

rounded-2xl

bg-gradient-to-br

from-blue-600

to-purple-600

flex

items-center

justify-center

shadow-xl

"

>


<ShieldCheck

size={32}

className="text-white"

/>


</div>





<div>


<h1

className="

text-xl

font-black

text-transparent

bg-gradient-to-r

from-blue-600

to-purple-600

bg-clip-text

"

>

FakeGuard AI

</h1>


<p

className="

text-xs

text-gray-500

"

>

{role.toUpperCase()}

</p>


</div>


</div>


</div>









{/* MENU */}



<div

className="

flex-1

space-y-3

"

>



{

activeMenus.map((item,index)=>(


<motion.div


key={index}



whileHover={{

x:8

}}



transition={{

duration:.2

}}



>


<NavLink



to={item.path}



onClick={()=>{


if(window.innerWidth < 900)

setOpen(false);


}}




className={({isActive})=>`


flex

items-center

gap-4

px-5

py-4

rounded-2xl

font-semibold

transition-all

duration-300



${


isActive


?


"bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl scale-105"


:


"text-slate-600 hover:bg-purple-50 hover:text-purple-600"


}


`}



>



<motion.div


whileHover={{

scale:1.15

}}

>


{item.icon}


</motion.div>





<span>

{item.name}

</span>



</NavLink>


</motion.div>


))


}



</div>









{/* FOOTER */}



<div

className="

mt-auto

p-4

rounded-3xl

bg-gradient-to-r

from-purple-600

to-blue-600

text-white

shadow-xl

"

>


<p

className="

font-bold

"

>

AI Protection Active

</p>


<p

className="

text-xs

opacity-80

"

>

SecureHire Intelligence

</p>



</div>







</motion.aside>


</>


);


};




export default Sidebar;