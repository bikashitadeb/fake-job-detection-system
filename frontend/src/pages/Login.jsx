import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API from "../api/axios";


function Login(){

    const navigate = useNavigate();


    const [form,setForm] = useState({

        email:"",
        password:""

    });


    const [error,setError] = useState("");



    const handleChange = (e)=>{

        setForm({

            ...form,

            [e.target.name]:e.target.value

        });

    };




    const handleSubmit = async(e)=>{

        e.preventDefault();


        try{


            const response = await API.post(

                "/auth/login",

                form

            );


            console.log(
                "LOGIN RESPONSE:",
                response.data
            );



            // Handles both formats:
            // {data:{access_token}}
            // {access_token}

            const data =
            response.data.data || response.data;



            if(!data.access_token){

                throw new Error(
                    "Token not received from backend"
                );

            }



            localStorage.removeItem(
                "token"
            );


            localStorage.setItem(

                "token",

                data.access_token

            );



            localStorage.setItem(

                "user",

                JSON.stringify(
                    data.user
                )

            );



            console.log(

                "SAVED TOKEN:",

                localStorage.getItem("token")

            );




            if(data.user.role === "recruiter"){

                navigate("/recruiter");

            }

            else if(data.user.role === "admin"){

                navigate("/admin");

            }

            else{

                navigate("/jobs");

            }



        }


        catch(err){


            console.log(
                "LOGIN ERROR:",
                err
            );


            setError(
                "Invalid email or password"
            );


        }


    };



    return (

        <div>


            <h1>
                Fake Job Detection System
            </h1>



            <h2>
                Login
            </h2>



            {
                error &&
                <p>{error}</p>
            }




            <form onSubmit={handleSubmit}>


                <input

                    type="email"

                    name="email"

                    placeholder="Email"

                    value={form.email}

                    onChange={handleChange}

                />



                <br/><br/>




                <input

                    type="password"

                    name="password"

                    placeholder="Password"

                    value={form.password}

                    onChange={handleChange}

                />



                <br/><br/>



                <button type="submit">

                    Login

                </button>



            </form>


        </div>

    );

}


export default Login;