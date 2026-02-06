import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { equipmentAPI, bookingAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    FiMapPin,
    FiPhone,
    FiUser,
    FiCalendar,
    FiArrowLeft,
    FiCheck,
    FiX,
    FiTruck
} from 'react-icons/fi';
// import { GiTractor } from 'react-icons/gi';

const EquipmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isFarmer } = useAuth();

    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState({
        startDate: null,
        endDate: null,

        usage: '',
        farmerNotes: '',
    });
    const [availability, setAvailability] = useState({ available: true, existingBookings: [] });
    const [checkingAvailability, setCheckingAvailability] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        fetchEquipment();
    }, [id]);

    const fetchEquipment = async () => {
        try {
            const response = await equipmentAPI.getById(id);
            setEquipment(response.data.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
            toast.error('Equipment not found');
            navigate('/farmer/browse');
        } finally {
            setLoading(false);
        }
    };

    const checkAvailability = async () => {
        if (!booking.startDate || !booking.endDate) return;

        setCheckingAvailability(true);
        try {
            const response = await bookingAPI.checkAvailability(id, {
                startDate: booking.startDate.toISOString(),
                endDate: booking.endDate.toISOString(),
            });
            setAvailability(response.data);
        } catch (error) {
            console.error('Error checking availability:', error);
        } finally {
            setCheckingAvailability(false);
        }
    };

    useEffect(() => {
        if (booking.startDate && booking.endDate) {
            checkAvailability();
        }
    }, [booking.startDate, booking.endDate]);

    const calculateTotal = () => {
        if (!booking.startDate || !booking.endDate || !equipment) return 0;

        if (equipment.pricingUnit === 'day') {
            const days = Math.max(1, Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24)));
            return days * equipment.dailyRate;
        } else {
            // For hour/acre, total cost = rate * usage
            return (parseFloat(booking.usage) || 0) * equipment.dailyRate;
        }
    };

    const getTotalDays = () => {
        if (!booking.startDate || !booking.endDate) return 0;
        const days = Math.ceil((booking.endDate - booking.startDate) / (1000 * 60 * 60 * 24));
        return Math.max(1, days);
    };

    const handleBooking = async () => {
        if (!user) {
            toast.error('Please login to book equipment');
            navigate('/login');
            return;
        }

        if (!isFarmer) {
            toast.error('Only farmers can book equipment');
            return;
        }

        if (!booking.startDate || !booking.endDate) {
            toast.error('Please select booking dates');
            return;
        }

        setSubmitting(true);
        try {
            await bookingAPI.create({
                equipmentId: id,
                startDate: booking.startDate.toISOString(),
                endDate: booking.endDate.toISOString(),
                usage: equipment.pricingUnit !== 'day' ? Number(booking.usage) : undefined,
                farmerNotes: booking.farmerNotes,
            });
            toast.success('Booking request submitted successfully!');
            navigate('/farmer/bookings');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create booking');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="h-96 bg-gray-200 rounded-2xl"></div>
                            <div className="space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                <div className="h-32 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!equipment) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to browse
                </button>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left - Images */}
                    <div>
                        <div className="aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50 mb-4">
                            {equipment.images && equipment.images.length > 0 ? (
                                <img
                                    src={equipment.images[selectedImage]}
                                    alt={equipment.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <FiTruck className="w-32 h-32 text-primary-300" />
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Gallery */}
                        {equipment.images && equipment.images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto">
                                {equipment.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedImage(index)}
                                        className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${selectedImage === index ? 'border-primary-500' : 'border-transparent'
                                            }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right - Details */}
                    <div>
                        <div className="mb-4">
                            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-2">
                                {equipment.category}
                            </span>
                            <h1 className="text-3xl font-bold text-gray-900">{equipment.name}</h1>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-4xl font-bold text-primary-600">₹{equipment.dailyRate}</span>
                            <span className="text-gray-500">/{equipment.pricingUnit || 'day'}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6">{equipment.description}</p>

                        {/* Specifications */}
                        {equipment.specifications && (
                            <div className="card mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Specifications</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {equipment.specifications.brand && (
                                        <div>
                                            <p className="text-sm text-gray-500">Brand</p>
                                            <p className="font-medium">{equipment.specifications.brand}</p>
                                        </div>
                                    )}
                                    {equipment.specifications.model && (
                                        <div>
                                            <p className="text-sm text-gray-500">Model</p>
                                            <p className="font-medium">{equipment.specifications.model}</p>
                                        </div>
                                    )}
                                    {equipment.specifications.horsepower && (
                                        <div>
                                            <p className="text-sm text-gray-500">Horsepower</p>
                                            <p className="font-medium">{equipment.specifications.horsepower} HP</p>
                                        </div>
                                    )}
                                    {equipment.specifications.condition && (
                                        <div>
                                            <p className="text-sm text-gray-500">Condition</p>
                                            <p className="font-medium">{equipment.specifications.condition}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Owner Info */}
                        <div className="card mb-6">
                            <h3 className="font-semibold text-gray-900 mb-3">Equipment Owner</h3>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                                    <FiUser className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{equipment.owner?.name}</p>
                                    {equipment.owner?.phone && (
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <FiPhone className="w-3 h-3" />
                                            {equipment.owner.phone}
                                        </p>
                                    )}
                                </div>
                            </div>
                            {equipment.location && (
                                <div className="flex items-start gap-2 text-gray-500">
                                    <FiMapPin className="w-4 h-4 mt-0.5" />
                                    <span className="text-sm">
                                        {[equipment.location.village, equipment.location.district, equipment.location.state]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Booking Section */}
                        {isFarmer && equipment.isAvailable && (
                            <div className="card bg-gradient-to-br from-gray-50 to-white">
                                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <FiCalendar className="w-5 h-5 text-primary-500" />
                                    Book This Equipment
                                </h3>

                                {equipment.pricingUnit === 'hour' ? (
                                    <div className="space-y-4 mb-4">
                                        <div>
                                            <label className="label">Date</label>
                                            <DatePicker
                                                selected={booking.startDate}
                                                onChange={(date) => {
                                                    // Preserve time if already set, or default to current/start of day
                                                    const newStart = new Date(date);
                                                    if (booking.startDate) {
                                                        newStart.setHours(booking.startDate.getHours(), booking.startDate.getMinutes());
                                                    }

                                                    // For end date, keep same day, preserve time
                                                    const newEnd = booking.endDate ? new Date(date) : new Date(date);
                                                    if (booking.endDate) {
                                                        newEnd.setHours(booking.endDate.getHours(), booking.endDate.getMinutes());
                                                    }

                                                    setBooking(prev => ({
                                                        ...prev,
                                                        startDate: newStart,
                                                        endDate: newEnd
                                                    }));
                                                }}
                                                minDate={new Date()}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select date"
                                                className="input w-full"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="label">Start Time</label>
                                                <input
                                                    type="time"
                                                    className="input w-full"
                                                    onChange={(e) => {
                                                        if (!booking.startDate) return;
                                                        const [hours, minutes] = e.target.value.split(':');
                                                        const newStart = new Date(booking.startDate);
                                                        newStart.setHours(parseInt(hours), parseInt(minutes));

                                                        // Update start date
                                                        const updates = { startDate: newStart };

                                                        // Auto update usage if end date exists
                                                        if (booking.endDate) {
                                                            const diff = (booking.endDate - newStart) / (1000 * 60 * 60);
                                                            if (diff > 0) updates.usage = diff.toFixed(1);
                                                        }
                                                        setBooking(prev => ({ ...prev, ...updates }));
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <label className="label">End Time</label>
                                                <input
                                                    type="time"
                                                    className="input w-full"
                                                    onChange={(e) => {
                                                        if (!booking.startDate) return; // Need date first
                                                        const [hours, minutes] = e.target.value.split(':');
                                                        const newEnd = new Date(booking.startDate); // Same day
                                                        newEnd.setHours(parseInt(hours), parseInt(minutes));

                                                        const updates = { endDate: newEnd };

                                                        // Auto update usage
                                                        if (booking.startDate) {
                                                            const diff = (newEnd - booking.startDate) / (1000 * 60 * 60);
                                                            if (diff > 0) updates.usage = diff.toFixed(1);
                                                        }
                                                        setBooking(prev => ({ ...prev, ...updates }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <label className="label">Start Date</label>
                                            <DatePicker
                                                selected={booking.startDate}
                                                onChange={(date) => setBooking({ ...booking, startDate: date })}
                                                minDate={new Date()}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select start date"
                                                className="input w-full"
                                            />
                                        </div>
                                        <div>
                                            <label className="label">End Date</label>
                                            <DatePicker
                                                selected={booking.endDate}
                                                onChange={(date) => setBooking({ ...booking, endDate: date })}
                                                minDate={booking.startDate}
                                                dateFormat="dd/MM/yyyy"
                                                placeholderText="Select end date"
                                                className="input w-full"
                                            />
                                        </div>
                                    </div>
                                )}

                                {equipment.pricingUnit !== 'day' && equipment.pricingUnit !== 'hour' && (
                                    <div className="mb-4">
                                        <label className="label">
                                            Estimated Usage ({equipment.pricingUnit}s) *
                                        </label>
                                        <input
                                            type="number"
                                            value={booking.usage}
                                            onChange={(e) => setBooking({ ...booking, usage: e.target.value })}
                                            className="input"
                                            placeholder={`Enter number of ${equipment.pricingUnit}s`}
                                            min="1"
                                        />
                                    </div>
                                )}

                                {equipment.pricingUnit === 'hour' && (
                                    <div className="mb-4">
                                        <label className="label">Calculated Duration</label>
                                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700 font-medium">
                                            {booking.usage ? `${booking.usage} hours` : 'Select times to calculate'}
                                        </div>
                                    </div>
                                )}

                                {/* Availability Status */}
                                {booking.startDate && booking.endDate && (
                                    <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 ${checkingAvailability
                                        ? 'bg-gray-100 text-gray-600'
                                        : availability.available
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                        }`}>
                                        {checkingAvailability ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                                <span>Checking availability...</span>
                                            </>
                                        ) : availability.available ? (
                                            <>
                                                <FiCheck className="w-5 h-5" />
                                                <span>Available for selected dates</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiX className="w-5 h-5" />
                                                <span>Not available for selected dates</span>
                                            </>
                                        )}
                                    </div>
                                )}

                                {/* Notes */}
                                <div className="mb-4">
                                    <label className="label">Notes (Optional)</label>
                                    <textarea
                                        value={booking.farmerNotes}
                                        onChange={(e) => setBooking({ ...booking, farmerNotes: e.target.value })}
                                        className="input min-h-[80px]"
                                        placeholder="Any special requirements or notes for the owner..."
                                    />
                                </div>

                                {/* Total */}
                                {booking.startDate && booking.endDate && (
                                    <div className="p-4 bg-primary-50 rounded-xl mb-4">
                                        <div className="flex justify-between mb-2">
                                            {equipment.pricingUnit === 'day' ? (
                                                <span className="text-gray-600">₹{equipment.dailyRate} × {getTotalDays()} days</span>
                                            ) : (
                                                <span className="text-gray-600">₹{equipment.dailyRate} × {booking.usage || 0} {equipment.pricingUnit}s</span>
                                            )}
                                            <span className="font-medium">₹{calculateTotal()}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-primary-200 pt-2">
                                            <span className="font-semibold text-gray-900">Total</span>
                                            <span className="text-2xl font-bold text-primary-600">₹{calculateTotal()}</span>
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={handleBooking}
                                    disabled={
                                        !booking.startDate ||
                                        !booking.endDate ||
                                        !availability.available ||
                                        submitting ||
                                        (equipment.pricingUnit !== 'day' && !booking.usage)
                                    }
                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {submitting ? 'Submitting...' : 'Request Booking'}
                                </button>
                            </div>
                        )}

                        {!equipment.isAvailable && (
                            <div className="card bg-gray-100 text-center">
                                <p className="text-gray-600">This equipment is currently not available for rent</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default EquipmentDetails;
