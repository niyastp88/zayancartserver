const express = require("express");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Import wishlist controller functions
const {
  toggleWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controller/wishlistController");

const router = express.Router();

// Add or remove product from wishlist
router.post("/", protect, toggleWishlist);

// Get logged in user's wishlist
router.get("/", protect, getWishlist);

// Remove product from wishlist
router.delete("/:productId", protect, removeFromWishlist);

module.exports = router;
