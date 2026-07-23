import multer from "multer";

// ===========================
// Memory Storage
// ===========================
const storage = multer.memoryStorage();

// ===========================
// Allowed File Types
// ===========================
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "application/pdf",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Only JPG, JPEG, PNG, WEBP and PDF files are allowed."),
      false,
    );
  }
};

// ===========================
// Multer Configuration
// ===========================
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },
});

// ===========================
// Export Middleware
// ===========================
export const singleUpload = upload.single("file");

// 🔴 NEW: Error handler middleware
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "File size too large. Maximum 5MB allowed.",
        success: false,
      });
    }
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
  if (err) {
    return res.status(400).json({
      message: err.message,
      success: false,
    });
  }
  next();
};
