import axios from "axios";


// ================================
// BACKEND URL
// ================================

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:5000/api";




// ================================
// AXIOS INSTANCE
// ================================

const API = axios.create({

    baseURL: BASE_URL,

    headers: {

        "Content-Type": "application/json"

    }

});




// ================================
// REQUEST INTERCEPTOR
// ADD JWT TOKEN
// ================================

API.interceptors.request.use(

    (config)=>{


        const token = localStorage.getItem(
            "access_token"
        );


        if(token){


            config.headers = config.headers || {};


            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;


    },


    (error)=>{

        return Promise.reject(error);

    }

);





// ================================
// RESPONSE INTERCEPTOR
// HANDLE AUTH ERRORS
// ================================

API.interceptors.response.use(


    (response)=>{


        return response;


    },


    (error)=>{


        if(error.response){


            const status = error.response.status;



            // Unauthorized
            if(status === 401){


                console.log(
                    "JWT expired or missing"
                );


                localStorage.removeItem(
                    "access_token"
                );


                localStorage.removeItem(
                    "user"
                );


                window.location.href =
                    "/login";


            }


            // Forbidden
            if(status === 403){


                console.log(
                    "Access denied"
                );


            }


        }


        return Promise.reject(error);


    }


);





export default API;