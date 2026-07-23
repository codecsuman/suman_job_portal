import express from "express";

import {
  register,
  login,
  logout,
  updateProfile,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload, handleUploadError } from "../middlewares/mutler.js";

const router = express.Router();

// ===========================
// Authentication Routes
// ===========================
router.post("/register", singleUpload, handleUploadError, register);
router.post("/login", login);
router.get("/logout", logout);

// ===========================
// User Profile
// ===========================
router.post(
  "/profile/update",
  isAuthenticated,
  singleUpload,
  handleUploadError,
  updateProfile,
);

export default router;
