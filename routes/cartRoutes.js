const express = require("express");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Import cart controller function
const {
  addToCart,
  updateCartItem,
  removeFromCart,
  getCartByUser,
  mergeGuestCart,
} = require("../controller/cartController");

const router = express.Router();

// Add a product to the cart for a guest or logged in user
router.post("/", addToCart);

// Update product quantity in cart (guest or logged-in user)
router.put("/", updateCartItem);

// Remove product from cart
router.delete("/", removeFromCart);

// Get cart for guest or logged-in user
router.get("/", getCartByUser);

// Merge guest cart into user cart after login
router.post("/merge", protect, mergeGuestCart);

module.exports = router;
