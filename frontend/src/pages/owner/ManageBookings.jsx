import { useState, useEffect } from 'react';
import { bookingAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import BookingCard from '../../components/BookingCard';
import toast from 'react-hot-toast';
import { FiCalendar } from 'react-icons/fi';

const statusFilters = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
];

const ManageBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchBookings();
    }, [filter]);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const params = filter !== 'all' ? { status: filter } : {};
            const response = await bookingAPI.getOwnerBookings(params);
            setBookings(response.data.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            toast.error('Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (bookingId, status) => {
        try {
            await bookingAPI.updateStatus(bookingId, { status });
            toast.success(`Booking ${status}`);
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update booking');
        }
    };

    const handlePaymentUpdate = async (bookingId, paymentStatus) => {
        try {
            await bookingAPI.updatePaymentStatus(bookingId, { paymentStatus });
            toast.success('Payment confirmed successfully');
            fetchBookings();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update payment status');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Requests</h1>
                    <p className="text-gray-500 mt-1">Manage rental requests for your equipment</p>
                </div>

                {/* Status Filters */}
                <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="flex gap-2 min-w-max">
                        {statusFilters.map((status) => (
                            <button
                                key={status.value}
                                onClick={() => setFilter(status.value)}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${filter === status.value
                                    ? 'bg-primary-600 text-white shadow-lg'
                                    : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                                    }`}
                            >
                                {status.label}
                                {status.value === 'pending' && bookings.filter(b => b.status === 'pending').length > 0 && (
                                    <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                        {bookings.filter(b => b.status === 'pending').length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bookings List */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="flex gap-4">
                                    <div className="w-32 h-24 bg-gray-200 rounded-xl"></div>
                                    <div className="flex-1">
                                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : bookings.length > 0 ? (
                    <div className="space-y-4">
                        {bookings.map((booking) => (
                            <BookingCard
                                key={booking._id}
                                booking={booking}
                                isOwner={true}
                                onStatusUpdate={handleStatusUpdate}
                                onPaymentUpdate={handlePaymentUpdate}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <FiCalendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No booking requests</h3>
                        <p className="text-gray-500">
                            {filter !== 'all'
                                ? `No ${filter} booking requests found`
                                : "You haven't received any booking requests yet"
                            }
                        </p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default ManageBookings;

