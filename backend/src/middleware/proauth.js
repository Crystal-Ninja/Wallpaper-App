import jwt from "jsonwebtoken";
import {User} from "../models/user.js";

export const proAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-passwordHash"); // exclude password
    if (!req.user) return res.status(401).json({ message: "Invalid token user" });

    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized: " + err.message });
  }
};
