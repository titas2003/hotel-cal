const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  checkAvailability
} = require('../controllers/roomController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.post('/availability', checkAvailability);

router
  .route('/')
  .get(getRooms)
  .post(protect, authorize('Admin', 'Staff'), createRoom);

router
  .route('/:id')
  .get(getRoom)
  .put(protect, authorize('Admin', 'Staff'), updateRoom)
  .delete(protect, authorize('Admin'), deleteRoom);

module.exports = router;
