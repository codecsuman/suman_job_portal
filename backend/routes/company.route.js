import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { singleUpload } from "../middlewares/mutler.js";

import {
    registerCompany,
    getCompany,
    getCompanyById,
    updateCompany,
} from "../controllers/company.controller.js";

const router = express.Router();

// Register Company
router.post("/register", isAuthenticated, registerCompany);

// Get All Companies
router.get("/get", isAuthenticated, getCompany);

// Get Company By Id
router.get("/get/:id", isAuthenticated, getCompanyById);

// Update Company
router.put(
    "/update/:id",
    isAuthenticated,
    singleUpload,
    updateCompany
);

export default router;