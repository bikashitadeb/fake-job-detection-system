import React, {
    useState
} from "react";


import {

    motion

} from "framer-motion";


import {

    CheckCircle,

    AlertTriangle,

    ShieldCheck,

    Loader2

} from "lucide-react";


import API from "../../api/API";







export default function PostJob(){



const [form,setForm] = useState({


    title:"",

    company:"",

    location:"",

    salary:"",

    experience:"",

    skills:"",

    description:"",

    website:"",

    official_email:"",

    linkedin_url:""


});



const [loading,setLoading]=useState(false);


const [error,setError]=useState("");


const [result,setResult]=useState(null);










const handleChange=(e)=>{


setForm({

    ...form,

    [e.target.name]:e.target.value

});


};









const submitJob=async(e)=>{


e.preventDefault();


setLoading(true);

setError("");




try{


const response = await API.post(

    "/jobs",

    {


        title:form.title,


        company:form.company,


        location:form.location,


        salary:form.salary,


        requirements:

        `${form.experience} ${form.skills}`,


        description:form.description,


        website:form.website,


        official_email:form.official_email,


        linkedin_url:form.linkedin_url


    }

);




setResult(

    response.data.job

    ||

    response.data.data

);



}



catch(err){



setError(

err.response?.data?.message

||

"Job creation failed"

);


}



finally{


setLoading(false);


}


};









return(



<div

className="

text-white

space-y-8

"

>



<h1

className="

text-4xl

font-bold

"

>

Post New Job 🚀

</h1>



<p

className="

text-gray-400

"

>

AI will verify your job posting before publishing.

</p>








{

error &&

<div

className="

bg-red-500/20

border

border-red-500/40

p-4

rounded-xl

"

>

{error}

</div>

}





<form

onSubmit={submitJob}


className="

bg-white/10

backdrop-blur-xl

border

border-white/20

rounded-3xl

p-8

space-y-6

"

>






<div

className="

grid

md:grid-cols-2

gap-5

"

>


{

[

"title",

"company",

"location",

"salary",

"experience",

"skills",

"website",

"official_email",

"linkedin_url"

].map(field=>(



<input


key={field}


name={field}


value={form[field]}


onChange={handleChange}



placeholder={

field.replace("_"," ")

.toUpperCase()

}



className="

bg-black/20

border

border-white/20

rounded-xl

px-4

py-3

outline-none

"




/>



))


}


</div>








<textarea


name="description"


value={form.description}


onChange={handleChange}



rows="6"


placeholder="Detailed job description..."



className="

w-full

bg-black/20

border

border-white/20

rounded-xl

p-4

outline-none

"


/>










<button


disabled={loading}



className="

w-full

bg-gradient-to-r

from-blue-600

to-purple-600

py-4

rounded-xl

font-bold

flex

justify-center

items-center

gap-3

"


>



{

loading

?


<>

<Loader2

className="animate-spin"

/>

AI Verification Running...

</>



:

"Post Job & Verify With AI"


}



</button>






</form>









{

result &&



<VerificationResult

result={result}

/>



}







</div>



);


}









function VerificationResult({

result

}){


const trust =

result.trust_score || 0;



return(



<motion.div



initial={{

opacity:0,

y:30

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

p-8

"

>



<div

className="

flex

items-center

gap-3

"

>



<ShieldCheck

className="text-green-400"

size={35}

/>



<h2

className="

text-2xl

font-bold

"

>

AI Verification Result

</h2>


</div>








<div

className="

mt-6

"

>



<p className="text-gray-400">

AI Trust Score

</p>



<h1

className="

text-5xl

font-bold

"

>

{trust}%

</h1>





<div

className="

mt-4

h-3

bg-gray-700

rounded-full

"

>



<div

style={{

width:`${trust}%`

}}



className="

h-full

bg-gradient-to-r

from-green-400

to-blue-500

rounded-full

"

/>



</div>



</div>









<div

className="

mt-6

flex

gap-3

items-center

"

>


{

result.status==="verified"

?


<CheckCircle

className="text-green-400"

/>


:

<AlertTriangle

className="text-yellow-400"

/>


}



<p>

{

result.status

||

"Pending Verification"

}

</p>



</div>









<p

className="

mt-5

text-gray-300

"

>

{

result.explanation

||

"AI analysis completed."

}

</p>






</motion.div>


);


}