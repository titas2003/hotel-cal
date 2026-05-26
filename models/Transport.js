const mongoose = require('mongoose');

const TransportSchema = new mongoose.Schema({
  vehicleName: {
    type: String,
    required: [true, 'Please add a vehicle name/identifier'],
    trim: true
  },
  plateNumber: {
    type: String,
    required: [true, 'Please add license plate number'],
    unique: true,
    uppercase: true,
    trim: true
  },
  vehicleType: {
    type: String,
    enum: ['Sedan', 'SUV', 'Shuttle Bus', 'Luxury Limo', 'Van'],
    required: true
  },
  offeredTo: {
    type: String,
    enum: ['Customers', 'Staffs', 'Both'],
    default: 'Both'
  },
  driverName: {
    type: String,
    required: [true, 'Please specify assigned driver name']
  },
  driverPhone: String,
  status: {
    type: String,
    enum: ['Available', 'In Transit', 'Under Maintenance'],
    default: 'Available'
  },
  pricePerTrip: {
    type: Number,
    default: 0 // Free or priced
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Transport', TransportSchema);
