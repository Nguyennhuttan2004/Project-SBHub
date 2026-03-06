const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');

/**
 * Generate a JWT token for the given user ID
 * @param {string} id - User's MongoDB ObjectId
 * @returns {string} - Signed JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new AppError('A user with this email already exists.', 400);
        }

        // Create the new user (password is hashed via pre-save hook)
        const user = await User.create({ name, email, password, role });

        // Generate token and send response
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'Registration successful!',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login an existing user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            throw new AppError('Please provide email and password.', 400);
        }

        // Find user and include password field for comparison
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new AppError('Invalid email or password.', 401);
        }

        // Compare passwords
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            throw new AppError('Invalid email or password.', 401);
        }

        // Generate token and send response
        const token = generateToken(user._id);

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
