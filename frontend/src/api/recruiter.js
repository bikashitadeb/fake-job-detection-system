// src/services/recruiterService.js


import API from "./API";




// =====================================================
// GET RECRUITER DASHBOARD
// =====================================================


export const getRecruiterDashboard = async()=>{


    try{


        const response = await API.get(

            "/dashboard/recruiter"

        );


        return response.data;


    }

    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// GET RECRUITER ANALYTICS
// =====================================================


export const getRecruiterAnalytics = async()=>{


    try{


        const response = await API.get(

            "/analytics/recruiter"

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// CREATE JOB POST
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


        throw handleRecruiterError(error);


    }


};









// =====================================================
// GET MY JOB POSTS
// =====================================================


export const getMyJobs = async()=>{


    try{


        const response = await API.get(

            "/jobs/my-jobs"

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// UPDATE JOB
// =====================================================


export const updateJob = async(

    id,

    data

)=>{


    try{


        const response = await API.put(

            `/jobs/${id}`,

            data

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


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


        throw handleRecruiterError(error);


    }


};









// =====================================================
// VIEW APPLICANTS
// =====================================================


export const getApplicants = async(jobId)=>{


    try{


        const response = await API.get(

            `/applications/job/${jobId}`

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// UPDATE APPLICATION STATUS
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


        throw handleRecruiterError(error);


    }


};









// =====================================================
// AI VERIFY JOB
// =====================================================


export const verifyJob = async(jobId)=>{


    try{


        const response = await API.post(

            `/verification/verify/${jobId}`

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// FLAG JOB
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


        throw handleRecruiterError(error);


    }


};









// =====================================================
// GET NOTIFICATIONS
// =====================================================


export const getRecruiterNotifications = async()=>{


    try{


        const response = await API.get(

            "/notifications"

        );


        return response.data;


    }


    catch(error){


        throw handleRecruiterError(error);


    }


};









// =====================================================
// ERROR HANDLER
// =====================================================


const handleRecruiterError = (error)=>{


    if(error.response){



        return {


            message:

            error.response.data?.message

            ||

            "Recruiter operation failed",



            status:

            error.response.status


        };


    }




    return {


        message:

        "Unable to connect to server",



        status:

        500


    };


};