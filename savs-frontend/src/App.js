import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { MeetingAppProvider } from "./context/MeetingAppContextDef";

import LandingPage from "./components/LandingPage";
import AdminSignup from './components/AdminSignup';
import StudentSignup from './components/StudentSignup';
import LoginPage from './components/LoginPage.jsx';
import AdminLogin from './components/AdminLogin';
import StudentLogin from './components/StudentLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import StudentDashboard from "./pages/StudentDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SessionTab from './components/SessionTab';
import SessionHistory from './components/SessionHistory';
import SessionPerformance from './components/SessionPerformance';
import MeetingViewPage from './pages/MeetingViewPage';
import StartSessionForm from './pages/StartSessionForm';

import { JoiningScreen } from './components/screens/JoiningScreen';
import { LeaveScreen } from './components/screens/LeaveScreen';
import { MeetingContainer } from './meeting/MeetingContainer';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [token, setToken] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [participantName, setParticipantName] = useState("");
  const [micOn, setMicOn] = useState(false);
  const [webcamOn, setWebcamOn] = useState(false);
  const [customAudioStream, setCustomAudioStream] = useState(null);
  const [customVideoStream, setCustomVideoStream] = useState(null);
  const [isMeetingStarted, setMeetingStarted] = useState(false);
  const [isMeetingLeft, setIsMeetingLeft] = useState(false);

  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;

  useEffect(() => {
    if (isMobile) {
      window.onbeforeunload = () => {
        return "Are you sure you want to exit?";
      };
    }
  }, [isMobile]);

  return (
    <Router>
      <Routes>
        {/* savs-frontend routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup/admin" element={<AdminSignup />} />
        <Route path="/signup/student" element={<StudentSignup />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/super-admin-panel" element={<SuperAdminDashboard />} />
        <Route path="/student-login" element={<LoginPage />} />
        <Route path="/admin-login" element={<LoginPage />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/superadmin/sessions" element={<SessionTab />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/history" element={<SessionHistory />} />
        <Route path="/performance" element={<SessionPerformance />} />
        <Route path="/admin/session/:meetingId" element={<MeetingViewPage />} />
        <Route path="/admin/host-session" element={<StartSessionForm />} />
        <Route path="/session/:meetingId" element={<MeetingViewPage />} />

        {/* Video meeting route */}
        <Route
          path="/video-meeting"
          element={
            <MeetingAppProvider>
              {isMeetingStarted ? (
                <MeetingProvider
                  config={{
                    meetingId,
                    micEnabled: micOn,
                    webcamEnabled: webcamOn,
                    name: participantName ? participantName : "TestUser",
                    multiStream: true,
                    customCameraVideoTrack: customVideoStream,
                    customMicrophoneAudioTrack: customAudioStream,
                  }}
                  token={token}
                  reinitialiseMeetingOnConfigChange={true}
                  joinWithoutUserInteraction={true}
                >
                  <MeetingContainer
                    onMeetingLeave={() => {
                      setToken("");
                      setMeetingId("");
                      setParticipantName("");
                      setWebcamOn(false);
                      setMicOn(false);
                      setMeetingStarted(false);
                    }}
                    setIsMeetingLeft={setIsMeetingLeft}
                  />
                </MeetingProvider>
              ) : isMeetingLeft ? (
                <LeaveScreen setIsMeetingLeft={setIsMeetingLeft} />
              ) : (
                <JoiningScreen
                  participantName={participantName}
                  setParticipantName={setParticipantName}
                  setMeetingId={setMeetingId}
                  setToken={setToken}
                  micOn={micOn}
                  setMicOn={setMicOn}
                  webcamOn={webcamOn}
                  setWebcamOn={setWebcamOn}
                  customAudioStream={customAudioStream}
                  setCustomAudioStream={setCustomAudioStream}
                  customVideoStream={customVideoStream}
                  setCustomVideoStream={setCustomVideoStream}
                  onClickStartMeeting={() => {
                    setMeetingStarted(true);
                  }}
                  startMeeting={isMeetingStarted}
                  setIsMeetingLeft={setIsMeetingLeft}
                />
              )}
            </MeetingAppProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;