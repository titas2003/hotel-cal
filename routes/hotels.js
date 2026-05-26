const express = require('express');
const {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel
} = require('../controllers/hotelController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(getHotels)
  .post(protect, authorize('Admin'), createHotel);

router
  .route('/:id')
  .get(getHotel)
  .put(protect, authorize('Admin'), updateHotel)
  .delete(protect, authorize('Admin'), deleteHotel);

module.exports = router;
