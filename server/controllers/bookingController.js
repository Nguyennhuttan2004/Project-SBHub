const Booking = require('../models/Booking');
const bookingService = require('../services/bookingService');
const AppError = require('../utils/AppError');

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Authenticated users
 */
const createBooking = async (req, res, next) => {
    try {
        const { court_id, date, start_time, end_time } = req.body;

        // Validate booking data using the service layer
        const validatedData = await bookingService.validateBooking({
            court_id,
            date,
            start_time,
            end_time,
        });

        // Create the booking with the authenticated user's ID
        const booking = await Booking.create({
            user_id: req.user._id,
            court_id: validatedData.court_id,
            date: validatedData.date,
            start_time: validatedData.start_time,
            end_time: validatedData.end_time,
            total_price: validatedData.total_price,
        });

        // Populate court details in the response
        await booking.populate('court_id', 'name price_per_hour');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully!',
            data: booking,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get bookings for the current authenticated user
 * @route   GET /api/bookings/user
 * @access  Authenticated users
 */
const getUserBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user_id: req.user._id })
            .populate('court_id', 'name price_per_hour')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all bookings (admin view)
 * @route   GET /api/bookings/admin
 * @access  Admin only
 */
const getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user_id', 'name email')
            .populate('court_id', 'name price_per_hour')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a booking (change status, cancel, etc.)
 * @route   PUT /api/bookings/:id
 * @access  Authenticated users (own bookings) or Admin
 */
const updateBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            throw new AppError('Booking not found.', 404);
        }

        // Allow only the booking owner or admin to update
        const isOwner = booking.user_id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            throw new AppError('You are not authorized to update this booking.', 403);
        }

        // Regular users can only cancel their own bookings
        if (!isAdmin && req.body.status && req.body.status !== 'cancelled') {
            throw new AppError('You can only cancel your bookings.', 403);
        }

        // Update the booking
        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate('user_id', 'name email')
            .populate('court_id', 'name price_per_hour');

        res.status(200).json({
            success: true,
            message: 'Booking updated successfully!',
            data: updatedBooking,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createBooking, getUserBookings, getAllBookings, updateBooking };
