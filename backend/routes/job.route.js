import express from "express";

import isAuthenticated from "../middlewares/isAuthenticated.js";

import {
    postJob,
    getAllJobs,
    getAdminJobs,
    getJobById,
} from "../controllers/job.controller.js";

const router = express.Router();

// Recruiter
router.post("/post", isAuthenticated, postJob);
router.get("/admin", isAuthenticated, getAdminJobs);

// Public
router.get("/get", getAllJobs);
router.get("/get/:id", getJobById);

export default router;