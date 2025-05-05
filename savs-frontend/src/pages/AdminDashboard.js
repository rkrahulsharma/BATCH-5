import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs, Container, Button, Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // <-- Import useNavigate
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [pending, setPending] = useState([]);
  const [sessionActive, setSessionActive] = useState(false);
  const [admin, setAdmin] = useState({});
  
  const navigate = useNavigate();  // <-- Define navigate here

  useEffect(() => {
    fetchStudents();
    fetchPending();
    const userData = JSON.parse(localStorage.getItem('userData'));
    setAdmin(userData);
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/students");
      setStudents(res.data.students);
    } catch (err) {
      alert("Failed to fetch students");
    }
  };

  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/pending-approvals");
      setPending(res.data.pending || []);
    } catch (err) {
      console.error("Error fetching pending approvals", err);
    }
  };

  const approveStudent = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/admin/approve/${id}`);
      alert("Student approved!");
      fetchPending();
      fetchStudents();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const startSession = async () => {
    try {
      await axios.post("http://localhost:5000/api/session/start");
      setSessionActive(true);
      alert("Session started");
    } catch (err) {
      alert("Error starting session");
    }
  };

  const endSession = async () => {
    try {
      await axios.post("http://localhost:5000/api/session/end");
      setSessionActive(false);
      alert("Session ended");
    } catch (err) {
      alert("Error ending session");
    }
  };

  const logout = () => {
    localStorage.removeItem("userData");
    window.location.href = "/";
  };

  return (
    <Container className="mt-4 admin-dashboard-bg">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>Welcome, {admin.name}</h3>
          <p className="text-muted">Email: {admin.email}</p>
        </div>
        <Button variant="outline-danger" onClick={logout}>Logout</Button>
      </div>

      <Tabs defaultActiveKey="host" className="mb-3" fill>
        {/* Host Session */}
        <Tab eventKey="host" title="📡 Host Session">
          <div className="mb-3">
            <button onClick={() => navigate('/admin/host-session')}>
              Go to Host Session
            </button>
          </div>
          <h5>Registered Students</h5>
          <ul className="list-group">
            {students.map(student => (
              <li key={student.id} className="list-group-item">
                {student.name} - {student.email}
              </li>
            ))}
          </ul>
        </Tab>

        {/* Pending Approvals */}
        <Tab eventKey="pending" title="🕓 Pending Approvals">
          {pending.length === 0 ? <p>No pending students</p> : (
            <ul className="list-group">
              {pending.map(student => (
                <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {student.name} - {student.email}
                  <Button size="sm" onClick={() => approveStudent(student.id)}>Approve</Button>
                </li>
              ))}
            </ul>
          )}
        </Tab>

        {/* Session History */}
        <Tab eventKey="history" title="📁 Session History">
          <p>(To be implemented: fetch attendance session records)</p>
        </Tab>

        {/* Performance Charts */}
        <Tab eventKey="charts" title="📊 Performance Charts">
          <p>(To be implemented: graphical attendance patterns)</p>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default AdminDashboard;