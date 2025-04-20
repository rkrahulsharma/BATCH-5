import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import axios from 'axios';
import { io } from 'socket.io-client';
import SimplePeer from 'simple-peer';  // Import SimplePeer for WebRTC

const StudentDashboard = () => {
  const [attendance, setAttendance] = useState([]);
  const [sessionDetails, setSessionDetails] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();  // Replace useHistory with useNavigate
  const socket = io('http://localhost:5000');  // Connect to backend for real-time communication

  useEffect(() => {
    // Setup WebRTC for video conferencing
    const peer = new SimplePeer({
      initiator: true,  // You can change this based on whether the student joins as an initiator or not
      trickle: false
    });

    // Connect to the peer
    peer.on('signal', data => {
      socket.emit('video_signal', data); // Send signal to backend to broadcast to other peer
    });

    peer.on('stream', stream => {
      const videoElement = document.getElementById('videoFeed');
      if (videoElement) {
        videoElement.srcObject = stream;
      }
    });

    socket.on('video_signal', (signalData) => {
      peer.signal(signalData);
    });

    // Clean up peer connection on component unmount
    return () => {
      peer.destroy();
    };
  }, []);

  // Fetch session details and attendance stats on dashboard load
  const fetchData = async () => {
    try {
      const sessionResponse = await axios.get('/api/student/session');
      setSessionDetails(sessionResponse.data);

      const attendanceResponse = await axios.get('/api/student/attendance');
      setAttendance(attendanceResponse.data);
    } catch (error) {
      console.error('Error fetching session or attendance data:', error);
    }
  };

  useEffect(() => {
    fetchData();

    // Real-time chat communication
    socket.on('receive_message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    // Notification system
    socket.on('new_notification', (notification) => {
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    return () => {
      socket.disconnect(); // Clean up socket connection on component unmount
    };
  }, []);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      socket.emit('send_message', { content: messageInput, sender: 'Student' });
      setMessageInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    navigate('/login');  // Use navigate instead of history.push
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-8">
          <h1>Welcome, {sessionDetails.studentName}</h1>
          <div className="card">
            <div className="card-body">
              <h3>Attendance Overview</h3>
              <ul>
                {attendance.map((item, index) => (
                  <li key={index}>{item.date}: {item.status}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h3>Current Session</h3>
              <p>Session: {sessionDetails.sessionName}</p>
              <p>Time Remaining: {sessionDetails.timeRemaining}</p>
              <video id="videoFeed" autoPlay></video>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h3>Live Chat</h3>
              <div className="chat-box">
                {messages.map((msg, index) => (
                  <div key={index} className="message">
                    <strong>{msg.sender}:</strong> {msg.content}
                  </div>
                ))}
              </div>
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="form-control mt-2"
              />
              <button onClick={handleSendMessage} className="btn btn-primary mt-2">Send</button>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-body">
              <h3>Notifications</h3>
              <ul>
                {notifications.map((notification, index) => (
                  <li key={index}>{notification}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
