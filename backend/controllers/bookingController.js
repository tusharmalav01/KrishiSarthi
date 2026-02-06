const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Farmer only)
exports.createBooking = async (req, res) => {
    try {
        const { equipmentId, startDate, endDate, farmerNotes, usage } = req.body;

        // Get equipment
        const equipment = await Equipment.findById(equipmentId);
        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // Check if equipment is available
        if (!equipment.isAvailable) {
            return res.status(400).json({
                success: false,
                message: 'Equipment is not available for rental'
            });
        }

        // Prevent owner from booking their own equipment
        if (equipment.owner.toString() === req.user.id) {
            return res.status(400).json({
                success: false,
                message: 'You cannot book your own equipment'
            });
        }

        // Parse dates
        const start = new Date(startDate);
        const end = new Date(endDate);

        // Validate dates
        if (start > end) {
            return res.status(400).json({
                success: false,
                message: 'End date cannot be before start date'
            });
        }

        if (start < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'Start date cannot be in the past'
            });
        }

        // Check for overlapping bookings
        const hasOverlap = await Booking.checkOverlap(equipmentId, start, end);
        if (hasOverlap) {
            return res.status(400).json({
                success: false,
                message: 'Equipment is already booked for the selected dates'
            });
        }

        // Calculate rental duration and cost
        // If start and end are same day, count as 1 day
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const totalDays = Math.max(1, diffDays);

        let calculatedUsage = totalDays;
        let totalCost = 0;

        if (equipment.pricingUnit === 'day') {
            calculatedUsage = totalDays;
            totalCost = totalDays * equipment.dailyRate;
        } else {
            // For hour and acre, use the provided usage
            if (!usage || usage <= 0) {
                return res.status(400).json({
                    success: false,
                    message: `Please provide usage in ${equipment.pricingUnit}s`
                });
            }
            calculatedUsage = parseFloat(usage);
            totalCost = calculatedUsage * equipment.dailyRate;
        }

        // Create booking
        const booking = await Booking.create({
            equipment: equipmentId,
            farmer: req.user.id,
            owner: equipment.owner,
            startDate: start,
            endDate: end,
            totalDays,
            usage: calculatedUsage,
            unit: equipment.pricingUnit,
            dailyRate: equipment.dailyRate,
            totalCost,
            farmerNotes
        });

        await booking.populate([
            { path: 'equipment', select: 'name images category' },
            { path: 'farmer', select: 'name phone' },
            { path: 'owner', select: 'name phone' }
        ]);

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get farmer's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { farmer: req.user.id };

        if (status && status !== 'all') {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('equipment', 'name images category dailyRate location')
            .populate('owner', 'name phone')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get bookings for owner's equipment
// @route   GET /api/bookings/owner-bookings
// @access  Private (Owner only)
exports.getOwnerBookings = async (req, res) => {
    try {
        const { status } = req.query;
        let query = { owner: req.user.id };

        if (status && status !== 'all') {
            query.status = status;
        }

        const bookings = await Booking.find(query)
            .populate('equipment', 'name images category')
            .populate('farmer', 'name phone address')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner only)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, ownerNotes } = req.body;
        const validStatuses = ['approved', 'rejected', 'active', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check authorization
        const isOwner = booking.owner.toString() === req.user.id;
        const isFarmer = booking.farmer.toString() === req.user.id;

        // Only owner can approve, reject, mark active, or complete
        if (['approved', 'rejected', 'active', 'completed'].includes(status) && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'Only equipment owner can perform this action'
            });
        }

        // Both farmer and owner can cancel (with different rules)
        if (status === 'cancelled') {
            if (!isOwner && !isFarmer) {
                return res.status(403).json({
                    success: false,
                    message: 'Not authorized'
                });
            }
            // Farmer can only cancel pending bookings
            if (isFarmer && booking.status !== 'pending') {
                return res.status(400).json({
                    success: false,
                    message: 'Can only cancel pending bookings'
                });
            }
        }

        // Validate status transitions
        const validTransitions = {
            pending: ['approved', 'rejected', 'cancelled'],
            approved: ['active', 'cancelled'],
            active: ['completed'],
            completed: [],
            rejected: [],
            cancelled: []
        };

        if (!validTransitions[booking.status].includes(status)) {
            return res.status(400).json({
                success: false,
                message: `Cannot change status from ${booking.status} to ${status}`
            });
        }

        booking.status = status;
        if (ownerNotes) booking.ownerNotes = ownerNotes;
        await booking.save();

        await booking.populate([
            { path: 'equipment', select: 'name images category' },
            { path: 'farmer', select: 'name phone' },
            { path: 'owner', select: 'name phone' }
        ]);

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Check equipment availability
// @route   GET /api/bookings/check-availability/:equipmentId
// @access  Public
exports.checkAvailability = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const equipmentId = req.params.equipmentId;

        if (!startDate || !endDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide start and end dates'
            });
        }

        const start = new Date(startDate);
        const end = new Date(endDate);

        const hasOverlap = await Booking.checkOverlap(equipmentId, start, end);

        // Get existing bookings for the equipment
        const bookings = await Booking.find({
            equipment: equipmentId,
            status: { $in: ['pending', 'approved', 'active'] },
            endDate: { $gte: new Date() }
        }).select('startDate endDate status');

        res.status(200).json({
            success: true,
            available: !hasOverlap,
            existingBookings: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('equipment')
            .populate('farmer', 'name phone address')
            .populate('owner', 'name phone address');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check authorization
        const isOwner = booking.owner._id.toString() === req.user.id;
        const isFarmer = booking.farmer._id.toString() === req.user.id;

        if (!isOwner && !isFarmer && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/payment-status
// @access  Private (Owner only)
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.body;

        if (!['pending', 'received'].includes(paymentStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment status. Use "pending" or "received"'
            });
        }

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Only owner can update payment status
        if (booking.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Only equipment owner can update payment status'
            });
        }

        // Only allow payment confirmation for completed bookings
        if (booking.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: 'Payment status can only be updated for completed bookings'
            });
        }

        booking.paymentStatus = paymentStatus;
        if (paymentStatus === 'received') {
            booking.paymentConfirmedAt = new Date();
        } else {
            booking.paymentConfirmedAt = undefined;
        }

        await booking.save();

        await booking.populate([
            { path: 'equipment', select: 'name images category' },
            { path: 'farmer', select: 'name phone' },
            { path: 'owner', select: 'name phone' }
        ]);

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
