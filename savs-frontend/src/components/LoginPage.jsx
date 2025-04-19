import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // import this
import axios from 'axios';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate(); // hook to navigate
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'student'
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/auth/login", formData);
    alert(res.data.message);

    const user = res.data.user; // ✅ get the user object from response

    // Redirect based on role
    if (user.role === 'superadmin') {
      navigate('/super-admin-panel');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    } else {
      navigate('/admin/dashboard');
    }
    
  } catch (err) {
    alert(err.response?.data?.message || "Login failed");
  }
};

  return (
    <div className="signup-background">
      <div className="admin-signup-box shadow">
        <h2 className="title">SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p className="subline">Smart Attendance, Smarter Learning</p>
        <h4 className="text-center mb-4 admin-label">Login</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" name="email" className="form-control" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Login As</label>
            <select className="form-control" name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
