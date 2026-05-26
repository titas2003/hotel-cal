const express = require('express');
const {
  getAmenities,
  createAmenity,
  updateAmenity,
  deleteAmenity
} = require('../controllers/amenityController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router
  .route('/')
  .get(getAmenities)
  .post(protect, authorize('Admin'), createAmenity);

router
  .route('/:id')
  .put(protect, authorize('Admin'), updateAmenity)
  .delete(protect, authorize('Admin'), deleteAmenity);

module.exports = router;
