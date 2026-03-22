const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import admin product controller function
const { getAllProductsAdmin } = require("../controller/productAdminController");

const router = express.Router();

// Get all products (Admin only)
router.get("/", protect, admin, getAllProductsAdmin);

module.exports = router;
