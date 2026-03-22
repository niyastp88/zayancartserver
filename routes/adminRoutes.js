const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import admin controller functions
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserByAdmin,
} = require("../controller/adminController");

const router = express.Router();

// Get all users (Admin only)
router.get("/", protect, admin, getAllUsers);

// Create new user (Admin only)
router.post("/", protect, admin, createUser);

// Update user by ID (Admin only)
router.put("/:id", protect, admin, updateUserByAdmin);

// Delete user by ID (Admin only)
router.delete("/:id", protect, admin, deleteUser);

module.exports = router;
