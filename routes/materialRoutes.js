const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import material controller functions
const {
  createMaterial,
  getMaterials,
  deleteMaterial,
} = require("../controller/materialController");

const router = express.Router();

// Create new material
router.post("/", protect, admin, createMaterial);

// Get all materials
router.get("/", getMaterials);

// Delete a material by ID
router.delete("/:id", protect, admin, deleteMaterial);

module.exports = router;
