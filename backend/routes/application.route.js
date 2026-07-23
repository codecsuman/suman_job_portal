import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus,
  scheduleInterview,
  withdrawApplication,
} from "../controllers/application.controller.js";

const router = express.Router();

// ===========================
// Student Routes
// ===========================
router.post("/apply/:id", isAuthenticated, applyJob);

router.get("/", isAuthenticated, getAppliedJobs);

// 🔴 NEW: student withdraws a still-pending application
router.delete("/withdraw/:id", isAuthenticated, withdrawApplication);

// ===========================
// Recruiter Routes
// ===========================
router.get("/:id/applicants", isAuthenticated, getApplicants);

router.put("/status/:id", isAuthenticated, updateStatus);

router.post("/schedule-interview/:id", isAuthenticated, scheduleInterview);

export default router;
