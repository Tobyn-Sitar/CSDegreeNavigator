"use client";
import React, { useState } from "react";
import './SurveyForm.css';  

const SurveyForm = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        age: '',
        role: 'student',
        classes: [],
        comment: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            classes: checked
                ? [...prevState.classes, name]
                : prevState.classes.filter(course => course !== name)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    age: formData.age,
                    role: formData.role,
                    classes: formData.classes,
                    comment: formData.comment
                })
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

                {/* Age */}
                <div className="form-control">
                    <label htmlFor="age">Age</label>
                    <input
                        type="text"
                        id="age"
                        name="age"
                        placeholder="Enter your age"
                        value={formData.age}
                        onChange={handleChange}
                    />
                </div>

                {/* Role */}
                <div className="form-control">
                    <label htmlFor="role">Which option best describes you?</label>
                    <select
                        name="role"
                        id="role"
                        value={formData.role}
                        onChange={handleChange}
                    >
                        <option value="student">Student</option>
                        <option value="intern">Intern</option>
                        <option value="professional">Professional</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                {/* Classes Taken */}
                <div className="form-control">
                    <label>What classes have you taken? <small>(Check all that apply)</small></label>
                    {["CSC 100 - Computer Science 1", "CSC 200 - Computer Science 2", "CSC 300 - Computer Science 3", 
                    "CSC 400 - Computer Science 4", "CSC 500 - Computer Science 5", "CSC 600 - Computer Science 6", 
                    "CSC 700 - Computer Science 7"].map(course => (
                        <label key={course} htmlFor={`course-${course}`}>
                            <input
                                type="checkbox"
                                name={course}
                                id={`course-${course}`}
                                checked={formData.classes.includes(course)}
                                onChange={handleCheckboxChange}
                            />
                            {course}
                        </label>
                    ))}
                </div>

                {/* Comments */}
                <div className="form-control">
                    <label htmlFor="comment">Any comments or suggestions</label>
                    <textarea
                        name="comment"
                        id="comment"
                        placeholder="Enter your comment here"
                        value={formData.comment}
                        onChange={handleChange}
                    />
                </div>

                {/* Submit Button */}
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default SurveyForm;
