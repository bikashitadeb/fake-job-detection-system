// src/components/Navbar.jsx

import React from "react";

import {
    Bell,
    UserCircle,
    ChevronDown
} from "lucide-react";


import {
    getCurrentUser
} from "../api/auth";




export default function Navbar(){


    const user = getCurrentUser();



return (

<header

className="

h-20

w-full

flex

items-center

justify-between

px-6

md:px-10

bg-white/95

backdrop-blur-xl

border-b

border-gray-200

shadow-sm

relative

z-40

"

>







{/* LEFT LOGO */}


<div

className="

flex

items-center

gap-4

"

>



<div

className="

w-12

h-12

rounded-2xl

bg-gradient-to-br

from-blue-600

to-purple-600

flex

items-center

justify-center

shadow-lg

"

>


<span

className="

text-white

text-xl

font-black

"

>

✓

</span>


</div>






<div>


<h1

className="

text-xl

md:text-2xl

font-black

bg-gradient-to-r

from-blue-600

to-purple-600

bg-clip-text

text-transparent

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

AI Job Verification

</p>


</div>


</div>









{/* RIGHT SECTION */}


<div

className="

flex

items-center

gap-6

"

>







{/* NOTIFICATION */}



<button


className="

relative

text-slate-700

hover:text-purple-600

transition

hover:scale-110

"

>


<Bell size={28}/>



<span


className="

absolute

top-[-8px]

right-[-8px]

bg-red-500

text-white

text-xs

font-bold

w-5

h-5

rounded-full

flex

items-center

justify-center

"

>

3

</span>



</button>









{/* PROFILE */}



<div

className="

flex

items-center

gap-3

cursor-pointer

hover:bg-gray-100

px-3

py-2

rounded-xl

transition

"

>



<UserCircle

size={42}

className="text-slate-700"

/>





<div

className="hidden md:block"

>


<p

className="

font-bold

text-slate-800

"

>


{user?.name || "Bikashita"}


</p>



<p

className="

text-xs

text-slate-500

"

>

Recruiter

</p>


</div>







<ChevronDown

size={18}

className="text-slate-600"

/>




</div>






</div>





</header>


);


}