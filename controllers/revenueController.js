const Invoice = require('../models/Invoice');
const Room = require('../models/Room');

// @desc    Get complete revenue and billing analytics
// @route   GET /api/revenue/report
// @access  Private (Admin only)
exports.getRevenueReport = async (req, res, next) => {
  try {
    const paidInvoices = await Invoice.find({ paymentStatus: 'Paid' });
    const unpaidInvoices = await Invoice.find({ paymentStatus: 'Unpaid' });

    const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const roomRevenue = paidInvoices.reduce((sum, inv) => sum + inv.roomCharges, 0);
    const additionalServicesRevenue = paidInvoices.reduce((sum, inv) => sum + inv.additionalCharges, 0);
    const taxesCollected = paidInvoices.reduce((sum, inv) => sum + inv.tax, 0);

    const pendingPayments = unpaidInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        roomRevenue,
        additionalServicesRevenue,
        taxesCollected,
        pendingPayments,
        paidCount: paidInvoices.length,
        unpaidCount: unpaidInvoices.length
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all invoices
// @route   GET /api/revenue/invoices
// @access  Private (Staff/Admin)
exports.getInvoices = async (req, res, next) => {
  try {
    const invoices = await Invoice.find()
      .populate('guest', 'name email phone')
      .populate({
        path: 'booking',
        populate: { path: 'room', select: 'roomNumber type' }
      });

    res.status(200).json({
      success: true,
      count: invoices.length,
      data: invoices
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single invoice
// @route   GET /api/revenue/invoices/:id
// @access  Private (Staff/Admin/Invoice Owner)
exports.getInvoice = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('guest', 'name email phone')
      .populate({
        path: 'booking',
        populate: { path: 'room', select: 'roomNumber type' }
      });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    // Owner checks
    if (req.user.role === 'Customer' && invoice.guest._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this invoice' });
    }

    res.status(200).json({
      success: true,
      data: invoice
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get occupancy statistics
// @route   GET /api/revenue/occupancy
// @access  Private (Staff/Admin)
exports.getOccupancyStats = async (req, res, next) => {
  try {
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied' });
    const maintenanceRooms = await Room.countDocuments({ status: 'Under Maintenance' });
    const availableRooms = await Room.countDocuments({ status: 'Available' });

    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        totalRooms,
        occupiedRooms,
        maintenanceRooms,
        availableRooms,
        occupancyRate: Math.round(occupancyRate * 100) / 100
      }
    });
  } catch (error) {
    next(error);
  }
};
