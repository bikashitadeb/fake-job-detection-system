import API from "./API";


// =====================================
// GET RECRUITER DASHBOARD DATA
// =====================================

export const fetchRecruiterDashboard = () => {

    return API.get(
        "/dashboard/recruiter"
    );

};