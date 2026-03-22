const mongoose = require("mongoose");

// Define schema for product reviews
const reviewSchema = new mongoose.Schema(
  {
    // Reference to the user who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },

    countInStock: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
    },
    sizes: {
      type: [String],
      required: true,
      enum: {
        values: ["XS", "S", "M", "L", "XL", "XXL"],
        message: "Sizes must be XS, S, M or L only",
      },
    },

    colors: {
      type: [String],
      required: true,
      validate: {
        validator: function (colors) {
          return colors.every((color) => /^[A-Z][a-z]+$/.test(color));
        },
        message: "Colors must start with capital letter (Eg: Red, Blue)",
      },
    },

    material: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Men", "Women", "Unisex"],
    },
    images: [
      {
        url: {
          type: String,
          required: true,
        },
      },
      {
        altText: {
          type: String,
        },
      },
    ],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    
    // Reference to admin user who created the product
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("products", productSchema);
