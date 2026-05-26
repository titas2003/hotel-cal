const mongoose = require('mongoose');

const InvoiceSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.ObjectId,
    ref: 'Booking',
    required: true
  },
  guest: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  roomCharges: {
    type: Number,
    required: true
  },
  additionalCharges: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    required: true
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['Unpaid', 'Paid'],
    default: 'Unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['Card', 'Cash', 'UPI', 'Pending'],
    default: 'Pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  paidAt: Date
});

module.exports = mongoose.model('Invoice', InvoiceSchema);
