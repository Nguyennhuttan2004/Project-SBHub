const Court = require('../models/Court');
const AppError = require('../utils/AppError');

/**
 * @desc    Get all courts
 * @route   GET /api/courts
 * @access  Public
 */
const getCourts = async (req, res, next) => {
    try {
        const courts = await Court.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: courts.length,
            data: courts,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single court by ID
 * @route   GET /api/courts/:id
 * @access  Public
 */
const getCourtById = async (req, res, next) => {
    try {
        const court = await Court.findById(req.params.id);

        if (!court) {
            throw new AppError('Court not found.', 404);
        }

        res.status(200).json({
            success: true,
            data: court,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create a new court
 * @route   POST /api/courts
 * @access  Admin only
 */
const createCourt = async (req, res, next) => {
    try {
        const { name, description, price_per_hour, status } = req.body;

        const court = await Court.create({ name, description, price_per_hour, status });

        res.status(201).json({
            success: true,
            message: 'Court created successfully!',
            data: court,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update a court
 * @route   PUT /api/courts/:id
 * @access  Admin only
 */
const updateCourt = async (req, res, next) => {
    try {
        const court = await Court.findByIdAndUpdate(req.params.id, req.body, {
            new: true,           // Return the updated document
            runValidators: true,  // Run schema validators on update
        });

        if (!court) {
            throw new AppError('Court not found.', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Court updated successfully!',
            data: court,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a court
 * @route   DELETE /api/courts/:id
 * @access  Admin only
 */
const deleteCourt = async (req, res, next) => {
    try {
        const court = await Court.findByIdAndDelete(req.params.id);

        if (!court) {
            throw new AppError('Court not found.', 404);
        }

        res.status(200).json({
            success: true,
            message: 'Court deleted successfully!',
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { getCourts, getCourtById, createCourt, updateCourt, deleteCourt };
