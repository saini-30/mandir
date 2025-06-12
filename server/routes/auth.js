import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { email: username }],
      isActive: true
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const waitMinutes = Math.ceil((user.lockUntil - Date.now()) / (1000 * 60));
      return res.status(423).json({
        success: false,
        message: `Account is temporarily locked. Please try again in ${waitMinutes} minutes.`,
        lockUntil: user.lockUntil
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      user.loginAttempts += 1;
      if (user.loginAttempts >= 5) {
        user.lockUntil = Date.now() + (30 * 60 * 1000); // 30 minutes
      }
      
      await user.save();
      
      const attemptsLeft = 5 - user.loginAttempts;
      return res.status(401).json({
        success: false,
        message: user.loginAttempts >= 5 
          ? 'Account has been locked for 30 minutes due to too many failed attempts.'
          : `Invalid credentials. ${attemptsLeft} attempts remaining before account lockout.`,
        attemptsLeft: Math.max(0, attemptsLeft),
        lockUntil: user.lockUntil
      });
    }

    // Reset login attempts on successful login
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        username: user.username,
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed'
    });
  }
});

// Verify token
router.get('/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// Create initial admin user (for setup)
router.post('/setup', async (req, res) => {
  try {
    // Check if any admin user exists
    const existingAdmin = await User.findOne({ role: { $in: ['super_admin', 'admin'] } });
    
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin user already exists'
      });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    const adminUser = new User({
      username,
      email,
      password,
      role: 'super_admin'
    });

    await adminUser.save();

    res.json({
      success: true,
      message: 'Admin user created successfully'
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create admin user'
    });
  }
});

export default router;