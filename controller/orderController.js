const Order = require("../models/Order");

// Get logged-in user's orders
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all return requests (Admin only)
exports.getReturnRequests = async (req, res) => {
  try {
    const orders = await Order.find({
      "orderItems.returnRequested": true,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Request return for a product
exports.requestReturn = async (req, res) => {
  const { productId, reason, comment } = req.body;
  const allowedReasons = [
    "Damaged",
    "Wrong Size",
    "Wrong Product",
    "Quality Issue",
    "Other",
  ];

  if (!allowedReasons.includes(reason)) {
    return res.status(400).json({ message: "Invalid return reason" });
  }

  if (!productId || !reason) {
    return res.status(400).json({ message: "Product and reason required" });
  }

  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    //  Only owner can return
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    //  Delivered check
    if (order.status !== "Delivered" || !order.deliveredAt) {
      return res.status(400).json({ message: "Order not delivered yet" });
    }

    // 7 day rule
    const diffDays =
      (Date.now() - new Date(order.deliveredAt)) / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      return res.status(400).json({ message: "Return window expired" });
    }

    const item = order.orderItems.find(
      (i) => i.productId.toString() === productId.toString(),
    );

    if (!item) {
      return res.status(404).json({ message: "Product not in order" });
    }

    if (item.returnRequested) {
      return res.status(400).json({ message: "Return already requested" });
    }

    //  Mark return
    item.returnRequested = true;
    item.returnReason = reason;
    item.returnComment = comment || "";
    item.returnRequestedAt = new Date();

    await order.save();

    res.status(200).json({ message: "Return request submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Approve or reject return request (Admin only)
exports.updateReturnStatus = async (req, res) => {
  const { action } = req.body; // approved | rejected

  if (!["approved", "rejected"].includes(action)) {
    return res.status(400).json({ message: "Invalid return action" });
  }

  const order = await Order.findById(req.params.orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  const item = order.orderItems.find(
    (i) => i.productId.toString() === req.params.productId,
  );

  if (!item || !item.returnRequested) {
    return res.status(400).json({ message: "No return request" });
  }

  if (item.returnStatus !== "pending") {
    return res.status(400).json({ message: "Return already processed" });
  }

  item.returnStatus = action;
  await order.save();

  res.status(200).json({ message: `Return ${action}` });
};

// Get order details by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email",
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Return the full order details
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
