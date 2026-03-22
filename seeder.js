const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const bcrypt=require("bcryptjs")

dotenv.config();

// Connect to mongoDB
mongoose.connect(process.env.MONGO_URI);

// Function to seed data

const seedData = async () => {

  try {
    // Create a default admin User
    
    const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const createdUser = await User.create({
      name: "Admin User",
      email: "zayancartadmin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created successfully!");
    process.exit();
  } catch (error) {
    console.error("Error creating admin ", error);
    process.exit(1);
  }
};

seedData();
