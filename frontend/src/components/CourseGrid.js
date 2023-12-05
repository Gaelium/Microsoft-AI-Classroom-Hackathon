import React, { useState } from "react";
import { Link } from "react-router-dom";
const initialCourses = [
  { id: 1, name: "Physics", icon: "🏹" },
  { id: 2, name: "Chemistry", icon: "🧪" },
  { id: 3, name: "Calculus", icon: "🎢" },
  { id: 4, name: "Rhetoric", icon: "📙" },
  { id: 5, name: "Statistics", icon: "🎲" },
  { id: 6, name: "Geography", icon: "🌎" },
  { id: 7, name: "History", icon: "📖" },
  { id: 8, name: "Computer Science", icon: "💻" },
  { id: 9, name: "Art", icon: "🖼️" },
];

const CourseGrid = () => {
  const [courses, setCourses] = useState(initialCourses);

  // Function to add a new course
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");

  const addCourse = () => {
    if (newCourseName) {
      const newCourse = {
        id: courses.length + 1,
        name: newCourseName,
        icon: "🆕",
      };
      setCourses([...courses, newCourse]);
      setNewCourseName(""); // Reset input field
      setIsModalOpen(false); // Close modal
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCourseNameChange = (e) => {
    setNewCourseName(e.target.value);
  };

  return (
    <div style={pageContainerStyle}>
      <div style={gridContainerStyle}>
        {courses.map((course) => (
          <Link
            to={`/class/${course.id}`}
            style={{ textDecoration: "none" }}
            key={course.id}
          >
            <div style={gridItemStyle}>
              <div style={iconStyle}>{course.icon}</div>
              <div style={courseNameStyle}>{course.name}</div>
            </div>
          </Link>
        ))}
      </div>
      <button
        className="button-styled"
        style={{ marginTop: "16px" }}
        onClick={() => handleOpenModal()}
      >
        Add Course
      </button>
      {isModalOpen && (
        <div style={modalStyle}>
          <div style={modalContentStyle}>
            <h4 style={{ color: "black" }}>Add a New Course</h4>
            <input
              type="text"
              value={newCourseName}
              onChange={handleCourseNameChange}
              placeholder="Course Name"
              style={inputStyle}
            />
            <button
              className="button-styled"
              style={{ marginBottom: "8px" }}
              onClick={addCourse}
            >
              Save Course
            </button>
            <button className="button-styled" onClick={handleCloseModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const pageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "50px",
  flexDirection: "column",
};

const gridContainerStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)", // 3 columns for small screens
  gap: "16px",
  justifyContent: "center", // Center the grid horizontally
};

const gridItemStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  background: "linear-gradient(to right, #fff5fc 0%, #fffef3 100%)",
  width: "80%", // Make each item take 80% of the width of its column
  maxWidth: "150px", // Set maximum width for each item
};

const iconStyle = {
  fontSize: "24px",
};

const courseNameStyle = {
  marginTop: "8px",
  textAlign: "center",
};
const modalStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const inputStyle = {
  marginBottom: "10px",
  padding: "10px",
  width: "90%",
};

export default CourseGrid;
