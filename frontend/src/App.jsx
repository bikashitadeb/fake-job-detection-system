import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import PostJob from "./pages/PostJob";
import MyJobs from "./pages/MyJobs";
import AIReports from "./pages/AIReports";

function App() {
  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/jobs" element={<MyJobs />} />

        <Route path="/post-job" element={<PostJob />} />

        <Route path="/reports" element={<AIReports />} />
      </Routes>
    </DashboardLayout>
  );
}

export default App;