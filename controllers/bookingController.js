const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Invoice = require('../models/Invoice');
const sendEmail = require('../config/mailer');

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin/Staff sees all, Customer sees their own)
exports.getBookings = async (req, res, next) => {
  try {
    let query = {};

    if (req.user.role === 'Customer') {
      query.guest = req.user.id;
    } else {
      if (req.query.guest) {
        query.guest = req.query.guest;
      }
      if (req.query.status) {
        query.bookingStatus = req.query.status;
      }
    }

    const bookings = await Booking.find(query)
      .populate('room')
      .populate('guest', 'name email phone');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('room')
      .populate('guest', 'name email phone');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Check ownership
    if (req.user.role === 'Customer' && booking.guest._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking' });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a room booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: 'Please provide roomId, checkIn date and checkOut date' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, message: 'Check-out date must be after check-in date' });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    if (room.status === 'Under Maintenance') {
      return res.status(400).json({ success: false, message: 'Room is currently under maintenance' });
    }

    // Verify room is not already booked during this timeframe
    const overlapping = await Booking.findOne({
      room: roomId,
      bookingStatus: { $in: ['Confirmed', 'CheckedIn'] },
      $or: [
        { checkInDate: { $lt: checkOutDate }, checkOutDate: { $gt: checkInDate } }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ success: false, message: 'Room is already booked for these dates' });
    }

    // Calculate total cost
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((checkOutDate - checkInDate) / millisecondsPerDay) || 1;
    const totalAmount = room.pricePerNight * days;

    // Create booking
    const booking = await Booking.create({
      guest: req.user.id,
      room: roomId,
      checkInDate,
      checkOutDate,
      totalAmount,
      bookingStatus: 'Confirmed'
    });

    // Create corresponding Invoice
    const tax = totalAmount * 0.12; // 12% tax
    await Invoice.create({
      booking: booking._id,
      guest: req.user.id,
      roomCharges: totalAmount,
      tax,
      totalAmount: totalAmount + tax,
      paymentStatus: 'Unpaid'
    });

    // Send confirmation email
    const subject = 'Booking Confirmed - Hotel California';
    const text = `Hi ${req.user.name},\nYour booking for Room ${room.roomNumber} has been confirmed from ${checkIn} to ${checkOut}.\nTotal Amount: $${totalAmount}.\nThank you for choosing Hotel California!`;
    const html = `<h3>Hi ${req.user.name},</h3><p>Your booking for <strong>Room ${room.roomNumber}</strong> has been confirmed.</p><p><strong>Check-in:</strong> ${checkIn}<br><strong>Check-out:</strong> ${checkOut}</p><p><strong>Total Room Charges:</strong> $${totalAmount}</p><p>Thank you for choosing Hotel California!</p>`;
    
    await sendEmail(req.user.email, subject, text, html);

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-In guest
// @route   PUT /api/bookings/:id/checkin
// @access  Private (Staff/Admin)
exports.checkIn = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus !== 'Confirmed') {
      return res.status(400).json({ success: false, message: `Cannot check in from status: ${booking.bookingStatus}` });
    }

    booking.bookingStatus = 'CheckedIn';
    await booking.save();

    // Update Room status to Occupied
    await Room.findByIdAndUpdate(booking.room, { status: 'Occupied' });

    res.status(200).json({
      success: true,
      message: 'Guest checked in successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check-Out guest
// @route   PUT /api/bookings/:id/checkout
// @access  Private (Staff/Admin)
exports.checkOut = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.bookingStatus !== 'CheckedIn') {
      return res.status(400).json({ success: false, message: `Cannot check out from status: ${booking.bookingStatus}` });
    }

    booking.bookingStatus = 'CheckedOut';
    await booking.save();

    // Update Room status to Available
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });

    // Find and update Invoice to paid
    const invoice = await Invoice.findOne({ booking: booking._id });
    if (invoice) {
      invoice.paymentStatus = 'Paid';
      invoice.paymentMethod = req.body.paymentMethod || 'Cash';
      invoice.paidAt = Date.now();
      await invoice.save();
    }

    res.status(200).json({
      success: true,
      message: 'Guest checked out successfully and invoice settled',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Auth ownership check
    if (req.user.role === 'Customer' && booking.guest.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this booking' });
    }

    if (booking.bookingStatus === 'CheckedIn' || booking.bookingStatus === 'CheckedOut') {
      return res.status(400).json({ success: false, message: 'Cannot cancel active or past stays' });
    }

    booking.bookingStatus = 'Cancelled';
    await booking.save();

    // Free the room
    await Room.findByIdAndUpdate(booking.room, { status: 'Available' });

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking
    });
  } catch (error) {
    next(error);
  }
};
