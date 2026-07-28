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


    headers:{


        "Content-Type":"application/json"


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
// HANDLE ERRORS
// ================================


API.interceptors.response.use(



(response)=>{


    return response;


},




(error)=>{



    if(error.response){



        // JWT expired / unauthorized

        if(error.response.status === 401){



            localStorage.removeItem(

                "access_token"

            );



            localStorage.removeItem(

                "user"

            );



            window.location.href="/login";


        }



    }





    return Promise.reject(error);



}



);









export default API;