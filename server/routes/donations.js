import express from 'express';
import Donation from '../models/Donation.js';
import Event from '../models/Event.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Create donation
router.post('/create', async (req, res) => {
  try {
    const { donorName, email, phone, amount, donationType, eventId, isAnonymous } = req.body;

    // Validation
    if (!donorName || !email || !phone || !amount) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    if (amount < 1 || amount > 500000) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be between ₹1 and ₹5,00,000'
      });
    }

    // Validate phone number
    if (!/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phone number'
      });
    }

    // Validate event if provided
    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event || event.status !== 'active') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or inactive event'
        });
      }
    }

    const donation = new Donation({
      donorName,
      email: email.toLowerCase(),
      phone,
      amount,
      donationType: donationType || 'general',
      eventId: eventId || null,
      isAnonymous: isAnonymous || false,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    await donation.save();

    res.status(201).json({
      success: true,
      data: donation,
      message: 'Donation created successfully'
    });
  } catch (error) {
    console.error('Error creating donation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create donation'
    });
  }
});

// Get public donations (for displaying on website)
router.get('/public', async (req, res) => {
  try {
    const { eventId, limit = 10 } = req.query;

    const filter = {
      'adminActions.isApproved': true,
      'paymentDetails.paymentStatus': 'success',
      isAnonymous: false
    };

    if (eventId) {
      filter.eventId = eventId;
    }

    const donations = await Donation.find(filter)
      .populate('eventId', 'title')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('donorName amount createdAt eventId')
      .lean();

    res.json({
      success: true,
      data: donations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations'
    });
  }
});

// Admin routes
// Get all donations (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      status,
      eventId,
      dateFrom,
      dateTo,
      search,
      approved
    } = req.query;

    const filter = {};

    if (status && status !== 'all') {
      filter['paymentDetails.paymentStatus'] = status;
    }

    if (eventId && eventId !== 'all') {
      filter.eventId = eventId;
    }

    if (approved !== undefined) {
      filter['adminActions.isApproved'] = approved === 'true';
    }

    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
      if (dateTo) filter.createdAt.$lte = new Date(dateTo);
    }

    if (search) {
      filter.$or = [
        { donorName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const donations = await Donation.find(filter)
      .populate('eventId', 'title')
      .populate('adminActions.approvedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Donation.countDocuments(filter);

    // Calculate total amount
    const totalAmountResult = await Donation.aggregate([
      { $match: { ...filter, 'paymentDetails.paymentStatus': 'success' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalAmount = totalAmountResult[0]?.total || 0;

    res.json({
      success: true,
      data: donations,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        totalAmount
      }
    });
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donations'
    });
  }
});

// Approve donation
router.patch('/admin/:id/approve', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        'adminActions.isApproved': true,
        'adminActions.approvedBy': req.user.userId,
        'adminActions.approvedAt': new Date(),
        'adminActions.notes': notes || ''
      },
      { new: true }
    ).populate('eventId');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    // Update event raised amount if applicable
    if (donation.eventId && donation.paymentDetails.paymentStatus === 'success') {
      await Event.findByIdAndUpdate(donation.eventId._id, {
        $inc: {
          raisedAmount: donation.amount,
          donationCount: 1
        }
      });
    }

    res.json({
      success: true,
      data: donation,
      message: 'Donation approved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to approve donation'
    });
  }
});

// Reject donation
router.patch('/admin/:id/reject', authenticateToken, async (req, res) => {
  try {
    const { notes } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        'adminActions.isApproved': false,
        'adminActions.approvedBy': req.user.userId,
        'adminActions.approvedAt': new Date(),
        'adminActions.notes': notes || ''
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation,
      message: 'Donation rejected'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to reject donation'
    });
  }
});

// Update payment status (for webhook/manual update)
router.patch('/admin/:id/payment', authenticateToken, async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, razorpayPaymentId, transactionDate } = req.body;

    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      {
        'paymentDetails.paymentStatus': paymentStatus,
        'paymentDetails.paymentMethod': paymentMethod,
        'paymentDetails.razorpayPaymentId': razorpayPaymentId,
        'paymentDetails.transactionDate': transactionDate || new Date()
      },
      { new: true }
    );

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
});

export default router;