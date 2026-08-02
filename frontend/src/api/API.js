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

    timeout:15000,

    headers:{

        "Content-Type":"application/json"

    }

});








// ================================
// REQUEST INTERCEPTOR
// ================================


API.interceptors.request.use(


(config)=>{


    const token =

        localStorage.getItem("token")

        ||

        localStorage.getItem("access_token");





    if(token){


        config.headers.Authorization =

        `Bearer ${token}`;


    }





    console.log(

        "REQUEST:",

        config.method?.toUpperCase(),

        config.url

    );



    return config;


},


(error)=>{


    return Promise.reject(error);


}

);









// ================================
// RESPONSE INTERCEPTOR
// ================================


API.interceptors.response.use(


(response)=>{


    return response;


},



(error)=>{



    if(!error.response){


        console.error(

            "Backend not reachable"

        );


        return Promise.reject(error);


    }





    const status = error.response.status;





    console.error(

        "API ERROR:",

        status,

        error.response.data

    );







    // ONLY logout for real authentication failure

    if(status === 401){



        console.warn(

            "Token expired"

        );



        localStorage.removeItem(

            "token"

        );


        localStorage.removeItem(

            "access_token"

        );


        localStorage.removeItem(

            "user"

        );



        window.location.href="/login";


    }






    // DO NOT LOGOUT FOR 403,404,422,500

    // These are normal API errors





    return Promise.reject(error);



}

);





export default API;