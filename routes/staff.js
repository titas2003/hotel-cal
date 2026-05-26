const express = require('express');
const {
  getStaff,
  createStaff,
  updateStaff,
  deleteStaff,
  getDeployments,
  createDeployment,
  updateDeployment
} = require('../controllers/staffController');

const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.use(protect);

// Deployments routes (Staff can view and update their own, Admin manages everything)
router.get('/deployments', authorize('Admin', 'Staff'), getDeployments);
router.post('/deployments', authorize('Admin'), createDeployment);
router.put('/deployments/:id', authorize('Admin', 'Staff'), updateDeployment);

// Base staff profiles (Admin only)
router.use(authorize('Admin'));
router
  .route('/')
  .get(getStaff)
  .post(createStaff);

router
  .route('/:id')
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
