import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    FiArrowRight,
    FiCheckCircle,
    FiShield,
    FiClock,
    FiMapPin,
    FiTruck,
    FiBox,
    FiWind,
    FiDroplet,
    FiCloudRain,
} from 'react-icons/fi';
import { FaRupeeSign } from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Home = () => {
    const { isAuthenticated, isFarmer, isOwner } = useAuth();

    const categories = [
        { icon: FiTruck, name: 'Tractors', count: '50+' },
        { icon: FiBox, name: 'Harvesters', count: '30+' },
        { icon: FiWind, name: 'Cultivators', count: '40+' },
        { icon: FiDroplet, name: 'Sprayers', count: '25+' },
        { icon: FiCloudRain, name: 'Irrigation', count: '35+' },
    ];

    const features = [
        {
            icon: FiCheckCircle,
            title: 'Easy Booking',
            description: 'Book equipment in just a few clicks with our simple and intuitive interface.'
        },
        {
            icon: FiShield,
            title: 'Verified Owners',
            description: 'All equipment owners are verified for your safety and peace of mind.'
        },
        {
            icon: FiClock,
            title: 'Flexible Rentals',
            description: 'Rent for a day, a week, or longer. You choose the duration that works for you.'
        },
        {
            icon: FiMapPin,
            title: 'Local Equipment',
            description: 'Find equipment near you to save on transportation costs.'
        },
        {
            icon: FaRupeeSign,
            title: 'Transparent Pricing',
            description: 'Clear daily rates in ₹ with no hidden charges. Pay only for what you use.'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yIDItNCAyLTRzMiAyIDIgNC0yIDQtMiA0LTItMi0yLTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] bg-repeat"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Rent Agricultural Equipment
                            <span className="block text-secondary-300">Made Simple</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-100 mb-10">
                            Connect with local equipment owners and rent the farming machinery you need. Save money, increase productivity, and grow better.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {isAuthenticated ? (
                                <Link
                                    to={isFarmer ? '/farmer/dashboard' : '/owner/dashboard'}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
                                >
                                    Go to Dashboard
                                    <FiArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        to="/register?role=farmer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-primary-700 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
                                    >
                                        I'm a Farmer
                                        <FiArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link
                                        to="/register?role=owner"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 text-lg font-semibold text-white bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-all duration-200 border-2 border-white/50"
                                    >
                                        I Own Equipment
                                        <FiArrowRight className="w-5 h-5" />
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Wave */}
                <div className="absolute bottom-0 left-0 right-0">
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#f9fafb" />
                    </svg>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Browse by Category
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Find the right equipment for your farming needs from our wide range of categories.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((category, index) => (
                            <Link
                                key={index}
                                to={isAuthenticated ? `/farmer/browse?category=${category.name}` : '/login'}
                                className="group p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary-200 text-center"
                            >
                                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <category.icon className="w-8 h-8 text-primary-600" />
                                </div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">{category.count} available</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Why Choose AgriRent?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            We make agricultural equipment rental easy, safe, and affordable for everyone.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white mb-4">
                                    <feature.icon className="w-6 h-6" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 lg:py-24 bg-gradient-to-br from-secondary-500 to-secondary-600">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        Ready to Get Started?
                    </h2>
                    <p className="text-lg text-secondary-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of farmers and equipment owners who are already using AgriRent to grow their business.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-secondary-700 bg-white rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
                    >
                        Create Free Account
                        <FiArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default Home;
