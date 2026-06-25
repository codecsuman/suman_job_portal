import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
    try {
        // ===========================
        // Get Token From Cookies
        // ===========================
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "User not authenticated.",
                success: false,
            });
        }

        // ===========================
        // Verify JWT Token
        // ===========================
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token.",
                success: false,
            });
        }

        // ===========================
        // Store User ID
        // ===========================
        req.id = decoded.userId;

        next();
    } catch (error) {
        console.error("Authentication Error:", error.message);

        return res.status(401).json({
            message: "Authentication failed.",
            success: false,
        });
    }
};

export default isAuthenticated;