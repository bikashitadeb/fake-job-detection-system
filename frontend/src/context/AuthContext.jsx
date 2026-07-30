import {

    createContext,

    useContext,

    useEffect,

    useState,

} from "react";





const AuthContext = createContext(null);








export function AuthProvider({children}){



    const [user,setUser] = useState(null);



    const [token,setToken] = useState(null);



    const [loading,setLoading] = useState(true);



    const [isAuthenticated,setIsAuthenticated] = useState(false);








    // =====================================
    // INITIALIZE AUTH SESSION
    // =====================================


    useEffect(()=>{


        const initializeAuth = ()=>{


            try{


                const savedToken = localStorage.getItem(

                    "access_token"

                );



                const savedUser = localStorage.getItem(

                    "user"

                );







                if(savedToken && savedUser){



                    const parsedUser = JSON.parse(

                        savedUser

                    );




                    setToken(savedToken);



                    setUser(parsedUser);



                    setIsAuthenticated(true);



                }





            }

            catch(error){


                console.error(

                    "AUTH INITIALIZATION ERROR:",

                    error

                );


                clearSession();



            }


            finally{


                setLoading(false);


            }



        };




        initializeAuth();



    },[]);









    // =====================================
    // LOGIN
    // =====================================


    const login=(authData)=>{


        try{


            const accessToken =

                authData.access_token ||

                authData.token;





            const userData = authData.user;






            if(!accessToken){


                throw new Error(

                    "Access token missing"

                );


            }





            if(!userData){


                throw new Error(

                    "User information missing"

                );


            }







            localStorage.setItem(

                "access_token",

                accessToken

            );





            localStorage.setItem(

                "user",

                JSON.stringify(userData)

            );







            localStorage.setItem(

                "login_time",

                new Date().toISOString()

            );







            setToken(accessToken);



            setUser(userData);



            setIsAuthenticated(true);






            return true;



        }


        catch(error){


            console.error(

                "LOGIN CONTEXT ERROR:",

                error

            );


            return false;


        }



    };









    // =====================================
    // LOGOUT
    // =====================================


    const logout=()=>{


        clearSession();



    };









    // =====================================
    // CLEAR SESSION
    // =====================================


    const clearSession=()=>{


        localStorage.removeItem(

            "access_token"

        );



        localStorage.removeItem(

            "user"

        );



        localStorage.removeItem(

            "login_time"

        );





        setToken(null);



        setUser(null);



        setIsAuthenticated(false);



    };









    // =====================================
    // ROLE CHECK
    // =====================================


    const hasRole=(role)=>{


        return user?.role === role;


    };









    // =====================================
    // USER INFORMATION
    // =====================================


    const getUserName=()=>{


        return user?.name || "User";


    };










    return(


        <AuthContext.Provider


            value={{


                user,


                token,


                loading,


                isAuthenticated,


                login,


                logout,


                clearSession,


                hasRole,


                getUserName


            }}



        >


            {children}


        </AuthContext.Provider>


    );



}









export function useAuth(){



    const context = useContext(

        AuthContext

    );




    if(!context){


        throw new Error(

            "useAuth must be used inside AuthProvider"

        );


    }





    return context;



}