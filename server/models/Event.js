import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 1000
  },
  raisedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  images: [{
    url: String,
    publicId: String,
    alt: String
  }],
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'completed', 'cancelled'],
    default: 'active'
  },
  priority: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  isMainEvent: {
    type: Boolean,
    default: false
  },
  eventDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  location: {
    type: String,
    default: 'Main Temple Complex'
  },
  category: {
    type: String,
    enum: ['Festival', 'Seva', 'Development', 'Special'],
    default: 'Festival'
  },
  donationCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Generate slug from title
eventSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Ensure only one main event
eventSchema.pre('save', async function(next) {
  if (this.isMainEvent && this.isModified('isMainEvent')) {
    await mongoose.model('Event').updateMany(
      { _id: { $ne: this._id } },
      { isMainEvent: false }
    );
  }
  next();
});

export default mongoose.model('Event', eventSchema);