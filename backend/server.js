const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// ─── Security Middleware ──────────────────────────────────────────────────────
app.use(helmet()); // Sets 11 HTTP security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// General API rate limiter: 100 requests per 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

// Strict rate limiter for auth endpoints: 10 requests per 15 minutes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many authentication attempts, please try again later.' },
});

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json());
app.use(morgan('dev'));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime().toFixed(2) + 's',
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/v1/users', apiLimiter, require('./routes/userRoutes'));

// Apply stricter limiter specifically on auth routes
app.use('/api/v1/users/login', authLimiter);
app.use('/api/v1/users/send-otp', authLimiter);
app.use('/api/v1/users/verify-otp', authLimiter);

// Legacy redirect (for backward compat)
app.use('/api/users', (req, res) => {
  res.status(301).json({ message: 'API has moved to /api/v1/users' });
});

// Root
app.get('/', (req, res) => {
  res.json({
    message: 'Purple Merit — User Management API',
    version: 'v1',
    docs: '/api/v1/health',
  });
});

// ─── Error Middleware ─────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
