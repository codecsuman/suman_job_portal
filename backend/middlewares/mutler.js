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
