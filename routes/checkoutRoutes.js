const express = require("express");

// Import authentication middleware
const { protect } = require("../middleware/authMiddleware");

// Import checkout controller functions
const {
  createCheckout,
  markCheckoutPaid,
  finalizeCheckout,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require("../controller/checkoutController");

const router = express.Router();

// Create a new checkout session
router.post("/", protect, createCheckout);

// Mark checkout as paid after successful payment
router.put("/:id/pay", protect, markCheckoutPaid);

// Finalize checkout, create order and reduce stock
router.post("/:id/finalize", protect, finalizeCheckout);

// Create Razorpay Order
router.post("/:id/razorpay", protect, createRazorpayOrder);

// Verify Razorpay Payment
router.post("/:id/verify", protect, verifyRazorpayPayment);

module.exports = router;
