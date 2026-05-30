const mongoose = require('mongoose');

const RoomSchema = new mongoose.Schema({
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number']
  },
  type: {
    type: String,
    required: [true, 'Please select a room type'],
    enum: ['Standard', 'Deluxe', 'Suite', 'Penthouse']
  },
  pricePerNight: {
    type: Number,
    required: [true, 'Please add a room price']
  },
  capacity: {
    type: Number,
    required: [true, 'Please add occupancy capacity']
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Under Maintenance'],
    default: 'Available'
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v && v.length >= 1;
      },
      message: 'A room must have at least 1 image.'
    },
    required: [true, 'Please add at least 1 room image']
  },
  maintenanceReason: {
    type: String,
    default: ''
  },
  maintenanceStart: {
    type: Date
  },
  maintenanceEnd: {
    type: Date
  },
  amenities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Amenity'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Enforce unique room numbers per hotel
RoomSchema.index({ hotel: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model('Room', RoomSchema);
