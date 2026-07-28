import API from "./API";



// =====================================
// LOGIN USER
// =====================================

export const loginUser = (data)=>{


    return API.post(

        "/auth/login",

        data

    );


};




// =====================================
// REGISTER EMPLOYEE
// =====================================


export const registerEmployee = (data)=>{


    return API.post(

        "/auth/register",

        {

            ...data,

            role:"employee"

        }

    );


};




// =====================================
// REGISTER RECRUITER
// =====================================


export const registerRecruiter = (data)=>{


    return API.post(

        "/auth/register",

        {

            ...data,

            role:"recruiter"

        }

    );


};




// =====================================
// GET PROFILE
// =====================================


export const getProfile = ()=>{


    return API.get(

        "/auth/profile"

    );


};




// =====================================
// CHANGE PASSWORD
// =====================================


export const changePassword = (data)=>{


    return API.put(

        "/auth/change-password",

        data

    );


};




// =====================================
// LOGOUT
// =====================================


export const logoutUser = ()=>{


    return API.post(

        "/auth/logout"

    );


};