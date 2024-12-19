require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB Connection
const uri = process.env.MONGO_URI; // MongoDB connection string from .env
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

// Function to connect to the database
async function connectToDatabase() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // Exit if the connection fails
    }
}
connectToDatabase();

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to SideBy!');
});

// Test Database Connection Route
app.get('/check-db', async (req, res) => {
    try {
        const testCollection = client.db('testDatabase').collection('testCollection');

        // Insert a test document
        const testDocument = { name: 'Test Entry', createdAt: new Date() };
        await testCollection.insertOne(testDocument);

        // Retrieve the document to verify the insertion
        const retrievedDocument = await testCollection.findOne({ name: 'Test Entry' });

        // Respond with success and the retrieved document
        res.json({
            success: true,
            message: 'Successfully connected to the database!',
            data: retrievedDocument,
        });

        // Optional: Clean up the test document
        await testCollection.deleteOne({ name: 'Test Entry' });
    } catch (error) {
        console.error('Error interacting with the database:', error);
        res.status(500).json({ success: false, message: 'Database connection failed.', error });
    }
});

// Wildcard Route (Optional for Catch-All)
app.get('*', (req, res) => {
    res.status(404).send('Route not found');
});

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
