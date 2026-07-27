import axios from "axios";


const API = axios.create({

    baseURL: "http://127.0.0.1:5000/api",

    headers: {
        "Content-Type": "application/json"
    }

});



API.interceptors.request.use(

    (config) => {


        const token = localStorage.getItem("token");


        console.log(
            "TOKEN FROM STORAGE:",
            token
        );


        if (token) {

            config.headers = config.headers || {};


            config.headers.Authorization =
                `Bearer ${token}`;

        }


        console.log(
            "REQUEST URL:",
            config.baseURL + config.url
        );


        console.log(
            "FINAL HEADERS:",
            config.headers
        );


        return config;

    },


    (error) => {

        return Promise.reject(error);

    }

);



API.interceptors.response.use(

    (response) => {

        return response;

    },


    (error) => {


        if(error.response){

            console.log(
                "API ERROR:",
                error.response.data
            );

        }
        else{

            console.log(
                "NETWORK ERROR:",
                error.message
            );

        }


        return Promise.reject(error);

    }

);



export default API;