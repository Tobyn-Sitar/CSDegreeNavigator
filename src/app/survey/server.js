const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json()); // To parse JSON bodies

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

    // Respond back with a success message and the received data
    res.json({
        message: 'Data received successfully!',
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
