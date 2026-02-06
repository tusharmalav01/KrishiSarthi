import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { equipmentAPI } from '../../services/api';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import EquipmentCard from '../../components/EquipmentCard';
import {
    FiSearch,
    FiFilter,
    FiX,
    FiTruck,
    FiBox,
    FiWind,
    FiDroplet,
    FiCloudRain
} from 'react-icons/fi';
// import { GiTractor, GiCombinHarvester, GiHighGrass, GiSpray, GiWateringCan } from 'react-icons/gi';

const categories = [
    { id: 'Tractors', icon: FiTruck, name: 'Tractors' },
    { id: 'Harvesters', icon: FiBox, name: 'Harvesters' },
    { id: 'Cultivators', icon: FiWind, name: 'Cultivators' },
    { id: 'Sprayers', icon: FiDroplet, name: 'Sprayers' },
    { id: 'Irrigation', icon: FiCloudRain, name: 'Irrigation' },
];

const BrowseEquipment = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || 'All',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        district: searchParams.get('district') || '',
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async (currentFilters = filters) => {
        setLoading(true);
        try {
            const params = {
                available: 'true',
            };

            if (currentFilters.search) params.search = currentFilters.search;
            if (currentFilters.category && currentFilters.category !== 'All') params.category = currentFilters.category;
            if (currentFilters.minPrice) params.minPrice = currentFilters.minPrice;
            if (currentFilters.maxPrice) params.maxPrice = currentFilters.maxPrice;
            if (currentFilters.district) params.district = currentFilters.district;

            const response = await equipmentAPI.getAll(params);
            setEquipment(response.data.data);
        } catch (error) {
            console.error('Error fetching equipment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        const newFilters = { ...filters };
        fetchEquipment(newFilters);

        // Update URL params
        const params = new URLSearchParams();
        Object.entries(newFilters).forEach(([key, value]) => {
            if (value && value !== 'All') params.set(key, value);
        });
        setSearchParams(params);
    };

    const handleCategorySelect = (category) => {
        const newFilters = { ...filters, category };
        setFilters(newFilters);
        fetchEquipment(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            category: 'All',
            minPrice: '',
            maxPrice: '',
            district: '',
        };
        setFilters(clearedFilters);
        setSearchParams({});
        fetchEquipment(clearedFilters);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Browse Equipment</h1>
                    <p className="text-gray-500 mt-1">Find the perfect equipment for your farming needs</p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-6">
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                value={filters.search}
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                                className="input pl-12"
                                placeholder="Search equipment..."
                            />
                        </div>
                        <button type="submit" className="btn-primary">
                            Search
                        </button>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="btn-outline px-4"
                        >
                            <FiFilter className="w-5 h-5" />
                        </button>
                    </div>
                </form>

                {/* Advanced Filters */}
                {showFilters && (
                    <div className="card mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-semibold text-gray-900">Filters</h3>
                            <button onClick={clearFilters} className="text-sm text-primary-600 hover:text-primary-700">
                                Clear all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="label">Min Price (₹/day)</label>
                                <input
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    className="input"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="label">Max Price (₹/day)</label>
                                <input
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    className="input"
                                    placeholder="10000"
                                />
                            </div>
                            <div>
                                <label className="label">District</label>
                                <input
                                    type="text"
                                    value={filters.district}
                                    onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                    className="input"
                                    placeholder="Enter district"
                                />
                            </div>
                        </div>
                        <button onClick={handleSearch} className="btn-primary mt-4">
                            Apply Filters
                        </button>
                    </div>
                )}

                {/* Category Tabs */}
                <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4">
                    <div className="flex gap-2 min-w-max">
                        {categories.map((cat) => {
                            const isActive = filters.category === cat.name;
                            return (
                                <button
                                    key={cat.name}
                                    onClick={() => handleCategorySelect(cat.name)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${isActive
                                        ? 'bg-primary-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-primary-50 hover:text-primary-600 border border-gray-200'
                                        }`}
                                >
                                    <cat.icon className="w-5 h-5" />
                                    <span>{cat.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4 flex items-center justify-between">
                    <p className="text-gray-500">
                        {loading ? 'Loading...' : `${equipment.length} equipment found`}
                    </p>
                    {(filters.search || filters.category !== 'All' || filters.minPrice || filters.maxPrice || filters.district) && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                        >
                            <FiX className="w-4 h-4" />
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Equipment Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card animate-pulse">
                                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : equipment.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {equipment.map((item) => (
                            <EquipmentCard key={item._id} equipment={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FiTruck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">{filters.search ? 'No equipment found' : 'No equipment available'}</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                        <button onClick={clearFilters} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default BrowseEquipment;
