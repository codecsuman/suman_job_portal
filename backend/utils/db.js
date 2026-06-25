import mongoose from "mongoose";

const connectDB = async () => {
    try {
        console.log("==================================");
        console.log("Connecting to MongoDB...");
        console.log("Database URI:", process.env.MONGO_URI);
        console.log("==================================");

        await mongoose.connect(process.env.MONGO_URI);

        console.log("==================================");
        console.log("✅ MongoDB Connected Successfully");
        console.log("==================================");
    } catch (error) {
        console.error("==================================");
        console.error("❌ MongoDB Connection Failed");
        console.error(error.message);
        console.error("==================================");

        process.exit(1);
    }
};

export default connectDB;