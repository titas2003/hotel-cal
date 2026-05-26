const mongoose = require('mongoose');

const InventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add inventory item name'],
    unique: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Cleaning', 'Linen', 'Toiletries', 'F&B', 'Maintenance Supplies', 'Stationery', 'Other'],
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please specify inventory quantity'],
    min: 0,
    default: 0
  },
  unit: {
    type: String,
    required: [true, 'Please specify unit of measure (e.g. bottles, packs, pieces)'],
    default: 'pieces'
  },
  safetyStockLevel: {
    type: Number,
    required: [true, 'Please specify alert quantity threshold'],
    default: 10
  },
  unitCost: {
    type: Number,
    required: true
  },
  supplier: {
    name: String,
    contact: String,
    email: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update standard updatedAt field on saves
InventorySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Inventory', InventorySchema);
