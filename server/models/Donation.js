import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    match: /^[6-9]\d{9}$/
  },
  amount: {
    type: Number,
    required: true,
    min: 1,
    max: 500000
  },
  donationType: {
    type: String,
    enum: ['general', 'event', 'seva', 'infrastructure'],
    default: 'general'
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  paymentDetails: {
    razorpayPaymentId: String,
    razorpayOrderId: String,
    razorpaySignature: String,
    paymentMethod: String,
    paymentStatus: {
      type: String,
      enum: ['pending', 'processing', 'success', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionDate: Date,
    failureReason: String
  },
  adminActions: {
    isApproved: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    notes: String
  },
  receiptDetails: {
    receiptNumber: {
      type: String,
      unique: true,
      sparse: true
    },
    isGenerated: {
      type: Boolean,
      default: false
    },
    generatedAt: Date,
    emailSent: {
      type: Boolean,
      default: false
    }
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
});

// Generate receipt number
donationSchema.pre('save', function(next) {
  if (this.isNew && !this.receiptDetails.receiptNumber) {
    this.receiptDetails.receiptNumber = `STJ${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  next();
});

export default mongoose.model('Donation', donationSchema);