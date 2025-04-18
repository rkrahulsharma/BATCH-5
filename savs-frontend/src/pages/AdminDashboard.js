import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const AdminDashboard = () => {
  return (
    <Container fluid className="mt-4">
      <h2 className="text-center mb-4">Admin Dashboard</h2>

      <Row className="mb-4">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Pending Approvals</Card.Title>
              <Card.Text>
                View and approve registered admins and students.
              </Card.Text>
              <Button variant="primary">Review Approvals</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Sessions</Card.Title>
              <Card.Text>
                Schedule sessions and set attendance capture intervals.
              </Card.Text>
              <Button variant="success">Create Session</Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Reports</Card.Title>
              <Card.Text>
                View and download attendance reports in PDF format.
              </Card.Text>
              <Button variant="info">View Reports</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;
