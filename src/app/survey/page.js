"use client";
import React, { useState } from "react";
import './SurveyForm.css';

// JSON-like data structure for the survey
const surveyData = [
  {
    question: "What core classes have you taken? (Check all that apply)",
    type: "checkbox",
    name: "completed",
    options: [
      { _id: "CSC141", name: "CSC 141 - Computer Science I" },
      { _id: "CSC142", name: "CSC 142 - Computer Science II" },
      { _id: "CSC220", name: "CSC 220 - Foundations of Computer Science" },
      { _id: "CSC231", name: "CSC 231 - Computer Systems" },
      { _id: "CSC240", name: "CSC 240 - Computer Science III" },
      { _id: "CSC241", name: "CSC 241 - Data Structures and Algorithms" },
      { _id: "CSC301", name: "CSC 301 - Computer Security" },
      { _id: "CSC345", name: "CSC 345 - Programming Language Concepts and Paradigms" },
      { _id: "CSC402", name: "CSC 402 - Software Engineering" }
    ]
  },
  {
    question: "What math classes have you taken? (Check all that apply)",
    type: "checkbox",
    name: "mathClasses",
    options: [
      { _id: "MAT121", name: "MAT 121 - Statistics I (3)" },
      { _id: "MAT151", name: "MAT 151* - Introduction to Discrete Mathematics (3)" },
      { _id: "MAT161", name: "MAT 161 - Calculus I (4)" }
    ]
  },
  {
    question: "Did you take Calculus II or Statistics II? Choose One or Leave Blank",
    type: "radio",
    name: "calculusOrStats",
    options: [
      { _id: "MAT162", name: "MAT 162 - Calculus II (4)" },
      { _id: "STA200", name: "STA 200 - Statistics II (3)" },
      { _id: "none", name: "None" }
    ]
  },
  {
    question: "Which of the science courses have you taken? You must have two completed. (Check at least two)",
    type: "checkbox",
    name: "scienceClasses",
    options: [
      { _id: "BIO110", name: "BIO 110* - General Biology (3)" },
      { _id: "CHE103", name: "CHE 103* & CRL 103 - General Chemistry I (3) & Lab (1)" },
      { _id: "ESS101", name: "ESS 101* - Introduction to Geology (3)" },
      { _id: "PHY130", name: "PHY 130* - General Physics I (4)" },
      { _id: "PHY170", name: "PHY 170* - Physics I (4)" }
    ],
    minSelection: 2 // Ensures that at least two courses are selected
  },
  {
    question: "Which of these large-scale classes have you taken? (Check all that apply)",
    type: "checkbox",
    name: "largeScaleClasses",
    options: [
      { _id: "CSC416", name: "CSC 416 - Design/Construction Compilers" },
      { _id: "CSC417", name: "CSC 417 - User Interfaces" },
      { _id: "CSC418", name: "CSC 418 - Modern Web Applications Using Server-Side Technologies" },
      { _id: "CSC466", name: "CSC 466 - Distributed and Parallel Computing" },
      { _id: "CSC467", name: "CSC 467 - Big Data Engineering" },
      { _id: "CSC468", name: "CSC 468 - Introduction to Cloud Computing" },
      { _id: "CSC476", name: "CSC 476 - Game Development" },
      { _id: "CSC496", name: "CSC 496 - Topics in Complex Large-Scale Systems" }
    ]
  }
];

const SurveyForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    graduationYear: '',
    completed: [],
    mathClasses: [],
    calculusOrStats: "",
    scienceClasses: [], 
    largeScaleClasses: [] 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked, value } = e.target;
    setFormData(prevState => {
      const newValues = checked
        ? [...prevState[name], value]
        : prevState[name].filter(item => item !== value);

   
      if (name === "scienceClasses" && newValues.length < 2) {
        return { ...prevState, [name]: newValues };
      }
      return { ...prevState, [name]: newValues };
    });
  };

  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const payload = {
      "First Name": formData.firstName,
      "Last Name": formData.lastName,
      "Email": formData.email,
      "Password": formData.password,
      "Graduation": formData.graduationYear,
      "Completed": formData.completed,
      "Math Classes": formData.mathClasses,
      "Calculus/Stats": formData.calculusOrStats,
      "Science Classes": formData.scienceClasses,
      "Large Scale Classes": formData.largeScaleClasses 
    };

    try {
      const response = await fetch('http://localhost:8000', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      console.log('Server Response:', result);
    } catch (error) {
      console.error('Error sending data to server:', error);
    }
  };

  return (
    <div>
      <h1>University Survey Form</h1>
      <form id="form" onSubmit={handleSubmit}>

        {/* First Name */}
        <div className="form-control">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>

        {/* Last Name */}
        <div className="form-control">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Email */}
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Password */}
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        {/* Graduation Year */}
        <div className="form-control">
          <label htmlFor="graduationYear">Graduation Year</label>
          <input
            type="text"
            id="graduationYear"
            name="graduationYear"
            placeholder="Enter your graduation year"
            value={formData.graduationYear}
            onChange={handleChange}
          />
        </div>

        {/* Dynamically Render Questions */}
        {surveyData.map((question, index) => (
          <div className="form-control" key={index}>
            <label>{question.question}</label>

            {question.type === "checkbox" ? (
              question.options.map((option) => (
                <div key={option._id}>
                  <label htmlFor={option._id}>
                    <input
                      type="checkbox"
                      name={question.name}
                      value={option._id}
                      checked={formData[question.name].includes(option._id)}
                      onChange={handleCheckboxChange}
                    />
                    {option.name}
                  </label>
                </div>
              ))
            ) : (
              question.options.map((option) => (
                <div key={option._id}>
                  <label htmlFor={option._id}>
                    <input
                      type="radio"
                      name={question.name}
                      value={option._id}
                      checked={formData[question.name] === option._id}
                      onChange={handleRadioChange}
                    />
                    {option.name}
                  </label>
                </div>
              ))
            )}
          </div>
        ))}

        {/* Submit Button */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SurveyForm;
