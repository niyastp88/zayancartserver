const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import order controller functions
const {
  getMyOrders,
  getReturnRequests,
  requestReturn,
  updateReturnStatus,
  getOrderById,
} = require("../controller/orderController");

const router = express.Router();

// Get logged-in user's orders
router.get("/my-orders", protect, getMyOrders);

// Get all return requests
router.get("/returns", protect, admin, getReturnRequests);

// Request return for a product
router.post("/:orderId/return", protect, requestReturn);

//  Approve or reject return
router.put("/:orderId/return/:productId", protect, admin, updateReturnStatus);

// Get order details by ID
router.get("/:id", protect, getOrderById);

module.exports = router;
