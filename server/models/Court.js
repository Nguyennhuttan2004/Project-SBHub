const mongoose = require('mongoose');

/**
 * Court Model
 * Represents a badminton court that can be booked by users
 */
const courtSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Court name is required'],
        trim: true,
        maxlength: [100, 'Court name cannot exceed 100 characters'],
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters'],
        default: '',
    },
    price_per_hour: {
        type: Number,
        required: [true, 'Price per hour is required'],
        min: [0, 'Price cannot be negative'],
    },
    status: {
        type: String,
        enum: ['available', 'maintenance'],
        default: 'available',
    },
}, {
    timestamps: true, // Automatically adds createdAt and updatedAt
});

module.exports = mongoose.model('Court', courtSchema);
