import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";

const Audio = ({ setAnswerText }) => {
  const [audioData, setAudioData] = useState(null);

  const onStop = async (audioData) => {
    // audioData contains blob and blobUrl
    setAudioData(audioData);
  };

  const uploadAudio = async () => {
    if (audioData) {
      const formData = new FormData();
      formData.append("file", audioData, "voice.webm");
      try {
        const response = await fetch("http://127.0.0.1:5000/upload-audio", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log("Audio uploaded successfully.");
          const responseData = await response.json();
          setAnswerText(responseData);
        } else {
          console.error("Upload failed.");
        }
      } catch (error) {
        console.error("Error in uploading:", error);
      }
    }
  };

  React.useEffect(() => {
    uploadAudio();
  }, [audioData]);

  return (
    <div>
      <AudioRecorder onRecordingComplete={onStop} />
    </div>
  );
};

export default Audio;
