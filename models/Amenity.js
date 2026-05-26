const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add an amenity name'],
    unique: true,
    trim: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Room', 'Hotel', 'Both'],
    default: 'Both'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Amenity', AmenitySchema);
