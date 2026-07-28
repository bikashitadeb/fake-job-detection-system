import {

useEffect,

useState

} from "react";



import {

Box,

Grid,

Card,

CardContent,

Typography

} from "@mui/material";



import {

Bar,

Pie,

Doughnut

} from "react-chartjs-2";



import {

Chart as ChartJS,

CategoryScale,

LinearScale,

BarElement,

ArcElement,

Title,

Tooltip,

Legend

} from "chart.js";



import API from "../../api/API";





ChartJS.register(

CategoryScale,

LinearScale,

BarElement,

ArcElement,

Title,

Tooltip,

Legend

);







export default function Analytics(){



const [data,setData]=useState(null);



useEffect(()=>{


loadAnalytics();


},[]);







const loadAnalytics=async()=>{


try{


const response = await API.get(

"/admin/analytics"

);



setData(

response.data.data

);



}

catch(error){


console.log(error);


}



};








if(!data){


return(

<Typography color="white">

Loading analytics...

</Typography>

);


}








const monthlyJobs={


labels:

data.jobs_per_month?.map(

(item)=>item.month

)

|| [],



datasets:[

{

label:"Jobs Posted",

data:

data.jobs_per_month?.map(

(item)=>item.count

)

|| []

}

]

};








const fakeVsReal={


labels:[

"Fake Jobs",

"Genuine Jobs"

],



datasets:[

{

data:[

data.fake_jobs || 0,

data.genuine_jobs || 0

]

}

]

};








const trustDistribution={


labels:[

"0-40",

"40-70",

"70-90",

"90-100"

],



datasets:[

{

label:"Trust Score Range",

data:

data.trust_distribution ||

[]

}

]

};








const companies={


labels:

data.top_companies?.map(

(item)=>item.company

)

|| [],



datasets:[

{

label:"Jobs Posted",

data:

data.top_companies?.map(

(item)=>item.jobs

)

|| []

}

]

};







return(


<Box>



<Typography

className="dashboard-title"

>

AI Recruitment Analytics 📊

</Typography>




<Typography

className="dashboard-subtitle"

mb={4}

>

Monitor fake job detection and recruitment trends.

</Typography>









<Grid

container

spacing={3}

>




<Grid

item

xs={12}

lg={6}

>



<Card

className="glass"

sx={{

padding:3,

color:"white"

}}

>



<CardContent>



<Typography

variant="h6"

mb={3}

>

Jobs Posted Per Month

</Typography>



<Bar

data={monthlyJobs}

/>



</CardContent>


</Card>


</Grid>









<Grid

item

xs={12}

lg={6}

>



<Card

className="glass"

sx={{

padding:3,

color:"white"

}}



>



<CardContent>



<Typography

variant="h6"

mb={3}

>

Fake vs Genuine Jobs

</Typography>



<Doughnut

data={fakeVsReal}

/>



</CardContent>


</Card>


</Grid>









<Grid

item

xs={12}

lg={6}

>



<Card

className="glass"

sx={{

padding:3,

color:"white"

}}



>



<CardContent>



<Typography

variant="h6"

mb={3}

>

Trust Score Distribution

</Typography>



<Bar

data={trustDistribution}

/>



</CardContent>



</Card>



</Grid>









<Grid

item

xs={12}

lg={6}

>



<Card

className="glass"

sx={{

padding:3,

color:"white"

}}



>



<CardContent>



<Typography

variant="h6"

mb={3}

>

Top Companies

</Typography>




<Bar

data={companies}

/>



</CardContent>



</Card>



</Grid>








</Grid>





</Box>


);


}