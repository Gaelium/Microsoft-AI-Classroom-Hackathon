import React from "react";


const courses = [
  { id: 1, name: 'Physics', icon: '🏹' },
  { id: 2, name: 'Chemistry', icon: '🧪' },
  { id: 3, name: 'Calculus', icon: '🎢' },
  { id: 4, name: 'Rhetoric', icon: '📙' },
  { id: 5, name: 'Statistics', icon: '🎲' },
  { id: 6, name: 'Geography', icon: '🌎' },
  { id: 7, name: 'History', icon: '📖' },
  { id: 8, name: 'Computer Science', icon: '💻' },
  { id: 9, name: 'Art', icon: '🖼️' },
];

const CourseGrid = () => {
    return (
      <div style={pageContainerStyle}>
        <div style={gridContainerStyle}>
          {courses.map(course => (
            <div key={course.id} style={gridItemStyle}>
              <div style={iconStyle}>{course.icon}</div>
              <div style={courseNameStyle}>{course.name}</div>
            </div>
          ))}
        </div>
      </div>
    );
};
  
// Styles
const pageContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '50px',
};
  
const gridContainerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)', // 3 columns for small screens
    gap: '16px',
    justifyContent: 'center', // Center the grid horizontally
};
  
const gridItemStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '80%', // Make each item take 80% of the width of its column
    maxWidth: '150px', // Set maximum width for each item
};
  
const iconStyle = {
    fontSize: '24px',
};
  
const courseNameStyle = {
    marginTop: '8px',
    textAlign: 'center',
};
  
export default CourseGrid;