import {

Box,

Card,

CardContent,

Typography,

Chip,

LinearProgress,

Stack

} from "@mui/material";


import {

VerifiedUser,

Warning,

ErrorOutline,

Security

} from "@mui/icons-material";





export default function TrustScore({

data

}){





if(!data){


return null;


}






const score =

data.trust_score ||

0;





const risk =

data.risk_level ||

(

score >=80

?

"Low Risk"

:

score >=50

?

"Needs Review"

:

"High Risk"

);







const getColor=()=>{


if(score>=80)

return "success";


if(score>=50)

return "warning";


return "error";


};









return(


<Card


className="glass"


sx={{


color:"white",


mt:3

}}



>


<CardContent>





<Typography


variant="h5"


fontWeight="800"


>

AI Trust Analysis 🤖

</Typography>








{/* SCORE */}



<Box mt={3}>


<Typography

color="#94a3b8"

>

Trust Score

</Typography>



<Typography


variant="h2"


fontWeight="900"


color={

score>=80

?

"#22c55e"

:

score>=50

?

"#facc15"

:

"#ef4444"

}


>

{score}%

</Typography>







<LinearProgress


variant="determinate"


value={score}


color={getColor()}


sx={{


height:10,


borderRadius:5,


mt:2

}}


/>



</Box>









{/* STATUS */}



<Stack


direction="row"


spacing={2}


mt={3}


flexWrap="wrap"


>



<Chip


icon={

score>=80

?

<VerifiedUser/>

:

score>=50

?

<Warning/>

:

<ErrorOutline/>

}



label={risk}



color={getColor()}



/>






<Chip


icon={<Security/>}


label={

`ML Confidence:

${

data.ml_confidence || 0

}%`

}



/>






<Chip


label={

`Fake Probability:

${

data.fake_probability || 0

}%`

}



/>



</Stack>









{/* VERIFICATION */}



<Box mt={4}>


<Typography


fontWeight="700"


>

Verification Checks

</Typography>





{

data.checks &&

data.checks.map(

(check,index)=>(


<Typography


key={index}


color="#cbd5e1"


mt={1}

>

✓ {check}

</Typography>


)

)


}





</Box>









{/* EXPLANATION */}



<Box mt={4}>


<Typography


fontWeight="700"


>

AI Explanation

</Typography>




<Typography


color="#94a3b8"


mt={1}

>

{

data.explanation ||

"No explanation provided."

}

</Typography>



</Box>







</CardContent>



</Card>



);


}