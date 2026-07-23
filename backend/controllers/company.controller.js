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
// Update Company  —  FIXED
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

    // Update text fields
    if (name) company.name = name.trim();
    if (description !== undefined) company.description = description.trim();
    if (website !== undefined) company.website = website.trim();
    if (location !== undefined) company.location = location.trim();

    // 🔴 FIXED: Enhanced logo upload with proper error handling
    if (req.file) {
      console.log(
        "🏢 Company logo received:",
        req.file.originalname,
        req.file.mimetype,
      );

      try {
        const fileUri = getDataUri(req.file);

        if (!fileUri || !fileUri.content) {
          return res.status(400).json({
            success: false,
            message:
              "Failed to process logo image. Please try a different image.",
          });
        }

        // 🔴 FIXED: Added folder and proper upload options
        const uploadedImage = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "job-portal/company-logo",
            public_id: `company_${company._id}_${Date.now()}`,
            overwrite: true,
            resource_type: "auto",
          },
        );

        if (uploadedImage && uploadedImage.secure_url) {
          // Delete old logo from Cloudinary if exists
          if (company.logo) {
            try {
              const oldPublicId = company.logo.split("/").pop().split(".")[0];
              if (oldPublicId) {
                await cloudinary.uploader.destroy(
                  `job-portal/company-logo/${oldPublicId}`,
                );
              }
            } catch (deleteError) {
              console.log("Old logo deletion skipped:", deleteError.message);
            }
          }

          company.logo = uploadedImage.secure_url;
          console.log("✅ Company logo uploaded:", uploadedImage.secure_url);
        } else {
          return res.status(500).json({
            success: false,
            message: "Logo upload failed. Please try again.",
          });
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to upload company logo. Please try again.",
        });
      }
    }

    await company.save();

    // 🔴 FIXED: Return fresh data from DB
    const updatedCompany = await Company.findById(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Company information updated successfully.",
      company: updatedCompany,
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
