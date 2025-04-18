// pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = ({ currentAdmin }) => {
  const [pendingStudents, setPendingStudents] = useState([]);

  useEffect(() => {
    axios.get('/api/pending-students', {
      params: {
        department: currentAdmin.department,
        college: currentAdmin.college
      }
    }).then(res => setPendingStudents(res.data))
      .catch(err => console.error(err));
  }, [currentAdmin]);

  const approveStudent = (email) => {
    axios.post('/api/verify-student', { email })
      .then(() => {
        alert("Student approved!");
        setPendingStudents(pendingStudents.filter(student => student.email !== email));
      })
      .catch(err => alert("Approval failed"));
  };

  return (
    <div className="container mt-4">
      <h2>Pending Student Approvals</h2>
      <ul className="list-group">
        {pendingStudents.map((student) => (
          <li key={student.email} className="list-group-item d-flex justify-content-between">
            <div>
              <strong>{student.name}</strong> - {student.email}<br />
              Dept: {student.department}, College: {student.college}
            </div>
            <button className="btn btn-success" onClick={() => approveStudent(student.email)}>Approve</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDashboard;
