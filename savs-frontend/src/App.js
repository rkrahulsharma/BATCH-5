import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import AdminSignup from './components/AdminSignup';
import StudentSignup from './components/StudentSignup';

import LoginPage from './components/LoginPage.jsx'
import AdminLogin from './components/AdminLogin';

import StudentLogin from './components/StudentLogin';
import SuperAdminPanel from './pages/SuperAdminPanel';
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/admin" element={<AdminSignup />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        <Route path="/student-login" element={<LoginPage />} />
<Route path="/admin-login" element={<LoginPage />} />
<Route path="/super-admin" element={<SuperAdminPanel />} />


<Route path="/login/admin" element={<AdminLogin />} />
<Route path="/login/student" element={<StudentLogin />} />


      </Routes>
    </Router>
  );
}

export default App;
