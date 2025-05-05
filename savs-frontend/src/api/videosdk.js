export const token = "7bb7d630-33a6-4a7b-8f35-ac8e365f537e";

export const createMeeting = async () => {
  const res = await fetch("https://api.videosdk.live/v2/rooms", {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  });

  const { roomId } = await res.json();
  return roomId;
};