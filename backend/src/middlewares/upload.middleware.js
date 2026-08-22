const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.resolve(__dirname, '../../uploads/resumes');

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const userId = req.user ? req.user._id : 'anonymous';
    const timestamp = Date.now();
    const cleanExt = path.extname(file.originalname).toLowerCase() || '.pdf';
    cb(null, `resume-${userId}-${timestamp}${cleanExt}`);
  }
});

const fileFilter = (req, file, cb) => {
  const isPdf = file.mimetype === 'application/pdf' || path.extname(file.originalname).toLowerCase() === '.pdf';
  if (isPdf) {
    cb(null, true);
  } else {
    const error = new Error('Invalid file format. Only PDF resumes are accepted');
    error.statusCode = 400;
    cb(error, false);
  }
};

const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  uploadResume
};
