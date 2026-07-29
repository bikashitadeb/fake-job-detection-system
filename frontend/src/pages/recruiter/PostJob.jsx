import {
    useState
} from "react";


import {

    Box,

    Card,

    CardContent,

    Typography,

    TextField,

    Button,

    Grid,

    Alert,

    Dialog,

    DialogTitle,

    DialogContent,

    DialogActions,

    Chip,

    CircularProgress

} from "@mui/material";



import {

    CheckCircle,

    Warning

} from "@mui/icons-material";



import API from "../../api/API";






export default function PostJob(){



const [form,setForm]=useState({


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


const [open,setOpen]=useState(false);









const handleChange=(e)=>{


setForm({

    ...form,

    [e.target.name]:

    e.target.value

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


        description:form.description,


        location:form.location,


        salary:form.salary


    }

);





console.log(

    "JOB RESPONSE",

    response.data

);





setResult(

    response.data.job

);





setOpen(true);





setForm({


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





}



catch(err){



console.log(

    "JOB POST ERROR",

    err

);




setError(


err.response?.data?.message ||


"Unable to post job"


);



}





finally{


setLoading(false);


}



};









return(


<Box>



<Typography

className="dashboard-title"

>

Post New Job 🚀

</Typography>






<Typography

className="dashboard-subtitle"

mb={4}

>

AI will automatically verify this job before publishing.

</Typography>








{

error &&

<Alert

severity="error"

sx={{mb:3}}

>

{error}

</Alert>


}











<Card

className="glass"

sx={{


padding:3,


color:"white"


}}



>


<CardContent>





<Box

component="form"

onSubmit={submitJob}

>





<Grid

container

spacing={3}

>







<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Job Title"

name="title"

value={form.title}

onChange={handleChange}

required

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Company"

name="company"

value={form.company}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Location"

name="location"

value={form.location}

onChange={handleChange}

required

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Salary"

name="salary"

value={form.salary}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Experience"

name="experience"

value={form.experience}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Skills"

name="skills"

value={form.skills}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

>


<TextField

fullWidth

label="Company Website"

name="website"

value={form.website}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="Official Email"

name="official_email"

value={form.official_email}

onChange={handleChange}

/>

</Grid>








<Grid

item

xs={12}

md={6}

>


<TextField

fullWidth

label="LinkedIn URL"

name="linkedin_url"

value={form.linkedin_url}

onChange={handleChange}

/>

</Grid>









<Grid

item

xs={12}

>


<TextField

fullWidth

multiline

rows={6}

label="Job Description"

name="description"

value={form.description}

onChange={handleChange}

required

/>

</Grid>









<Grid

item

xs={12}

>


<Button


fullWidth


type="submit"


variant="contained"


size="large"


disabled={loading}



sx={{


height:55,


borderRadius:3,


background:

"linear-gradient(90deg,#4f46e5,#7c3aed)"


}}


>


{

loading ?

<CircularProgress

size={25}

color="inherit"

/>


:

"Post Job & Verify With AI"

}



</Button>


</Grid>








</Grid>






</Box>






</CardContent>


</Card>













<Dialog


open={open}


onClose={()=>setOpen(false)}


maxWidth="sm"


fullWidth


>



<DialogTitle>

AI Job Verification Result 🤖

</DialogTitle>






<DialogContent>



{

result &&

<>



<Typography

variant="h5"

fontWeight="800"

>

Trust Score:

{result.trust_score ?? 0}%

</Typography>








<Chip



sx={{mt:2}}



icon={

result.status==="verified"

?

<CheckCircle/>

:

<Warning/>

}




label={

result.status ||

"Pending Verification"

}





color={

result.status==="verified"

?

"success"

:

"warning"

}


/>









<Box mt={3}>


<Typography

fontWeight="700"

>

AI Explanation

</Typography>




<Typography

color="text.secondary"

>

{

result.explanation ||

"Job submitted for AI verification"

}

</Typography>


</Box>





</>

}



</DialogContent>







<DialogActions>


<Button

onClick={()=>setOpen(false)}

>

Close

</Button>


</DialogActions>






</Dialog>






</Box>


);



}