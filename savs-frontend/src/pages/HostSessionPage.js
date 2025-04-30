import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const HostSessionPage = () => {
  const location = useLocation();
  const session = location.state?.session;
  const videoRef = useRef(null);

  useEffect(() => {
    const startWebcam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Failed to access webcam:', err);
      }
    };

    startWebcam();
  }, []);

  return (
    <Container className="mt-5 text-center">
      <h2>Hosting Session: {session?.name}</h2>
      <p><strong>Start:</strong> {session?.start}</p>
      <p><strong>End:</strong> {session?.end}</p>

      <div style={{ border: '2px solid #ccc', display: 'inline-block', padding: '10px' }}>
        <video ref={videoRef} width="480" height="360" autoPlay muted />
      </div>

      <div className="mt-3">
        <Button variant="primary">Capture Image (Coming Soon)</Button>{' '}
        <Button variant="danger">End Session</Button>
      </div>
    </Container>
  );
};

export default HostSessionPage;
