import express from 'express';
import Donation from '../models/Donation.js';
import Event from '../models/Event.js';
import Gallery from '../models/Gallery.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Dashboard overview
router.get('/overview', authenticateToken, async (req, res) => {
  try {
    const { period = '30d' } = req.query;

    let dateFilter = {};
    const now = new Date();

    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(now - 7 * 24 * 60 * 60 * 1000) };
        break;
      case '30d':
        dateFilter = { $gte: new Date(now - 30 * 24 * 60 * 60 * 1000) };
        break;
      case '90d':
        dateFilter = { $gte: new Date(now - 90 * 24 * 60 * 60 * 1000) };
        break;
      case '1y':
        dateFilter = { $gte: new Date(now - 365 * 24 * 60 * 60 * 1000) };
        break;
    }

    // Total donations stats
    const totalStats = await Donation.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'success',
          'adminActions.isApproved': true,
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Pending approvals
    const pendingApprovals = await Donation.countDocuments({
      'paymentDetails.paymentStatus': 'success',
      'adminActions.isApproved': false
    });

    // Active events count
    const activeEvents = await Event.countDocuments({ status: 'active' });

    // Recent donations
    const recentDonations = await Donation.find({
      'paymentDetails.paymentStatus': 'success'
    })
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('donorName amount createdAt eventId adminActions.isApproved')
      .lean();

    // Daily trends
    const dailyTrends = await Donation.aggregate([
      {
        $match: {
          'paymentDetails.paymentStatus': 'success',
          'adminActions.isApproved': true,
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    // Top events
    const topEvents = await Donation.aggregate([
      {
        $match: {
          eventId: { $exists: true },
          'paymentDetails.paymentStatus': 'success',
          'adminActions.isApproved': true,
          createdAt: dateFilter
        }
      },
      {
        $group: {
          _id: '$eventId',
          donationCount: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      {
        $lookup: {
          from: 'events',
          localField: '_id',
          foreignField: '_id',
          as: 'event'
        }
      },
      {
        $unwind: '$event'
      },
      {
        $sort: { totalAmount: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          ...totalStats[0],
          pendingApprovals,
          activeEvents
        },
        recentDonations,
        dailyTrends,
        topEvents,
        period
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
});

// Event-specific analytics
router.get('/events/:eventId', authenticateToken, async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Event donation stats
    const eventStats = await Donation.aggregate([
      {
        $match: {
          eventId: mongoose.Types.ObjectId(eventId),
          'paymentDetails.paymentStatus': 'success',
          'adminActions.isApproved': true
        }
      },
      {
        $group: {
          _id: null,
          totalDonations: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' }
        }
      }
    ]);

    // Daily progress
    const dailyProgress = await Donation.aggregate([
      {
        $match: {
          eventId: mongoose.Types.ObjectId(eventId),
          'paymentDetails.paymentStatus': 'success',
          'adminActions.isApproved': true
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 },
          amount: { $sum: '$amount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    res.json({
      success: true,
      data: {
        event,
        stats: eventStats[0] || { totalDonations: 0, totalAmount: 0, averageAmount: 0 },
        dailyProgress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event analytics'
    });
  }
});

export default router;