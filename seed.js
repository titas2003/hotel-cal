const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const Invoice = require('./models/Invoice');
const Maintenance = require('./models/Maintenance');
const Amenity = require('./models/Amenity');
const Inventory = require('./models/Inventory');
const Transport = require('./models/Transport');
const Deployment = require('./models/Deployment');

dotenv.config();

const seedData = async () => {
  try {
    // Connect to DB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('MongoDB Connected for Seeding...');

    // Clear old data
    await User.deleteMany();
    await Hotel.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    await Invoice.deleteMany();
    await Maintenance.deleteMany();
    await Amenity.deleteMany();
    await Inventory.deleteMany();
    await Transport.deleteMany();
    await Deployment.deleteMany();
    console.log('Cleared all collections.');

    // Seed Global Amenities
    const amenities = await Amenity.create([
      { name: 'High-speed Wi-Fi', description: 'Up to 500Mbps', category: 'Both' },
      { name: 'Indoor Jacuzzi', description: 'Private jacuzzi tub', category: 'Room' },
      { name: 'Valet Parking', description: '24/7 valet desk', category: 'Hotel' },
      { name: 'Mini Bar', description: 'Premium beverages and snacks', category: 'Room' },
      { name: 'Infinity Pool', description: 'Heated outdoor pool', category: 'Hotel' },
      { name: 'Spa Access', description: 'Sauna and massage parlor access', category: 'Hotel' }
    ]);
    console.log('Amenities seeded.');

    // Seed Users
    const users = await User.create([
      {
        name: 'Super Admin',
        email: 'admin@hotelcal.com',
        password: 'password123',
        role: 'Admin',
        phone: '1234567890',
        salary: 120000
      },
      {
        name: 'Staff Member John',
        email: 'staff@hotelcal.com',
        password: 'password123',
        role: 'Staff',
        phone: '9876543210',
        salary: 45000
      },
      {
        name: 'John Doe Guest',
        email: 'guest@hotelcal.com',
        password: 'password123',
        role: 'Customer',
        phone: '5551234567'
      }
    ]);
    console.log('Users seeded.');

    // Seed Hotel
    const hotel = await Hotel.create({
      name: 'Hotel California Beverly Hills',
      address: 'Sunset Boulevard, Beverly Hills',
      city: 'Los Angeles',
      phone: '1-800-CALIFORNIA',
      email: 'stay@hotelcalifornia.com',
      description: 'You can check-out any time you like, but you can never leave.',
      stars: 5,
      amenities: [amenities[2]._id, amenities[4]._id, amenities[5]._id] // Valet, Pool, Spa
    });
    console.log('Hotel seeded.');

    // Seed Rooms with linked Amenities
    const rooms = await Room.create([
      {
        hotel: hotel._id,
        roomNumber: '101',
        type: 'Standard',
        pricePerNight: 120,
        capacity: 2,
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1611891487122-2075b9624428?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop&q=60'
        ],
        amenities: [amenities[0]._id] // Wi-Fi
      },
      {
        hotel: hotel._id,
        roomNumber: '202',
        type: 'Deluxe',
        pricePerNight: 250,
        capacity: 3,
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop&q=60'
        ],
        amenities: [amenities[0]._id, amenities[3]._id] // Wi-Fi, Mini Bar
      },
      {
        hotel: hotel._id,
        roomNumber: '303',
        type: 'Suite',
        pricePerNight: 500,
        capacity: 4,
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop&q=60',
          'https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&auto=format&fit=crop&q=60'
        ],
        amenities: [amenities[0]._id, amenities[1]._id, amenities[3]._id] // Wi-Fi, Jacuzzi, Mini Bar
      }
    ]);
    console.log('Rooms seeded.');

    // Seed Materials & Inventory Supplies
    await Inventory.create([
      {
        name: 'Organic Lavendar Toiletries Kit',
        category: 'Toiletries',
        quantity: 120,
        unit: 'kits',
        safetyStockLevel: 25,
        unitCost: 3.50,
        supplier: { name: 'Eco Bath Corp', contact: '555-0192', email: 'orders@ecobath.com' }
      },
      {
        name: 'Egyptian Cotton Sheets (Queen)',
        category: 'Linen',
        quantity: 45,
        unit: 'sheets',
        safetyStockLevel: 15,
        unitCost: 15.00,
        supplier: { name: 'Luxe Linens Ltd', contact: '555-0144', email: 'sales@luxelinens.com' }
      },
      {
        name: 'Universal Cleaning Detergent (5L)',
        category: 'Cleaning',
        quantity: 8,
        unit: 'bottles',
        safetyStockLevel: 10, // Under stock level alert
        unitCost: 12.50,
        supplier: { name: 'Apex Supplies', contact: '555-0188', email: 'apex@apex.com' }
      }
    ]);
    console.log('Inventory supplies seeded.');

    // Seed Vehicles Fleet (Transport)
    await Transport.create([
      {
        vehicleName: 'Beverly Shuttle Bus',
        plateNumber: 'CAL101BUS',
        vehicleType: 'Shuttle Bus',
        offeredTo: 'Both',
        driverName: 'Robert Carter',
        driverPhone: '555-4433',
        status: 'Available',
        pricePerTrip: 0 // Free shuttle
      },
      {
        vehicleName: 'Luxury Guest Limo',
        plateNumber: 'VIPCAL777',
        vehicleType: 'Luxury Limo',
        offeredTo: 'Customers',
        driverName: 'Michael Sterling',
        driverPhone: '555-8899',
        status: 'Available',
        pricePerTrip: 75.00
      }
    ]);
    console.log('Fleet Transport seeded.');

    // Seed Deployments
    await Deployment.create({
      staff: users[1]._id, // Staff Member John
      hotel: hotel._id,
      department: 'Front Desk',
      shift: 'Morning',
      status: 'Active',
      notes: 'Responsible for general guest greeting, luggage coordinates, and check-in cycles.'
    });
    console.log('Staff deployments seeded.');

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error: ', error);
    process.exit(1);
  }
};

seedData();
