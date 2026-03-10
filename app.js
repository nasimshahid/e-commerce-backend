require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const UserType = require('./models/userType');
const app = express();
const adminRoutes = require('./routes/admin');
const userRouter = require('./routes/user');
const sellerRoutes = require('./routes/seller');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const deliveryRoutes = require('./routes/delivery');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const { errorHandler } = require('./middleware/errorHandler');

// ✅ Validate required environment variables at startup — fail fast and loudly
const REQUIRED_ENV = ['JWT_SECRET', 'MONGODB_URI', 'EMAIL_USER', 'EMAIL_PASSWORD', 'ADMIN_SETUP_KEY'];
const missingEnv = REQUIRED_ENV.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  console.error(`FATAL: Missing required environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Seed default user roles (defined before connect so it's available in .then())
const createUserTypes = async () => {
  try {
    const count = await UserType.countDocuments();
    if (count > 0) {
      console.log('User types already exist');
      return;
    }
    await UserType.insertMany([
      { role: 'admin' },
      { role: 'seller' },
      { role: 'user' },
      { role: 'delivery' },
    ]);
    console.log('User types saved successfully');
  } catch (error) {
    console.error('Error creating user types:', error.message);
  }
};

// ✅ DB Connected — createUserTypes() runs only AFTER the connection is established
mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    await createUserTypes();
  }).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Body parsing middleware
app.use(express.json({ limit: '10kb' }));

// ✅ Restrict CORS to the configured frontend origin only
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rate limiting
app.use(limiter);

// API routes
app.use('/api/v1', adminRoutes);
app.use('/api/v1', userRouter);
app.use('/api/v1', sellerRoutes);
app.use('/api/v1', cartRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', deliveryRoutes);

// Error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});