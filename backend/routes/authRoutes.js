// routes/authRoutes.js
import express from "express";
import { registerUser, loginUser } from "../controller/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getUserIssues } from "../controller/issueController.js";

const router = express.Router();

// ======================
// Auth Routes
// ======================

// Register a new user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get logged-in user's profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    // req.user is attached by authMiddleware
    res.json({ success: true, user: req.user });
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ======================
// Admin-only Routes
// ======================

// Get all users/issues (example admin route)
router.get("/all", authMiddleware, adminOnly, getUserIssues);

export default router;


