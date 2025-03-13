const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Define the courses with their respective credits
const courses = {
    "CSC141": 3,
    "CSC142": 3,
    "CSC220": 3,
    "CSC231": 3,
    "CSC240": 3,
    "CSC241": 3,
    "CSC301": 3,
    "CSC345": 3,
    "CSC402": 3,
    "MAT121": 3,
    "MAT151": 3,
    "MAT161": 4,
    "MAT162": 4,
    "STA200": 3,
    "BIO110": 3,
    "CHE103": 3,
    "ESS101": 3,
    "PHY130": 4,
    "PHY170": 4,
    "CSC416": 3,
    "CSC417": 3,
    "CSC418": 3,
    "CSC466": 3,
    "CSC467": 3,
    "CSC468": 3,
    "CSC476": 3,
    "CSC496": 3
};

// Handling POST request
app.post('/', (req, res) => {
    // Extract the fields based on the new data format
    const { 
        "First Name": firstName, 
        "Last Name": lastName, 
        "Email": email, 
        "Password": password, 
        "Graduation": graduationYear, 
        "Completed": completed,
        "Math Classes": mathClasses,
        "Calculus/Stats": calculusOrStats,
        "Science Classes": scienceClasses,
        "Large Scale Classes": largeScaleClasses
    } = req.body;

    // Calculate total credits
    let totalCredits = 0;
    
    // Calculate credits for the completed core courses
    completed.forEach(courseId => {
        if (courses[courseId]) {
            totalCredits += courses[courseId];
        }
    });

    // Calculate credits for the math courses
    mathClasses.forEach(courseId => {
        if (courses[courseId]) {
            totalCredits += courses[courseId];
        }
    });

    // Calculate credits for calculus/statistics
    if (courses[calculusOrStats]) {
        totalCredits += courses[calculusOrStats];
    }

    // Calculate credits for the science classes
    scienceClasses.forEach(courseId => {
        if (courses[courseId]) {
            totalCredits += courses[courseId];
        }
    });

    // Calculate credits for the large-scale classes
    largeScaleClasses.forEach(courseId => {
        if (courses[courseId]) {
            totalCredits += courses[courseId];
        }
    });

    // Log the received data with key-value pairs on separate lines, but arrays on a single line
    console.log('Received Data: {');
    console.log(`  "First Name": "${firstName}",`);
    console.log(`  "Last Name": "${lastName}",`);
    console.log(`  "Email": "${email}",`);
    console.log(`  "Password": "${password}",`);
    console.log(`  "Graduation": "${graduationYear}",`);
    console.log(`  "Completed": [${completed.map(course => `"${course}"`).join(",")}],`);
    console.log(`  "Math Classes": [${mathClasses.map(course => `"${course}"`).join(",")}],`);
    console.log(`  "Calculus/Stats": "${calculusOrStats}",`);
    console.log(`  "Science Classes": [${scienceClasses.map(course => `"${course}"`).join(",")}],`);
    console.log(`  "Large Scale Classes": [${largeScaleClasses.map(course => `"${course}"`).join(",")}],`);
    console.log('}');

    // Respond back with a success message, the received data, and the total credits
    res.json({
        message: 'Data received successfully!',
        totalCredits: totalCredits,
        receivedData: {
            "First Name": firstName,
            "Last Name": lastName,
            "Email": email,
            "Password": password,
            "Graduation": graduationYear,
            "Completed": completed,
            "Math Classes": mathClasses,
            "Calculus/Stats": calculusOrStats,
            "Science Classes": scienceClasses,
            "Large Scale Classes": largeScaleClasses
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
