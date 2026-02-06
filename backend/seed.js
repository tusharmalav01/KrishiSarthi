const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

// Models
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Booking = require('./models/Booking');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Clear existing data
        await User.deleteMany({});
        await Equipment.deleteMany({});
        await Booking.deleteMany({});
        console.log('Cleared existing data...');

        // Create users
        const users = await User.create([
            {
                name: 'Rajesh Kumar',
                email: 'farmer@demo.com',
                password: 'password123',
                phone: '9876543210',
                role: 'farmer',
                address: {
                    village: 'Rampur',
                    district: 'Bhopal',
                    state: 'Madhya Pradesh',
                    pincode: '462001'
                }
            },
            {
                name: 'Suresh Patel',
                email: 'owner@demo.com',
                password: 'password123',
                phone: '9876543211',
                role: 'owner',
                address: {
                    village: 'Khandwa',
                    district: 'Khandwa',
                    state: 'Madhya Pradesh',
                    pincode: '450001'
                }
            },
            {
                name: 'Amit Singh',
                email: 'owner2@demo.com',
                password: 'password123',
                phone: '9876543212',
                role: 'owner',
                address: {
                    village: 'Indore',
                    district: 'Indore',
                    state: 'Madhya Pradesh',
                    pincode: '452001'
                }
            }
        ]);

        console.log('Created users...');
        const owner1 = users[1];
        const owner2 = users[2];

        // Create equipment
        const equipment = await Equipment.create([
            {
                name: 'John Deere 5050D Tractor',
                description: 'Powerful 50 HP tractor perfect for medium to large farms. Features power steering, oil-immersed brakes, and excellent fuel efficiency. Well maintained and regularly serviced.',
                category: 'Tractor',
                images: ['https://images.unsplash.com/photo-1605002711128-2e36e9adab37?w=800'],
                dailyRate: 2500,
                owner: owner1._id,
                specifications: {
                    brand: 'John Deere',
                    model: '5050D',
                    year: 2021,
                    horsepower: '50',
                    fuelType: 'Diesel',
                    condition: 'Excellent'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'Mahindra 575 DI XP Plus',
                description: 'Reliable 45 HP tractor with adjustable clearance. Ideal for wet lands and paddy fields. Comes with all standard accessories.',
                category: 'Tractor',
                images: ['https://images.unsplash.com/photo-1592878904946-b3cd8ae243d0?w=800'],
                dailyRate: 2000,
                owner: owner1._id,
                specifications: {
                    brand: 'Mahindra',
                    model: '575 DI XP Plus',
                    year: 2020,
                    horsepower: '45',
                    fuelType: 'Diesel',
                    condition: 'Good'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'New Holland 3630 TX Plus',
                description: 'Premium 55 HP tractor with superior hydraulics and transmission. Best suited for multiple farming operations.',
                category: 'Tractor',
                images: ['https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800'],
                dailyRate: 2800,
                owner: owner2._id,
                specifications: {
                    brand: 'New Holland',
                    model: '3630 TX Plus',
                    year: 2022,
                    horsepower: '55',
                    fuelType: 'Diesel',
                    condition: 'Excellent'
                },
                location: owner2.address,
                isAvailable: true
            },
            {
                name: 'Combine Harvester - Class Lexion',
                description: 'High-performance combine harvester for wheat, rice, and other grain crops. Features advanced threshing technology and large grain tank.',
                category: 'Harvester',
                images: ['https://images.unsplash.com/photo-1499529112087-3cb3b73cec95?w=800'],
                dailyRate: 8000,
                owner: owner1._id,
                specifications: {
                    brand: 'Class',
                    model: 'Lexion 760',
                    year: 2019,
                    horsepower: '402',
                    fuelType: 'Diesel',
                    condition: 'Good'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'Rotavator (Tractor Mounted)',
                description: 'Heavy-duty rotavator for soil preparation. 7 feet working width with hardened blades for tough soil conditions.',
                category: 'Cultivator',
                images: ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800'],
                dailyRate: 800,
                owner: owner1._id,
                specifications: {
                    brand: 'Shaktiman',
                    model: 'RCR-200',
                    year: 2021,
                    condition: 'Excellent'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'Seed Drill Machine',
                description: '11 row seed drill for precision sowing. Adjustable row spacing and seed rate control. Compatible with most tractors above 35 HP.',
                category: 'Seeder',
                images: ['https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800'],
                dailyRate: 600,
                owner: owner2._id,
                specifications: {
                    brand: 'Dasmesh',
                    model: 'SD-11',
                    year: 2020,
                    condition: 'Good'
                },
                location: owner2.address,
                isAvailable: true
            },
            {
                name: 'Boom Sprayer - 500L Tank',
                description: 'Tractor mounted boom sprayer with 500 liter tank capacity. 12 meter boom width with pressure regulator and nozzle controls.',
                category: 'Sprayer',
                images: ['https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800'],
                dailyRate: 500,
                owner: owner1._id,
                specifications: {
                    brand: 'Aspee',
                    model: 'Boom 500',
                    year: 2021,
                    condition: 'Excellent'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'MB Plough - 3 Bottom',
                description: 'Heavy-duty 3 bottom mould board plough for deep tillage. Ideal for black cotton soil and heavy clay.',
                category: 'Plough',
                images: ['https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800'],
                dailyRate: 400,
                owner: owner2._id,
                specifications: {
                    brand: 'Lemken',
                    model: 'Opal 110',
                    year: 2020,
                    condition: 'Good'
                },
                location: owner2.address,
                isAvailable: true
            },
            {
                name: 'Drip Irrigation System - 1 Acre',
                description: 'Complete drip irrigation kit for 1 acre. Includes main line, sub main, laterals, drippers, and all fittings. Easy installation.',
                category: 'Irrigation',
                images: ['https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800'],
                dailyRate: 300,
                owner: owner1._id,
                specifications: {
                    brand: 'Jain Irrigation',
                    model: 'Complete Kit',
                    year: 2022,
                    condition: 'Excellent'
                },
                location: owner1.address,
                isAvailable: true
            },
            {
                name: 'Paddy Thresher',
                description: 'High capacity paddy thresher with 1 ton per hour output. Efficient grain separation with minimal losses.',
                category: 'Thresher',
                images: ['https://images.unsplash.com/photo-1595841696677-6489ff18f629?w=800'],
                dailyRate: 1200,
                owner: owner2._id,
                specifications: {
                    brand: 'Rajkumar',
                    model: 'Multi Crop',
                    year: 2021,
                    horsepower: '35',
                    fuelType: 'Electric/Diesel',
                    condition: 'Good'
                },
                location: owner2.address,
                isAvailable: true
            }
        ]);

        console.log(`Created ${equipment.length} equipment listings...`);
        console.log('\n✅ Database seeded successfully!\n');
        console.log('Demo Accounts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👨‍🌾 Farmer: farmer@demo.com / password123');
        console.log('🚜 Owner:  owner@demo.com / password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedData();
