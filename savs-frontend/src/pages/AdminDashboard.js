import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Row, Col, Button, Card, ListGroup, Navbar, Nav, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [session, setSession] = useState({ name: '', start: '', end: '' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Read admin data from localStorage
    const storedAdmin = localStorage.getItem("adminData");
    if (storedAdmin) {
      const parsed = JSON.parse(storedAdmin);
      setCurrentAdmin(parsed);

      // Fetch pending students
      axios.get('/api/pending-students', {
        params: {
          department: parsed.department,
          college: parsed.college
        }
      })
        .then(res => setPendingStudents(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const approveStudent = (email) => {
    axios.post('/api/verify-student', { email })
      .then(() => {
        alert("✅ Student approved!");
        setPendingStudents(pendingStudents.filter(student => student.email !== email));
      })
      .catch(() => alert("❌ Approval failed"));
  };

  const startSession = () => {
    console.log("Session started:", session);
    alert(`🎥 Session "${session.name}" scheduled from ${session.start} to ${session.end}`);
    setShowSessionModal(false);
  };

  const logout = () => {
    localStorage.removeItem("admin-token");
    localStorage.removeItem("adminData");
    navigate("/admin-login");
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading admin data...</h4>
      </div>
    );
  }

  if (!currentAdmin) {
    return (
      <div className="text-center mt-5">
        <h4>No admin data found. Please login again.</h4>
        <Button className="mt-3" onClick={logout}>Go to Login</Button>
      </div>
    );
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Admin Dashboard - SAVS</Navbar.Brand>
          <Nav>
            <Nav.Link onClick={() => setShowSessionModal(true)}>📅 Schedule Session</Nav.Link>
            <Nav.Link onClick={logout}>🚪 Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header><strong>Pending Student Approvals</strong></Card.Header>
              <ListGroup variant="flush">
                {pendingStudents.length === 0 ? (
                  <ListGroup.Item>No pending students ✅</ListGroup.Item>
                ) : (
                  pendingStudents.map((student) => (
                    <ListGroup.Item key={student.email} className="d-flex justify-content-between">
                      <div>
                        <strong>{student.name}</strong> ({student.email})<br />
                        Dept: {student.department}, College: {student.college}
                      </div>
                      <Button variant="success" onClick={() => approveStudent(student.email)}>Approve</Button>
                    </ListGroup.Item>
                  ))
                )}
              </ListGroup>
            </Card>
          </Col>

          <Col md={6}>
            <Card>
              <Card.Header><strong>Upcoming Session Info</strong></Card.Header>
              <Card.Body>
                <p>Use "Schedule Session" above to initiate live attendance verification.</p>
                <p><strong>Future Features:</strong></p>
                <ul>
                  <li>📸 Real-time image capturing</li>
                  <li>📊 Attendance analytics</li>
                  <li>📥 Download PDF reports</li>
                </ul>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Modal show={showSessionModal} onHide={() => setShowSessionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>📅 Schedule a Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Session Name</Form.Label>
              <Form.Control type="text" placeholder="e.g., DBMS Lecture" onChange={(e) => setSession({ ...session, name: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Time</Form.Label>
              <Form.Control type="datetime-local" onChange={(e) => setSession({ ...session, start: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Time</Form.Label>
              <Form.Control type="datetime-local" onChange={(e) => setSession({ ...session, end: e.target.value })} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSessionModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={startSession}>Start Session</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AdminDashboard;
