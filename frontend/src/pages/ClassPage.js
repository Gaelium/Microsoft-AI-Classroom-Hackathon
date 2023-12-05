import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  AuthenticatedTemplate,
  UnauthenticatedTemplate,
} from "@azure/msal-react";
import Audio from "../components/Audio";
import styles from "./ClassPage.module.css";

const ClassPage = () => {
  const { classId } = useParams();
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
    <>
      <AuthenticatedTemplate>
        <div style={authenticatedContentStyle}>
          <h1 style={titleStyle}>Class Options for {classId}</h1>

          {/* Document Upload Section */}
          <div style={sectionStyle}>
            <h2 style={subtitleStyle}>Document Upload</h2>
            <form onSubmit={handleUpload} style={formStyle}>
              <input
                type="file"
                onChange={handleFileChange}
                style={inputStyle}
              />
              <button type="submit" style={buttonStyled}>
                Upload File
              </button>
            </form>
          </div>

          {/* Question and Answer Section */}
          <div style={sectionStyle}>
            <h2 style={subtitleStyle}>Question and Answer</h2>
            <form onSubmit={handleSubmit} style={formStyle}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter your question"
                style={inputStyle}
              />
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer"
                style={textareaStyle}
              />
              <Audio setAnswerText={setAnswer} />
              <button type="submit" style={buttonStyled}>
                Submit Answer
              </button>
            </form>
          </div>
        </div>
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <div className="app-name">EchoLearn</div>
        <div className="unauthenticated-template">
          <h5 className="card-title">
            Ready to revolutionize the way you learn?
          </h5>
          <p className="card-text">Sign in to get started with EchoLearn!</p>
        </div>
      </UnauthenticatedTemplate>
    </>
  );
};
const authenticatedContentStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: "linear-gradient(135deg, #324376 0%, #5e3173 50%, #201e40 100%)",
};

const titleStyle = {
  color: "#fff",
  textAlign: "center",
  marginBottom: "1rem",
};

const sectionStyle = {
  marginBottom: "1rem",
};

const subtitleStyle = {
  color: "#fff",
  textAlign: "center",
  margin: "1rem 0",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  maxWidth: "1000px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "1rem",
  border: "1px solid #ddd",
  borderRadius: "5px",
  boxSizing: "border-box", // Ensures padding doesn't increase the width
};

const textareaStyle = {
  ...inputStyle, // Spread the input styles
  height: "150px", // Specify the height for the textarea
  resize: "vertical", // Allow vertical resize
};

const buttonStyled = {
  padding: "10px 25px",
  border: "none",
  background: "linear-gradient(to right, #ff758c 0%, #ff7eb3 100%)",
  color: "white",
  borderRadius: "20px",
  cursor: "pointer",
  margin: "10px 0",
};

export default ClassPage;
