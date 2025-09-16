import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const requireAuth = async (req, res, next) => {
    try {
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : null;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - No token provided" });
        }

        // Verify the token
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find the user and attach to req.user
        const user = await User.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User not found" });
        }

        req.user = {
            id: user._id.toString(),
            email: user.email,
            name: user.name
        };
        
        next();
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};