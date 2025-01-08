        const express = require('express');
        const { MongoClient, ObjectId } = require('mongodb');

        const app = express();
        const port = 3001;

        // MongoDB connection details
        const uri = "mongodb://127.0.0.1:27017";
        const dbName = "codinggita-students";

        // Middleware
        app.use(express.json());

        // Database connection setup
        let db, courses;

        // Connect to MongoDB and initialize collections
        async function initializeDatabase() {
            try {
                const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
                console.log("Connected to MongoDB");

                db = client.db(dbName);
                courses = db.collection("courses");  // Set the correct collection name for courses

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

        // GET: List all courses
        app.get('/courses', async (req, res) => {
            try {
                const allCourses = await courses.find().toArray(); 
                res.status(200).json(allCourses);  
            } catch (err) {
                res.status(500).send("Error fetching courses: " + err.message);
            }
        });

        // POST: Add a new course
        app.post('/courses', async (req, res) => {
            try {
                const newCourse = req.body;  
                const result = await courses.insertOne(newCourse);  
                res.status(201).send(`Course added with ID: ${result.insertedId}`);  
            } catch (err) {
                res.status(500).send("Error adding course: " + err.message);
            }
        });

        app.put('/courses/:courseCode', async (req, res) => {
            try {
                const courseCode = req.params.courseCode;
                const updatedCourse = req.body;

                const result = await courses.replaceOne({ courseCode }, updatedCourse);

                if (result.modifiedCount > 0) {
                    res.status(200).send(`${result.modifiedCount} document(s) updated`);
                } else {
                    res.status(404).send('Course not found or no changes made');
                }
            } catch (err) {
                res.status(500).send("Error updating course: " + err.message);
            }
        });

        app.patch('/courses/:courseCode', async (req, res) => {
            try {
                const courseCode = req.params.courseCode;
                const updates = req.body;

                const result = await courses.updateOne({ courseCode }, { $set: updates });

                if (result.modifiedCount > 0) {
                    res.status(200).send(`${result.modifiedCount} document(s) updated`);
                } else {
                    res.status(404).send('Course not found or no changes made');
                }
            } catch (err) {
                res.status(500).send("Error partially updating course: " + err.message);
            }
        });

        app.delete('/courses/:courseCode', async (req, res) => {
            try {
                const courseCode = req.params.courseCode;

                const result = await courses.deleteOne({ courseCode });

                if (result.deletedCount > 0) {
                    res.status(200).send(`${result.deletedCount} document(s) deleted`);
                } else {
                    res.status(404).send('Course not found');
                }
            } catch (err) {
                res.status(500).send("Error deleting course: " + err.message);
            }
        });

        // PUT: Update a course by ObjectId
        app.put("/courses/_id/:_oid", async (req, res) => {
            try {
                const _oid = req.params._oid; // Get the ObjectId from the URL parameter
        
                // Check if the _oid is a valid ObjectId (24 hex characters)
                if (!ObjectId.isValid(_oid)) {
                    return res.status(400).send("Invalid ObjectId format");
                }
        
                const updatedCourse = req.body; // Get the updated course data from the request body
        
                // Perform the update operation
                const result = await courses.updateOne(
                    { _id: new ObjectId(_oid) }, // Match the course by its ObjectId
                    { $set: updatedCourse } // Update the course fields with the new data
                );
        
                // Check if any document was modified
                if (result.modifiedCount > 0) {
                    res.status(200).send(`${result.modifiedCount} document(s) updated`);
                } else {
                    res.status(404).send('Course not found or no changes made');
                }
            } catch (err) {
                res.status(500).send("Error updating course: " + err.message);
            }
        });
        

app.patch("/courses/_id/:_oid", async (req, res) => {
    try {
        const _oid = req.params._oid;

        // Check if the _oid is a valid ObjectId (24 hex characters)
        if (!ObjectId.isValid(_oid)) {
            return res.status(400).send("Invalid ObjectId format");
        }

        const updates = req.body;
        const result = await courses.updateOne({ _id: new ObjectId(_oid) }, { $set: updates });

        if (result.modifiedCount > 0) {
            res.status(200).send(`${result.modifiedCount} document(s) updated`);
        } else {
            res.status(404).send('Course not found or no changes made');
        }
    } catch (err) {
        res.status(500).send("Error partially updating course: " + err.message);
    }
});

// DELETE: Remove a course by ObjectId
app.delete("/courses/_id/:_oid", async (req, res) => {
    try {
        const _oid = req.params._oid;
        if (!ObjectId.isValid(_oid)) {
            return res.status(400).send("Invalid ObjectId format");
        }

        const result = await courses.deleteOne({ _id: new ObjectId(_oid) });

        if (result.deletedCount > 0) {
            res.status(200).send(`${result.deletedCount} document(s) deleted`);
        } else {
            res.status(404).send('Course not found');
        }
    } catch (err) {
        res.status(500).send("Error deleting course: " + err.message);
    }
});
