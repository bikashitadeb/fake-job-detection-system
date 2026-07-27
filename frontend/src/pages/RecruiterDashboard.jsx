import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";


function RecruiterDashboard(){

    const [jobs,setJobs] = useState([]);

    const navigate = useNavigate();


    useEffect(()=>{

        loadJobs();

    },[]);



    const loadJobs = async()=>{

        try{

            const response = await API.get(
                "/jobs"
            );

            setJobs(
                response.data.data
            );

        }
        catch(error){

            console.log(error);

        }

    };



    return (

        <div>

            <h1>
                Recruiter Dashboard
            </h1>


            <button
            onClick={()=>navigate("/post-job")}
            >
                + Create Job
            </button>


            <h2>
                Posted Jobs
            </h2>


            {
                jobs.map((job)=>(

                    <div key={job.id}>

                        <h3>
                            {job.title}
                        </h3>


                        <p>
                            Company:
                            {job.company_name}
                        </p>


                        <p>
                            Location:
                            {job.location}
                        </p>


                        <p>
                            AI Status:
                            {job.ai_status || "Pending"}
                        </p>


                        <p>
                            Trust Score:
                            {job.ai_trust_score || 0}
                        </p>


                        <p>
                            Verification:
                            {job.verification_status}
                        </p>


                    </div>

                ))
            }


        </div>

    );

}


export default RecruiterDashboard;