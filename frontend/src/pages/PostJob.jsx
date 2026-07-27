import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";


function PostJob(){

    const navigate = useNavigate();


    const [form,setForm] = useState({

        title:"",
        description:"",
        company_name:"",
        location:"",
        job_type:"",
        experience:"",
        salary:"",
        skills:"",
        website:"",
        official_email:"",
        linkedin_url:""

    });



    const handleChange=(e)=>{

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };



    const submitJob=async(e)=>{

        e.preventDefault();


        try{


            const response = await API.post(
                "/jobs",
                form
            );


            console.log(response.data);


            alert(
                "Job created successfully"
            );


            navigate("/recruiter");


        }
        catch(error){


            console.log(
                error.response?.data
            );


            alert(
                error.response?.data?.message ||
                "Job creation failed"
            );

        }

    };



    return (

        <div>


            <h1>
                Create Job
            </h1>


            <form onSubmit={submitJob}>


            <input
            name="title"
            placeholder="Job Title"
            value={form.title}
            onChange={handleChange}
            />


            <textarea
            name="description"
            placeholder="Job Description"
            value={form.description}
            onChange={handleChange}
            />


            <input
            name="company_name"
            placeholder="Company Name"
            value={form.company_name}
            onChange={handleChange}
            />


            <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            />


            <input
            name="job_type"
            placeholder="Job Type"
            value={form.job_type}
            onChange={handleChange}
            />


            <input
            name="experience"
            placeholder="Experience"
            value={form.experience}
            onChange={handleChange}
            />


            <input
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            />


            <input
            name="skills"
            placeholder="Skills"
            value={form.skills}
            onChange={handleChange}
            />


            <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
            />


            <input
            name="official_email"
            placeholder="Official Email"
            value={form.official_email}
            onChange={handleChange}
            />


            <input
            name="linkedin_url"
            placeholder="LinkedIn URL"
            value={form.linkedin_url}
            onChange={handleChange}
            />


            <button type="submit">
                Create Job
            </button>


            </form>


        </div>

    );

}


export default PostJob;