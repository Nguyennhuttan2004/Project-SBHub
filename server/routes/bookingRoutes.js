const express = require('express');
const router = express.Router();
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    updateBooking,
} = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/**
 * Booking Routes
 * POST /api/bookings       - Create a new booking (authenticated users)
 * GET  /api/bookings/user  - Get current user's bookings (authenticated)
 * GET  /api/bookings/admin - Get all bookings (admin only)
 * PUT  /api/bookings/:id   - Update a booking (owner or admin)
 */
router.post('/', authMiddleware, createBooking);
router.get('/user', authMiddleware, getUserBookings);
router.get('/admin', authMiddleware, adminMiddleware, getAllBookings);
router.put('/:id', authMiddleware, updateBooking);

module.exports = router;
