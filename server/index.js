import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import net from 'net';

// Import routes
import authRoutes from './routes/auth.js';
import donationRoutes from './routes/donations.js';
import eventRoutes from './routes/events.js';
import galleryRoutes from './routes/gallery.js';
import paymentRoutes from './routes/payments.js';
import analyticsRoutes from './routes/analytics.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001; // Change default port to 5001

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://checkout.razorpay.com"],
      imgSrc: ["'self'", "https://res.cloudinary.com", "https://images.pexels.com", "data:"],
      connectSrc: ["'self'", "https://api.razorpay.com"]
    }
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://shreethakurjiseva.com', 'https://admin.shreethakurjiseva.com']
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

// Global rate limiting (increased limit)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // increased from 100 to 200 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Auth-specific rate limiting
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 auth requests per 15 minutes
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Donation-specific rate limiting
const donationLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 donation attempts per minute
  message: 'Too many donation attempts, please try again later.'
});

// Apply rate limiters
app.use('/api', limiter); // Global limiter
app.use('/api/auth', authLimiter); // Auth-specific limiter
app.use('/api/donations', donationLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://harpreet:saini@cluster0.uszo25j.mongodb.net/donation')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/donations', donationRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: process.env.NODE_ENV === 'production' 
      ? 'Something went wrong!' 
      : err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Function to find available port
const findAvailablePort = async (startPort) => {
  const isPortAvailable = (port) => {
    return new Promise((resolve) => {
      const server = net.createServer()
        .listen(port, () => {
          server.once('close', () => resolve(true));
          server.close();
        })
        .on('error', () => resolve(false));
    });
  };

  let port = startPort;
  while (!(await isPortAvailable(port))) {
    port++;
    if (port > startPort + 100) {
      throw new Error('No available ports found');
    }
  }
  return port;
};

// Modified server startup with dynamic port
const startServer = async () => {
  try {
    const desiredPort = process.env.PORT || 5000;
    const availablePort = await findAvailablePort(desiredPort);
    
    if (availablePort !== desiredPort) {
      console.log(`Port ${desiredPort} is in use, using port ${availablePort} instead`);
    }

    const server = app.listen(availablePort, () => {
      console.log(`Server running on port ${availablePort}`);
    });

    // Graceful shutdown
    const signals = ['SIGTERM', 'SIGINT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`Received ${signal}, shutting down...`);
        await mongoose.connection.close();
        server.close(() => {
          console.log('Server closed');
          process.exit(0);
        });
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();