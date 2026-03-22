const mongoose = require("mongoose");

// Define schema for homepage content
const homeContentSchema = new mongoose.Schema(
  {
    heroImage: {
      type: String,
      required: false,
    },
    menCollectionImage: {
      type: String,
      required: false,
    },
    womenCollectionImage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("HomeContent", homeContentSchema);
