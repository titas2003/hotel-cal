const Inventory = require('../models/Inventory');

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private (Staff/Admin)
exports.getInventory = async (req, res, next) => {
  try {
    let query = {};

    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }

    // Filter for low stock warning level alerts
    if (req.query.alert === 'true') {
      query = {
        ...query,
        $expr: { $lte: ['$quantity', '$safetyStockLevel'] }
      };
    }

    const items = await Inventory.find(query);
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new inventory supply record
// @route   POST /api/inventory
// @access  Private (Staff/Admin)
exports.createInventory = async (req, res, next) => {
  try {
    const item = await Inventory.create(req.body);
    res.status(201).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update stock / pricing details
// @route   PUT /api/inventory/:id
// @access  Private (Staff/Admin)
exports.updateInventory = async (req, res, next) => {
  try {
    let item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item = await Inventory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory record
// @route   DELETE /api/inventory/:id
// @access  Private (Admin)
exports.deleteInventory = async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
