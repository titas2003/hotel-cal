const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  checkIn,
  checkOut,
  cancelBooking
} = require('../controllers/bookingController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getBookings)
  .post(createBooking);

router.route('/:id').get(getBooking);
router.put('/:id/checkin', authorize('Admin', 'Staff'), checkIn);
router.put('/:id/checkout', authorize('Admin', 'Staff'), checkOut);
router.put('/:id/cancel', cancelBooking);

module.exports = router;
