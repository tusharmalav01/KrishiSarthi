import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { equipmentAPI, bookingAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { FiSearch, FiCalendar, FiPackage, FiTrendingUp } from 'react-icons/fi';
import { FiTruck } from 'react-icons/fi';
// import { GiTractor } from 'react-icons/gi';

const FarmerDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalBookings: 0,
        activeBookings: 0,
        pendingBookings: 0,
        completedBookings: 0,
    });
    const [recentBookings, setRecentBookings] = useState([]);
    const [featuredEquipment, setFeaturedEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [bookingsRes, equipmentRes] = await Promise.all([
                bookingAPI.getMyBookings(),
                equipmentAPI.getAll({ available: 'true' })
            ]);

            const bookings = bookingsRes.data.data;
            setStats({
                totalBookings: bookings.length,
                activeBookings: bookings.filter(b => b.status === 'active').length,
                pendingBookings: bookings.filter(b => b.status === 'pending').length,
                completedBookings: bookings.filter(b => b.status === 'completed').length,
            });
            setRecentBookings(bookings.slice(0, 3));
            setFeaturedEquipment(equipmentRes.data.data.slice(0, 4));
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
        { label: 'Total Bookings', value: stats.totalBookings, icon: FiCalendar, color: 'bg-blue-500' },
        { label: 'Active Rentals', value: stats.activeBookings, icon: FiTrendingUp, color: 'bg-green-500' },
        { label: 'Pending Requests', value: stats.pendingBookings, icon: FiPackage, color: 'bg-yellow-500' },
        { label: 'Completed', value: stats.completedBookings, icon: FiCalendar, color: 'bg-gray-500' },
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
                    <p className="text-gray-500 mt-1">Here's what's happening with your rentals</p>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <Link
                        to="/farmer/browse"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiSearch className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">Browse Equipment</p>
                            <p className="text-sm text-primary-100">Find what you need</p>
                        </div>
                    </Link>
                    <Link
                        to="/farmer/bookings"
                        className="flex items-center gap-3 p-4 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-2xl text-white shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <div className="p-3 bg-white/20 rounded-xl">
                            <FiCalendar className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-semibold">My Bookings</p>
                            <p className="text-sm text-secondary-100">View all rentals</p>
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

                {/* Recent Bookings */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                        <Link to="/farmer/bookings" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
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
                                    <div className="w-16 h-16 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                                        {booking.equipment?.images?.[0] ? (
                                            <img src={booking.equipment.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <FiTruck className="w-8 h-8 text-primary-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-gray-900 truncate">{booking.equipment?.name}</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                                        </p>
                                    </div>
                                    <span className={`badge badge-${booking.status}`}>
                                        {booking.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <FiCalendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500">No bookings yet</p>
                            <Link to="/farmer/browse" className="btn-primary mt-4 inline-block">
                                Browse Equipment
                            </Link>
                        </div>
                    )}
                </div>

                {/* Featured Equipment */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Featured Equipment</h2>
                        <Link to="/farmer/browse" className="text-primary-600 hover:text-primary-700 font-medium text-sm">
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
                    ) : featuredEquipment.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {featuredEquipment.map((equipment) => (
                                <Link
                                    key={equipment._id}
                                    to={`/equipment/${equipment._id}`}
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
                                    <p className="text-primary-600 font-bold">₹{equipment.dailyRate}/{equipment.pricingUnit || 'day'}</p>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-8">
                            <p className="text-gray-500">No equipment available</p>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FarmerDashboard;
