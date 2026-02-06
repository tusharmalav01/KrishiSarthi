const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    equipment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Equipment',
        required: true
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        required: [true, 'Please add start date']
    },
    endDate: {
        type: Date,
        required: [true, 'Please add end date']
    },
    totalDays: {
        type: Number,
        required: true
    },
    usage: {
        type: Number, // Hours, Acres, or Days
        default: 0
    },
    unit: {
        type: String, // 'day', 'hour', 'acre'
        default: 'day'
    },
    dailyRate: {
        type: Number,
        required: true
    },
    totalCost: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'active', 'completed', 'rejected', 'cancelled'],
        default: 'pending'
    },
    farmerNotes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    ownerNotes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'received'],
        default: 'pending'
    },
    paymentConfirmedAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Index for booking queries
bookingSchema.index({ equipment: 1, startDate: 1, endDate: 1 });
bookingSchema.index({ farmer: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });

// Static method to check for overlapping bookings
bookingSchema.statics.checkOverlap = async function (equipmentId, startDate, endDate, excludeBookingId = null) {
    const query = {
        equipment: equipmentId,
        status: { $in: ['pending', 'approved', 'active'] },
        $or: [
            {
                startDate: { $lte: endDate },
                endDate: { $gte: startDate }
            }
        ]
    };

    if (excludeBookingId) {
        query._id = { $ne: excludeBookingId };
    }

    const overlappingBooking = await this.findOne(query);
    return overlappingBooking !== null;
};

module.exports = mongoose.model('Booking', bookingSchema);
