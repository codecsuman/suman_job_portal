import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Job title is required"],
            trim: true,
        },

        description: {
            type: String,
            required: [true, "Job description is required"],
            trim: true,
        },

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        salary: {
            type: Number,
            required: [true, "Salary is required"],
            min: 0,
        },

        experienceLevel: {
            type: Number,
            required: [true, "Experience level is required"],
            min: 0,
        },

        location: {
            type: String,
            required: [true, "Location is required"],
            trim: true,
        },

        jobType: {
            type: String,
            enum: ["Full-Time", "Part-Time", "Internship", "Contract", "Remote", "Hybrid"],
            required: true,
        },

        position: {
            type: Number,
            required: [true, "Number of openings is required"],
            min: 1,
        },

        company: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Company",
            required: true,
        },

        created_by: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application",
            },
        ],
    },
    {
        timestamps: true,
    }
);

// ===========================
// Indexes
// ===========================
jobSchema.index({ title: "text", description: "text" });
jobSchema.index({ company: 1 });
jobSchema.index({ created_by: 1 });

export const Job = mongoose.model("Job", jobSchema);