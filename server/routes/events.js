import express from 'express';
import Event from '../models/Event.js';
import Donation from '../models/Donation.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';

const router = express.Router();

// Get public events (for main website)
router.get('/public', async (req, res) => {
  try {
    const events = await Event.find({
      status: 'active',
      $or: [
        { endDate: { $gte: new Date() } },
        { endDate: null }
      ]
    })
    .sort({ isMainEvent: -1, priority: -1, createdAt: -1 })
    .select('title slug description targetAmount raisedAmount images priority isMainEvent eventDate location category donationCount')
    .lean();

    // Calculate progress percentage
    const eventsWithProgress = events.map(event => ({
      ...event,
      progressPercentage: Math.min((event.raisedAmount / event.targetAmount) * 100, 100),
      isCompleted: event.raisedAmount >= event.targetAmount
    }));

    res.json({
      success: true,
      data: {
        mainEvent: eventsWithProgress.find(e => e.isMainEvent) || eventsWithProgress[0],
        otherEvents: eventsWithProgress.filter(e => !e.isMainEvent)
      }
    });
  } catch (error) {
    console.error('Error fetching public events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Get single event by slug
router.get('/public/:slug', async (req, res) => {
  try {
    const event = await Event.findOne({
      slug: req.params.slug,
      status: 'active'
    }).lean();

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get recent donations for this event
    const recentDonations = await Donation.find({
      eventId: event._id,
      'adminActions.isApproved': true,
      'paymentDetails.paymentStatus': 'success',
      isAnonymous: false
    })
    .sort({ createdAt: -1 })
    .limit(10)
    .select('donorName amount createdAt')
    .lean();

    res.json({
      success: true,
      data: {
        ...event,
        progressPercentage: Math.min((event.raisedAmount / event.targetAmount) * 100, 100),
        recentDonations
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event details'
    });
  }
});

// Admin routes
// Get all events (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;

    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const events = await Event.find(filter)
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Event.countDocuments(filter);

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events'
    });
  }
});

// Create new event
router.post('/admin', authenticateToken, uploadImages, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.userId
    };

    // Handle uploaded images
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      eventData.images = req.uploadedImages;
    }

    const event = new Event(eventData);
    await event.save();

    res.status(201).json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event'
    });
  }
});

// Update event
router.put('/admin/:id', authenticateToken, uploadImages, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle uploaded images
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      updateData.images = req.uploadedImages;
    }

    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update event'
    });
  }
});

// Delete event
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete event'
    });
  }
});

// Set main event
router.patch('/admin/:id/main', authenticateToken, async (req, res) => {
  try {
    // First, remove main event status from all events
    await Event.updateMany({}, { isMainEvent: false });

    // Set the selected event as main
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      { isMainEvent: true },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to set main event'
    });
  }
});

export default router;