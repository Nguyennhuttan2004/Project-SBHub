const mongoose = require('mongoose');

/**
 * Booking Model
 * Represents a court reservation made by a user
 * Links users to courts with specific date and time slots
 */
const bookingSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    court_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Court',
        required: [true, 'Court ID is required'],
    },
    date: {
        type: Date,
        required: [true, 'Booking date is required'],
    },
    start_time: {
        type: String, // Format: "HH:mm" (e.g., "09:00")
        required: [true, 'Start time is required'],
    },
    end_time: {
        type: String, // Format: "HH:mm" (e.g., "10:00")
        required: [true, 'End time is required'],
    },
    status: {
        type: String,
        enum: ['booked', 'cancelled', 'completed'],
        default: 'booked',
    },
    total_price: {
        type: Number,
        required: [true, 'Total price is required'],
        min: [0, 'Total price cannot be negative'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a compound index to help with conflict checking queries
bookingSchema.index({ court_id: 1, date: 1, start_time: 1, end_time: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
