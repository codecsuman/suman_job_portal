import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },

    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    // 🔴 NEW: interview scheduling details set by the recruiter
    interview: {
      date: { type: String, default: null }, // e.g. "2026-08-01"
      time: { type: String, default: null }, // e.g. "14:30"
      mode: {
        type: String,
        enum: ["online", "offline", "phone"],
        default: "online",
      },
      location: { type: String, default: "" }, // meeting link or address
      notes: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
  },
);

// ===========================
// Prevent Duplicate Applications
// ===========================
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
