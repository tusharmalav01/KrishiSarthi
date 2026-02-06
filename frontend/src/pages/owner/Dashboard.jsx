import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { equipmentAPI, bookingAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiPackage, FiCalendar, FiPlus, FiTrendingUp } from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import { FiTruck } from 'react-icons/fi';
// import { GiTractor } from 'react-icons/gi';

const OwnerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalEquipment: 0,
        totalBookings: 0,
        pendingRequests: 0,
        activeRentals: 0,
        totalEarnings: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [myEquipment, setMyEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [bookingsRes, equipmentRes] = await Promise.all([
                bookingAPI.getOwnerBookings(),
                equipmentAPI.getMyListings()
            ]);

            const bookings = bookingsRes.data.data;
            const equipment = equipmentRes.data.data;

            const paidBookings = bookings.filter(b => b.status === 'completed' && b.paymentStatus === 'received');
            const totalEarnings = paidBookings.reduce((sum, b) => sum + b.totalCost, 0);

            setStats({
                totalEquipment: equipment.length,
                totalBookings: bookings.length,
                pendingRequests: bookings.filter(b => b.status === 'pending').length,
                activeRentals: bookings.filter(b => b.status === 'active').length,
                totalEarnings,
            });
            setRecentBookings(bookings.filter(b => b.status === 'pending').slice(0, 3));
            setMyEquipment(equipment.slice(0, 4));
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
        });
    };

    const statCards = [
        { label: 'Total Equipment', value: stats.totalEquipment, icon: FiPackage, color: 'bg-blue-500' },
        { label: 'Pending Requests', value: stats.pendingRequests, icon: FiCalendar, color: 'bg-yellow-500' },
        { label: 'Active Rentals', value: stats.activeRentals, icon: FiTrendingUp, color: 'bg-green-500' },
        { label: 'Total Earnings', value: `₹${stats.totalEarnings}`, icon: FaRupeeSign, color: 'bg-green-600' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Welcome back, {user?.name?.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1">Manage your equipment and rental requests</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/owner/equipment/add"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">Add Equipment</p>
                            <p className="text-sm text-primary-100">List new item</p>
                        </div>
                    </Link>
                    <Link
                        to="/owner/bookings"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">Booking Requests</p>
                            <p className="text-sm text-secondary-100">{stats.pendingRequests} pending</p>
                        </div>
                    </Link>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <div key={index} className="card">
                            <div className="flex items-center gap-3">
                                <div className={`p-3 ${stat.color} rounded-xl text-white`}>
                                    <stat.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500">{stat.label}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pending Booking Requests */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Pending Requests</h2>
                        <Link to="/owner/bookings" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="card animate-pulse">
                            <div className="h-20 bg-gray-200 rounded"></div>
                        </div>
                    ) : recentBookings.length > 0 ? (
                        <div className="space-y-3">
                            {recentBookings.map((booking) => (
                                <div key={booking._id} className="card flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-4 group-hover:scale-110 transition-transform duration-200">
                                        <FiTruck className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{booking.equipment?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {booking.farmer?.name} • {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary-600">₹{booking.totalCost}</p>
                                        <span className="badge badge-pending">Pending</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No pending requests</p>
                        </div>
                    )}
                </div>

                {/* My Equipment */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">My Equipment</h2>
                        <Link to="/owner/equipment" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="card animate-pulse">
                                    <div className="h-32 bg-gray-200 rounded-xl mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                </div>
                            ))}
                        </div>
                    ) : myEquipment.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {myEquipment.map((equipment) => (
                                <Link
                                    key={equipment._id}
                                    to={`/owner/equipment`}
                                    className="card hover:shadow-xl transition-shadow group"
                                >
                                    <div className="h-32 rounded-xl bg-primary-100 mb-3 overflow-hidden">
                                        {equipment.images?.[0] ? (
                                            <img
                                                src={equipment.images[0]}
                                                alt={equipment.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-primary-50 rounded-lg">
                                                <FiTruck className="w-12 h-12 text-primary-300" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="font-semibold text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                                        {equipment.name}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <p className="text-primary-600 font-bold">₹{equipment.dailyRate}/{equipment.pricingUnit || 'day'}</p>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${equipment.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {equipment.isAvailable ? 'Available' : 'Unavailable'}
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <FiPackage className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 mb-4">No equipment listed yet</p>
                            <Link to="/owner/equipment/add" className="btn-primary inline-block">
                                Add Equipment
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default OwnerDashboard;
