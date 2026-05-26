const mongoose = require('mongoose');

const HotelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a hotel name'],
    unique: true,
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please add an address']
  },
  city: {
    type: String,
    required: [true, 'Please add a city']
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },
  email: {
    type: String,
    required: [true, 'Please add an email']
  },
  description: String,
  amenities: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Amenity'
    }
  ],
  stars: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hotel', HotelSchema);
