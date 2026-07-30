import API from "./API";




// =====================================
// GET PROFILE
// =====================================

export const getProfile = async()=>{

    try{


        const response = await API.get(
            "/auth/profile"
        );


        return response;


    }

    catch(error){


        console.error(
            "PROFILE API ERROR:",
            error.response?.data || error.message
        );


        throw error;


    }

};








// =====================================
// GET JOBS
// =====================================

export const getJobs = async()=>{


    try{


        const response = await API.get(
            "/jobs"
        );


        return response;


    }


    catch(error){


        console.error(
            "JOBS API ERROR:",
            error.response?.data || error.message
        );


        throw error;


    }


};








// =====================================
// GET APPLICATIONS
// =====================================

export const getApplications = async()=>{


    try{


        const response = await API.get(
            "/applications/my"
        );


        return response;


    }


    catch(error){


        console.error(

            "APPLICATION API ERROR:",

            error.response?.data || error.message

        );


        throw error;


    }


};








// =====================================
// APPLY JOB
// =====================================

export const applyForJob = async(jobId,data={})=>{


    try{


        const response = await API.post(

            `/applications/${jobId}/apply`,

            {


                cover_letter:
                data.cover_letter || "",



                resume_url:
                data.resume_url || ""


            }


        );


        return response;


    }


    catch(error){


        console.error(

            "APPLY JOB ERROR:",

            error.response?.data || error.message

        );


        throw error;


    }


};