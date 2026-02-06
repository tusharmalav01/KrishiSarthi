import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { equipmentAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { FiTruck } from 'react-icons/fi';
// import { GiTractor } from 'react-icons/gi';

const MyEquipment = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await equipmentAPI.getMyListings();
            setEquipment(response.data.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
            toast.error('Failed to load equipment');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAvailability = async (id, currentStatus) => {
        try {
            await equipmentAPI.update(id, { isAvailable: !currentStatus });
            toast.success(`Equipment ${!currentStatus ? 'enabled' : 'disabled'}`);
            fetchEquipment();
        } catch (error) {
            toast.error('Failed to update availability');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) return;

        try {
            await equipmentAPI.delete(id);
            toast.success('Equipment deleted');
            fetchEquipment();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete equipment');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Equipment</h1>
                        <p className="text-gray-500 mt-1">Manage your listed equipment</p>
                    </div>
                    <Link to="/owner/equipment/add" className="btn-primary">
                        <FiPlus className="w-5 h-5" />
                        Add New
                    </Link>
                </div>

                {/* Equipment List */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : equipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {equipment.map((item) => (
                            <div key={item._id} className="card group">
                                {/* Image */}
                                <div className="relative h-40 rounded-xl overflow-hidden bg-primary-100 mb-4">
                                    {item.images?.[0] ? (
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <FiTruck className="w-12 h-12 text-gray-300" />
                                        </div>
                                    )}

                                    {/* Category Badge */}
                                    <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 rounded-lg text-xs font-medium text-primary-700">
                                        {item.category}
                                    </div>

                                    {/* Status Badge */}
                                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-medium ${item.isAvailable ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                                        }`}>
                                        {item.isAvailable ? 'Available' : 'Unavailable'}
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">{item.name}</h3>
                                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{item.description}</p>

                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-2xl font-bold text-primary-600">₹{item.dailyRate}</span>
                                    <span className="text-gray-400">/{item.pricingUnit || 'day'}</span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                                    <button
                                        onClick={() => handleToggleAvailability(item._id, item.isAvailable)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-medium transition-colors ${item.isAvailable
                                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                                            }`}
                                    >
                                        {item.isAvailable ? (
                                            <>
                                                <FiToggleRight className="w-4 h-4" />
                                                Disable
                                            </>
                                        ) : (
                                            <>
                                                <FiToggleLeft className="w-4 h-4" />
                                                Enable
                                            </>
                                        )}
                                    </button>
                                    <Link
                                        to={`/owner/equipment/edit/${item._id}`}
                                        className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                                    >
                                        <FiEdit2 className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    >
                                        <FiTrash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FiTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">No equipment listed yet</h3>
                        <p className="text-gray-500 mb-4">Start earning by listing your agricultural equipment</p>
                        <Link to="/owner/equipment/add" className="btn-primary inline-flex items-center gap-2">
                            <FiPlus className="w-5 h-5" />
                            Add Equipment
                        </Link>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default MyEquipment;
