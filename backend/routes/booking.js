const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getOwnerBookings,
    updateBookingStatus,
    updatePaymentStatus,
    checkAvailability,
    getBookingById
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// Public route for checking availability
router.get('/check-availability/:equipmentId', checkAvailability);

// Protected routes
router.post('/', protect, authorize('farmer'), createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/owner-bookings', protect, authorize('owner', 'admin'), getOwnerBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.put('/:id/payment-status', protect, authorize('owner', 'admin'), updatePaymentStatus);

module.exports = router;

