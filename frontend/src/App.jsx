import {

Routes,

Route,

Navigate

} from "react-router-dom";


// ==========================
// AUTH PAGES
// ==========================

import Login from "./pages/Login.jsx";

import Register from "./pages/Register.jsx";



// ==========================
// EMPLOYEE
// ==========================

import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";

import JobPostings from "./pages/employee/JobPostings.jsx";

import JobDetails from "./pages/employee/JobDetails.jsx";

import SavedJobs from "./pages/employee/SavedJobs.jsx";

import Applications from "./pages/employee/Applications.jsx";



// ==========================
// RECRUITER
// ==========================

import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard.jsx";

import PostJob from "./pages/recruiter/PostJob.jsx";

import PostedJobs from "./pages/recruiter/PostedJobs.jsx";

import RecruiterVerification from "./pages/recruiter/RecruiterVerification.jsx";



// ==========================
// ADMIN
// ==========================

import AdminDashboard from "./pages/admin/AdminDashboard.jsx";

import Analytics from "./pages/admin/Analytics.jsx";



// ==========================
// LAYOUTS
// ==========================

import EmployeeLayout from "./layouts/EmployeeLayout.jsx";

import RecruiterLayout from "./layouts/RecruiterLayout.jsx";



// ==========================
// AUTH GUARD
// ==========================

import ProtectedRoute from "./routes/ProtectedRoute.jsx";







export default function App(){



return(

<Routes>





{/* ==========================
        PUBLIC
========================== */}



<Route

path="/"

element={<Login/>}

/>



<Route

path="/login"

element={<Login/>}

/>



<Route

path="/register"

element={<Register/>}

/>









{/* ==========================
        EMPLOYEE
========================== */}



<Route

path="/employee"

element={


<ProtectedRoute role="employee">


<EmployeeLayout/>


</ProtectedRoute>


}



>



<Route

index

element={

<Navigate to="dashboard"/>

}

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



</Route>









{/* ==========================
        RECRUITER
========================== */}



<Route

path="/recruiter"

element={


<ProtectedRoute role="recruiter">


<RecruiterLayout/>


</ProtectedRoute>


}



>



<Route

index

element={

<Navigate to="dashboard"/>

}

/>



<Route

path="dashboard"

element={<RecruiterDashboard/>}

/>



<Route

path="post-job"

element={<PostJob/>}

/>



<Route

path="jobs"

element={<PostedJobs/>}

/>



<Route

path="verification"

element={<RecruiterVerification/>}

/>



</Route>









{/* ==========================
        ADMIN
========================== */}



<Route

path="/admin"

element={


<ProtectedRoute role="admin">


<div>


</div>


</ProtectedRoute>


}



>



<Route

index

element={

<Navigate to="dashboard"/>

}

/>



<Route

path="dashboard"

element={<AdminDashboard/>}

/>



<Route

path="analytics"

element={<Analytics/>}

/>



</Route>









{/* ==========================
        UNKNOWN URL
========================== */}



<Route

path="*"

element={

<Navigate to="/login"/>

}

/>



</Routes>


);


}