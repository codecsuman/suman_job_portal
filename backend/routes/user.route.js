import express from "express";

import {
    register,
    login,
    logout,
    updateProfile,
} from "../controllers/user.controller.js";

import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

// ===========================
// Authentication Routes
// ===========================
router.post("/register", singleUpload, register);
router.post("/login", login);
router.get("/logout", logout);

// ===========================
// User Profile
// ===========================
router.post(
    "/profile/update",
    isAuthenticated,
    singleUpload,
    updateProfile
);

export default router;