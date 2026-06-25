import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullname: {
            type: String,
            required: [true, "Full name is required"],
            trim: true,
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },

        phoneNumber: {
            type: String,
            required: [true, "Phone number is required"],
            trim: true,
        },

        password: {
            type: String,
            required: [true, "Password is required"],
        },

        role: {
            type: String,
            enum: ["student", "recruiter"],
            required: true,
        },

        profile: {
            bio: {
                type: String,
                default: "",
                trim: true,
            },

            skills: [
                {
                    type: String,
                    trim: true,
                },
            ],

            resume: {
                type: String,
                default: "",
            },

            resumeOriginalName: {
                type: String,
                default: "",
            },

            company: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Company",
                default: null,
            },

            profilePhoto: {
                type: String,
                default: "",
            },
        },
    },
    {
        timestamps: true,
    }
);

// ===========================
// Remove Password From JSON
// ===========================
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export const User = mongoose.model("User", userSchema);