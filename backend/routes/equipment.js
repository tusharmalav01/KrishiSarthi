const express = require('express');
const router = express.Router();
const {
    getEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getMyEquipment,
    getCategories
} = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getEquipment);
router.get('/categories', getCategories);
router.get('/:id', getEquipmentById);

// Protected routes (Owner only)
router.post('/', protect, authorize('owner', 'admin'), createEquipment);
router.get('/owner/my-listings', protect, authorize('owner', 'admin'), getMyEquipment);
router.put('/:id', protect, authorize('owner', 'admin'), updateEquipment);
router.delete('/:id', protect, authorize('owner', 'admin'), deleteEquipment);

module.exports = router;
