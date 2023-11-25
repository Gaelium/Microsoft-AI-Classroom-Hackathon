import React from "react";
import { ReactMediaRecorder } from "react-media-recorder-2";

const sendAudioToServer = async (audioBlob) => {
  const formData = new FormData();
  formData.append("file", audioBlob, "recording.wav");

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
};

const AudioRecorder = () => {
  return (
    <div>
      <ReactMediaRecorder
        audio
        render={({ status, startRecording, stopRecording, mediaBlobUrl }) => (
          <div>
            <p>{status}</p>
            <button onClick={startRecording}>Start Recording</button>
            <button onClick={stopRecording}>Stop Recording</button>
            <audio src={mediaBlobUrl} controls />
          </div>
        )}
        onStop={(blobUrl, blob) => sendAudioToServer(blob)}
      />
    </div>
  );
};

export default AudioRecorder;
