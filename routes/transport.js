const express = require('express');
const {
  getTransports,
  createTransport,
  updateTransport,
  deleteTransport
} = require('../controllers/transportController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

router
  .route('/')
  .get(getTransports)
  .post(authorize('Admin'), createTransport);

router
  .route('/:id')
  .put(authorize('Admin', 'Staff'), updateTransport)
  .delete(authorize('Admin'), deleteTransport);

module.exports = router;
