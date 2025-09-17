import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const router = Router();

// Validation helper
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Register endpoint
router.post("/register", async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    
    // Input validation
    if (!email || !username || !password) {
      return res.status(400).json({ 
        message: "Email, username, and password are required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    if (username.length < 2) {
      return res.status(400).json({ 
        message: "Username must be at least 2 characters long" 
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        message: "An account with this email already exists" 
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      name: username.trim(),
      passwordHash,
      email: email.toLowerCase().trim()
    });

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return success response
    res.status(201).json({
      message: "Account created successfully",
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        message: "An account with this email already exists" 
      });
    }
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: "Invalid input data",
        details: Object.values(error.errors).map(err => err.message)
      });
    }
    
    next(error);
  }
});

// Login endpoint
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Email and password are required" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Find user with password field included
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select("+passwordHash");
    
    if (!user) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: "Invalid email or password" 
      });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: "7d" }
    );

    // Return success response
    res.json({
      message: "Login successful",
      token,
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name 
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
});

// Logout endpoint
router.post("/logout", (req, res) => {
  res.json({ 
    message: "Logged out successfully. Please remove token from client storage." 
  });
});

// Token verification endpoint (useful for checking if token is still valid)
router.get("/verify", async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-passwordHash");
      
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      res.json({
        valid: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name
        }
      });
    } catch (jwtError) {
      return res.status(401).json({ 
        message: "Invalid or expired token",
        valid: false 
      });
    }
  } catch (error) {
    console.error("Token verification error:", error);
    next(error);
  }
});

export default router;