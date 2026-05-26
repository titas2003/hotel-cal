const express = require('express');
const {
  getRevenueReport,
  getInvoices,
  getInvoice,
  getOccupancyStats
} = require('../controllers/revenueController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router.get('/invoices', authorize('Admin', 'Staff'), getInvoices);
router.get('/invoices/:id', getInvoice); // Users can view their own, Staff/Admin can view any
router.get('/report', authorize('Admin'), getRevenueReport);
router.get('/occupancy', authorize('Admin', 'Staff'), getOccupancyStats);

module.exports = router;
