const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
app.use(cors());


mongoose.connect('mongodb://localhost:27017/', {
    dbName: 'CSDegreeNavigator',
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to user database');
})
.catch(err => {
    console.log('Error connecting to the database:', err);
});


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true  
    },
    password: {
        type: String,
        required: true
    },
    graduationYear: {
        type: String,
        required: true
    },
    taken: {
        fye: Object,
        core: Object,
        communication: Object,
        mathematics: Object,
        science: Object,
        large_scale: Object,
    },
    requirements_satisfied: {
        fye: Boolean,
        core: Boolean,
        communication: Boolean,
        mathematics: Boolean,
        science: Boolean,
        large_scale: Boolean,
    },
    progress: {
        classes_completed: Number,
        total_credits: Number,
    },
    degree_completion: Boolean
});


const UserModel = mongoose.model('users', userSchema);


app.post("/survey", async (req, resp) => {
    const {
        first_name,
        last_name,
        email,
        password,
        graduation,
        taken,
        requirements_satisfied,
        progress,
        degree_completion
    } = req.body;

 
    if (!first_name || !last_name || !email || !password || !graduation) {
        return resp.status(400).send("All required fields must be filled");
    }

    try {
      
        const existingUser = await UserModel.findOne({ email });
        
        if (existingUser) {
            return resp.status(400).send({ message: "Email already exists. Please use a different email." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

     
        const newUser = new UserModel({
            firstName: first_name,
            lastName: last_name,
            email,
            password: hashedPassword, 
            graduationYear: graduation,
            taken,  
            requirements_satisfied,
            progress,
            degree_completion
        });

    
        const savedUser = await newUser.save();

   
        resp.status(201).send(savedUser);
    } catch (error) {
        console.error("Error saving survey data:", error);
        resp.status(500).send("Something went wrong while saving data");
    }
});


app.listen(3001, () => {
    console.log("App listening at port 3001");
});
