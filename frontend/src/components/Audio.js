import React, { useState } from "react";
import { AudioRecorder } from "react-audio-voice-recorder";

const Audio = () => {
  const [audioData, setAudioData] = useState(null);

  const onStop = (audioData) => {
    // audioData contains blob and blobUrl
    setAudioData(audioData);
    console.log("audioData", audioData);
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
        } else {
          console.error("Upload failed.");
        }
      } catch (error) {
        console.error("Error in uploading:", error);
      }
    }
  };

  return (
    <div>
      <AudioRecorder onRecordingComplete={onStop} downloadFileExtension="wav" />
      {audioData && <button onClick={uploadAudio}>Upload Audio</button>}
    </div>
  );
};

export default Audio;
