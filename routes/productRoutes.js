const express = require("express");

// Import authentication middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Import product controller functions
const {
  createProduct,
  updateProduct,
  getBestSeller,
  getNewArrivals,
  deleteProduct,
  getProducts,
  getProductById,
  getSimilarProducts,
} = require("../controller/productController");

const router = express.Router();

//  Create a new Product
router.post("/", protect, admin, createProduct);

//  Update an existing product
router.put("/:id", protect, admin, updateProduct);

//Retrieve the product with highest rating
router.get("/best-seller", getBestSeller);

// Get latest products based on creation date
router.get("/new-arrivals", getNewArrivals);

//  DELETE a product by ID
router.delete("/:id", protect, admin, deleteProduct);

// Get all products with optional query filters
router.get("/", getProducts);

//  Get a single product by ID
router.get("/:id", getProductById);

// Get similar products based on gender and category
router.get("/similar/:id", getSimilarProducts);

module.exports = router;
