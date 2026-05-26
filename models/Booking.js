const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  checkInDate: {
    type: Date,
    required: [true, 'Please add a check-in date']
  },
  checkOutDate: {
    type: Date,
    required: [true, 'Please add a check-out date']
  },
  totalAmount: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['Pending', 'Confirmed', 'CheckedIn', 'CheckedOut', 'Cancelled'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
