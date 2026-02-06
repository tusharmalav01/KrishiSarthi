import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiMenu,
    FiX,
    FiHome,
    FiSearch,
    FiPackage,
    FiCalendar,
    FiLogOut,
    FiUser,
    FiPlus,
    FiTruck,
    FiGlobe
} from 'react-icons/fi';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, isAuthenticated, isFarmer, isOwner } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsOpen(false);
    };

    const navLinks = isAuthenticated ? (
        isFarmer ? [
            { to: '/farmer/dashboard', icon: FiHome, label: 'Dashboard' },
            { to: '/farmer/browse', icon: FiSearch, label: 'Browse Equipment' },
            { to: '/farmer/bookings', icon: FiCalendar, label: 'My Bookings' },
        ] : isOwner ? [
            { to: '/owner/dashboard', icon: FiHome, label: 'Dashboard' },
            { to: '/owner/equipment', icon: FiPackage, label: 'My Equipment' },
            { to: '/owner/equipment/add', icon: FiPlus, label: 'Add Equipment' },
            { to: '/owner/bookings', icon: FiCalendar, label: 'Manage Bookings' },
        ] : []
    ) : [];

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link
                        to={isAuthenticated ? (isFarmer ? '/farmer/dashboard' : '/owner/dashboard') : '/'}
                        className="flex items-center gap-2 group"
                    >
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-lg group-hover:shadow-xl transition-all duration-200">
                            <FiTruck className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                            Krishi Sarthi
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                            >
                                <link.icon className="w-4 h-4" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <Link to="/profile" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                                    <FiUser className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 capitalize">
                                        {user?.role}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                                >
                                    <FiLogOut className="w-4 h-4" />
                                    <span className="font-medium">Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="btn-outline text-sm py-2">
                                    Login
                                </Link>
                                <Link to="/register" className="btn-primary text-sm py-2">
                                    Join Now
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
                    <div className="px-4 py-4 space-y-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                            >
                                <link.icon className="w-5 h-5" />
                                <span className="font-medium">{link.label}</span>
                            </Link>
                        ))}

                        {isAuthenticated ? (
                            <>
                                <div className="pt-2 border-t border-gray-100">
                                    <div className="flex items-center gap-2 px-4 py-2 text-gray-500">
                                        <FiUser className="w-4 h-4" />
                                        <span className="text-sm">{user?.name}</span>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary-100 text-primary-700 capitalize">
                                            {user?.role}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200"
                                    >
                                        <FiLogOut className="w-5 h-5" />
                                        <span className="font-medium">Logout</span>
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="pt-2 border-t border-gray-100 space-y-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center btn-outline"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsOpen(false)}
                                    className="block w-full text-center btn-primary"
                                >
                                    Join Now
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
