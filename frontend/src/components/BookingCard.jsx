import { FiCalendar, FiMapPin, FiUser, FiPhone, FiCheck } from 'react-icons/fi';

const statusConfig = {
    pending: { class: 'badge-pending', label: 'Pending' },
    approved: { class: 'badge-approved', label: 'Approved' },
    active: { class: 'badge-active', label: 'Active' },
    completed: { class: 'badge-completed', label: 'Completed' },
    rejected: { class: 'badge-rejected', label: 'Rejected' },
    cancelled: { class: 'badge-cancelled', label: 'Cancelled' },
};

const paymentStatusConfig = {
    pending: { class: 'bg-yellow-100 text-yellow-800', label: 'Payment Pending' },
    received: { class: 'bg-green-100 text-green-800', label: 'Paid' },
};

const BookingCard = ({ booking, onStatusUpdate, onPaymentUpdate, isOwner = false }) => {
    const config = statusConfig[booking.status] || statusConfig.pending;
    const paymentConfig = paymentStatusConfig[booking.paymentStatus] || paymentStatusConfig.pending;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <div className="card hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col md:flex-row gap-4">
                {/* Equipment Image */}
                <div className="w-full md:w-40 h-32 rounded-xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 flex-shrink-0">
                    {booking.equipment?.images?.[0] ? (
                        <img
                            src={booking.equipment.images[0]}
                            alt={booking.equipment.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-primary-300">
                            <span className="text-4xl">🚜</span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">
                                {booking.equipment?.name || 'Equipment'}
                            </h3>
                            <span className="text-sm text-gray-500">{booking.equipment?.category}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <span className={`badge ${config.class}`}>{config.label}</span>
                            {booking.status === 'completed' && (
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${paymentConfig.class}`}>
                                    {paymentConfig.label}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Date Range */}
                    <div className="mt-3 flex items-center gap-2 text-gray-600">
                        <FiCalendar className="w-4 h-4 text-primary-500" />
                        <span className="text-sm">
                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                            {booking.unit && booking.unit !== 'day'
                                ? `${booking.usage} ${booking.unit}s`
                                : `${booking.totalDays} days`
                            }
                        </span>
                    </div>

                    {/* Location */}
                    {booking.equipment?.location && (
                        <div className="mt-2 flex items-center gap-2 text-gray-500">
                            <FiMapPin className="w-4 h-4" />
                            <span className="text-sm">
                                {booking.equipment.location.district}, {booking.equipment.location.state}
                            </span>
                        </div>
                    )}

                    {/* Contact Info */}
                    {isOwner && booking.farmer && (
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FiUser className="w-4 h-4" />
                                <span>{booking.farmer.name}</span>
                            </div>
                            {booking.farmer.phone && (
                                <div className="flex items-center gap-1">
                                    <FiPhone className="w-4 h-4" />
                                    <span>{booking.farmer.phone}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {!isOwner && booking.owner && (
                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <FiUser className="w-4 h-4" />
                                <span>Owner: {booking.owner.name}</span>
                            </div>
                            {booking.owner.phone && (
                                <div className="flex items-center gap-1">
                                    <FiPhone className="w-4 h-4" />
                                    <span>{booking.owner.phone}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Cost */}
                    <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <span className="text-sm text-gray-500">Total Cost:</span>
                            <span className="ml-2 text-xl font-bold text-primary-600">₹{booking.totalCost}</span>
                            <span className="ml-1 text-xs text-gray-400">
                                (₹{booking.dailyRate}/{booking.unit || 'day'})
                            </span>
                        </div>

                        {/* Action Buttons */}
                        {isOwner && booking.status === 'pending' && onStatusUpdate && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onStatusUpdate(booking._id, 'approved')}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => onStatusUpdate(booking._id, 'rejected')}
                                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Reject
                                </button>
                            </div>
                        )}

                        {isOwner && booking.status === 'approved' && onStatusUpdate && (
                            <button
                                onClick={() => onStatusUpdate(booking._id, 'active')}
                                className="px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Mark as Active
                            </button>
                        )}

                        {isOwner && booking.status === 'active' && onStatusUpdate && (
                            <button
                                onClick={() => onStatusUpdate(booking._id, 'completed')}
                                className="px-4 py-2 text-sm font-semibold text-white bg-gray-700 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                Mark Completed
                            </button>
                        )}

                        {/* Payment Confirmation Button for Owner */}
                        {isOwner && booking.status === 'completed' && booking.paymentStatus === 'pending' && onPaymentUpdate && (
                            <button
                                onClick={() => onPaymentUpdate(booking._id, 'received')}
                                className="px-4 py-2 text-sm font-semibold text-white bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
                            >
                                Confirm Payment Received
                            </button>
                        )}

                        {isOwner && booking.status === 'completed' && booking.paymentStatus === 'received' && (
                            <span className="px-4 py-2 text-sm font-semibold text-emerald-600 bg-emerald-50 rounded-lg flex items-center gap-2">
                                <FiCheck className="w-4 h-4" />
                                Payment Confirmed
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookingCard;

