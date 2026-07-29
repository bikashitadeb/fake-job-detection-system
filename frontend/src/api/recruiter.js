import API from "./API";



// ================================
// GET RECRUITER DASHBOARD DATA
// ================================

export const getRecruiterDashboard = () => {

    return API.get(
        "/dashboard/recruiter"
    );

};




// ================================
// CREATE JOB
// ================================

export const createJob = (data) => {

    return API.post(
        "/jobs",
        data
    );

};




// ================================
// GET MY JOBS
// ================================

export const getMyJobs = () => {

    return API.get(
        "/jobs/my-jobs"
    );

};




// ================================
// UPDATE JOB
// ================================

export const updateJob = (id,data)=>{

    return API.put(

        `/jobs/${id}`,

        data

    );

};




// ================================
// DELETE JOB
// ================================

export const deleteJob = (id)=>{


    return API.delete(

        `/jobs/${id}`

    );


};




// ================================
// GET APPLICANTS
// ================================

export const getApplicants = (jobId)=>{


    return API.get(

        `/applications/job/${jobId}`

    );


};




// ================================
// UPDATE APPLICATION STATUS
// ================================

export const updateApplicationStatus = (
    id,
    status
)=>{


    return API.put(

        `/applications/${id}`,

        {
            status
        }

    );


};




// ================================
// GET NOTIFICATIONS
// ================================

export const getRecruiterNotifications = ()=>{


    return API.get(

        "/notifications"

    );


};