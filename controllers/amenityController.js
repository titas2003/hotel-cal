const Amenity = require('../models/Amenity');

// @desc    Get all amenities
// @route   GET /api/amenities
// @access  Public
exports.getAmenities = async (req, res, next) => {
  try {
    const amenities = await Amenity.find();
    res.status(200).json({
      success: true,
      count: amenities.length,
      data: amenities
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create an amenity
// @route   POST /api/amenities
// @access  Private (Admin only)
exports.createAmenity = async (req, res, next) => {
  try {
    const amenity = await Amenity.create(req.body);
    res.status(201).json({
      success: true,
      data: amenity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an amenity
// @route   PUT /api/amenities/:id
// @access  Private (Admin only)
exports.updateAmenity = async (req, res, next) => {
  try {
    let amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ success: false, message: 'Amenity not found' });
    }

    amenity = await Amenity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: amenity
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an amenity
// @route   DELETE /api/amenities/:id
// @access  Private (Admin only)
exports.deleteAmenity = async (req, res, next) => {
  try {
    const amenity = await Amenity.findById(req.params.id);
    if (!amenity) {
      return res.status(404).json({ success: false, message: 'Amenity not found' });
    }

    await amenity.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
