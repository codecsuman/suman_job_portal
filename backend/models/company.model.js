import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Company name is required"],
            unique: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        website: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        logo: {
            type: String,
            default: "",
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

// ===========================
// Indexes
// ===========================
companySchema.index({ userId: 1 });
companySchema.index({ name: 1 });

export const Company = mongoose.model("Company", companySchema);