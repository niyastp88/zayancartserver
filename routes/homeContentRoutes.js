const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import home content controller functions
const {
  getHomeContent,
  updateHomeContent,
} = require("../controller/homeContentController");

const router = express.Router();

// Get home page content
router.get("/", getHomeContent);

// UPDATE home page content
router.put("/", protect, admin, updateHomeContent);

module.exports = router;
