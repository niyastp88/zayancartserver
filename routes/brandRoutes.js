const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import brand controller functions
const {
  createBrand,
  getBrands,
  deleteBrand,
} = require("../controller/brandController");

const router = express.Router();

// Create new brand
router.post("/", protect, admin, createBrand);

// Get all brands
router.get("/", getBrands);

// Delete brand by ID
router.delete("/:id", protect, admin, deleteBrand);

module.exports = router;
