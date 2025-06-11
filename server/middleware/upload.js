import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Allow only images
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Maximum 10 files
  },
  fileFilter
});

// Middleware to handle image uploads
export const uploadImages = (req, res, next) => {
  const uploadMiddleware = upload.array('images', 10);
  
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message
      });
    }

    // Process uploaded files (in a real app, you'd upload to Cloudinary here)
    if (req.files && req.files.length > 0) {
      req.uploadedImages = req.files.map((file, index) => ({
        url: `https://images.pexels.com/photos/7945776/pexels-photo-7945776.jpeg?auto=compress&cs=tinysrgb&w=800`, // Placeholder
        publicId: `upload_${Date.now()}_${index}`,
        alt: file.originalname
      }));
    }

    next();
  });
};