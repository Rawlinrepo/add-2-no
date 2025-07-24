// backend\index.js
const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API route
app.post('/api/add', (req, res) => {
    const { num1, num2 } = req.body;

    // Check if inputs are present
    if (num1 === undefined || num2 === undefined) {
        return res.status(400).json({ error: 'Both num1 and num2 are required in the request body.' });
    }

    // Check if inputs are numbers
    if (isNaN(num1) || isNaN(num2)) {
        return res.status(400).json({ error: 'Both inputs must be valid numbers.' });
    }

    const result = Number(num1) + Number(num2);
    res.json({ result });
});

app.get('/api/ping', (req, res) => {
  res.send('pong');
});


// Catch-all for undefined routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found.' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error.' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on ${PORT}`);
});
