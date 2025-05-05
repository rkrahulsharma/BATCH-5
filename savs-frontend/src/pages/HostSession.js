import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import axios from "axios";

const socket = io("http://localhost:5000", { transports: ["websocket"] }); // Persistent connection

const HostSession = () => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [roomId] = useState(() =>
    `room-${Math.random().toString(36).substr(2, 6)}`
  );
  const [sessionData, setSessionData] = useState({
    session_name: "",
    host_name: "",
    admin_email: "",
    intervals: ["", "", ""],
  });

  useEffect(() => {
    let localStream;

    const startMedia = async () => {
      try {
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(localStream);
        if (videoRef.current) {
          videoRef.current.srcObject = localStream;
        }

        socket.emit("join-room", {
          roomId: roomId,
          userId: "HOST",
        });
      } catch (err) {
        alert("Please allow camera and microphone permissions!");
        console.error("Media error:", err);
      }
    };

    startMedia();

    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      socket.off("user-joined");
      socket.off("signal");
    };
  }, [roomId]);

  useEffect(() => {
    if (!stream) return;

    const handleUserJoined = ({ userId, socketId }) => {
      console.log("Student joined:", userId, socketId);

      const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream,
      });

      peer.on("signal", (signal) => {
        socket.emit("signal", {
          target: socketId,
          caller: socket.id,
          signal: signal,
        });
      });

      peer.on("stream", (studentStream) => {
        console.log("Received student stream");
        // TODO: Display student's stream if needed
      });

      socket.on("signal", ({ signal }) => {
        peer.signal(signal);
      });
    };

    socket.on("user-joined", handleUserJoined);

    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, [stream]);

  const handleChange = (e, index = null) => {
    if (index !== null) {
      const updatedIntervals = [...sessionData.intervals];
      updatedIntervals[index] = e.target.value;
      setSessionData({ ...sessionData, intervals: updatedIntervals });
    } else {
      setSessionData({ ...sessionData, [e.target.name]: e.target.value });
    }
  };

  const handleStartSession = async () => {
    try {
      const payload = {
        ...sessionData,
        room_id: roomId,
        start_time: new Date().toISOString().slice(0, 19).replace("T", " ")
      };

      const response = await axios.post("http://localhost:5000/api/sessions/start", payload);
      alert(response.data || "Session Started!");
    } catch (error) {
      console.error("Error starting session:", error);
      alert("Failed to start session. Try again.");
    }
  };

  return (
    <div className="container mt-4">
      <h3>Host Live Attendance Session</h3>
      <div className="row">
        <div className="col-md-6">
          <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", borderRadius: "8px" }} />
        </div>

        <div className="col-md-6">
          <form>
            <div className="mb-2">
              <label>Session Name:</label>
              <input type="text" name="session_name" className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Host Name:</label>
              <input type="text" name="host_name" className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Host/Admin Email:</label>
              <input type="email" name="admin_email" className="form-control" onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label>Set Image Capture Intervals (in minutes):</label>
              {[0, 1, 2].map((i) => (
                <input
                  key={i}
                  type="number"
                  className="form-control mt-1"
                  placeholder={`Interval ${i + 1}`}
                  onChange={(e) => handleChange(e, i)}
                />
              ))}
            </div>
            <div className="mb-2">
              <strong>Session Code:</strong>
              <div className="form-control text-center text-primary fw-bold">{roomId}</div>
            </div>

            <button type="button" className="btn btn-primary mt-3" onClick={handleStartSession}>
              Start Session
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HostSession;