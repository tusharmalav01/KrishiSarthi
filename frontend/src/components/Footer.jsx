import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiTruck, FiBox } from 'react-icons/fi';

import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
    const { isAuthenticated, isFarmer } = useAuth();

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                                <FiTruck className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
                                Krishi Sarthi
                            </span>
                        </div>
                        <p className="text-gray-400 mb-4 max-w-sm">
                            Connecting farmers with equipment owners for a more efficient and productive agriculture ecosystem.
                        </p>
                        <div className="flex items-center gap-2 text-gray-400">
                            <FiBox className="w-5 h-5 text-secondary-500" />
                            <span className="text-sm">Empowering Indian Agriculture</span>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            {isAuthenticated ? (
                                <>
                                    <li>
                                        <Link
                                            to={isFarmer ? "/farmer/dashboard" : "/owner/dashboard"}
                                            className="text-gray-400 hover:text-primary-400 transition-colors"
                                        >
                                            Dashboard
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/profile" className="text-gray-400 hover:text-primary-400 transition-colors">
                                            My Profile
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link to="/login" className="text-gray-400 hover:text-primary-400 transition-colors">
                                            Login
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="text-gray-400 hover:text-primary-400 transition-colors">
                                            Register
                                        </Link>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold text-lg mb-4">Contact</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiMail className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">tusharmalav.info@gmail.com</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiPhone className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">+91 8949036569</span>
                            </li>
                            <li className="flex items-center gap-2 text-gray-400">
                                <FiMapPin className="w-4 h-4 text-primary-400" />
                                <span className="text-sm">India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center">
                    <p className="text-gray-400 text-sm">
                        © {new Date().getFullYear()} Krishi Sarthi. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
