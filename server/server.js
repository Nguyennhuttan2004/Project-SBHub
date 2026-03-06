const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorMiddleware = require('./middleware/errorMiddleware');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const courtRoutes = require('./routes/courtRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

// Load environment variables from .env file
dotenv.config();

// Initialize Express application
const app = express();

// --------------- Middleware ---------------

// Enable CORS for all origins (configure in production)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// --------------- Routes ---------------

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Badminton Booking API is running! 🏸',
    });
});

// Mount route handlers
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);

// --------------- Error Handling ---------------

// Centralized error handling middleware (must be registered last)
app.use(errorMiddleware);

// --------------- Server Start ---------------

const PORT = process.env.PORT || 5000;

// Connect to MongoDB then start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    });
});
