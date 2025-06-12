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
    files: 20 // Maximum 20 files
  },
  fileFilter
});

// Middleware to handle image uploads
export const uploadImages = async (req, res, next) => {
  const uploadMiddleware = upload.array('images', 20);
  
  try {
    await new Promise((resolve, reject) => {
      uploadMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    if (!req.files || req.files.length === 0) {
      return next();
    }

    // Convert files to base64 strings and store in MongoDB
    req.uploadedImages = req.files.map(file => ({
      url: `data:${file.mimetype};base64,${file.buffer.toString('base64')}`,
      alt: file.originalname
    }));

    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Error processing file upload'
    });
  }
};