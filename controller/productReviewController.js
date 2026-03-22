const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Get all reviews of a product
exports.getProductReviews = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "reviews rating numReviews",
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    //SORT LATEST FIRST
    const sortedReviews = [...product.reviews].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
    );

    res.status(200).json({
      rating: product.rating,
      numReviews: product.numReviews,
      reviews: sortedReviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Add review for a product (Only delivered users)
exports.addProductReview = async (req, res) => {
  console.log("review is working");
  const { rating, comment } = req.body;

  if (!rating) {
    return res.status(400).json({ message: "Rating is required" });
  }

  try {
    // Product exists check
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this product" });
    }

    // Check if user has a DELIVERED order for this product
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      isDelivered: true,
      "orderItems.productId": new mongoose.Types.ObjectId(req.params.id),
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: "You can review only delivered products",
      });
    }

    // Create review
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;

    // Calculate average rating
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added successfully",
      reviews: product.reviews,
      rating: product.rating,
      numReviews: product.numReviews,
    });
  } catch (error) {
    console.error("Add review error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
