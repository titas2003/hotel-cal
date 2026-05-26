const Room = require('../models/Room');
const Booking = require('../models/Booking');

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res, next) => {
  try {
    let query = {};

    // Filter by hotel
    if (req.query.hotel) {
      query.hotel = req.query.hotel;
    }

    // Filter by type
    if (req.query.type) {
      query.type = req.query.type;
    }

    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }

    const rooms = await Room.find(query).populate('hotel', 'name city').populate('amenities');
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate('hotel', 'name address city').populate('amenities');
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new room
// @route   POST /api/rooms
// @access  Private (Admin, Staff)
exports.createRoom = async (req, res, next) => {
  try {
    // Resolve placeholder hotel ID to seeded hotel ObjectId
    if (!req.body.hotel || req.body.hotel === 'hotel-california-id') {
      const Hotel = require('../models/Hotel');
      const activeHotel = await Hotel.findOne();
      if (activeHotel) {
        req.body.hotel = activeHotel._id;
      } else {
        return res.status(400).json({ success: false, message: 'No hotel registry found. Please seed the database first.' });
      }
    }

    const room = await Room.create(req.body);
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update room details
// @route   PUT /api/rooms/:id
// @access  Private (Admin, Staff)
exports.updateRoom = async (req, res, next) => {
  try {
    let room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Admin)
exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    await room.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check room availability for checkIn/checkOut dates
// @route   POST /api/rooms/availability
// @access  Public
exports.checkAvailability = async (req, res, next) => {
  try {
    const { hotelId, checkIn, checkOut, type } = req.body;

    if (!hotelId || !checkIn || !checkOut) {
      return res.status(400).json({
        success: false,
        message: 'Please provide hotelId, checkIn, and checkOut dates'
      });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find all bookings overlapping with requested dates
    const overlappingBookings = await Booking.find({
      bookingStatus: { $in: ['Confirmed', 'CheckedIn'] },
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    }).select('room');

    const bookedRoomIds = overlappingBookings.map(b => b.room);

    // Find all rooms in the hotel that are NOT booked and are not under maintenance
    let query = {
      hotel: hotelId,
      status: 'Available',
      _id: { $nin: bookedRoomIds }
    };

    if (type) {
      query.type = type;
    }

    const availableRooms = await Room.find(query).populate('hotel', 'name');

    res.status(200).json({
      success: true,
      count: availableRooms.length,
      data: availableRooms
    });
  } catch (error) {
    next(error);
  }
};
