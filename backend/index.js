// backend/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const resultSchema = new mongoose.Schema({
    num1: Number,
    num2: Number,
    result: Number,
    createdAt: { type: Date, default: Date.now }
});

const Result = mongoose.model("Result", resultSchema);

// API route - Add
app.post('/api/add', async (req, res) => {
    const { num1, num2 } = req.body;

    // Validation
    if (num1 === undefined || num2 === undefined) {
        return res.status(400).json({ error: 'Both num1 and num2 are required in the request body.' });
    }

    // Check if inputs are numbers
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Both inputs must be valid numbers.' });
    }

    const result = Number(num1) + Number(num2);

    try {
        // Save in DB
        const newResult = new Result({ num1, num2, result });
        await newResult.save();

        res.json({ result, message: "Result saved to DB" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save result" });
    }
});

// API route - Get all results
app.get('/api/results', async (req, res) => {
    try {
        const results = await Result.find().sort({ createdAt: -1 }); // latest first
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch results" });
    }
});

// Ping route
app.get('/api/ping', (req, res) => {
    res.send('pong');
});

// Catch-all
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error.' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on ${PORT}`);
});
