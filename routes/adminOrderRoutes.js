const express = require("express");

// Import authentication and authorization middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import admin order controller functions
const {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} = require("../controller/adminOrderController");

const router = express.Router();

// Get all order
router.get("/", protect, admin, getAllOrders);

// Update order status
router.put("/:id", protect, updateOrderStatus);

// Delete an order
router.delete("/:id", protect, admin, deleteOrder);

module.exports = router;
