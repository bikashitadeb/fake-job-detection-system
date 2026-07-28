import {
    useEffect,
    useState
} from "react";


import {

    Grid,

    Card,

    CardContent,

    Typography,

    Box,

    TextField,

    Button,

    Chip,

    InputAdornment

} from "@mui/material";


import {

Search,

VerifiedUser,

Bookmark

} from "@mui/icons-material";


import {

useNavigate

} from "react-router-dom";


import API from "../../api/API";





export default function JobPostings(){



const navigate = useNavigate();



const [jobs,setJobs]=useState([]);


const [search,setSearch]=useState("");


const [loading,setLoading]=useState(true);






// ============================
// FETCH JOBS
// ============================


useEffect(()=>{


fetchJobs();


},[]);







const fetchJobs=async()=>{


try{


const response = await API.get(
"/jobs"
);



setJobs(

response.data.data || []

);



}

catch(error){


console.log(error);


}


finally{


setLoading(false);


}


};








// ============================
// SEARCH FILTER
// ============================


const filteredJobs = jobs.filter((job)=>{


return (

job.title

?.toLowerCase()

.includes(

search.toLowerCase()

)

||

job.company

?.toLowerCase()

.includes(

search.toLowerCase()

)


);


});







if(loading){


return(


<Typography

color="white"

>

Loading jobs...

</Typography>


);


}







return(


<Box>



<Typography

className="dashboard-title"

>

Browse Jobs

</Typography>



<Typography

className="dashboard-subtitle"

mb={4}

>

AI verified opportunities only.

</Typography>







{/* SEARCH */}



<TextField


fullWidth


placeholder="Search jobs or companies..."


value={search}


onChange={(e)=>

setSearch(e.target.value)

}


sx={{


mb:4,


input:{

color:"white"

}



}}



InputProps={{


startAdornment:(


<InputAdornment position="start">


<Search

sx={{

color:"#94a3b8"

}}


/>


</InputAdornment>


)


}}


/>









<Grid

container

spacing={3}

>



{

filteredJobs.length===0 ?


<Typography

color="#94a3b8"

>

No jobs found

</Typography>



:

filteredJobs.map((job,index)=>(



<Grid

item

xs={12}

md={6}

lg={4}

key={index}

>



<Card


className="glass"


sx={{


height:"100%",


color:"white"


}}



>



<CardContent>




<Typography

variant="h6"

fontWeight="700"

>

{job.title}

</Typography>





<Typography

color="#94a3b8"

>

{job.company}

</Typography>






<Box mt={2}>


<Typography>

📍 {job.location}

</Typography>



<Typography>

💰 Salary: {job.salary || "Not disclosed"}

</Typography>



</Box>







<Box

mt={3}

display="flex"

gap={1}

flexWrap="wrap"

>



<Chip


icon={<VerifiedUser/>}


label={

job.status ||

"Pending"

}


color={

job.status==="verified"

?

"success"

:

"warning"

}



/>




<Chip


label={

`Trust ${

job.fake_probability

?

100-job.fake_probability

:

90

}%`

}



/>




</Box>








<Button


fullWidth


variant="contained"


sx={{mt:3}}


onClick={()=>


navigate(

`/employee/job/${job.id}`

)


}



>

View Details

</Button>








<Button


fullWidth


startIcon={<Bookmark/>}


sx={{mt:1,color:"white"}}


>


Save Job

</Button>





</CardContent>



</Card>






</Grid>



))


}



</Grid>





</Box>


);


}