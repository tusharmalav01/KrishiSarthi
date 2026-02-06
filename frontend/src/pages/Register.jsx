import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiTruck, FiSun, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiPhone, FiMapPin } from 'react-icons/fi';
const Register = () => {
    const [searchParams] = useSearchParams();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        role: searchParams.get('role') || 'farmer',
        address: {
            village: '',
            district: '',
            state: '',
            pincode: '',
        }
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const role = searchParams.get('role');
        if (role === 'farmer' || role === 'owner') {
            setFormData(prev => ({ ...prev, role }));
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRoleSelect = (role) => {
        setFormData(prev => ({ ...prev, role }));
        setStep(2);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registrationData } = formData;
            const user = await register(registrationData);
            toast.success('Account created successfully!');

            if (user.role === 'farmer') {
                navigate('/farmer/dashboard');
            } else if (user.role === 'owner') {
                navigate('/owner/dashboard');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel - Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 lg:px-24 py-12 overflow-y-auto">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 mb-8">
                        <div className="p-2 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                            <FiTruck className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                            AgriRent
                        </span>
                    </Link>

                    {step === 1 ? (
                        <>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join AgriRent Community</h1>
                            <p className="text-gray-500 mb-8">Choose how you want to use the platform</p>

                            <div className="grid grid-cols-1 gap-4">
                                <button
                                    onClick={() => handleRoleSelect('farmer')}
                                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left ${formData.role === 'farmer'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${formData.role === 'farmer'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                                            }`}>
                                            <FiUser className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">I am a Farmer</h3>
                                            <p className="text-gray-500 mt-1">I want to rent equipment for my farm</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleRoleSelect('owner')}
                                    className={`group p-6 rounded-2xl border-2 transition-all duration-300 text-left ${formData.role === 'owner'
                                        ? 'border-primary-500 bg-primary-50'
                                        : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${formData.role === 'owner'
                                            ? 'bg-primary-500 text-white'
                                            : 'bg-gray-100 text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600'
                                            }`}>
                                            <FiTruck className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg text-gray-900">I am an Equipment Owner</h3>
                                            <p className="text-gray-500 mt-1">I want to list my equipment for rent</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setStep(1)}
                                className="text-gray-500 hover:text-gray-700 mb-4 flex items-center gap-1"
                            >
                                ← Back
                            </button>

                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {formData.role === 'farmer' ? 'Farmer Registration' : 'Equipment Owner Registration'}
                            </h1>
                            <p className="text-gray-500 mb-8">Fill in your details to create an account</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="label">Full Name</label>
                                    <div className="relative">
                                        <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="input pl-12"
                                            placeholder="Enter your full name"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Email Address</label>
                                    <div className="relative">
                                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="input pl-12"
                                            placeholder="Enter your email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="label">Phone Number</label>
                                    <div className="relative">
                                        <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="input pl-12"
                                            placeholder="Enter your phone number"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="label">Password</label>
                                        <div className="relative">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="input pl-12"
                                                placeholder="Password"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">Confirm Password</label>
                                        <div className="relative">
                                            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="input pl-12"
                                                placeholder="Confirm"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="showPassword"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    <label htmlFor="showPassword" className="text-sm text-gray-500">Show password</label>
                                </div>

                                {/* Address Section */}
                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-2 mb-4">
                                        <FiMapPin className="w-5 h-5 text-primary-500" />
                                        <span className="font-medium text-gray-700">Address (Optional)</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input
                                                type="text"
                                                name="address.village"
                                                value={formData.address.village}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Village/Town"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="address.district"
                                                value={formData.address.district}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="District"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="address.state"
                                                value={formData.address.state}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="State"
                                            />
                                        </div>
                                        <div>
                                            <input
                                                type="text"
                                                name="address.pincode"
                                                value={formData.address.pincode}
                                                onChange={handleChange}
                                                className="input"
                                                placeholder="Pincode"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Creating account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center gap-2">
                                            Create Account
                                            <FiArrowRight className="w-5 h-5" />
                                        </span>
                                    )}
                                </button>
                            </form>
                        </>
                    )}

                    <p className="mt-8 text-center text-gray-500">
                        Already have an account? Login{' '}
                        <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700">
                            Login
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right Panel - Illustration */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 items-center justify-center p-12">
                <div className="max-w-lg text-center text-white">
                    <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-white/10 flex items-center justify-center">
                        {formData.role === 'farmer' ? (
                            <FiUser className="w-16 h-16" />
                        ) : (
                            <FiTruck className="w-16 h-16" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                        {formData.role === 'farmer'
                            ? 'Find Equipment Near You'
                            : 'Start Earning from Your Equipment'
                        }
                    </h2>
                    <p className="text-primary-100 text-lg">
                        {formData.role === 'farmer'
                            ? 'Browse through hundreds of agricultural equipment available for rent in your area.'
                            : 'List your farming equipment and earn money when others rent it.'
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
