const mongoose = require("mongoose");

// Define schema for individual wishlist items
const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { _id: false },
);

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    products: [wishlistItemSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
