import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Donation from '../models/Donation.js';
import Event from '../models/Event.js';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

// Create Razorpay order
router.post('/create-order', async (req, res) => {
  try {
    const { donationId } = req.body;

    if (!donationId) {
      return res.status(400).json({
        success: false,
        message: 'Donation ID is required'
      });
    }

    const donation = await Donation.findById(donationId);
    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    const options = {
      amount: donation.amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `donation_${donationId}`,
      notes: {
        donationId: donationId,
        donorName: donation.donorName,
        donationType: donation.donationType
      }
    };

    const order = await razorpay.orders.create(options);

    // Update donation with order ID
    await Donation.findByIdAndUpdate(donationId, {
      'paymentDetails.razorpayOrderId': order.id,
      'paymentDetails.paymentStatus': 'processing'
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy'
      }
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order'
    });
  }
});

// Verify payment
router.post('/verify', async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      donationId
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }

    // Update donation record
    const donation = await Donation.findByIdAndUpdate(
      donationId,
      {
        'paymentDetails.razorpayPaymentId': razorpay_payment_id,
        'paymentDetails.razorpaySignature': razorpay_signature,
        'paymentDetails.paymentStatus': 'success',
        'paymentDetails.transactionDate': new Date(),
        'paymentDetails.paymentMethod': 'razorpay'
      },
      { new: true }
    ).populate('eventId');

    if (!donation) {
      return res.status(404).json({
        success: false,
        message: 'Donation not found'
      });
    }

    res.json({
      success: true,
      data: donation,
      message: 'Payment verified successfully'
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed'
    });
  }
});

// Webhook handler
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookBody = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_secret')
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature === expectedSignature) {
      const event = JSON.parse(webhookBody);

      switch (event.event) {
        case 'payment.captured':
          handlePaymentCaptured(event.payload.payment.entity);
          break;
        case 'payment.failed':
          handlePaymentFailed(event.payload.payment.entity);
          break;
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ status: 'error' });
  }
});

// Helper functions
const handlePaymentCaptured = async (payment) => {
  try {
    const donation = await Donation.findOne({
      'paymentDetails.razorpayPaymentId': payment.id
    });

    if (donation) {
      donation.paymentDetails.paymentStatus = 'success';
      donation.paymentDetails.transactionDate = new Date();
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment captured:', error);
  }
};

const handlePaymentFailed = async (payment) => {
  try {
    const donation = await Donation.findOne({
      'paymentDetails.razorpayPaymentId': payment.id
    });

    if (donation) {
      donation.paymentDetails.paymentStatus = 'failed';
      donation.paymentDetails.failureReason = payment.error_description;
      await donation.save();
    }
  } catch (error) {
    console.error('Error handling payment failed:', error);
  }
};

export default router;