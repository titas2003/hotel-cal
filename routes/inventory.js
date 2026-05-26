const express = require('express');
const {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} = require('../controllers/inventoryController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Staff'));

router
  .route('/')
  .get(getInventory)
  .post(createInventory);

router
  .route('/:id')
  .put(updateInventory)
  .delete(authorize('Admin'), deleteInventory);

module.exports = router;
