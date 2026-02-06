const Equipment = require('../models/Equipment');
const Booking = require('../models/Booking');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
exports.getEquipment = async (req, res) => {
    try {
        const { category, search, minPrice, maxPrice, district, available } = req.query;

        let query = {};

        // Filter by category
        if (category && category !== 'all') {
            query.category = category;
        }

        // Filter by availability
        if (available === 'true') {
            query.isAvailable = true;
        }

        // Filter by price range
        if (minPrice || maxPrice) {
            query.dailyRate = {};
            if (minPrice) query.dailyRate.$gte = Number(minPrice);
            if (maxPrice) query.dailyRate.$lte = Number(maxPrice);
        }

        // Filter by location
        if (district) {
            query['location.district'] = { $regex: district, $options: 'i' };
        }

        // Search by name or description
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const equipment = await Equipment.find(query)
            .populate('owner', 'name phone address')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: equipment.length,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single equipment
// @route   GET /api/equipment/:id
// @access  Public
exports.getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate('owner', 'name phone address');

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        res.status(200).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create equipment
// @route   POST /api/equipment
// @access  Private (Owner only)
exports.createEquipment = async (req, res) => {
    try {
        req.body.owner = req.user.id;

        // Use owner's address if location not provided
        if (!req.body.location && req.user.address) {
            req.body.location = req.user.address;
        }

        const equipment = await Equipment.create(req.body);

        res.status(201).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private (Owner only)
exports.updateEquipment = async (req, res) => {
    try {
        let equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // Make sure user is equipment owner
        if (equipment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this equipment'
            });
        }

        equipment = await Equipment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete equipment
// @route   DELETE /api/equipment/:id
// @access  Private (Owner only)
exports.deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        // Make sure user is equipment owner
        if (equipment.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this equipment'
            });
        }

        // Check for active bookings
        const activeBookings = await Booking.find({
            equipment: req.params.id,
            status: { $in: ['pending', 'approved', 'active'] }
        });

        if (activeBookings.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete equipment with active bookings'
            });
        }

        await equipment.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Equipment deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get owner's equipment
// @route   GET /api/equipment/my-listings
// @access  Private (Owner only)
exports.getMyEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find({ owner: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: equipment.length,
            data: equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get equipment categories
// @route   GET /api/equipment/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const categories = [
            'Tractor',
            'Harvester',
            'Plough',
            'Seeder',
            'Sprayer',
            'Irrigation',
            'Cultivator',
            'Thresher',
            'Other'
        ];

        res.status(200).json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
