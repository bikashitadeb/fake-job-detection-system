import API from "./API";




// =====================================
// GET PROFILE
// =====================================

export const getProfile = () => {


    return API.get(

        "/dashboard/profile"

    );


};






// =====================================
// EMPLOYEE DASHBOARD
// =====================================

export const getEmployeeDashboard = () => {


    return API.get(

        "/dashboard/employee"

    );


};







// =====================================
// RECRUITER DASHBOARD
// =====================================

export const getRecruiterDashboard = () => {


    return API.get(

        "/dashboard/recruiter"

    );


};







// =====================================
// GET JOBS
// =====================================

export const getJobs = () => {


    return API.get(

        "/jobs"

    );


};







// =====================================
// GET APPLICATIONS
// =====================================

export const getApplications = () => {


    return API.get(

        "/applications"

    );


};