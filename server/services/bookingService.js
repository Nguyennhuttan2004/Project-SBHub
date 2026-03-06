const Booking = require('../models/Booking');
const Court = require('../models/Court');
const AppError = require('../utils/AppError');

/**
 * Booking Service Layer
 * Contains business logic for booking validation and operations
 * Separates business rules from controller logic for cleaner architecture
 */
const bookingService = {
    /**
     * Check for time slot conflicts
     * Prevents double booking for the same court, date, and overlapping time
     *
     * @param {string} court_id - The court being booked
     * @param {Date} date - The booking date
     * @param {string} start_time - Start time in "HH:mm" format
     * @param {string} end_time - End time in "HH:mm" format
     * @param {string|null} excludeBookingId - Booking ID to exclude (for updates)
     * @returns {boolean} - True if there is a conflict
     */
    checkTimeSlotConflict: async (court_id, date, start_time, end_time, excludeBookingId = null) => {
        // Build query to find overlapping bookings on the same court and date
        const query = {
            court_id,
            date: new Date(date),
            status: { $ne: 'cancelled' }, // Ignore cancelled bookings
            // Check for time overlap:
            // Existing booking overlaps if its start is before our end
            // AND its end is after our start
            $and: [
                { start_time: { $lt: end_time } },
                { end_time: { $gt: start_time } },
            ],
        };

        // Exclude current booking when updating
        if (excludeBookingId) {
            query._id = { $ne: excludeBookingId };
        }

        const conflictingBooking = await Booking.findOne(query);
        return !!conflictingBooking;
    },

    /**
     * Calculate total price based on duration and court hourly rate
     *
     * @param {string} start_time - Start time in "HH:mm" format
     * @param {string} end_time - End time in "HH:mm" format
     * @param {number} price_per_hour - Court's hourly rate
     * @returns {number} - Total price for the booking
     */
    calculateTotalPrice: (start_time, end_time, price_per_hour) => {
        const [startH, startM] = start_time.split(':').map(Number);
        const [endH, endM] = end_time.split(':').map(Number);

        // Calculate duration in hours
        const startMinutes = startH * 60 + startM;
        const endMinutes = endH * 60 + endM;
        const durationHours = (endMinutes - startMinutes) / 60;

        if (durationHours <= 0) {
            throw new AppError('End time must be after start time.', 400);
        }

        return durationHours * price_per_hour;
    },

    /**
     * Validate booking data before creation
     * Checks court availability, time validity, and conflicts
     *
     * @param {Object} bookingData - The booking details
     * @returns {Object} - Validated booking data with calculated total_price
     */
    validateBooking: async (bookingData) => {
        const { court_id, date, start_time, end_time } = bookingData;

        // 1. Check if the court exists and is available
        const court = await Court.findById(court_id);
        if (!court) {
            throw new AppError('Court not found.', 404);
        }
        if (court.status === 'maintenance') {
            throw new AppError('This court is currently under maintenance.', 400);
        }

        // 2. Validate that the booking date is not in the past
        const bookingDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (bookingDate < today) {
            throw new AppError('Cannot book a court for a past date.', 400);
        }

        // 3. Calculate total price
        const total_price = bookingService.calculateTotalPrice(
            start_time,
            end_time,
            court.price_per_hour
        );

        // 4. Check for time slot conflicts (double booking prevention)
        const hasConflict = await bookingService.checkTimeSlotConflict(
            court_id,
            date,
            start_time,
            end_time
        );
        if (hasConflict) {
            throw new AppError(
                'This time slot is already booked. Please choose a different time.',
                409
            );
        }

        return { ...bookingData, total_price };
    },
};

module.exports = bookingService;
