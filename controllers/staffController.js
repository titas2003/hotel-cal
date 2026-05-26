const User = require('../models/User');
const Deployment = require('../models/Deployment');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private (Admin only)
exports.getStaff = async (req, res, next) => {
  try {
    const staff = await User.find({ role: { $in: ['Staff', 'Admin'] } });
    res.status(200).json({
      success: true,
      count: staff.length,
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create/Add a new staff member
// @route   POST /api/staff
// @access  Private (Admin only)
exports.createStaff = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, salary } = req.body;

    if (!['Staff', 'Admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff role' });
    }

    const staff = await User.create({
      name,
      email,
      password,
      phone,
      role,
      salary: salary || 0
    });

    res.status(201).json({
      success: true,
      data: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
        phone: staff.phone,
        salary: staff.salary
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff profile (including salary)
// @route   PUT /api/staff/:id
// @access  Private (Admin only)
exports.updateStaff = async (req, res, next) => {
  try {
    let staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    if (!['Staff', 'Admin'].includes(staff.role)) {
      return res.status(400).json({ success: false, message: 'User is not a staff member' });
    }

    staff = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: staff
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete/Terminate a staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin only)
exports.deleteStaff = async (req, res, next) => {
  try {
    const staff = await User.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    await staff.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// Staff Deployments Section

// @desc    Get all staff deployments
// @route   GET /api/staff/deployments
// @access  Private (Admin/Staff)
exports.getDeployments = async (req, res, next) => {
  try {
    const deployments = await Deployment.find()
      .populate('staff', 'name email phone role')
      .populate('hotel', 'name city');

    res.status(200).json({
      success: true,
      count: deployments.length,
      data: deployments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Deploy a staff member
// @route   POST /api/staff/deployments
// @access  Private (Admin only)
exports.createDeployment = async (req, res, next) => {
  try {
    const { staffId, hotelId, department, shift, notes } = req.body;

    const staffUser = await User.findById(staffId);
    if (!staffUser || !['Staff', 'Admin'].includes(staffUser.role)) {
      return res.status(400).json({ success: false, message: 'Invalid staff member selected' });
    }

    const deployment = await Deployment.create({
      staff: staffId,
      hotel: hotelId,
      department,
      shift,
      notes
    });

    res.status(201).json({
      success: true,
      data: deployment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update staff deployment status / shift
// @route   PUT /api/staff/deployments/:id
// @access  Private (Admin/Staff)
exports.updateDeployment = async (req, res, next) => {
  try {
    let deployment = await Deployment.findById(req.params.id);
    if (!deployment) {
      return res.status(404).json({ success: false, message: 'Deployment log not found' });
    }

    deployment = await Deployment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: deployment
    });
  } catch (error) {
    next(error);
  }
};
