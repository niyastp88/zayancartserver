const express = require("express");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Import product review controller functions
const {
  getProductReviews,
  addProductReview,
} = require("../controller/productReviewController");

const router = express.Router();

//  Get all reviews of a product
router.get("/:productId/reviews", getProductReviews);

// Add review for a product (only delivered users)
router.post("/:id/reviews", protect, addProductReview);

module.exports = router;
