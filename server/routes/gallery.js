import express from 'express';
import Gallery from '../models/Gallery.js';
import { authenticateToken } from '../middleware/auth.js';
import { uploadImages } from '../middleware/upload.js';

const router = express.Router();

// Get public gallery
router.get('/public', async (req, res) => {
  try {
    const { category, page = 1, limit = 20 } = req.query;

    const filter = { isPublic: true };
    if (category && category !== 'all') {
      filter.category = category;
    }

    const galleries = await Gallery.find(filter)
      .populate('eventId', 'title slug')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Gallery.countDocuments(filter);

    res.json({
      success: true,
      data: galleries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery'
    });
  }
});

// Admin routes
// Get all gallery items (admin)
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;

    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const galleries = await Gallery.find(filter)
      .populate('eventId', 'title')
      .populate('uploadedBy', 'username')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const totalCount = await Gallery.countDocuments(filter);

    res.json({
      success: true,
      data: galleries,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / limit),
        totalCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch gallery'
    });
  }
});

// Upload new gallery item
router.post('/admin', authenticateToken, uploadImages, async (req, res) => {
  try {
    const galleryData = {
      ...req.body,
      uploadedBy: req.user.userId
    };

    // Handle uploaded images
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      galleryData.images = req.uploadedImages;
    }

    const gallery = new Gallery(galleryData);
    await gallery.save();

    res.status(201).json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create gallery item'
    });
  }
});

// Update gallery item
router.put('/admin/:id', authenticateToken, uploadImages, async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Handle uploaded images
    if (req.uploadedImages && req.uploadedImages.length > 0) {
      updateData.images = req.uploadedImages;
    }

    const gallery = await Gallery.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update gallery item'
    });
  }
});

// Delete gallery item
router.delete('/admin/:id', authenticateToken, async (req, res) => {
  try {
    const gallery = await Gallery.findByIdAndDelete(req.params.id);

    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete gallery item'
    });
  }
});

export default router;