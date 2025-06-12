import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },  description: {
    type: String,
    maxlength: 500
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: 'Temple Complex'
  }
}, {
  timestamps: true
});

export default mongoose.model('Gallery', gallerySchema);