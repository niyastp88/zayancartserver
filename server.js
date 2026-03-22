// Import required core packages
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Import database connection

// Import route files
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoute");
const uploadRoutes = require("./routes/uploadRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const materialRoutes = require("./routes/materialRoutes");
const brandRoutes = require("./routes/brandRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const homeContentRoutes = require("./routes/homeContentRoutes");
const productReviewRoutes = require("./routes/productReviewRoutes");

// Initialize express app
const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Enable CORS
app.use(cors());

// Set server port
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Root route
app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API!");
});
// API Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/home-content", homeContentRoutes);
app.use("/api/review", productReviewRoutes);

// API Routes
app.use("/api/admin/users", adminRoutes);
app.use("/api/admin/products", productAdminRoutes);
app.use("/api/admin/orders", adminOrderRoutes);

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
