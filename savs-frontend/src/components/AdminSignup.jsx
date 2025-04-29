import React, { useState } from 'react';
import axios from 'axios';
import './AdminSignup.css';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
    college: '',
    profilePhoto: null, // New state for profile photo
  });

  // Handle input change
  const handleChange = (e) => {
    if (e.target.name === 'profilePhoto') {
      // Handle file upload
      setFormData((prev) => ({
        ...prev,
        profilePhoto: e.target.files[0], // Store file in state
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, department, college, profilePhoto } = formData;

    // Prepare form data for file upload
    const formDataToSend = new FormData();
    formDataToSend.append('name', name);
    formDataToSend.append('email', email);
    formDataToSend.append('password', password);
    formDataToSend.append('department', department);
    formDataToSend.append('college', college);
    formDataToSend.append('profilePhoto', profilePhoto); // Attach profile photo

    try {
      const response = await axios.post("http://localhost:5000/api/signup/admin", formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert(response.data.message); // Success message
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("An error occurred during registration");
    }
  };

  return (
    <div className="signup-background">
      <div className="admin-signup-box shadow">
        <h2 className="title">SMART ATTENDANCE VERIFICATION SYSTEM</h2>
        <p className="subline">Smart Attendance, Smarter Learning</p>
        <h4 className="text-center mb-4 admin-label">Admin Signup</h4>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Name</label>
            <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Department</label>
            <input type="text" className="form-control" name="department" value={formData.department} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>College</label>
            <input type="text" className="form-control" name="college" value={formData.college} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label>Profile Photo</label>
            <input type="file" className="form-control" name="profilePhoto" onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
