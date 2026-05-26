const express = require('express');
const {
  getMaintenanceTasks,
  createMaintenanceTask,
  updateMaintenanceStatus
} = require('../controllers/maintenanceController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('Admin', 'Staff'));

router
  .route('/')
  .get(getMaintenanceTasks)
  .post(createMaintenanceTask);

router.route('/:id').put(updateMaintenanceStatus);

module.exports = router;
