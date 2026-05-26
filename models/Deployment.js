const mongoose = require('mongoose');

const DeploymentSchema = new mongoose.Schema({
  staff: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hotel',
    required: true
  },
  department: {
    type: String,
    enum: ['Front Desk', 'Housekeeping', 'Kitchen', 'Security', 'Management', 'Valet & Transport'],
    required: true
  },
  shift: {
    type: String,
    enum: ['Morning', 'Evening', 'Night'],
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Completed'],
    default: 'Active'
  },
  deployedAt: {
    type: Date,
    default: Date.now
  },
  notes: String
});

module.exports = mongoose.model('Deployment', DeploymentSchema);
