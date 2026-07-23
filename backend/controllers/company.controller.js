import { Company } from "../models/company.model.js";
import { Job } from "../models/job.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ===========================
// Register Company
// ===========================
export const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;

    if (!companyName || !companyName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Company name is required.",
      });
    }

    // 🔴 Case-insensitive duplicate check ("Acme" and "acme" now count as the same company)
    const existingCompany = await Company.findOne({
      name: { $regex: `^${companyName.trim()}$`, $options: "i" },
    });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message: "Company already exists.",
      });
    }

    const company = await Company.create({
      name: companyName.trim(),
      userId: req.id,
    });

    return res.status(201).json({
      success: true,
      message: "Company registered successfully.",
      company,
    });
  } catch (error) {
    console.error("Register Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===========================
// Get All Companies
// ===========================
export const getCompany = async (req, res) => {
  try {
    const companies = await Company.find({
      userId: req.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      companies,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===========================
// Get Company By ID
// ===========================
export const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error("Get Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===========================
// Update Company
// ===========================
export const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (name) company.name = name.trim();
    if (description) company.description = description.trim();
    if (website) company.website = website.trim();
    if (location) company.location = location.trim();

    if (req.file) {
      const fileUri = getDataUri(req.file);

      if (fileUri?.content) {
        const uploadedImage = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "job-portal/company-logo",
          },
        );

        company.logo = uploadedImage.secure_url;
      }
    }

    await company.save();

    return res.status(200).json({
      success: true,
      message: "Company information updated successfully.",
      company,
    });
  } catch (error) {
    console.error("Update Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// ===========================
// Delete Company   (owner only)
// ===========================
export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findById(id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found.",
      });
    }

    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        success: false,
        message: "You can only delete companies you registered.",
      });
    }

    // Remove any jobs tied to this company so they don't dangle
    await Job.deleteMany({ company: id });
    await Company.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Company deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
