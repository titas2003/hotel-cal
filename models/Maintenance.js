const mongoose = require('mongoose');

const MaintenanceSchema = new mongoose.Schema({
  room: {
    type: mongoose.Schema.ObjectId,
    ref: 'Room',
    required: true
  },
  assignedStaff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // User role must be Staff/Admin
    required: true
  },
  taskType: {
    type: String,
    enum: ['Cleaning', 'Repair', 'Routine Check'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed'],
    default: 'Pending'
  },
  cost: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date
});

module.exports = mongoose.model('Maintenance', MaintenanceSchema);
