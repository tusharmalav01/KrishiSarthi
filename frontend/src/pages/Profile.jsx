import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { FiUser, FiMail, FiPhone, FiMapPin, FiShield } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';


const Profile = () => {
    const { user, updateUser, isFarmer } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        village: '',
        district: '',
        state: '',
        pincode: ''
    });

    const handleEditClick = () => {
        setFormData({
            name: user.name || '',
            phone: user.phone || '',
            village: user.address?.village || '',
            district: user.address?.district || '',
            state: user.address?.state || '',
            pincode: user.address?.pincode || ''
        });
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            const updatedData = {
                name: formData.name,
                phone: formData.phone,
                address: {
                    village: formData.village,
                    district: formData.district,
                    state: formData.state,
                    pincode: formData.pincode
                }
            };

            const response = await authAPI.updateProfile(updatedData);
            updateUser(response.data.user);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update profile', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Please login to view your profile</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header Background */}
                    <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-500"></div>

                    <div className="px-8 pb-8">
                        {/* Avatar & Role */}
                        <div className="relative flex justify-between items-end -mt-12 mb-8">
                            <div className="flex items-end gap-6">
                                <div className="p-1 bg-white rounded-full">
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-4 border-white shadow-sm text-gray-400">
                                        <FiUser className="w-12 h-12" />
                                    </div>
                                </div>
                                <div className="mb-2">
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="text-2xl font-bold text-gray-900 border-b-2 border-primary-500 focus:outline-none bg-transparent"
                                        />
                                    ) : (
                                        <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                                    )}
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${isFarmer ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role}
                                        </span>
                                        <span className="text-gray-500 text-sm flex items-center gap-1">
                                            <FiShield className="w-4 h-4" />
                                            Verified Account
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditClick}
                                        className="btn-outline bg-white"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Contact Info */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary-600">
                                            <FiMail className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Email Address</p>
                                            <p className="font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 text-gray-600">
                                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary-600">
                                            <FiPhone className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Phone Number</p>
                                            {isEditing ? (
                                                <input
                                                    type="tel"
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                    className="w-full font-medium text-gray-900 border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                                                    placeholder="Enter phone number"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900">{user.phone || 'Not provided'}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address/Location */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Location Details</h3>

                                <div className="flex items-start gap-3 text-gray-600">
                                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-primary-600 shrink-0">
                                        <FiMapPin className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-500 mb-1">Address</p>
                                        {isEditing ? (
                                            <div className="grid grid-cols-2 gap-3">
                                                <input
                                                    type="text"
                                                    value={formData.village}
                                                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                                                    className="input text-sm p-2"
                                                    placeholder="Village"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.district}
                                                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                                                    className="input text-sm p-2"
                                                    placeholder="District"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.state}
                                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                    className="input text-sm p-2"
                                                    placeholder="State"
                                                />
                                                <input
                                                    type="text"
                                                    value={formData.pincode}
                                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                                    className="input text-sm p-2"
                                                    placeholder="Pincode"
                                                />
                                            </div>
                                        ) : (
                                            user.address ? (
                                                <div className="font-medium text-gray-900">
                                                    <p>{user.address.village}, {user.address.district}</p>
                                                    <p>{user.address.state} - {user.address.pincode}</p>
                                                </div>
                                            ) : (
                                                <p className="font-medium text-gray-900">No address details available</p>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Profile;
