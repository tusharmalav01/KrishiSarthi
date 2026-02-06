import { Link } from 'react-router-dom';
import { FiMapPin, FiStar, FiClock } from 'react-icons/fi';
import {
    FiTruck,
    FiBox,
    FiWind,
    FiDroplet,
    FiCloudRain
} from 'react-icons/fi';

const categoryIcons = {
    Tractor: FiTruck, 
    Harvester: FiBox, 
    Plough: FiWind, 
    Seeder: FiWind, 
    Sprayer: FiDroplet,
    Irrigation: FiCloudRain,
    Cultivator: FiWind, 
    Thresher: FiBox, 
    Other: FiTruck, 
};

const EquipmentCard = ({ equipment }) => {
    const IconComponent = categoryIcons[equipment.category] || FiTruck; // Default to FiTruck

    return (
        <Link
            to={`/equipment/${equipment._id}`}
            className="group block bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-primary-200"
        >
            {/* Image */}
            <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-50 overflow-hidden">
                {equipment.images && equipment.images.length > 0 ? (
                    <img
                        src={equipment.images[0]}
                        alt={equipment.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100 group-hover:scale-110 transition-transform duration-500">
                        <FiTruck className="w-16 h-16 text-gray-300" />
                    </div>
                )}

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
                    <span className="text-xs font-semibold text-primary-700">{equipment.category}</span>
                </div>

                {/* Availability */}
                {equipment.isAvailable ? (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-green-500 text-white rounded-full shadow-md">
                        <span className="text-xs font-semibold">Available</span>
                    </div>
                ) : (
                    <div className="absolute top-3 right-3 px-3 py-1 bg-gray-500 text-white rounded-full shadow-md">
                        <span className="text-xs font-semibold">Unavailable</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-5">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                    {equipment.name}
                </h3>

                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {equipment.description}
                </p>

                {/* Location */}
                {equipment.location && (
                    <div className="mt-3 flex items-center gap-1 text-gray-400">
                        <FiMapPin className="w-3.5 h-3.5" />
                        <span className="text-xs">
                            {equipment.location.district}, {equipment.location.state}
                        </span>
                    </div>
                )}

                {/* Specs */}
                <div className="mt-3 flex flex-wrap gap-2">
                    {equipment.specifications?.brand && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                            {equipment.specifications.brand}
                        </span>
                    )}
                    {equipment.specifications?.horsepower && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                            {equipment.specifications.horsepower} HP
                        </span>
                    )}
                    {equipment.specifications?.condition && (
                        <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600">
                            {equipment.specifications.condition}
                        </span>
                    )}
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div>
                        <span className="text-2xl font-bold text-primary-600">₹{equipment.dailyRate}</span>
                        <span className="text-sm text-gray-400">/{equipment.pricingUnit || 'day'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-secondary-500">
                        <FiClock className="w-4 h-4" />
                        <span className="text-xs font-medium">Book Now</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default EquipmentCard;
