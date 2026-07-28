import {

createContext,

useContext,

useEffect,

useState

} from "react";



const AuthContext = createContext();



export function AuthProvider({children}){


const [user,setUser] = useState(null);


const [token,setToken] = useState(

localStorage.getItem("access_token")

);


const [loading,setLoading] = useState(true);





// ============================
// LOAD USER ON REFRESH
// ============================

useEffect(()=>{


const savedUser = localStorage.getItem("user");


if(savedUser){

setUser(

JSON.parse(savedUser)

);

}


setLoading(false);


},[]);





// ============================
// LOGIN
// ============================

const login=(data)=>{


const accessToken =

data.access_token ||

data.token;



const userData = data.user;





if(accessToken){


localStorage.setItem(

"access_token",

accessToken

);


setToken(accessToken);


}





if(userData){


localStorage.setItem(

"user",

JSON.stringify(userData)

);


setUser(userData);


}



};







// ============================
// LOGOUT
// ============================

const logout=()=>{


localStorage.removeItem(

"access_token"

);


localStorage.removeItem(

"user"

);



setToken(null);


setUser(null);



};







return(

<AuthContext.Provider

value={{

user,

token,

loading,

login,

logout

}}

>

{children}

</AuthContext.Provider>


);


}







export function useAuth(){


return useContext(AuthContext);


}