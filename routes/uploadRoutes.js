const express = require("express");
const multer = require("multer");

// Import upload controller
const { uploadImage } = require("../controller/uploadController");

const router = express.Router();

require("dotenv").config();

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Upload image
router.post("/", upload.single("image"), uploadImage);

module.exports = router;
