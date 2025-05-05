// src/components/CreateSession.jsx
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

const CreateSession = () => {
  const [session, setSession] = useState({
    name: '',
    hostEmail: '',
    interval1: '',
    interval2: '',
    interval3: '',
  });

  const handleChange = (e) => {
    setSession({ ...session, [e.target.name]: e.target.value });
  };

  const handleCreate = (e) => {
    e.preventDefault();
    alert('Session Created! (placeholder)');
  };

  return (
    <Card>
      <Card.Header>Create a New Session</Card.Header>
      <Card.Body>
        <Form onSubmit={handleCreate}>
          <Form.Group className="mb-3">
            <Form.Label>Session Name (optional)</Form.Label>
            <Form.Control
              name="name"
              type="text"
              placeholder="Eg. Data Structures - Unit 1"
              value={session.name}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Host Email</Form.Label>
            <Form.Control
              name="hostEmail"
              type="email"
              placeholder="admin@example.com"
              value={session.hostEmail}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Label>Set 3 Intervals (Between Session Time)</Form.Label>
          <div className="d-flex gap-2 mb-3">
            <Form.Control name="interval1" type="time" value={session.interval1} onChange={handleChange} />
            <Form.Control name="interval2" type="time" value={session.interval2} onChange={handleChange} />
            <Form.Control name="interval3" type="time" value={session.interval3} onChange={handleChange} />
          </div>

          <Button variant="primary" type="submit">Start Session</Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateSession;
