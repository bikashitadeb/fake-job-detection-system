// src/services/authService.js


import API from "./API";




// =====================================================
// LOGIN USER
// =====================================================


export const loginUser = async(data)=>{


    try{


        const response = await API.post(

            "/auth/login",

            {

                email:data.email,

                password:data.password

            }

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

                JSON.stringify(response.data.user)

            );


        }



        return response.data;



    }

    catch(error){


        throw error;


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

                full_name:data.full_name,

                email:data.email,

                password:data.password,

                phone:data.phone,

                role:"employee"

            }

        );



        return response.data;



    }

    catch(error){


        throw error;


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


                full_name:data.full_name,

                email:data.email,

                password:data.password,

                phone:data.phone,

                role:"recruiter",

                company_name:data.company_name,

                company_website:data.company_website,

                linkedin_url:data.linkedin_url,

                official_email:data.official_email


            }

        );



        return response.data;



    }

    catch(error){


        throw error;


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


        throw error;


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


        throw error;


    }


};









// =====================================================
// LOGOUT USER
// =====================================================


export const logoutUser = async()=>{


    try{


        await API.post(

            "/auth/logout"

        );


    }

    catch(error){


        console.log(

            "Logout API failed"

        );


    }


    finally{


        localStorage.removeItem(

            "token"

        );


        localStorage.removeItem(

            "access_token"

        );


        localStorage.removeItem(

            "user"

        );



    }



};









// =====================================================
// GET CURRENT USER
// =====================================================


export const getCurrentUser = ()=>{


    const user = localStorage.getItem(

        "user"

    );



    try{


        return user

        ?

        JSON.parse(user)

        :

        null;



    }

    catch{


        return null;


    }


};









// =====================================================
// CHECK AUTH
// =====================================================


export const isAuthenticated = ()=>{


    return Boolean(

        localStorage.getItem("token")

    );


};