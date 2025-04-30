import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Toast, Modal, Badge, Container, Row, Col, Tabs, Tab, Card } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './SuperAdminPanel.css';

const SuperAdminPanel = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [approvedSessions, setApprovedSessions] = useState([]);

  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('admin');

  const handleToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchData = async () => {
    try {
      const [pendingAdminRes, pendingStudentRes, sessionRes, pendingSessionRes, approvedSessionRes] = await Promise.all([
        axios.get('/api/super-admin/pending-admins'),
        axios.get('/api/super-admin/pending-students'),
        axios.get('/api/super-admin/sessions'),
        axios.get('/api/super-admin/pending-sessions'), // New API for pending sessions
        axios.get('/api/super-admin/approved-sessions'), // New API for approved sessions
      ]);
  
      setPendingAdmins(pendingAdminRes.data);
      setPendingStudents(pendingStudentRes.data);
      setSessions(sessionRes.data);
      setPendingSessions(pendingSessionRes.data);
      setApprovedSessions(approvedSessionRes.data);
  
      // Fetch approved admins and students separately
      const [approvedAdminRes, approvedStudentRes] = await Promise.all([
        axios.get('/api/super-admin/admins'),
        axios.get('/api/super-admin/students'),
      ]);
  
      setApprovedAdmins(approvedAdminRes.data.filter(a => a.is_approved === 1));
      setApprovedStudents(approvedStudentRes.data.filter(s => s.is_approved === 1));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openModal = (user, role, action) => {
    setSelectedUser(user);
    setSelectedRole(role);
    setModalAction(action);
    setShowModal(true);
  };

  const confirmAction = async () => {
    try {
      const url = `/api/super-admin/${modalAction}-${selectedRole}`;
      await axios.post(url, { id: selectedUser.id, email: selectedUser.email, name: selectedUser.name });
      handleToast(`${selectedRole} ${modalAction}d successfully!`);
      fetchData();
    } catch (err) {
      handleToast('Something went wrong!');
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard-bg text-white min-vh-100 p-4">
      <Container fluid>
        <motion.h2 className="mb-4 text-shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Super Admin Dashboard
        </motion.h2>

        <Toast show={showToast} bg="info" onClose={() => setShowToast(false)} className="position-fixed top-0 end-0 m-3 zindex-toast">
          <Toast.Body>{toastMsg}</Toast.Body>
        </Toast>

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm {modalAction}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to {modalAction} {selectedRole} <strong>{selectedUser?.name}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button variant={modalAction === 'approve' ? 'success' : 'danger'} onClick={confirmAction}>
              Yes, {modalAction}
            </Button>
          </Modal.Footer>
        </Modal>

        <Tabs defaultActiveKey="admins" className="mb-4" fill>
          {/* Admin Tab */}
          <Tab eventKey="admins" title="Admins">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Row>
                <Col md={6}>
                  <Card bg="dark" text="light" className="mb-3">
                    <Card.Body><Badge bg="warning">Pending: {pendingAdmins.length}</Badge></Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card bg="dark" text="light" className="mb-3">
                    <Card.Body><Badge bg="success">Approved: {approvedAdmins.length}</Badge></Card.Body>
                  </Card>
                </Col>
              </Row>
              <h5 className="text-light">Pending Admins</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead><tr><th>Name</th><th>Email</th><th>Dept</th><th>Action</th></tr></thead>
                <tbody>
                  {pendingAdmins.map(admin => (
                    <motion.tr key={admin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.department}</td>
                      <td>
                        <Button size="sm" variant="success" className="me-2" onClick={() => openModal(admin, 'admin', 'approve')}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => openModal(admin, 'admin', 'reject')}>Reject</Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="text-light">Approved Admins</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead><tr><th>Name</th><th>Email</th><th>Dept</th><th>College</th></tr></thead>
                <tbody>
                  {approvedAdmins.map(admin => (
                    <motion.tr key={admin.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{admin.name}</td>
                      <td>{admin.email}</td>
                      <td>{admin.department}</td>
                      <td>{admin.college}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          </Tab>

          {/* Students Tab */}
          <Tab eventKey="students" title="Students">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Row>
                <Col md={6}>
                  <Card bg="dark" text="light" className="mb-3">
                    <Card.Body><Badge bg="warning">Pending: {pendingStudents.length}</Badge></Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card bg="dark" text="light" className="mb-3">
                    <Card.Body><Badge bg="success">Approved: {approvedStudents.length}</Badge></Card.Body>
                  </Card>
                </Col>
              </Row>

              <h5 className="text-light">Pending Students</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead><tr><th>Name</th><th>Email</th><th>Guardian</th><th>Action</th></tr></thead>
                <tbody>
                  {pendingStudents.map(student => (
                    <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.guardian_name}</td>
                      <td>
                        <Button size="sm" variant="success" className="me-2" onClick={() => openModal(student, 'student', 'approve')}>Approve</Button>
                        <Button size="sm" variant="danger" onClick={() => openModal(student, 'student', 'reject')}>Reject</Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="text-light">Approved Students</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead><tr><th>Name</th><th>Email</th><th>Guardian</th></tr></thead>
                <tbody>
                  {approvedStudents.map(student => (
                    <motion.tr key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.guardian_name}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          </Tab>

          {/* Session Reports */}
          <Tab eventKey="reports" title="Session Reports">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h5 className="text-light mt-3">Pending Sessions</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th>Session Title</th>
                    <th>Host</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingSessions.map(session => (
                    <motion.tr key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{session.title}</td>
                      <td>{session.host}</td>
                      <td>{session.start_time}</td>
                      <td>{session.end_time}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="success"
                          className="me-2"
                          onClick={() => openModal(session, 'session', 'approve')}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => openModal(session, 'session', 'reject')}
                        >
                          Reject
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>

              <h5 className="text-light mt-3">Approved Sessions</h5>
              <Table striped bordered hover variant="dark" responsive>
                <thead>
                  <tr>
                    <th>Session Title</th>
                    <th>Host</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                  </tr>
                </thead>
                <tbody>
                  {approvedSessions.map(session => (
                    <motion.tr key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <td>{session.title}</td>
                      <td>{session.host}</td>
                      <td>{session.start_time}</td>
                      <td>{session.end_time}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </Table>
            </motion.div>
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

export default SuperAdminPanel;
