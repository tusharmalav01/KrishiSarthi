import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { equipmentAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUpload, FiX, FiSave } from 'react-icons/fi';

const categories = [
    'Tractor',
    'Harvester',
    'Plough',
    'Seeder',
    'Sprayer',
    'Irrigation',
    'Cultivator',
    'Thresher',
    'Other'
];

const conditions = ['Excellent', 'Good', 'Fair'];

const AddEquipment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isEditing = Boolean(id);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'Tractor',
        dailyRate: '',
        pricingUnit: 'day',
        images: [],
        specifications: {
            brand: '',
            model: '',
            year: '',
            horsepower: '',
            fuelType: '',
            condition: 'Good',
        },
        location: {
            village: user?.address?.village || '',
            district: user?.address?.district || '',
            state: user?.address?.state || '',
            pincode: user?.address?.pincode || '',
        },
        isAvailable: true,
    });
    const [imageUrls, setImageUrls] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            fetchEquipment();
        }
    }, [id]);

    const fetchEquipment = async () => {
        try {
            const response = await equipmentAPI.getById(id);
            const data = response.data.data;
            setFormData({
                name: data.name,
                description: data.description,
                category: data.category,
                dailyRate: data.dailyRate,
                pricingUnit: data.pricingUnit || 'day',
                images: data.images || [],
                specifications: data.specifications || {
                    brand: '',
                    model: '',
                    year: '',
                    horsepower: '',
                    fuelType: '',
                    condition: 'Good',
                },
                location: data.location || {
                    village: '',
                    district: '',
                    state: '',
                    pincode: '',
                },
                isAvailable: data.isAvailable,
            });
            setImageUrls(data.images?.length ? data.images : ['']);
        } catch (error) {
            toast.error('Equipment not found');
            navigate('/owner/equipment');
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleImageUrlChange = (index, value) => {
        const newUrls = [...imageUrls];
        newUrls[index] = value;
        setImageUrls(newUrls);
    };

    const addImageUrl = () => {
        setImageUrls([...imageUrls, '']);
    };

    const removeImageUrl = (index) => {
        const newUrls = imageUrls.filter((_, i) => i !== index);
        setImageUrls(newUrls.length ? newUrls : ['']);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name || !formData.description || !formData.dailyRate) {
            toast.error('Please fill all required fields');
            return;
        }

        setLoading(true);
        try {
            const submitData = {
                ...formData,
                dailyRate: Number(formData.dailyRate),
                images: imageUrls.filter(url => url.trim()),
                specifications: {
                    ...formData.specifications,
                    year: formData.specifications.year ? Number(formData.specifications.year) : undefined,
                }
            };

            if (isEditing) {
                await equipmentAPI.update(id, submitData);
                toast.success('Equipment updated');
            } else {
                await equipmentAPI.create(submitData);
                toast.success('Equipment added');
            }
            navigate('/owner/equipment');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to save equipment');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-3xl mx-auto px-4 py-8">
                    <div className="animate-pulse space-y-4">
                        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                        <div className="card">
                            <div className="h-10 bg-gray-200 rounded mb-4"></div>
                            <div className="h-32 bg-gray-200 rounded mb-4"></div>
                            <div className="h-10 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <FiArrowLeft className="w-4 h-4" />
                    Back
                </button>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                    {isEditing ? 'Edit Equipment' : 'Add New Equipment'}
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <div className="card">
                        <h2 className="font-semibold text-lg text-gray-900 mb-4">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="label">Equipment Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="e.g., John Deere 5050D Tractor"
                                    required
                                />
                            </div>

                            <div>
                                <label className="label">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="input min-h-[100px]"
                                    placeholder="Describe your equipment, its features, and condition..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="label">Category *</label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Pricing Unit</label>
                                    <select
                                        name="pricingUnit"
                                        value={formData.pricingUnit}
                                        onChange={handleChange}
                                        className="input"
                                        required
                                    >
                                        <option value="day">Per Day</option>
                                        <option value="hour">Per Hour</option>
                                        <option value="acre">Per Acre</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Rate (₹) *</label>
                                    <input
                                        type="number"
                                        name="dailyRate"
                                        value={formData.dailyRate}
                                        onChange={handleChange}
                                        className="input"
                                        placeholder="1500"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="card">
                        <h2 className="font-semibold text-lg text-gray-900 mb-4">Images</h2>
                        <p className="text-sm text-gray-500 mb-4">Add image URLs for your equipment</p>

                        <div className="space-y-3">
                            {imageUrls.map((url, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => handleImageUrlChange(index, e.target.value)}
                                        className="input flex-1"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    {imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(index)}
                                            className="p-3 rounded-xl bg-red-100 text-red-600 hover:bg-red-200"
                                        >
                                            <FiX className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImageUrl}
                                className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                            >
                                <FiUpload className="w-4 h-4" />
                                Add another image
                            </button>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="card">
                        <h2 className="font-semibold text-lg text-gray-900 mb-4">Specifications (Optional)</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Brand</label>
                                <input
                                    type="text"
                                    name="specifications.brand"
                                    value={formData.specifications.brand}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="John Deere"
                                />
                            </div>
                            <div>
                                <label className="label">Model</label>
                                <input
                                    type="text"
                                    name="specifications.model"
                                    value={formData.specifications.model}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="5050D"
                                />
                            </div>
                            <div>
                                <label className="label">Year</label>
                                <input
                                    type="number"
                                    name="specifications.year"
                                    value={formData.specifications.year}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="2020"
                                />
                            </div>
                            <div>
                                <label className="label">Horsepower</label>
                                <input
                                    type="text"
                                    name="specifications.horsepower"
                                    value={formData.specifications.horsepower}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="50"
                                />
                            </div>
                            <div>
                                <label className="label">Fuel Type</label>
                                <input
                                    type="text"
                                    name="specifications.fuelType"
                                    value={formData.specifications.fuelType}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Diesel"
                                />
                            </div>
                            <div>
                                <label className="label">Condition</label>
                                <select
                                    name="specifications.condition"
                                    value={formData.specifications.condition}
                                    onChange={handleChange}
                                    className="input"
                                >
                                    {conditions.map(cond => (
                                        <option key={cond} value={cond}>{cond}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Location */}
                    <div className="card">
                        <h2 className="font-semibold text-lg text-gray-900 mb-4">Location</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="label">Village/Town</label>
                                <input
                                    type="text"
                                    name="location.village"
                                    value={formData.location.village}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="Village name"
                                />
                            </div>
                            <div>
                                <label className="label">District</label>
                                <input
                                    type="text"
                                    name="location.district"
                                    value={formData.location.district}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="District"
                                />
                            </div>
                            <div>
                                <label className="label">State</label>
                                <input
                                    type="text"
                                    name="location.state"
                                    value={formData.location.state}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="State"
                                />
                            </div>
                            <div>
                                <label className="label">Pincode</label>
                                <input
                                    type="text"
                                    name="location.pincode"
                                    value={formData.location.pincode}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="123456"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div className="card">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="font-medium text-gray-900">Available for rental</span>
                        </label>
                    </div>

                    {/* Submit */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="btn-outline flex-1"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Saving...
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <FiSave className="w-5 h-5" />
                                    {isEditing ? 'Update Equipment' : 'Add Equipment'}
                                </span>
                            )}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
};

export default AddEquipment;
