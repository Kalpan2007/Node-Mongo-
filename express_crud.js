const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const cors = require('cors');
app.use(cors());
const corsOptions = {
    origin: '*', // Replace with your React app URL
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Specify allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  }

// MongoDB connection details
const uri2 = "mongodb://127.0.0.1:27017"; 
const uri = "mongodb+srv://kalpankaneriya:kalpan_2007@codinggitaa.97mgu.mongodb.net/";
const dbName = "codinggita-students";

// Middleware
app.use(express.json());
    
let db, students;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        students = db.collection("students");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all students
app.get('/students', async (req, res) => {
    try {
        const allStudents = await students.find().toArray();
        res.status(200).json(allStudents);
    } catch (err) {
        res.status(500).send("Error fetching students: " + err.message);
    }
});

// POST: Add a new student
app.post('/students', async (req, res) => {
    try {
        // console.log("request : ",req);
        // console.log("request body : ",req.body);
        const newStudent = req.body;
        const result = await students.insertOne(newStudent);
        res.status(201).send(`Student added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding student: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const updatedStudent = req.body;
        const result = await students.replaceOne({ rollNumber }, updatedStudent);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch('/students/:rollNumber', async (req, res) => {
    try {
        
        const rollNumber = parseInt(req.params.rollNumber);
        const updates = req.body;
        const result = await students.updateOne({ rollNumber }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating student: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/students/v1/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const result = await students.deleteMany({ rollNumber });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});


app.delete('/students/v2/:name', async (req, res) => {
    try {
        const name = req.params.name; // Get the name from the URL parameter
        const result = await students.deleteMany({ name }); // Use the name field in the query
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});


app.delete('/students/v3/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year); // Get the year from the URL parameter
        const result = await students.deleteMany({ year }); // Delete by year field
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});



app.delete('/students/v4/:course', async (req, res) => {
    try {
        const course = req.params.course; // Get the course name from the URL parameter
        const result = await students.deleteMany({ coursesEnrolled: course }); // Delete by course enrolled field
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting student: " + err.message);
    }
});
