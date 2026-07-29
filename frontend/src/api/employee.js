import API from "./API";



// =====================================
// GET AVAILABLE JOBS
// =====================================

export const getJobs = () => {

    return API.get(
        "/jobs"
    );

};




// =====================================
// GET JOB DETAILS
// =====================================

export const getJobDetails = (id) => {

    return API.get(

        `/jobs/${id}`

    );

};




// =====================================
// APPLY JOB
// =====================================

export const applyJob = (id) => {

    return API.post(

        `/applications/${id}/apply`

    );

};




// =====================================
// GET MY APPLICATIONS
// =====================================

export const getMyApplications = () => {

    return API.get(

        "/applications/my"

    );

};




// =====================================
// GET NOTIFICATIONS
// =====================================

export const getNotifications = () => {

    return API.get(

        "/notifications"

    );

};