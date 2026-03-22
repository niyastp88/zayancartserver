// Import mongoose package
const mongoose = require("mongoose");

// Function to connect to MongoDB database
const connectDB = async () => {
  try {
    // Connect to MongoDB using URI from environment variables
    await mongoose.connect(process.env.MONGO_URI);

    // Log success message if connection is established
    console.log("MongoDB connected successfully");
  } catch (error) {
    // Log error message if connection fails
    console.log("MongoDb connection failed", error);

    // Exit process with failure status
    process.exit(1);
  }
};

// Export the database connection function
module.exports = connectDB;
