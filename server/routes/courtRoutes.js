const express = require('express');
const router = express.Router();
const {
    getCourts,
    getCourtById,
    createCourt,
    updateCourt,
    deleteCourt,
} = require('../controllers/courtController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/**
 * Court Routes
 * GET    /api/courts      - Get all courts (public)
 * GET    /api/courts/:id  - Get a single court (public)
 * POST   /api/courts      - Create a court (admin only)
 * PUT    /api/courts/:id  - Update a court (admin only)
 * DELETE /api/courts/:id  - Delete a court (admin only)
 */
router.get('/', getCourts);
router.get('/:id', getCourtById);
router.post('/', authMiddleware, adminMiddleware, createCourt);
router.put('/:id', authMiddleware, adminMiddleware, updateCourt);
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourt);

module.exports = router;
