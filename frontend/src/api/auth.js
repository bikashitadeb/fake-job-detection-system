// src/services/authService.js


import API from "./API";




// =====================================================
// LOGIN USER
// =====================================================


export const loginUser = async (data)=>{


    try{


        const response = await API.post(

            "/auth/login",

            data

        );



        if(response.data.access_token){


            localStorage.setItem(

                "token",

                response.data.access_token

            );


        }



        if(response.data.user){


            localStorage.setItem(

                "user",

                JSON.stringify(

                    response.data.user

                )

            );


        }



        return response.data;



    }

    catch(error){


        throw handleAuthError(error);


    }


};









// =====================================================
// REGISTER EMPLOYEE
// =====================================================


export const registerEmployee = async(data)=>{


    try{


        const response = await API.post(

            "/auth/register",

            {


                ...data,


                role:"employee"


            }

        );


        return response.data;


    }

    catch(error){


        throw handleAuthError(error);


    }


};









// =====================================================
// REGISTER RECRUITER
// =====================================================


export const registerRecruiter = async(data)=>{


    try{


        const response = await API.post(

            "/auth/register",

            {


                ...data,


                role:"recruiter"


            }

        );


        return response.data;


    }

    catch(error){


        throw handleAuthError(error);


    }


};









// =====================================================
// GET USER PROFILE
// =====================================================


export const getProfile = async()=>{


    try{


        const response = await API.get(

            "/auth/profile"

        );


        return response.data;


    }

    catch(error){


        throw handleAuthError(error);


    }


};









// =====================================================
// CHANGE PASSWORD
// =====================================================


export const changePassword = async(data)=>{


    try{


        const response = await API.put(

            "/auth/change-password",

            data

        );


        return response.data;


    }

    catch(error){


        throw handleAuthError(error);


    }


};









// =====================================================
// LOGOUT USER
// =====================================================


export const logoutUser = async()=>{


    try{


        const response = await API.post(

            "/auth/logout"

        );



        localStorage.removeItem(

            "token"

        );


        localStorage.removeItem(

            "user"

        );



        return response.data;



    }

    catch(error){


        localStorage.clear();


        throw handleAuthError(error);


    }


};









// =====================================================
// GET STORED USER
// =====================================================


export const getCurrentUser = ()=>{


    const user = localStorage.getItem(

        "user"

    );


    return user

        ?

        JSON.parse(user)

        :

        null;


};









// =====================================================
// CHECK LOGIN STATUS
// =====================================================


export const isAuthenticated = ()=>{


    return Boolean(

        localStorage.getItem(

            "token"

        )

    );


};









// =====================================================
// ERROR HANDLER
// =====================================================


const handleAuthError = (error)=>{


    if(error.response){


        return {


            message:

            error.response.data?.message

            ||

            "Authentication failed",



            status:

            error.response.status


        };


    }



    return {


        message:

        "Server connection failed",



        status:

        500


    };


};