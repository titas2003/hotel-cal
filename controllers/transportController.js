const Transport = require('../models/Transport');

// @desc    Get all vehicles in fleet
// @route   GET /api/transport
// @access  Private (Staff/Admin/Customers)
exports.getTransports = async (req, res, next) => {
  try {
    const query = {};

    // Filter by customer/staff offerings
    if (req.query.offeredTo) {
      query.offeredTo = { $in: [req.query.offeredTo, 'Both'] };
    }

    // Filter by vehicle status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const transportList = await Transport.find(query);
    res.status(200).json({
      success: true,
      count: transportList.length,
      data: transportList
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a vehicle to fleet
// @route   POST /api/transport
// @access  Private (Admin only)
exports.createTransport = async (req, res, next) => {
  try {
    const transport = await Transport.create(req.body);
    res.status(201).json({
      success: true,
      data: transport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update vehicle status or driver profile
// @route   PUT /api/transport/:id
// @access  Private (Staff/Admin)
exports.updateTransport = async (req, res, next) => {
  try {
    let transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    transport = await Transport.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: transport
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove vehicle from fleet
// @route   DELETE /api/transport/:id
// @access  Private (Admin only)
exports.deleteTransport = async (req, res, next) => {
  try {
    const transport = await Transport.findById(req.params.id);
    if (!transport) {
      return res.status(404).json({ success: false, message: 'Vehicle not found' });
    }

    await transport.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
