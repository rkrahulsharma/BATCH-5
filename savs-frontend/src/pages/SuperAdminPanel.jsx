import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Toast, Modal, Badge, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { motion } from 'framer-motion';

const SuperAdminPanel = () => {
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [sessions, setSessions] = useState([]);

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
      const [adminRes, studentRes, sessionRes] = await Promise.all([
        axios.get('/api/super-admin/admins'),
        axios.get('/api/super-admin/students'),
        axios.get('/api/super-admin/sessions'),
      ]);

      const admins = adminRes.data;
      const students = studentRes.data;

      setPendingAdmins(admins.filter(a => a.is_approved === 0));
      setApprovedAdmins(admins.filter(a => a.is_approved === 1));
      setPendingStudents(students.filter(s => s.is_approved === 0));
      setApprovedStudents(students.filter(s => s.is_approved === 1));
      setSessions(sessionRes.data);
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
      await axios.post(url, { id: selectedUser.id });
      handleToast(`${selectedRole} ${modalAction}d successfully!`);
      fetchData();
    } catch {
      handleToast('Something went wrong!');
    }
    setShowModal(false);
  };

  return (
    <Container fluid className="p-4 bg-light min-vh-100">
      <h2 className="text-primary mb-4">Super Admin Dashboard</h2>

      <Toast show={showToast} bg="info" onClose={() => setShowToast(false)} className="position-fixed top-0 end-0 m-3">
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

      <Tabs defaultActiveKey="admins" className="mb-3">
        <Tab eventKey="admins" title="Admins">
          <Row className="mb-3">
            <Col><Badge bg="warning">Pending: {pendingAdmins.length}</Badge></Col>
            <Col><Badge bg="success">Approved: {approvedAdmins.length}</Badge></Col>
          </Row>

          <h5>Pending Admins</h5>
          <Table striped bordered hover responsive className="mb-4">
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

          <h5>Approved Admins</h5>
          <Table striped bordered hover responsive>
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
        </Tab>

        <Tab eventKey="students" title="Students">
          <Row className="mb-3">
            <Col><Badge bg="warning">Pending: {pendingStudents.length}</Badge></Col>
            <Col><Badge bg="success">Approved: {approvedStudents.length}</Badge></Col>
          </Row>

          <h5>Pending Students</h5>
          <Table striped bordered hover responsive className="mb-4">
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

          <h5>Approved Students</h5>
          <Table striped bordered hover responsive>
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
        </Tab>

        <Tab eventKey="reports" title="Session Reports">
          <h5>Hosted Sessions</h5>
          <Table striped bordered hover responsive>
            <thead><tr><th>Session Title</th><th>Host</th><th>Date</th><th>Participants</th></tr></thead>
            <tbody>
              {sessions.map(session => (
                <motion.tr key={session.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <td>{session.title}</td>
                  <td>{session.host}</td>
                  <td>{session.date}</td>
                  <td>{session.participant_count}</td>
                </motion.tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default SuperAdminPanel;
