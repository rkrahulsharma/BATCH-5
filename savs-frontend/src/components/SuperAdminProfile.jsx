// src/components/SuperAdmin/SuperAdminProfile.jsx
import React from 'react';
import { Card, Image } from 'react-bootstrap';
import './SuperAdminProfile.css';

const SuperAdminProfile = ({ profile }) => {
  return (
    <Row className="justify-content-end mb-4">
  <Col xs="auto">
    {admin && (
      <Card bg="dark" text="white" className="d-flex flex-row align-items-center p-2 shadow-lg">
        <img
          src={admin.image}
          alt="Profile"
          width={50}
          height={50}
          className="rounded-circle me-3 border border-light"
        />
        <div>
          <h6 className="mb-0">{admin.name}</h6>
          <small>{admin.email}</small>
          <div><Badge bg="primary">{admin.role}</Badge></div>
        </div>
      </Card>
    )}
  </Col>
</Row>

  );
};

export default SuperAdminProfile;
