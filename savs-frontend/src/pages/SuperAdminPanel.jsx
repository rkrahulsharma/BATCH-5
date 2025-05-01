import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  Button,
  Toast,
  Modal,
  Badge,
  Container,
  Row,
  Col,
  Tabs,
  Tab,
  Card
} from 'react-bootstrap';
import { motion } from 'framer-motion';
import './SuperAdminPanel.css';

const SuperAdminPanel = () => {
  const [admin, setAdmin] = useState(null);
  const [pendingAdmins, setPendingAdmins] = useState([]);
  const [approvedAdmins, setApprovedAdmins] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [approvedStudents, setApprovedStudents] = useState([]);
  const [pendingSessions, setPendingSessions] = useState([]);
  const [approvedSessions, setApprovedSessions] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('admin');

  useEffect(() => {
    axios.get('/api/admin/superadmin')
      .then(res => setAdmin(res.data))
      .catch(err => console.error('Super admin fetch error:', err));
  }, []);

  const handleToast = (msg) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const fetchData = async () => {
    try {
      const [
        adminRes,
        studentRes,
        pendingSessionRes,
        approvedSessionRes
      ] = await Promise.all([
        axios.get('/api/super-admin/admins'),
        axios.get('/api/super-admin/students'),
        axios.get('/api/super-admin/pending-sessions'),
        axios.get('/api/super-admin/approved-sessions')
      ]);

      const admins = adminRes.data;
      setPendingAdmins(admins.filter(a => a.is_approved === 0));
      setApprovedAdmins(admins.filter(a => a.is_approved === 1));

      const students = studentRes.data;
      setPendingStudents(students.filter(s => s.is_approved === 0));
      setApprovedStudents(students.filter(s => s.is_approved === 1));

      setPendingSessions(pendingSessionRes.data);
      setApprovedSessions(approvedSessionRes.data);
    } catch (err) {
      console.error('Data fetch error:', err);
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
      let endpoint = '';
      if (selectedRole === 'admin') {
        endpoint = `/api/super-admin/${modalAction}`;
      } else if (selectedRole === 'student') {
        endpoint = `/api/super-admin/${modalAction}-student`;
      }

      await axios.post(endpoint, {
        id: selectedUser.id,
        email: selectedUser.email,
        name: selectedUser.name
      });

      handleToast(`${selectedRole} ${modalAction}d successfully!`);
      fetchData();
    } catch {
      handleToast('Something went wrong!');
    }
    setShowModal(false);
  };

  return (
    <div className="dashboard-bg text-white min-vh-100 p-4">
      <Container fluid>
        <Row className="justify-content-end mb-4">
          <Col xs="auto">
            <Card bg="dark" text="white" className="d-flex flex-row align-items-center p-2 shadow-lg">
              <img
                src="/profile-placeholder.jpg"
                alt="Profile"
                width={50}
                height={50}
                className="rounded-circle me-3 border border-light"
              />
              <div>
                <h6 className="mb-0">{admin?.name || 'Rahul Kumar'}</h6>
                <small>{admin?.email || 'superadmin@savs.com'}</small>
                <div><Badge bg="primary">Super Admin</Badge></div>
              </div>
            </Card>
          </Col>
        </Row>

        <motion.h2 className="mb-4 text-shadow" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Super Admin Dashboard
        </motion.h2>

        <Toast
          show={showToast}
          bg="info"
          onClose={() => setShowToast(false)}
          className="position-fixed top-0 end-0 m-3 zindex-toast"
        >
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
            <Button
              variant={modalAction === 'approve' ? 'success' : 'danger'}
              onClick={confirmAction}
            >
              Yes, {modalAction}
            </Button>
          </Modal.Footer>
        </Modal>

        <Tabs defaultActiveKey="admins" className="mb-4" fill>
          <Tab eventKey="admins" title="Admins">
            <SectionTable
              title="Admin"
              pendingData={pendingAdmins}
              approvedData={approvedAdmins}
              openModal={openModal}
              approvedFields={['name', 'email', 'department', 'college']}
              pendingFields={['name', 'email', 'department']}
            />
          </Tab>

          <Tab eventKey="students" title="Students">
            <SectionTable
              title="Student"
              pendingData={pendingStudents}
              approvedData={approvedStudents}
              openModal={openModal}
              approvedFields={['name', 'email', 'guardian_name']}
              pendingFields={['name', 'email', 'guardian_name']}
            />
          </Tab>

          <Tab eventKey="sessions" title="Sessions">
            <SectionTable
              title="Session"
              pendingData={pendingSessions}
              approvedData={approvedSessions}
              openModal={openModal}
              approvedFields={['title', 'start_time', 'end_time']}
              pendingFields={['title', 'start_time', 'end_time']}
            />
          </Tab>
        </Tabs>
      </Container>
    </div>
  );
};

const SectionTable = ({ title, pendingData, approvedData, openModal, pendingFields, approvedFields }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <Row>
      <Col md={6}>
        <Card bg="dark" text="light" className="mb-3">
          <Card.Body><Badge bg="warning">Pending: {pendingData.length}</Badge></Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card bg="dark" text="light" className="mb-3">
          <Card.Body><Badge bg="success">Approved: {approvedData.length}</Badge></Card.Body>
        </Card>
      </Col>
    </Row>

    <h5 className="text-light">Pending {title}s</h5>
    <Table striped bordered hover variant="dark" responsive>
      <thead>
        <tr>
          {pendingFields.map((f, i) => <th key={i}>{f.replace('_', ' ').toUpperCase()}</th>)}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {pendingData.map(item => (
          <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {pendingFields.map((field, i) => <td key={i}>{item[field]}</td>)}
            <td>
              <Button variant="success" size="sm" className="me-2" onClick={() => openModal(item, title.toLowerCase(), 'approve')}>Approve</Button>
              <Button variant="danger" size="sm" onClick={() => openModal(item, title.toLowerCase(), 'reject')}>Reject</Button>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </Table>

    <h5 className="text-light">Approved {title}s</h5>
    <Table striped bordered hover variant="dark" responsive>
      <thead>
        <tr>{approvedFields.map((f, i) => <th key={i}>{f.replace('_', ' ').toUpperCase()}</th>)}</tr>
      </thead>
      <tbody>
        {approvedData.map(item => (
          <motion.tr key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {approvedFields.map((field, i) => <td key={i}>{item[field]}</td>)}
          </motion.tr>
        ))}
      </tbody>
    </Table>
  </motion.div>
);

export default SuperAdminPanel;
