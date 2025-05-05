// ✅ FILE: src/components/sessions/MeetingView.jsx
import React, { useEffect } from "react";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const ParticipantView = ({ participantId }) => {
  const { displayName, webcamStream, webcamOn } = useParticipant(participantId);

  return (
    <div>
      <p>{displayName}</p>
      {webcamOn && webcamStream && (
        <video
          autoPlay
          playsInline
          muted
          ref={(video) => {
            if (video) video.srcObject = new MediaStream([webcamStream.track]);
          }}
          style={{ width: "300px", borderRadius: "10px" }}
        />
      )}
    </div>
  );
};

const MeetingView = () => {
  const { participants } = useMeeting();

  useEffect(() => {
    const intervalSeconds = [10, 20, 30]; // example intervals
    intervalSeconds.forEach((sec) => {
      setTimeout(() => {
        console.log(`📸 Capture image at ${sec}s (snapshot logic goes here)`);
      }, sec * 1000);
    });
  }, []);

  return (
    <div>
      <h3>Live Session View</h3>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {[...participants.keys()].map((id) => (
          <ParticipantView key={id} participantId={id} />
        ))}
      </div>
    </div>
  );
};

export default MeetingView;
