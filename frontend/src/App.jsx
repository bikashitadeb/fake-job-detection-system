import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import RecruiterDashboard from "./pages/RecruiterDashboard";
import PostJob from "./pages/PostJob";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />


        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />


        {/* Recruiter Dashboard */}
        <Route
          path="/recruiter"
          element={<RecruiterDashboard />}
        />


        {/* Create Job */}
        <Route
          path="/post-job"
          element={<PostJob />}
        />


        {/* Default Route */}
        <Route
          path="*"
          element={<Login />}
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;