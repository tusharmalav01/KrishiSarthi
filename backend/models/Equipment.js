const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add equipment name'],
        trim: true,
        maxlength: [100, 'Name cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please select a category'],
        enum: [
            'Tractor',
            'Harvester',
            'Plough',
            'Seeder',
            'Sprayer',
            'Irrigation',
            'Cultivator',
            'Thresher',
            'Other'
        ]
    },
    images: [{
        type: String
    }],
    dailyRate: {
        type: Number,
        required: [true, 'Please add daily rental rate'],
        min: [0, 'Rate cannot be negative']
    },
    pricingUnit: {
        type: String,
        enum: ['day', 'hour', 'acre'],
        default: 'day'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    specifications: {
        brand: String,
        model: String,
        year: Number,
        horsepower: String,
        fuelType: String,
        condition: {
            type: String,
            enum: ['Excellent', 'Good', 'Fair'],
            default: 'Good'
        }
    },
    location: {
        village: String,
        district: String,
        state: String,
        pincode: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for search optimization
equipmentSchema.index({ name: 'text', description: 'text' });
equipmentSchema.index({ category: 1, isAvailable: 1 });
equipmentSchema.index({ 'location.district': 1 });

module.exports = mongoose.model('Equipment', equipmentSchema);
