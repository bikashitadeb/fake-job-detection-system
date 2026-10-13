import axios from "axios";



// =====================================================
// API CONFIGURATION
// =====================================================


const API = axios.create({

    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:5000/api",


    headers: {

        "Content-Type":
            "application/json",

    },


    timeout:10000,

});






// =====================================================
// REQUEST INTERCEPTOR
// =====================================================

API.interceptors.request.use(

    (config)=>{


        const token =
            localStorage.getItem(
                "access_token"
            );



        if(token){

            config.headers.Authorization =
                `Bearer ${token}`;

        }



        console.log(
            "🚀 API REQUEST:",
            config.method?.toUpperCase(),
            config.url
        );



        return config;


    },


    (error)=>{


        console.error(
            "REQUEST ERROR:",
            error
        );


        return Promise.reject(error);

    }

);







// =====================================================
// RESPONSE INTERCEPTOR
// =====================================================

API.interceptors.response.use(


    (response)=>{


        console.log(
            "✅ API RESPONSE:",
            response.status,
            response.config.url
        );


        return response;


    },



    (error)=>{


        console.error(

            "❌ API ERROR:",

            error.response?.data ||
            error.message

        );




        if(error.response){



            const status =
                error.response.status;




            // Token expired / invalid

            if(status === 401){



                localStorage.removeItem(

                    "access_token"

                );


                localStorage.removeItem(

                    "user"

                );



                window.location.href =
                    "/login";

            }



        }



        return Promise.reject(error);


    }


);








// =====================================================
// AUTH HELPERS
// =====================================================


export const saveAuthData = (

    token,

    user

)=>{


    localStorage.setItem(

        "access_token",

        token

    );


    localStorage.setItem(

        "user",

        JSON.stringify(user)

    );

};






export const getCurrentUser = ()=>{


    const user =
        localStorage.getItem(
            "user"
        );



    return user
        ? JSON.parse(user)
        : null;


};






export const logout = ()=>{


    localStorage.removeItem(

        "access_token"

    );


    localStorage.removeItem(

        "user"

    );


    window.location.href =
        "/login";


};






export default API;