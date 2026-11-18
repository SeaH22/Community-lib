
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');

const booksRoutes = require('./routes/books');
const usersRoutes = require('./routes/users');
const transactionsRoutes = require('./routes/transactions');

const { authenticateToken } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Protected Books API
app.use('/api/books', authenticateToken, booksRoutes);

// Users API
app.use('/api/users', usersRoutes);

// Protected Transactions API
app.use('/api/transactions', authenticateToken, transactionsRoutes);

// Test route
app.get('/', (req, res) => {
    res.send('Community Library Management System API is running!');
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
