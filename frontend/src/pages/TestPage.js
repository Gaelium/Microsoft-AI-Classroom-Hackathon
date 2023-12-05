// src/TestPage.js
import React, { useState } from "react";

const TestPage = () => {
  const [file, setFile] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      alert("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:5000/upload-material", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        alert("File uploaded successfully");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { question, answer };

    try {
      const response = await fetch("http://127.0.0.1:5000/validate-answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        alert(`Feedback: ${responseData.feedback}`);
      } else {
        alert("Failed to submit answer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to submit answer");
    }
  };

  return (
    <div>
      <h1>Document Upload</h1>
      <form onSubmit={handleUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload File</button>
      </form>

      <h1>Question and Answer</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question"
        />
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter your answer"
        />
        <button type="submit">Submit Answer</button>
      </form>
    </div>
  );
};

export default TestPage;
