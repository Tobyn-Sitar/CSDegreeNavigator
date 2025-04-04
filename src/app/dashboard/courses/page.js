"use client";
import { useState } from "react";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputValue, setInputValue] = useState(""); // User input field value

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = async () => {
    if (!inputValue) {
      setError("Please enter a course number to search.");
      setCourses([]); // Clear previous results
      return;
    }

    setLoading(true);
    setError(null);
    setCourses([]); // Clear previous results before the fetch

    try {
      const res = await fetch(`/api/courses?courseNumber=${inputValue}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch courses: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.length === 0) {
        setError("No courses found for the given course number.");
      } else {
        setCourses(data);
      }
    } catch (err) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Courses</h1>

      {/* Input field for course number */}
      <div style={{ marginBottom: "20px", textAlign: "center" }}>
        <label htmlFor="courseInput" style={{ fontSize: "16px", marginRight: "10px" }}>
          Enter Course Number:
        </label>
        <input
          id="courseInput"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g., 240"
          style={{
            padding: "8px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            width: "200px",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "8px 16px",
            fontSize: "14px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: "#D3A6FF",
            color: "white",
            cursor: "pointer",
            marginLeft: "10px",
          }}
        >
          Search
        </button>
      </div>

      {/* Loading message */}
      {loading && <div>Loading...</div>}

      {/* Error message */}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}

      {/* Courses Table */}
      {courses.length === 0 && !loading && !error ? (
        <p>No courses found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#D3A6FF", // Light purple background
                color: "white",
                textAlign: "left",
                fontSize: "16px",
              }}
            >
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Course Number</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Course Title</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Enrollment</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Start Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>End Date</th>
              <th style={{ padding: "12px", border: "1px solid #ddd" }}>Instructors</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr
                key={`${
                  course.crn || course._id || index
                }-${course.courseNumber}-${course.startOn}-${course.endOn}`}
                style={{ borderBottom: "1px solid #ddd" }}
              >
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                  {course.courseNumber}
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                  {course.courseTitle}
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                  {course.actualEnrollment}
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                  {course.startOn}
                </td>
                <td style={{ padding: "10px", textAlign: "center", border: "1px solid #ddd" }}>
                  {course.endOn}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                    {(course.instructors || []).map((instructor, idx) => (
                      <li
                        key={`${instructor.instructorFirstName || "Unknown"}-${instructor.instructorLastName || "Unknown"}-${idx}`}
                        style={{ marginBottom: "5px" }}
                      >
                        {instructor.instructorFirstName} {instructor.instructorLastName}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CoursesPage;
