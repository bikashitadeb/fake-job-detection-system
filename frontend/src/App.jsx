// src/App.jsx


import {
    lazy,
    Suspense
} from "react";


import {

    Routes,
    Route,
    Navigate,
    useLocation

} from "react-router-dom";


import {

    AnimatePresence,
    motion

} from "framer-motion";


import ProtectedRoute from "./routes/ProtectedRoute.jsx";





// ============================
// AUTH
// ============================


const Login = lazy(
    ()=>import("./pages/Login.jsx")
);


const Register = lazy(
    ()=>import("./pages/Register.jsx")
);





// ============================
// COMMON
// ============================


const Profile = lazy(
    ()=>import("./pages/Profile.jsx")
);


const Notifications = lazy(
    ()=>import("./pages/Notifications.jsx")
);







// ============================
// EMPLOYEE
// ============================


const EmployeeLayout = lazy(
    ()=>import("./layouts/EmployeeLayout.jsx")
);


const EmployeeDashboard = lazy(
    ()=>import("./pages/employee/EmployeeDashboard.jsx")
);


const JobPostings = lazy(
    ()=>import("./pages/employee/JobPostings.jsx")
);


const JobDetails = lazy(
    ()=>import("./pages/employee/JobDetails.jsx")
);


const SavedJobs = lazy(
    ()=>import("./pages/employee/SavedJobs.jsx")
);


const Applications = lazy(
    ()=>import("./pages/employee/Applications.jsx")
);








// ============================
// RECRUITER
// ============================


const RecruiterLayout = lazy(
    ()=>import("./layouts/RecruiterLayout.jsx")
);


const RecruiterDashboard = lazy(
    ()=>import("./pages/recruiter/RecruiterDashboard.jsx")
);


const PostJob = lazy(
    ()=>import("./pages/recruiter/PostJob.jsx")
);


const PostedJobs = lazy(
    ()=>import("./pages/recruiter/PostedJobs.jsx")
);


const RecruiterVerification = lazy(
    ()=>import("./pages/recruiter/RecruiterVerification.jsx")
);


const RecruiterProfile = lazy(
    ()=>import("./pages/recruiter/RecruiterProfile.jsx")
);


const Applicants = lazy(
    ()=>import("./pages/recruiter/Applicants.jsx")
);


const RecruiterAnalytics = lazy(
    ()=>import("./pages/recruiter/Analytics.jsx")
);








// ============================
// ADMIN
// ============================


const AdminDashboard = lazy(
    ()=>import("./pages/admin/AdminDashboard.jsx")
);


const Analytics = lazy(
    ()=>import("./pages/admin/Analytics.jsx")
);


const Companies = lazy(
    ()=>import("./pages/admin/Companies.jsx")
);









// ============================
// LOADING
// ============================


function LoadingScreen(){


return(


<div


style={{


height:"100vh",

display:"flex",

alignItems:"center",

justifyContent:"center",

background:"#020617",

color:"white"


}}



>


<motion.div



animate={{

scale:[1,1.15,1],

opacity:[.5,1,.5]


}}



transition={{

duration:1.5,

repeat:Infinity

}}



style={{


fontSize:"45px",

fontWeight:900,

background:

"linear-gradient(90deg,#8b5cf6,#ec4899)",

WebkitBackgroundClip:"text",

color:"transparent"


}}



>


SecureHire AI


</motion.div>



</div>


);


}









// ============================
// ANIMATED ROUTES
// ============================


function AnimatedRoutes(){



const location = useLocation();




return(



<AnimatePresence mode="wait">



<motion.div



key={location.pathname}



initial={{


opacity:0,

y:20


}}



animate={{


opacity:1,

y:0


}}



exit={{


opacity:0,

y:-20


}}



transition={{


duration:.35


}}



>



<Routes>






<Route

path="/"

element={<Navigate to="/login"/>}

/>





<Route

path="/login"

element={<Login/>}

/>




<Route

path="/register"

element={<Register/>}

/>









{/* ================= EMPLOYEE ================= */}




<Route

element={

<ProtectedRoute

allowedRoles={["employee"]}

/>

}

>


<Route

path="/employee"

element={<EmployeeLayout/>}

>


<Route

index

element={<Navigate to="dashboard"/>}

/>


<Route

path="dashboard"

element={<EmployeeDashboard/>}

/>


<Route

path="jobs"

element={<JobPostings/>}

/>


<Route

path="job/:id"

element={<JobDetails/>}

/>


<Route

path="saved"

element={<SavedJobs/>}

/>


<Route

path="applications"

element={<Applications/>}

/>


<Route

path="profile"

element={<Profile/>}

/>


<Route

path="notifications"

element={<Notifications/>}

/>


</Route>


</Route>










{/* ================= RECRUITER ================= */}




<Route

element={

<ProtectedRoute

allowedRoles={["recruiter"]}

/>

}

>


<Route

path="/recruiter"

element={<RecruiterLayout/>}

>


<Route

index

element={<Navigate to="dashboard"/>}

/>




<Route

path="dashboard"

element={<RecruiterDashboard/>}

/>



<Route

path="jobs"

element={<PostedJobs/>}

/>




<Route

path="post-job"

element={<PostJob/>}

/>




<Route

path="verification"

element={<RecruiterVerification/>}

/>




<Route

path="applicants"

element={<Applicants/>}

/>




<Route

path="analytics"

element={<RecruiterAnalytics/>}

/>




<Route

path="profile"

element={<RecruiterProfile/>}

/>




<Route

path="notifications"

element={<Notifications/>}

/>




</Route>


</Route>









{/* ================= ADMIN ================= */}




<Route

element={

<ProtectedRoute

allowedRoles={["admin"]}

/>

}

>


<Route

path="/admin"

element={<AdminDashboard/>}

>


<Route

index

element={<Navigate to="dashboard"/>}

/>



<Route

path="dashboard"

element={<AdminDashboard/>}

/>



<Route

path="analytics"

element={<Analytics/>}

/>



<Route

path="companies"

element={<Companies/>}

/>


<Route

path="notifications"

element={<Notifications/>}

/>


</Route>


</Route>









<Route

path="*"

element={<Navigate to="/login"/>}

/>






</Routes>




</motion.div>




</AnimatePresence>



);



}









export default function App(){


return(


<Suspense

fallback={<LoadingScreen/>}

>


<AnimatedRoutes/>


</Suspense>


);


}