import React from "react";
import { useLocation } from "react-router-dom";

const StudentSession = () => {
  const location = useLocation();
  const { sessionCode, studentName } = location.state || {};

  return (
    <div className="student-session">
      <h1>Welcome, {studentName}</h1>
      <h2>Session Code: {sessionCode}</h2>
      <div className="session-features">
        <button>Raise Hand</button>
        <button>Toggle Mic</button>
        <button>Toggle Camera</button>
        <button>Leave Session</button>
      </div>
      {/* Add camera feed and other features here */}
    </div>
  );
};

export default StudentSession;