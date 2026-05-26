const Hotel = require('../models/Hotel');

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
exports.getHotels = async (req, res, next) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json({
      success: true,
      count: hotels.length,
      data: hotels
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
exports.getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }
    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private/Admin
exports.createHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
exports.updateHotel = async (req, res, next) => {
  try {
    let hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: hotel
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
exports.deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' });
    }

    await hotel.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
