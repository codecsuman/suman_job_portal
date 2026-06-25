import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateStatus,
} from "../controllers/application.controller.js";

const router = express.Router();

// ===========================
// Student Routes
// ===========================
router.post("/apply/:id", isAuthenticated, applyJob);

router.get("/", isAuthenticated, getAppliedJobs);

// ===========================
// Recruiter Routes
// ===========================
router.get("/:id/applicants", isAuthenticated, getApplicants);

router.put("/status/:id", isAuthenticated, updateStatus);

export default router;