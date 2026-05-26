const Maintenance = require('../models/Maintenance');
const Room = require('../models/Room');

// @desc    Get all maintenance tasks
// @route   GET /api/maintenance
// @access  Private (Staff/Admin)
exports.getMaintenanceTasks = async (req, res, next) => {
  try {
    const tasks = await Maintenance.find()
      .populate('room', 'roomNumber type status')
      .populate('assignedStaff', 'name email');

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a maintenance task / room cleaning request
// @route   POST /api/maintenance
// @access  Private (Staff/Admin)
exports.createMaintenanceTask = async (req, res, next) => {
  try {
    const { roomId, assignedStaffId, taskType, description, cost } = req.body;

    if (!roomId || !assignedStaffId || !taskType) {
      return res.status(400).json({ success: false, message: 'Please provide roomId, assignedStaffId, and taskType' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Create task
    const task = await Maintenance.create({
      room: roomId,
      assignedStaff: assignedStaffId,
      taskType,
      description,
      cost: cost || 0
    });

    // Automatically flag the room status
    if (taskType === 'Repair' || taskType === 'Routine Check') {
      await Room.findByIdAndUpdate(roomId, { status: 'Under Maintenance' });
    }

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update maintenance status (In Progress, Completed)
// @route   PUT /api/maintenance/:id
// @access  Private (Staff/Admin)
exports.updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { status, cost } = req.body;
    let task = await Maintenance.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Maintenance task not found' });
    }

    const updateData = { status };
    if (cost !== undefined) {
      updateData.cost = cost;
    }

    if (status === 'Completed') {
      updateData.completedAt = Date.now();
    }

    task = await Maintenance.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true
    });

    // If completed, set Room status back to Available
    if (status === 'Completed') {
      await Room.findByIdAndUpdate(task.room, { status: 'Available' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};
