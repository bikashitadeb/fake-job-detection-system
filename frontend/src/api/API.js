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


    timeout: 15000,


    headers:{


        "Content-Type":

        "application/json"


    }


});







// ================================
// REQUEST INTERCEPTOR
// ATTACH JWT TOKEN
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





    console.log(

        "API REQUEST:",

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
// GLOBAL ERROR HANDLING
// ================================


API.interceptors.response.use(


(response)=>{


    console.log(

        "API SUCCESS:",

        response.status,

        response.config.url

    );


    return response;


},



(error)=>{



    if(!error.response){


        console.error(

            "Backend server not reachable"

        );


        return Promise.reject(error);


    }





    const status = error.response.status;





    // JWT expired / invalid


    if(

        status === 401 ||

        status === 422

    ){



        console.warn(

            "Authentication expired"

        );




        localStorage.removeItem(

            "access_token"

        );


        localStorage.removeItem(

            "user"

        );





        if(

            window.location.pathname !== "/login"

        ){


            window.location.href="/login";


        }



    }






    // Permission denied


    if(status === 403){


        console.warn(

            "Forbidden request"

        );


    }





    // Server error


    if(status >= 500){


        console.error(

            "Server error:",

            error.response.data

        );


    }




    return Promise.reject(error);



}



);








export default API;