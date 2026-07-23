import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// ===========================
// Load Environment Variables
// ===========================
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.local" });
}

// ===========================
// Validate Environment Variables
// ===========================
if (
  !process.env.CLOUD_NAME ||
  !process.env.API_KEY ||
  !process.env.API_SECRET
) {
  console.error("❌ Cloudinary environment variables are missing.");
  process.exit(1);
}

// ===========================
// Cloudinary Configuration
// ===========================
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// ===========================
// Export Cloudinary Instance
// ===========================
export default cloudinary;
