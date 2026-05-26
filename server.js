const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/error');
const mongoSanitize = require('express-mongo-sanitize');
const { rateLimit } = require('express-rate-limit');
const helmet = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Route files
const authRoutes = require('./routes/auth');
const hotelRoutes = require('./routes/hotels');
const roomRoutes = require('./routes/rooms');
const bookingRoutes = require('./routes/bookings');
const maintenanceRoutes = require('./routes/maintenance');
const staffRoutes = require('./routes/staff');
const revenueRoutes = require('./routes/revenue');
const amenityRoutes = require('./routes/amenities');
const inventoryRoutes = require('./routes/inventory');
const transportRoutes = require('./routes/transport');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Sanitize data (NoSQL injection prevention)
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent HTTP parameter pollution
app.use(hpp());

// Rate Limiting Policy
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  limit: 100, // Limit each IP to 100 requests per 10 minutes
  message: { success: false, message: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', limiter);

// Dev logging middleware
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/transport', transportRoutes);

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the Hotel California API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
