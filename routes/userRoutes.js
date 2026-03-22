const express = require("express");

// Import user controller functions
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmailOTP,
  forgotPassword,
  resetPassword,
  googleAuth,
} = require("../controller/userController");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

//Register a new user
router.post("/register", registerUser);

// Verify email OTP
router.post("/verify-otp", verifyEmailOTP);

// Authenticate user
router.post("/login", loginUser);

//  Get logged-in user's profile
router.get("/profile", protect, getUserProfile);

// Send forgot password email
router.post("/forgot-password", forgotPassword);

// Reset user password
router.put("/reset-password/:token", resetPassword);

// Authenticate user using Google
router.post("/google", googleAuth);

module.exports = router;
