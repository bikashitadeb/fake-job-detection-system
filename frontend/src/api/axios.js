import axios from "axios";


const API = axios.create({

    baseURL: "http://127.0.0.1:5000/api",

    headers: {
        "Content-Type": "application/json",
    },

});



// Attach JWT token automatically

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem(
            "access_token"
        );


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },


    (error) => {

        return Promise.reject(error);

    }

);



// Handle expired token globally

API.interceptors.response.use(

    (response) => {

        return response;

    },


    (error) => {


        if (
            error.response &&
            error.response.status === 401
        ) {

            localStorage.removeItem(
                "access_token"
            );


            localStorage.removeItem(
                "user"
            );

        }


        return Promise.reject(error);

    }

);



export default API;