// server2.js

// Load environment variables from .env.local
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Use the connection string from .env.local (or fallback)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/CSDegreeNavigator';

// Connect to MongoDB using Mongoose
mongoose
  .connect(MONGODB_URI, {
    // Note: options useNewUrlParser and useUnifiedTopology are deprecated in v4+
  })
  .then(() => console.log('Connected to user database'))
  .catch((err) => console.error('Error connecting to the database:', err));

// Define the courses and their respective credits (used for progress calculation)
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

// Define the Mongoose schema based on your JSON schema
const userSchema = new mongoose.Schema({
  "First Name": { type: String, required: true },
  "Last Name": { type: String, required: true },
  "Email": { type: String, required: true, unique: true },
  "Password": { type: String, required: true },
  "Graduation": { type: String, required: true },
  // "taken" stores nested objects for different categories
  "taken": {
    type: Object,
    default: {
      fye: {},
      core: {},
      communication: {},
      mathematics: {},
      science: {},
      large_scale: {}
    }
  },
  "requirements_satisfied": {
    type: Object,
    default: {
      core: false,
      communication: false,
      mathematics: false,
      science: false,
      large_scale: false
    }
  },
  "progress": {
    type: Object,
    default: { classes_completed: 0, total_credits: 0 }
  },
  "degree_completion": { type: Boolean, default: false },
  // New time restrictions field
  "timeRestrictions": {
    type: [
      {
        day: String, // "Monday", "Tuesday", etc.
        startTime: String, // "08:00 AM"
        endTime: String, // "10:00 AM"
        description: String // optional field for additional info like 'busy with work'
      }
    ],
    default: []
  },
  createdAt: { type: Date, default: Date.now }
});

// Create a Mongoose model for the user data (collection "userdataformatted")
const UserData = mongoose.model('UserData', userSchema, 'userdataformatted');

/**
 * Helper function to calculate total credits and count of completed classes
 * from the "taken" field using the courses mapping.
 */
function calculateProgress(taken) {
  let totalCredits = 0;
  let classesCompleted = 0;
  
  // Loop through each category in the "taken" object
  for (const category in taken) {
    const coursesTaken = taken[category];
    // coursesTaken is an object where key=course ID, value=boolean
    for (const course in coursesTaken) {
      if (coursesTaken[course] === true) {
        classesCompleted++;
        if (courses[course]) {
          totalCredits += courses[course];
        }
      }
    }
  }
  
  return { totalCredits, classesCompleted };
}

// POST endpoint to insert a new user document with progress calculation
app.post('/api/insert', async (req, res) => {
  try {
    // Extract the user data from the request body.
    // The payload should follow the JSON schema provided.
    const userDataPayload = req.body;
    
    // Calculate progress based on the "taken" field from the payload.
    const progress = calculateProgress(userDataPayload.taken || {});
    
    // Update the payload progress fields.
    userDataPayload.progress = progress;
    
    // Optionally, you can also update requirement satisfaction flags here.
    // For now, we'll assume they come in as provided or remain defaults.
    
    // Create and save the new user document
    const newUser = new UserData(userDataPayload);
    const result = await newUser.save();
    
    console.log('Inserted document with _id:', result._id);
    res.status(200).json({ message: 'Data received successfully!', insertedId: result._id, progress });
  } catch (error) {
    console.error('Insertion error:', error);
    res.status(500).json({ error: 'Failed to insert document' });
  }
});

// POST endpoint to add or update time restrictions for a user
app.post('/api/users/:id/time-restrictions', async (req, res) => {
  const { id } = req.params;
  const { timeRestrictions } = req.body;  // Expecting an array of time restriction objects
  
  try {
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    // Update the user's time restrictions
    user.timeRestrictions = timeRestrictions;
    await user.save();
    
    res.status(200).send({ message: 'Time restrictions updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error updating time restrictions' });
  }
});

// GET endpoint to retrieve time restrictions for a user
app.get('/api/users/:id/time-restrictions', async (req, res) => {
  const { id } = req.params;
  
  try {
    const user = await UserData.findById(id);
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    
    res.status(200).send({ timeRestrictions: user.timeRestrictions });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: 'Error fetching time restrictions' });
  }
});

// GET endpoint to retrieve all user documents
app.get('/api/users', async (req, res) => {
  try {
    const users = await UserData.find({});
    res.status(200).json(users);
  } catch (error) {
    console.error('Retrieval error:', error);
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
