import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// ===========================
// Register User
// ===========================
export const register = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, password, role } = req.body;

    if (!fullname || !email || !phoneNumber || !password || !role) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    let profilePhoto = "";

    if (req.file) {
      try {
        const fileUri = getDataUri(req.file);

        if (!fileUri || !fileUri.content) {
          return res.status(400).json({
            message: "Failed to process image. Please try again.",
            success: false,
          });
        }

        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "job-portal/profile-photos",
            public_id: `user_${Date.now()}`,
            overwrite: true,
          },
        );

        profilePhoto = cloudResponse.secure_url;
      } catch (uploadError) {
        console.error("Profile photo upload error:", uploadError);
        profilePhoto = "";
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      role,
      profile: {
        profilePhoto,
      },
    });

    return res.status(201).json({
      message: "Account created successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Login User
// ===========================
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "Something is missing.",
        success: false,
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    if (role !== user.role) {
      return res.status(400).json({
        message: "Account doesn't exist with the selected role.",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    user = {
      _id: user._id,
      fullname: user.fullname,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      profile: user.profile,
    };

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: `Welcome back ${user.fullname}`,
        user,
        success: true,
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Logout
// ===========================
export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      })
      .json({
        message: "Logged out successfully.",
        success: true,
      });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// ===========================
// Update Profile — FIXED ✅
// ===========================
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;

    const user = await User.findById(req.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    // Update text fields
    if (fullname !== undefined) user.fullname = fullname.trim();
    if (email !== undefined) user.email = email.trim().toLowerCase();
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber.trim();
    if (bio !== undefined) user.profile.bio = bio.trim();

    if (skills !== undefined) {
      user.profile.skills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // 🔴 FIXED: Profile photo upload with proper error handling
    if (req.file) {
      console.log(
        "📸 File received:",
        req.file.originalname,
        req.file.mimetype,
        req.file.size,
      );

      try {
        const fileUri = getDataUri(req.file);

        if (!fileUri || !fileUri.content) {
          return res.status(400).json({
            message:
              "Failed to process image file. Please try a different image.",
            success: false,
          });
        }

        // Upload to Cloudinary with explicit folder
        const cloudResponse = await cloudinary.uploader.upload(
          fileUri.content,
          {
            folder: "job-portal/profile-photos",
            public_id: `user_${user._id}_${Date.now()}`,
            overwrite: true,
            resource_type: "auto",
          },
        );

        if (cloudResponse && cloudResponse.secure_url) {
          // Delete old photo from Cloudinary if exists
          if (user.profile.profilePhoto) {
            try {
              // Extract public_id from the old URL
              const urlParts = user.profile.profilePhoto.split("/");
              const filename = urlParts[urlParts.length - 1];
              const publicId = `job-portal/profile-photos/${filename.split(".")[0]}`;
              await cloudinary.uploader.destroy(publicId);
              console.log("🗑️ Old photo deleted:", publicId);
            } catch (deleteError) {
              console.log("Old photo deletion skipped:", deleteError.message);
            }
          }

          user.profile.profilePhoto = cloudResponse.secure_url;
          console.log("✅ Profile photo uploaded:", cloudResponse.secure_url);
        } else {
          return res.status(500).json({
            message: "Image upload failed. Please try again.",
            success: false,
          });
        }
      } catch (uploadError) {
        console.error("❌ Cloudinary upload error:", uploadError);
        return res.status(500).json({
          message: "Failed to upload profile photo. Please try again.",
          success: false,
        });
      }
    }

    // 🔴 FIXED: Await the save before responding
    await user.save();

    // 🔴 FIXED: Fetch fresh user data from DB (without password)
    const updatedUser = await User.findById(req.id).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully.",
      user: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        role: updatedUser.role,
        profile: updatedUser.profile,
      },
      success: true,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);

    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
