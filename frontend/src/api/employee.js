// src/services/jobService.js


import API from "./API";





// =====================================================
// GET ALL AVAILABLE JOBS
// Employee Dashboard
// =====================================================


export const getJobs = async(params = {})=>{


    try{


        const response = await API.get(

            "/jobs",

            {

                params

            }

        );


        return response.data;


    }

    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// GET SINGLE JOB DETAILS
// =====================================================


export const getJobDetails = async(id)=>{


    try{


        const response = await API.get(

            `/jobs/${id}`

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// CREATE JOB
// Recruiter Dashboard
// =====================================================


export const createJob = async(data)=>{


    try{


        const response = await API.post(

            "/jobs",

            data

        );


        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// GET RECRUITER JOBS
// =====================================================


export const getMyJobs = async()=>{


    try{


        const response = await API.get(

            "/jobs/my-jobs"

        );


        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// UPDATE JOB
// =====================================================


export const updateJob = async(id,data)=>{


    try{


        const response = await API.put(

            `/jobs/${id}`,

            data

        );


        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// DELETE JOB
// =====================================================


export const deleteJob = async(id)=>{


    try{


        const response = await API.delete(

            `/jobs/${id}`

        );


        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// APPLY FOR JOB
// Employee
// =====================================================


export const applyJob = async(

    jobId,

    applicationData={}

)=>{


    try{


        const response = await API.post(


            `/applications/${jobId}/apply`,


            applicationData


        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// GET MY APPLICATIONS
// =====================================================


export const getMyApplications = async()=>{


    try{


        const response = await API.get(

            "/applications/my"

        );


        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// GET JOB APPLICANTS
// Recruiter
// =====================================================


export const getJobApplicants = async(jobId)=>{


    try{


        const response = await API.get(

            `/applications/job/${jobId}`

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// UPDATE APPLICATION STATUS
// Recruiter
// =====================================================


export const updateApplicationStatus = async(

    applicationId,

    status

)=>{


    try{


        const response = await API.put(

            `/applications/${applicationId}`,

            {

                status

            }

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// VERIFY JOB WITH AI
// =====================================================


export const verifyJob = async(jobId)=>{


    try{


        const response = await API.post(

            `/verification/verify/${jobId}`

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// GET VERIFICATION HISTORY
// =====================================================


export const getVerificationHistory = async(jobId)=>{


    try{


        const response = await API.get(

            `/verification/history/${jobId}`

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// FLAG SUSPICIOUS JOB
// =====================================================


export const flagJob = async(

    jobId,

    reason

)=>{


    try{


        const response = await API.post(

            `/verification/flag/${jobId}`,

            {

                reason

            }

        );



        return response.data;


    }


    catch(error){


        throw handleJobError(error);


    }


};









// =====================================================
// ERROR HANDLER
// =====================================================


const handleJobError = (error)=>{


    if(error.response){


        return {


            message:

            error.response.data?.message

            ||

            "Job operation failed",



            status:

            error.response.status



        };


    }




    return {


        message:

        "Server unavailable",



        status:

        500


    };


};